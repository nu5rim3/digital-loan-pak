import { Button, Select, Space, Input, DatePicker } from 'antd'
import React, { useState } from 'react'
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;

interface AdvanceSearchProps {
    options?: { label: string; value: string }[];
    loading?: boolean;
    setParams?(value: Record<string, string>): void; // Adjust type as needed
}
const AdvanceSearch: React.FC<AdvanceSearchProps> = ({ options, loading, setParams }) => {
    const [selectedType, setSelectedType] = useState(options ? options[0].value : 'Search By');
    const [searchValue, setSearchValue] = useState('');
    const [fromDateFilter, setFromDateFilter] = useState('');
    const [toDateFilter, setToDateFilter] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [dateRange, setDateRange] = useState<any>(null); // Adjust type as needed

    const handleSearch = () => {
        if (setParams) {
            setParams({
                [selectedType]: searchValue,
                fromDate: fromDateFilter,
                toDate: toDateFilter,
            });
        }
    }

    const handleReset = () => {
        setSelectedType(options ? options[0].value : 'Search By');
        setSearchValue('');
        setFromDateFilter('');
        setToDateFilter('');
        setDateRange(null);
        if (setParams) {
            setParams({
                [selectedType]: '',
                fromDate: '',
                toDate: '',
            });
        }
    };



    return (
        <Space.Compact className='flex-1'>
            <Select
                options={options ?? []}
                value={selectedType}
                onChange={(value) => setSelectedType(value)}
                className='search-fixed-select'
                dropdownStyle={{
                    width: 150, // Ensure dropdown matches the select width
                }}
            />

            <Input
                size='middle'
                style={{ width: 300 }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                allowClear
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />

            <RangePicker
                size='middle'
                style={{ width: 400 }}
                value={dateRange}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onCalendarChange={(value: any) => {
                    setDateRange(value);
                    if (value && value?.length !== 0) {
                        setToDateFilter(value[1]?.format('YYYY-MM-DD'))
                        setFromDateFilter(value[0]?.format('YYYY-MM-DD'))
                    }
                }}
                allowClear
                id='rangepicker'
                enterKeyHint='search'
            />
            <Button icon={<SearchOutlined />} type='primary' loading={loading} onClick={handleSearch}>Search</Button>
            <Button
                type="primary"
                onClick={handleReset}
                danger
                icon={<CloseCircleOutlined />}
            >Reset</Button>
        </Space.Compact>
    )
}

export default AdvanceSearch