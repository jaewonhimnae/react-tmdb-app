import { CHANGE_SEARHTERM } from '../_actions/types';

let searchTerm = '';

export default function (state = searchTerm, action) {
    switch(action.type) {
        case CHANGE_SEARHTERM: {
            searchTerm = action.payload
            return action.payload
        }
        
        default:
            return state
            
    }
}