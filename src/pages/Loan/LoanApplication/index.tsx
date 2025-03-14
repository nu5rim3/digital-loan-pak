import React, { useState } from 'react'
import { Card, Divider, Layout } from 'antd'
import SearchBar from '../../../components/common/searchBar/SearchBar'
import PaginatedTable from '../../../components/common/tables/PaginatedTable'
import SideDrawer from '../../../components/common/drawer/Drawer'
import CustomerOnboarding from './CustomerOnboarding'

const { Content } = Layout


const LoanApplication: React.FC = () => {

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: () => (
                <a href='/'>View</a>
            ),
        },
    ];

    const dummyData = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ];

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <Content>
            <Card title="Loan Request">
                <SearchBar action={showDrawer} />

                <Divider />

                <PaginatedTable columns={columns} data={dummyData} />
            </Card>


            <SideDrawer title={'Create a New Loan'} visible={open} onClose={onClose} form={
                <CustomerOnboarding />
            } />
        </Content>
    )
}

export default LoanApplication