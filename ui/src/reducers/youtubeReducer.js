import { LOAD_USER_INFO } from '../actions/actionTypes';

let youtubeUser = {
    name: ''    
};

export function youtubeReducer(state = { youtubeUser }, action) {
    switch (action.type) {
        case LOAD_USER_INFO:
            return Object.assign({}, state, { name: action.name });
        default:
            return state;
    }
}