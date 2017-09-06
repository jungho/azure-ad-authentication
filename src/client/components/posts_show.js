import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPost, deletePost } from '../actions/index';
import { Link, browserHistory } from 'react-router';

class PostsShow extends Component {
    componentWillMount() {
        this.props.fetchPost(this.props.params.id);
    }

    render() {
        if (!this.props.post) {
            return <div>Loading...</div>
        }

        const { post, isAuthenticated } = this.props;

        return (
            <div>
                <Link to="/">Back to Index</Link>

                {
                    isAuthenticated &&
                    <button
                        className='btn btn-danger pull-xs-right'
                        onClick={this.onDeleteClick.bind(this)}>Delete Post
                    </button>
                }

                <h3>{post.title}</h3>
                <h6>{post.categories}</h6>
                <p>
                    {post.content}
                </p>
            </div>
        );
    }

    onDeleteClick() {
        this.props.deletePost(this.props.params.id, this.props.user.token).then(() => {
            browserHistory.push('/');
        });
    }
}

function mapStateToProps(state) {
    return {
        post: state.posts.post,
        isAuthenticated: state.user.isAuthenticated,
        user: state.user.user
    };
}

export default connect(mapStateToProps, { fetchPost, deletePost })(PostsShow);