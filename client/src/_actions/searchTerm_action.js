import { CHANGE_SEARHTERM } from './types'

export function handleSearchTermChange(searchTerm) {
    return {
        type: CHANGE_SEARHTERM,
        payload: searchTerm
    }
}