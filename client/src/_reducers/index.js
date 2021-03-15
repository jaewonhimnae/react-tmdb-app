import { combineReducers } from 'redux';
import user from './user_reducer';
import searchTerm from './searchTerm_reducer'

const rootReducer = combineReducers({
    user,
    searchTerm
});

export default rootReducer;