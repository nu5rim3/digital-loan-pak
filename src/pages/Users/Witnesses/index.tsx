import { Card, Divider } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React from 'react'
import PaginatedTable from '../../../components/common/tables/PaginatedTable';
import SearchBar from '../../../components/common/searchBar/SearchBar';

const Guarantors: React.FC = () => {

    const columns = [
        {
            title: 'IDX',
            dataIndex: 'idx',
            key: 'idx',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Identification Type',
            dataIndex: 'identificationType',
            key: 'identificationType',
        },
        {
            title: 'Identification Number',
            dataIndex: 'identificationNumber',
            key: 'identificationNumber',
        },
        {
            title: 'Telco Provider',
            dataIndex: 'telcoProvider',
            key: 'telcoProvider',
        },
        {
            title: 'Contact Number',
            dataIndex: 'contactNumber',
            key: 'contactNumber',
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: () => (
                <>
                    <a href="#">View</a>
                    <Divider type="vertical" />
                    <a href="#">Update</a>
                </>
            ),
        },
    ];

    const dummyData = [
        {
            idx: 'CLI0000000001',
            fullName: 'John Doe',
            identificationType: 'CNIC',
            identificationNumber: '12345-1234567-8',
            telcoProvider: 'Jazz',
            contactNumber: '03001234567',
        },
        {
            idx: 'CLI0000000002',
            fullName: 'Jane Doe',
            identificationType: 'CNIC',
            identificationNumber: '12345-1234567-8',
            telcoProvider: 'Jazz',
            contactNumber: '03001234567',
        },
        {
            idx: 'CLI0000000003',
            fullName: 'John Smith',
            identificationType: 'CNIC',
            identificationNumber: '12345-1234567-8',
            telcoProvider: 'Jazz',
            contactNumber: '03001234567',
        },
    ];

    const createNewCustomer = () => {
        console.log('Create new customer');
    }

    return (
        <Content>
            <Card title="Witnesses">
                <SearchBar action={createNewCustomer} actionLoading={false} actionTitle='New Witness' />

                <Divider />

                <PaginatedTable columns={columns} data={dummyData} />
            </Card>


            {/* <SideDrawer title={'Create a New Loan'} visible={open} onClose={onClose} form={
                <CustomerOnboarding />
            } /> */}
        </Content>
    )
}

export default Guarantors;