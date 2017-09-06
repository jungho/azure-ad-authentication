import { LOGGED_IN, LOGGED_OUT } from '../actions';
import INITIAL_STATE from './initial_state';

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGGED_IN:
            console.log("reducer_auth.action.type --> LOGGED_IN");
            return { ...state, user: action.payload, isAuthenticated: true }
        case LOGGED_OUT:
            console.log("reducer_auth.action.type --> LOGGED_OUT");
            return { ...state, user: null, isAuthenticated: false };
        default:
            return state;
    }
}