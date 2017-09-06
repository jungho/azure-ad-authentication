import { FETCH_POSTS, FETCH_POST } from '../actions/index';
import INITIAL_STATE from './initial_state';

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
        case FETCH_POST:
            return { ...state, post: action.payload.data }
        case FETCH_POSTS:
            return { ...state, all: action.payload.data };
        default:
            return state;
    }
}