import React, { useEffect } from 'react'
import { Card, Divider, Layout, Tag } from 'antd'
import SearchBar from '../../../components/common/searchBar/SearchBar'
import PaginatedTable from '../../../components/common/tables/PaginatedTable'
// import SideDrawer from '../../../components/common/drawer/Drawer'
// import CustomerOnboarding from './CustomerOnboarding'
import { formatCurrency } from '../../../utils/formatterFunctions'
import { useNavigate } from 'react-router-dom'
import useLoanStore from '../../../store/loanStore'

const { Content } = Layout


const LoanApplication: React.FC = () => {

    const columns = [
        {
            title: 'Application ID',
            dataIndex: 'applicationID',
            key: 'applicationID',
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
            applicationID: 'APP0935093095',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100',
            status: 'C',
        },
        {
            key: '2',
            applicationID: 'APP0935093095',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100000',
            status: 'P',
        },
        {
            key: '3',
            applicationID: 'APP0935093095',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100000',
            status: 'F',
        },
        {
            key: '4',
            applicationID: 'APP0935093095',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100000',
            status: 'C',
        },
        {
            key: '5',
            applicationID: 'APP0935093095',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '1000',
            status: 'C',
        },
        {
            key: '6',
            applicationID: 'APP0935093095',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '1054000',
            status: 'P',
        },
        {
            key: '7',
            applicationID: 'APP0935093095',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '134000',
            status: 'F',
        },
        {
            key: '8',
            applicationID: 'APP0935093095',
            cusName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '6100000',
            status: 'C',
        }
    ];

    // const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { loading, addLoan } = useLoanStore();

    // const showDrawer = () => {
    //     setOpen(true);
    // };

    // const onClose = () => {
    //     setOpen(false);
    // };

    const newLoanHandler = async () => {
        await addLoan({
            category: "LOAN",
            longitude: "",
            latitude: "",
            financialUnit: "IBU",
            client: "WEB",
        }).then(() => {
            navigate(`new`)
        })
    };

    return (
        <Content>
            <Card title="Loan Request">
                <SearchBar action={newLoanHandler} actionLoading={loading} />

                <Divider />

                <PaginatedTable columns={columns} data={dummyData} />
            </Card>


            {/* <SideDrawer title={'Create a New Loan'} visible={open} onClose={onClose} form={
                <CustomerOnboarding />
            } /> */}
        </Content>
    )
}

export default LoanApplication