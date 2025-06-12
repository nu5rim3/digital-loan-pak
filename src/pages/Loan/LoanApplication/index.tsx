import React, { useEffect, useState } from 'react'
import { Button, Card, Divider, Layout, Tabs } from 'antd'
import SearchBar from '../../../components/common/searchBar/SearchBar'
import PaginatedTable from '../../../components/common/tables/PaginatedTable'
import APIPaginatedTable from '../../../components/common/tables/APIPaginatedTable'
import { formatCurrency } from '../../../utils/formatterFunctions'
import { useNavigate } from 'react-router-dom'
import useLoanStore from '../../../store/loanStore'
import { mainURL } from '../../../App'
import useCustomerStore from '../../../store/customerStore'
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment'

const { Content } = Layout


const LoanApplication: React.FC = () => {

    const navigate = useNavigate();
    const { pageableLoans, pageableLoading, loading, addLoan, fetchPageableLoans } = useLoanStore();
    const { resetCustomer } = useCustomerStore()
    const [activeTab, setActiveTab] = useState('PENDING');
    const [currentPage, setCurrentPage] = useState(1);

    const columns = [
        {
            title: 'Application ID',
            dataIndex: 'appIdx',
            key: 'appIdx',
        },
        {
            title: 'Customer Name',
            dataIndex: 'fullName',
            key: 'fullName',
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
        // {
        //     title: 'Status',
        //     dataIndex: 'appStatus',
        //     key: 'appStatus',
        //     render: (status: string) => {
        //         switch (status) {
        //             case 'C':
        //                 return <Tag color='green'>Completed</Tag>;
        //                 break;
        //             case 'P':
        //                 return <Tag color='yellow'>Pending</Tag>;
        //                 break;
        //             case 'F':
        //                 return <Tag color='red'>Rejected</Tag>;
        //                 break;
        //             default:
        //                 break;
        //         }
        //     },
        // },
        {
            title: 'Created Date',
            dataIndex: 'creationDate',
            key: 'creationDate',
            render: (date: string) => {
                return moment(date).format('YYYY-MM-DD');
            },
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: string, item: any) => (
                <a onClick={() => navigate(`${item.appIdx}`)}>View</a>
            ),
        },
    ];

    const dummyData = [
        {
            key: '1',
            appIdx: 'APP0000000066427',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100',
            // status: 'C',
            clidx: 'CLI0000000000003',
            creationDate: '2023-10-01'
        },
        {
            key: '2',
            appIdx: 'APP0000000067075',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100000',
            status: 'P',
            clidx: 'CLI0000000000003',
            creationDate: '2023-10-01'

        },
        {
            key: '3',
            appIdx: "APP0000000066623",
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100000',
            // status: 'F',
            clidx: 'CLI0000000103833',
            creationDate: '2023-10-01'
        },
        {
            key: '4',
            appIdx: 'APP0000000066602',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100000',
            // status: 'C',
            clidx: 'CLI0000000000003',
            creationDate: '2023-10-01'
        },
        {
            key: '5',
            appIdx: 'APP0000000066447',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '1000',
            // status: 'C',
            clidx: 'CLI0000000000003',
            creationDate: '2023-10-01'
        },
        {
            key: '6',
            appIdx: 'APP0000000066411',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '1054000',
            // status: 'C',
            clidx: 'CLI0000000103951',
            creationDate: '2023-10-01'
        },
        {
            key: '7',
            appIdx: 'APP0000000066707',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '134000',
            // status: 'F',
            clidx: 'CLI0000000000003',
            creationDate: '2023-10-01'
        },
        {
            key: '8',
            appIdx: 'APP0000000066660',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '6100000',
            // status: 'C',
            clidx: 'CLI0000000000003',
            creationDate: '2023-10-01'
        },
        {
            key: '9',
            appIdx: 'APP0000000066600',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '1000000',
            // status: 'C',
            clidx: 'CLI0000000000003',
            creationDate: '2023-10-01'
        },
        {
            key: '10',
            appIdx: 'APP0000000066601',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '10000',
            // status: 'C',
            clidx: 'CLI0000000000003',
            creationDate: '2023-10-01'
        },
        {
            key: '11',
            appIdx: 'APP0000000066603',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '100000',
            // status: 'C',
            clidx: 'CLI0000000000003',
            creationDate: '2023-10-01'
        },
        {
            key: '12',
            appIdx: 'APP0000000066604',
            fullName: 'Shabira',
            loanType: 'Gold Loan',
            loanAmount: '10000',
            // status: 'C',
            clidx: 'CLI0000000000003',
            creationDate: '2023-10-01'
        },

    ];

    const dummyData2 = [
        {
            "appIdx": "APP0000000017121",
            "appStatus": "P",
            "appCategory": "LOAN",
            "appLongitude": 6.9044529,
            "appLatitude": 79.903484,
            "appVersion": null,
            "createdBy": "ABU.BAKER",
            "creationDate": "2023-12-07T03:50:08.743+00:00",
            "lastModifiedDate": "2024-04-10T09:09:33.722+00:00",
            "isReturned": "Y",
            "contractNo": "330123120006",
            "contractStatus": "DP",
            "contractDescription": "Down Payment Received",
            "client": "MOBILE",
            "financialUnit": "CONVENTIONAL",
            "cliIdx": "CLI0000000041471",
            "cliType": "C",
            "cliIdentifier": "34603-9292439-3",
            "cliIdentifierType": "CNIC",
            "fullName": "Subhan Imran Sheikh",
            "cliSequence": "1",
            "cliStatus": "A",
            "cliCity": "10",
            "cliContactNumber": "03001775900",
            "cliTelcoProvider": "Jazz",
            "geoLocation": null,
            "cliRefNo": null,
            "loanType": "GL",
            "loanAmount": "61000",
            "tcNo": null
        },
        {
            "appIdx": "APP0000000017139",
            "appStatus": "C",
            "appCategory": "LOAN",
            "appLongitude": 6.9044529,
            "appLatitude": 79.903484,
            "appVersion": null,
            "createdBy": "AQSA.ARIF",
            "creationDate": "2023-12-07T07:37:42.961+00:00",
            "lastModifiedDate": "2023-12-07T09:03:40.341+00:00",
            "isReturned": null,
            "contractNo": null,
            "contractStatus": null,
            "contractDescription": null,
            "client": "MOBILE",
            "financialUnit": "CONVENTIONAL",
            "cliIdx": "CLI0000000041527",
            "cliType": "C",
            "cliIdentifier": "34101-8458401-7",
            "cliIdentifierType": "CNIC",
            "fullName": "dami",
            "cliSequence": "1",
            "cliStatus": "A",
            "cliCity": null,
            "cliContactNumber": "03251436825",
            "cliTelcoProvider": "Jazz",
            "geoLocation": null,
            "cliRefNo": null,
            "loanType": "GL",
            "loanAmount": "115000",
            "tcNo": null
        },
        {
            "appIdx": "APP0000000017118",
            "appStatus": "J",
            "appCategory": "LOAN",
            "appLongitude": 6.9044529,
            "appLatitude": 79.903484,
            "appVersion": null,
            "createdBy": "MUHAMMAD.AYAZ",
            "creationDate": "2023-12-07T02:48:32.339+00:00",
            "lastModifiedDate": "2023-12-07T06:21:03.962+00:00",
            "isReturned": "N",
            "contractNo": null,
            "contractStatus": null,
            "contractDescription": null,
            "client": "MOBILE",
            "financialUnit": "CONVENTIONAL",
            "cliIdx": "CLI0000000041451",
            "cliType": "C",
            "cliIdentifier": "38101-4490713-9",
            "cliIdentifierType": "CNIC",
            "fullName": "syed hussain abbas",
            "cliSequence": "1",
            "cliStatus": "A",
            "cliCity": "10",
            "cliContactNumber": "03302351214",
            "cliTelcoProvider": "Ufone",
            "geoLocation": null,
            "cliRefNo": null,
            "loanType": "GL",
            "loanAmount": "100000",
            "tcNo": null
        },
        {
            "appIdx": "APP0000000017115",
            "appStatus": "A",
            "appCategory": "LOAN",
            "appLongitude": 6.9044529,
            "appLatitude": 79.903484,
            "appVersion": null,
            "createdBy": "RAHIM.SHAH",
            "creationDate": "2023-12-07T02:46:35.289+00:00",
            "lastModifiedDate": "2023-12-07T05:47:39.007+00:00",
            "isReturned": "Y",
            "contractNo": "030823120004",
            "contractStatus": null,
            "contractDescription": null,
            "client": "MOBILE",
            "financialUnit": "CONVENTIONAL",
            "cliIdx": "CLI0000000041447",
            "cliType": "C",
            "cliIdentifier": "17301-1165488-9",
            "cliIdentifierType": "CNIC",
            "fullName": "Rizwan ullah",
            "cliSequence": "1",
            "cliStatus": "A",
            "cliCity": "30",
            "cliContactNumber": "03138787684",
            "cliTelcoProvider": "Zong",
            "geoLocation": null,
            "cliRefNo": null,
            "loanType": "GL",
            "loanAmount": "140900",
            "tcNo": null
        },
        {
            "appIdx": "APP0000000017119",
            "appStatus": "A",
            "appCategory": "LOAN",
            "appLongitude": 6.9044529,
            "appLatitude": 79.903484,
            "appVersion": null,
            "createdBy": "JAVAID.AKHTAR",
            "creationDate": "2023-12-07T03:07:51.550+00:00",
            "lastModifiedDate": "2023-12-07T05:22:45.585+00:00",
            "isReturned": "Y",
            "contractNo": "027123120009",
            "contractStatus": null,
            "contractDescription": null,
            "client": "MOBILE",
            "financialUnit": "CONVENTIONAL",
            "cliIdx": "CLI0000000041457",
            "cliType": "C",
            "cliIdentifier": "37406-5400369-8",
            "cliIdentifierType": "CNIC",
            "fullName": "Aleena Amir Kazmi",
            "cliSequence": "1",
            "cliStatus": "A",
            "cliCity": "10",
            "cliContactNumber": "03135484288",
            "cliTelcoProvider": "Zong",
            "geoLocation": null,
            "cliRefNo": null,
            "loanType": "GL",
            "loanAmount": "63000",
            "tcNo": null
        },
        {
            "appIdx": "APP0000000017090",
            "appStatus": "A",
            "appCategory": "LOAN",
            "appLongitude": 6.9044529,
            "appLatitude": 79.903484,
            "appVersion": null,
            "createdBy": "RASHIMA",
            "creationDate": "2023-12-07T00:37:24.203+00:00",
            "lastModifiedDate": "2023-12-07T05:02:29.666+00:00",
            "isReturned": null,
            "contractNo": "025723120009",
            "contractStatus": null,
            "contractDescription": null,
            "client": "MOBILE",
            "financialUnit": "CONVENTIONAL",
            "cliIdx": "CLI0000000041381",
            "cliType": "C",
            "cliIdentifier": "61101-1855309-9",
            "cliIdentifierType": "CNIC",
            "fullName": "Malik Muhammad Abbas",
            "cliSequence": "1",
            "cliStatus": "A",
            "cliCity": "60",
            "cliContactNumber": "03315585493",
            "cliTelcoProvider": "Ufone",
            "geoLocation": null,
            "cliRefNo": null,
            "loanType": "GL",
            "loanAmount": "86000",
            "tcNo": null
        },
        {
            "appIdx": "APP0000000017108",
            "appStatus": "A",
            "appCategory": "LOAN",
            "appLongitude": 6.9044529,
            "appLatitude": 79.903484,
            "appVersion": null,
            "createdBy": "NASEER.AHMAD",
            "creationDate": "2023-12-07T02:28:32.251+00:00",
            "lastModifiedDate": "2023-12-07T04:49:55.508+00:00",
            "isReturned": "Y",
            "contractNo": "080123120015",
            "contractStatus": null,
            "contractDescription": null,
            "client": "MOBILE",
            "financialUnit": "CONVENTIONAL",
            "cliIdx": "CLI0000000041427",
            "cliType": "C",
            "cliIdentifier": "37101-8913311-1",
            "cliIdentifierType": "CNIC",
            "fullName": "Faizan Akhtar",
            "cliSequence": "1",
            "cliStatus": "A",
            "cliCity": "10",
            "cliContactNumber": "03215717532",
            "cliTelcoProvider": "Zong",
            "geoLocation": null,
            "cliRefNo": null,
            "loanType": "GL",
            "loanAmount": "65000",
            "tcNo": null
        }
    ]

    const onChange = (key: string) => {
        setActiveTab(key);
        setCurrentPage(1);
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


    useEffect(() => {
        fetchPageableLoans({ status: activeTab, page: currentPage - 1, size: 7 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Extract data for the table from pageableLoans
    const tableData = pageableLoans?.content || [];
    const total = pageableLoans?.totalElements || 0;


    return (
        <Content>
            <Card title="Loan Request">


                <Tabs
                    onChange={onChange}
                    type="card"
                    tabBarExtraContent={{
                        right: <Button type='primary' onClick={newLoanHandler} loading={loading} icon={<PlusOutlined />}>New Loan</Button>
                    }}
                    defaultActiveKey={activeTab}
                    items={[
                        {
                            label: `Pending`,
                            key: 'PENDING',
                            children:
                                <>
                                    <SearchBar />
                                    <Divider />
                                    <APIPaginatedTable
                                        columns={columns}
                                        data={tableData}
                                        loading={pageableLoading}
                                        currentPage={currentPage}
                                        pageSize={7}
                                        total={total}
                                        onPageChange={handlePageChange}
                                    />
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
                                    <PaginatedTable columns={columns} data={dummyData2} />
                                </>
                        },
                    ]}
                />
            </Card>

        </Content>
    )
}

export default LoanApplication