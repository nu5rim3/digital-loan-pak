import React, { useEffect, useState } from 'react'
import { Button, Card, Divider, Layout, Tabs, Tag } from 'antd'
import APIPaginatedTable from '../../../components/common/tables/APIPaginatedTable'
import { formatCurrency } from '../../../utils/formatterFunctions'
import { useNavigate } from 'react-router-dom'
import useLoanStore from '../../../store/loanStore'
import { mainURL } from '../../../App'
import useCustomerStore from '../../../store/customerStore'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment'
import useUserStore from '../../../store/userStore'
import useCreditStore from '../../../store/creditStore'
import AdvanceSearch from '../../../components/common/searchBar/AdvanceSearch'
const { Content } = Layout


const LoanApplication: React.FC = () => {

    const navigate = useNavigate();
    const { pageableLoans, pageableLoading, loading, addLoan, fetchPageableLoans } = useLoanStore();
    const { resetAllTrailCalucationData } = useCreditStore()
    const { resetCustomer } = useCustomerStore()
    const [activeTab, setActiveTab] = useState('PENDING');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(7)
    const [params, setParams] = useState({
        appraisalId: '',
        customerName: '',
        fromDate: '',
        toDate: ''
    })
    const { user } = useUserStore();

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
            title: 'Application Category',
            dataIndex: 'prodCat',
            key: 'prodCat',
            render: (category: string) => {
                if (category === 'C') {
                    return <Tag color='cyan-inverse'><b>Loan</b></Tag>
                } else if (category === 'A') {
                    return <Tag color='lime-inverse'><b>Lease</b></Tag>
                } else {
                    return <Tag color='yellow-inverse'><b>TC Pending</b></Tag>
                }

            }
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
                <a onClick={() => {
                    resetAllTrailCalucationData();
                    navigate(`${item.appIdx}`)
                }}>
                    <EyeOutlined /> </a>
            ),
        },
    ];

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
            resetAllTrailCalucationData();
            resetCustomer();
        })
    };


    useEffect(() => {
        fetchPageableLoans({ ...params, status: activeTab, page: currentPage - 1, size: pageSize, createdBy: user?.idx });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, currentPage, pageSize, params]);

    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
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
                                    <AdvanceSearch
                                        options={[
                                            { label: 'Application ID', value: 'appraisalId' },
                                            { label: 'Customer Name', value: 'customerName' },
                                        ]}
                                        setParams={(value) => {
                                            setParams({
                                                ...params,
                                                ...value,
                                                fromDate: value.fromDate || '',
                                                toDate: value.toDate || ''
                                            });
                                        }}
                                        loading={pageableLoading}
                                    />
                                    <Divider />
                                    <APIPaginatedTable
                                        rowKey="appIdx"
                                        columns={columns}
                                        data={tableData}
                                        loading={pageableLoading}
                                        currentPage={currentPage}
                                        pageSize={pageSize}
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
                                    <AdvanceSearch
                                        options={[
                                            { label: 'Application ID', value: 'appraisalId' },
                                            { label: 'Customer Name', value: 'customerName' },
                                        ]}
                                        setParams={(value) => {
                                            setParams({
                                                ...params,
                                                ...value,
                                                fromDate: value.fromDate || '',
                                                toDate: value.toDate || ''
                                            });
                                        }}
                                        loading={pageableLoading}
                                    />
                                    <Divider />
                                    <APIPaginatedTable
                                        rowKey="appIdx"
                                        columns={columns}
                                        data={tableData}
                                        loading={pageableLoading}
                                        currentPage={currentPage}
                                        pageSize={pageSize}
                                        total={total}
                                        onPageChange={handlePageChange}
                                    />
                                </>
                        },
                        {
                            label: `Completed`,
                            key: 'COMPLETED',
                            children:
                                <>
                                    <AdvanceSearch
                                        options={[
                                            { label: 'Application ID', value: 'appraisalId' },
                                            { label: 'Customer Name', value: 'customerName' },
                                        ]}
                                        setParams={(value) => {
                                            setParams({
                                                ...params,
                                                ...value,
                                                fromDate: value.fromDate || '',
                                                toDate: value.toDate || ''
                                            });
                                        }}
                                        loading={pageableLoading}
                                    />
                                    <Divider />
                                    <APIPaginatedTable
                                        rowKey="appIdx"
                                        columns={columns}
                                        data={tableData}
                                        loading={pageableLoading}
                                        currentPage={currentPage}
                                        pageSize={pageSize}
                                        total={total}
                                        onPageChange={handlePageChange}
                                    />
                                </>
                        },
                    ]}
                />
            </Card>

        </Content>
    )
}

export default LoanApplication