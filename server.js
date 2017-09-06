const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const Posts = require('./src/server/models/Posts');
const passport = require('passport');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;


const app = express();
const publicDir = config.get('Env.node.publicDir');
const port = config.get('Env.node.port');
const connString = config.get('Env.database.connectionString');

mongoose.connect(connString);
var connection = mongoose.connection;

connection.on('error', function (error) {
    console.log('Failed to connect to database: ', error);
    process.exit();
});

connection.once('open', function () {
    console.log('Successfully connected to database');

    connection.db.listCollections({ name: 'yaba' }).next(function (err, collInfo) {
        if (err)
            console.log("error retrieving collections: ", err);

        if (collInfo)
            console.log("Collection Info: ", collInfo);
    })
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * passport configuration. For details for each configuration, 
 * see section 5.2 BearerStrategy at https://github.com/AzureAD/passport-azure-ad
 */

const options = {
    //The version 1 or 2 tenant specific or common endpoints for the OpenID Connect metadata.
    identityMetadata: config.Env.AzureAD.identityMetadata,
    //This is the Application ID of the application you registered in Azure AD
    clientID: config.Env.AzureAD.appId, 
    validateIssuer: false,
    passReqToCallback: true,
    isB2C: false,
    allowMultipleAudiencesInToken: false
}
const bearerStrategy = new BearerStrategy(options, function (req, token, done) {
    console.log("Inside BearerStrategy verify callback");
    console.log("token --> ", token);
    done(null, token);
});

passport.use(bearerStrategy);

const router = express.Router();

app.use('/api', router);

router.get('/', function (req, res) {
    res.json({ message: 'test working...' });

//note how we don't require authentication to retrieve the list 
//of posts
}).get('/posts', function (req, res) {
    Posts.find(function (error, posts) {
        if (error) {
            console.log("failed to retrieve posts: ", error);
            res.sendStatus(500);
        }
        else {
            console.log("retrieved all posts", posts);
            res.json(posts);
        }
    });
//auth not required to retrieve a specific post
}).get('/posts/:id', function (req, res) {
    Posts.findById(req.params.id, function (err, post) {
        if (err) {
            console.log("Failed to retrieve post for ID: " + req.params.id);
            res.status(500);
            res.send(err);
        } else {
            res.json(post);
        }
    })
//auth required to create a post
}).post('/posts', passport.authenticate('oauth-bearer', {session: false }), function (req, res) {
    Posts.create([req.body], function (err, post) {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            res.sendStatus(201);
        }
    });

//auth required to delete a post
}).delete('/posts/:id', passport.authenticate('oauth-bearer', {session: false }), function (req, res) {
    Posts.remove({
        _id: req.params.id
    }, function (err, post) {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            res.sendStatus(201);
        }
    });
});

//use the webpack middleware only for dev environment
if (process.env.NODE_ENV !== 'production') {
    console.log('info', 'Non-prod, configuring webpack middleware...');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.js');
    app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
    app.use(express.static(publicDir));
    //necessary to ensure the react router brower history works properly
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, publicDir, '/index.html'));
    })
}

const listener = app.listen(port || 3050,
    () => console.log('info', 'listening on ', listener.address().port));