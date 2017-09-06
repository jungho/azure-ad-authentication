import axios from 'axios';
import { apiUrl } from '../config';

export const FETCH_POSTS = 'FETCH_POSTS';
export const CREATE_POST = 'CREATE_POST';
export const FETCH_POST = 'FETCH_POST';
export const DELETE_POST = 'DELETE_POST';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';

const ROOT_URL = apiUrl;

export function fetchPosts() {
    const request = axios.get(`${ROOT_URL}`);

    return {
        type: FETCH_POSTS,
        payload: request
    };
}

export function createPost(post, token) {

    console.log("inside createPost. post was ", post);

    const request = axios.post(`${ROOT_URL}`, post, 
        { headers: {'Authorization': 'Bearer ' + token}});

    return {
        type: CREATE_POST,
        payload: request
    }
}

export function fetchPost(id) {
    const request = axios.get(`${ROOT_URL}/${id}`);

    return {
        type: FETCH_POST,
        payload: request
    }
}

export function deletePost(id, token) {
    const request = axios.delete(`${ROOT_URL}/${id}`, 
        {headers: { 'Authorization': 'Bearer ' + token }});

    return {
        type: DELETE_POST,
        payload: request
    }
}

export function loggedIn(userName, token) {
    return {
        type: LOGGED_IN,
        payload: { userName, token }
    }
} 
