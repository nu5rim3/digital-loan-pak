import React, { useState } from 'react';
import { Input, Button, Select, Space } from 'antd';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
const { Search } = Input;

const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
    },
];

type SearchBarProps = {
    action: () => void;
    actionLoading?: boolean;
    actionTitle?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ actionLoading, actionTitle, action }) => {
    const [searchType, setSearchType] = useState('Search By');
    const [searchValue, setSearchValue] = useState('');
    const [isloading, setIsloading] = useState(false);

    const handleSearchTypeChange = (value: string) => {
        setSearchType(value);
    };

    const handleSearch = () => {
        // Perform search logic here
        setIsloading(true);
        console.log('Search:', searchType, searchValue);

        setTimeout(() => {
            setIsloading(false);
        }, 2000);
    };

    const handleReset = () => {
        setSearchType('Search By');
        setSearchValue('');
    };

    const handleCreateNew = () => {
        // Handle create new logic here
        console.log('Create new');
        action()
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <Space.Compact className='flex-1'>
                <Select
                    options={options}
                    value={searchType}
                    onChange={handleSearchTypeChange}
                    className='w-auto'
                    style={{ width: 200 }} // Add the fixed size here
                    placeholder="Search By"
                />
                <Search
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                    enterButton
                    loading={isloading}
                    onSearch={handleSearch}
                />
                <Button type="default" onClick={handleReset} danger icon={<CloseCircleOutlined />} />
            </Space.Compact>

            <div className='flex flex-1'></div>
            <Button type="primary" onClick={handleCreateNew} icon={<PlusOutlined />} loading={actionLoading}>
                {actionTitle}
            </Button>
        </div>
    );
};

export default SearchBar;