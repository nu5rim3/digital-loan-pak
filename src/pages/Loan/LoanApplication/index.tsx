import React from 'react'
import { Button, Card, Divider, Layout, Tag, Tabs } from 'antd'
import SearchBar from '../../../components/common/searchBar/SearchBar'
import PaginatedTable from '../../../components/common/tables/PaginatedTable'
import { formatCurrency } from '../../../utils/formatterFunctions'
import { useNavigate } from 'react-router-dom'
import useLoanStore from '../../../store/loanStore'
import { mainURL } from '../../../App'
import useCustomerStore from '../../../store/customerStore'
import { PlusOutlined } from '@ant-design/icons';
import useUserStore from '../../../store/userStore'

const { Content } = Layout


const LoanApplication: React.FC = () => {

    const navigate = useNavigate();
    const { loading, addLoan, fetchLoans } = useLoanStore();
    const { resetCustomer } = useCustomerStore()
    const { user } = useUserStore()

    const columns = [
        {
            title: 'Application ID',
            dataIndex: 'applicationId',
            key: 'applicationId',
        },
        {
            title: 'Customer Name',
            dataIndex: 'cusName',
            key: 'cusName',
        },
        {
            title: 'Loan Type',
            dataIndex: 'loanType',
            key: 'loanType',
        },
        {
            title: 'Loan Amount',
            dataIndex: 'loanAmount',
            key: 'loanAmount',
            align: 'right',
            render: (amount: string) => {
                return <span>{formatCurrency(Number(amount))}</span>
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                switch (status) {
                    case 'C':
                        return <Tag color='green'>Completed</Tag>;
                        break;
                    case 'P':
                        return <Tag color='yellow'>Pending</Tag>;
                        break;
                    case 'F':
                        return <Tag color='red'>Rejected</Tag>;
                        break;
                    default:
                        break;
                }
            },
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: string, item: any) => (
                <a onClick={() => navigate(`${item.applicationId}`)}>View</a>
            ),
        },
    ];

    const dummyData = [
        {
            key: '1',
            applicationId: 'APP0000000066427',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100',
            status: 'C',
            clidx: 'CLI0000000000003',
            createdDate: '2023-10-01'
        },
        {
            key: '2',
            applicationId: 'APP0000000067075',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100000',
            status: 'P',
            clidx: 'CLI0000000000003',
            createdDate: '2023-10-01'

        },
        {
            key: '3',
            applicationId: "APP0000000066623",
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100000',
            status: 'F',
            clidx: 'CLI0000000103833',
            createdDate: '2023-10-01'
        },
        {
            key: '4',
            applicationId: 'APP0000000066602',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100000',
            status: 'C',
            clidx: 'CLI0000000000003',
            createdDate: '2023-10-01'
        },
        {
            key: '5',
            applicationId: 'APP0000000066447',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '1000',
            status: 'C',
            clidx: 'CLI0000000000003',
            createdDate: '2023-10-01'
        },
        {
            key: '6',
            applicationId: 'APP0000000066411',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '1054000',
            status: 'C',
            clidx: 'CLI0000000103951',
            createdDate: '2023-10-01'
        },
        {
            key: '7',
            applicationId: 'APP0000000066707',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '134000',
            status: 'F',
            clidx: 'CLI0000000000003',
            createdDate: '2023-10-01'
        },
        {
            key: '8',
            applicationId: 'APP0000000066660',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '6100000',
            status: 'C',
            clidx: 'CLI0000000000003',
            createdDate: '2023-10-01'
        }
    ];

    const onChange = (key: string) => {
        fetchLoans(key, user?.idx ?? '');
    }

    const newLoanHandler = async () => {
        await addLoan({
            category: "LOAN",
            longitude: "",
            latitude: "",
            financialUnit: "IBU",
            client: "WEB",
        }).then(() => {
            navigate(`${mainURL}/users/customer`, { state: { newLoan: true } })
            resetCustomer();
        })
    };

    return (
        <Content>
            <Card title="Loan Request">


                <Tabs
                    onChange={onChange}
                    type="card"
                    tabBarExtraContent={{
                        right: <Button type='primary' onClick={newLoanHandler} loading={loading} icon={<PlusOutlined />}>New Loan</Button>
                    }}
                    items={[
                        {
                            label: `Pending`,
                            key: 'PENDING',
                            children:
                                <>
                                    <SearchBar />
                                    <Divider />
                                    <PaginatedTable columns={columns} data={dummyData} />
                                </>
                            ,
                        },
                        {
                            label: `Return`,
                            key: 'RETURNED',
                            children:
                                <>
                                    <SearchBar />
                                    <Divider />
                                    <PaginatedTable columns={columns} data={dummyData} />
                                </>
                        },
                        {
                            label: `Completed`,
                            key: 'COMPLETED',
                            children:
                                <>
                                    <SearchBar />
                                    <Divider />
                                    <PaginatedTable columns={columns} data={dummyData} />
                                </>
                        },
                    ]}
                />
            </Card>

        </Content>
    )
}

export default LoanApplication