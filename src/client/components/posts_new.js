import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { createPost } from '../actions/index';
import { Link, browserHistory } from 'react-router';

class PostsNew extends Component {

    onSubmit(post) {
        this.props.createPost(post, this.props.user.token)
            .then(() => {
                //blog post has been created, navigate user to the index page.
                browserHistory.push('/');
            });
    }

    render() {
        const { fields: { title, categories, content }, handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <h3>Create a New Post</h3>
                <div className={`form-group ${errClass(title)}`}>
                    <label>Title</label>
                    <input type='text' className='form-control' {...title} />
                    <div className='text-help'>
                        {title.touched ? title.error : ''}
                    </div>
                </div>
                <div className={`form-group ${errClass(categories)}`}>
                    <label>Categories</label>
                    <input type='text' className='form-control'{...categories} />
                    <div className='text-help'>
                        {categories.touched ? categories.error : ''}
                    </div>
                </div>
                <div className={`form-group ${errClass(content)}`}>
                    <label>Content</label>
                    <textarea className='form-control' {...content} />
                    <div className='text-help'>
                        {content.touched ? content.error : ''}
                    </div>
                </div>
                <button type='submit' className='btn btn-primary'>Submit</button>

                <Link to='/' className='btn btn-danger'>Cancel</Link>
            </form>
        );
    }
}

function errClass(field) {
    return field.touched && field.invalid ? 'has-danger' : '';
}

function validate(values) {
    const errors = {};

    if (!values.title) {
        errors.title = 'Title is required.';
    }

    if (!values.categories) {
        errors.categories = 'You must provide at least one category.'
    }

    if (!values.content) {
        errors.content = 'A blog without any content is not very helpful.'
    }

    return errors;
}

function mapStateToProps(state) {
    return {
        user: state.user.user
    }
}

//connect: first argument is mapStateToProps, 2nd is mapDispatchToProps
//reduxForm: 1st is form config, 2nd mapStateToProps, 3rd is mapDispatchToProps
export default reduxForm({
    form: 'PostsNew',
    fields: [
        'title',
        'categories',
        'content'
    ],
    validate
}, mapStateToProps, { createPost })(PostsNew);