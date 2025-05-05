import { Breadcrumb, Card, Form, Select } from 'antd'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SalaryIncome from './Forms/SalaryIncome'
import AgricultureIncome from './Forms/AgricultureIncome'
import BusinessIncome from './Forms/BusinessIncome'

const LoanFormApplication: React.FC = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const cleanUrl = pathname.replace('/loan-application', '')
    const [sourceOfIncome, setSourceOfIncome] = useState(null)

    const resetSourceOfIncome = () => {
        setSourceOfIncome(null)
    }

    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: 'Home',
                    },
                    {
                        title: <a onClick={() => navigate(cleanUrl)}>Loan Dashboard</a>,
                    },
                    {
                        title: 'Loan Application',
                    },
                ]}
            />
            <Card title={"Loan Application"} className='mt-3'>

                <Form className='w-1/4' layout='vertical'>
                    <Form.Item label="Source Of Income">
                        <Select
                            className='w-1/4'
                            placeholder="Select Income Source"
                            value={sourceOfIncome}
                            options={[
                                { label: 'Agricultural Income', value: 'Agricultural Income' },
                                { label: 'Business Income', value: 'Business Income' },
                                { label: 'Salary Income', value: 'Salary Income' },
                                { label: 'Live Stock Income', value: 'Live Stock Income' }
                            ]}
                            onChange={(value => setSourceOfIncome(value))}
                        />
                    </Form.Item>
                </Form>

                {
                    sourceOfIncome === 'Salary Income' && <SalaryIncome sourceOfIncome={sourceOfIncome} resetSourceOfIncome={resetSourceOfIncome} />
                }
                {
                    sourceOfIncome === 'Agricultural Income' && <AgricultureIncome sourceOfIncome={sourceOfIncome} resetSourceOfIncome={resetSourceOfIncome} />
                }
                {
                    sourceOfIncome === 'Business Income' && <BusinessIncome sourceOfIncome={sourceOfIncome} resetSourceOfIncome={resetSourceOfIncome} />
                }
                {
                    sourceOfIncome === 'Live Stock Income' && <></>
                }

            </Card>
        </>
    )
}

export default LoanFormApplication