import React from 'react';
import { Input, Space } from 'antd';
import { AudioOutline } from '@ant-design/icons';

function SearchBar(props) {
    const { Search } = Input;

    const suffix = (
        <AudioOutline
            style={{
            fontSize: 16,
            color: '#1890ff',
            }}
        />
    );

    const onSearch = value => console.log(value);

    return(
        <>
            <Search 
                placeholder="Search..." onSearch={onSearch} enterButton
            />
        </>  
    )
}

export default SearchBar;