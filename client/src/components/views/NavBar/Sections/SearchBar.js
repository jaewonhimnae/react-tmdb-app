import React, { useRef } from 'react';
import { Input } from 'antd';

function SearchBar(props) {
    const { onSubmit } = props;

    const { Search } = Input;
    const typingTimeoutRef = useRef(null);

    const onSearch = (value) => {
        if (!onSubmit)
            return
        onSubmit(value);
    };

    const handleSearchTerm = (e) => {
        const value = e.target.value
        if(typingTimeoutRef.current)
            clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            onSearch(value);
        }, 500);
    }
    return(
        <>
            <Search
                className="search-input"
                placeholder="Search..." enterButton onSearch={onSearch}
                onChange={handleSearchTerm}
            />
        </>  
    )
}

export default SearchBar;