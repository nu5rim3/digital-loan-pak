import React from 'react';
import { Table } from 'antd';

interface APIPaginatedTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    loading?: boolean;
    currentPage: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number, pageSize?: number) => void;
}

const APIPaginatedTable: React.FC<APIPaginatedTableProps> = ({
    columns,
    data,
    loading = false,
    currentPage,
    pageSize,
    total,
    onPageChange,
}) => {
    return (
        <Table
            size='small'
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                showSizeChanger: false,
                onChange: onPageChange,
            }}
            rowKey={record => record.applicationId || record.key}
        />
    );
};

export default APIPaginatedTable;