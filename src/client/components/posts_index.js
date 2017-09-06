import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from '../actions/index';
import { Link } from 'react-router';
import AuthenticationContext from '../adal';
import adalConfig from '../config';


class PostsIndex extends Component {

    componentWillMount() {
        this.props.fetchPosts();
    }

    render() {
        const { isAuthenticated } = this.props;
        console.log("posts_index.isAuthenticated --> ", isAuthenticated);

        return (
            <div>
                <div className='text-xs-right '>
                    {
                        isAuthenticated &&
                        <Link to='/posts/new' className='btn btn-primary'>
                            Add a Post
                        </Link>
                    }

                    {
                        isAuthenticated &&
                        <button className='btn' onClick={() => {
                            new AuthenticationContext(adalConfig).logOut();
                        }}>Logout</button>

                    }

                    {
                        !isAuthenticated &&
                        <button className='btn btn-primary' onClick={() => {
                            new AuthenticationContext(adalConfig).login();
                        }}>Login to Post</button>
                    }
                </div>
                <h3>Yet Another Blog App</h3>
                <ul className='list-group'>
                    {this.renderPosts()}
                </ul>
            </div>
        );
    }

    renderPosts() {
        return this.props.posts.map((post) => {
            return (
                <li className='list-group-item' key={post._id}>
                    <Link to={"posts/" + post._id}>
                        <span className='pull-xs-right'>{post.categories}</span>
                        <strong>{post.title}</strong>
                    </Link>
                </li>
            )
        })
    }
}

function mapStateToProps(state) {
    return {
        posts: state.posts.all,
        isAuthenticated: state.user.isAuthenticated
    }
}

export default connect(mapStateToProps, { fetchPosts })(PostsIndex);