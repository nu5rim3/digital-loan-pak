/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Table } from 'antd';

interface PaginatedTableProps {
    columns: any[];
    data: any[];
}

const PaginatedTable: React.FC<PaginatedTableProps> = ({ columns, data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7; // Number of items to display per page

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <Table
            size='small'
            columns={columns}
            dataSource={paginatedData}
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: data.length,
                onChange: handlePageChange,
            }}
        />
    );
};

export default PaginatedTable;