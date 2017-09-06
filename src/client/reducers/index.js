import { combineReducers } from 'redux';
import PostsReducer from './reducer_posts';
import AuthReducer from './reducer_auth';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  posts: PostsReducer,
  form: formReducer,
  user: AuthReducer
});

export default rootReducer;
