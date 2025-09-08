import { Breadcrumb, Card, Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SalaryIncome from './Forms/SalaryIncome'
import AgricultureIncome from './Forms/AgricultureIncome'
import BusinessIncome from './Forms/BusinessIncome'
import LiveStockIncome from './Forms/LiveStockIncome'
import OtherIncome from './Forms/OtherIncome'

const LoanFormApplication: React.FC = () => {

    const navigate = useNavigate()
    const { pathname, state } = useLocation()
    const cleanUrl = pathname.replace('/loan-application', '')
    const [sourceOfIncome, setSourceOfIncome] = useState(null)
    const [mode, setMode] = useState<'save' | 'update'>('save')

    const resetSourceOfIncome = () => {
        setSourceOfIncome(null)
    }

    useEffect(() => {
        if (state?.sourceOfIncome) {
            setSourceOfIncome(state.sourceOfIncome)
            setMode(state.mode)
        }
    },
        [state])


    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: 'Home'
                    },
                    {
                        title: <a onClick={() => navigate(cleanUrl)}>Loan Dashboard</a>
                    },
                    {
                        title: 'Facility Application'
                    },
                ]}
            />
            <Card title={"Facility Application"} className='mt-3'>
                {/* https://lolcfusion.atlassian.net/browse/MDV-12222 - change the label title */}
                <Form className='w-1/4' layout='vertical'>
                    <Form.Item label="Add a Source of Income">
                        <Select
                            className='w-1/4'
                            placeholder="Select Income Source"
                            value={sourceOfIncome}
                            options={[
                                { label: 'Agriculture Income', value: 'Agriculture Income' },
                                { label: 'Business Income', value: 'Business Income' },
                                { label: 'Salary Income', value: 'Salary Income' },
                                { label: 'Live Stock Income', value: 'Live Stock Income' },
                                { label: 'Other Income', value: 'Other Income' }
                            ]}
                            onChange={(value => setSourceOfIncome(value))}
                        />
                    </Form.Item>
                </Form>

                {
                    sourceOfIncome === 'Salary Income' && <SalaryIncome sourceOfIncome={sourceOfIncome} resetSourceOfIncome={resetSourceOfIncome} mode={mode} updateData={mode === 'update' ? state.salaryIncome : null} />
                }
                {
                    sourceOfIncome === 'Agriculture Income' && <AgricultureIncome sourceOfIncome={sourceOfIncome} resetSourceOfIncome={resetSourceOfIncome} formMode={mode} updateData={mode === 'update' ? state.agricultureIncome : null} />
                }
                {
                    sourceOfIncome === 'Business Income' && <BusinessIncome sourceOfIncome={sourceOfIncome} resetSourceOfIncome={resetSourceOfIncome} mode={mode} updateData={mode === 'update' ? state.businessIncome : null} />
                }
                {
                    sourceOfIncome === 'Live Stock Income' && <LiveStockIncome sourceOfIncome={sourceOfIncome} resetSourceOfIncome={resetSourceOfIncome} mode={mode} updateData={mode === 'update' ? state.liveStockIncome : null} />
                }
                {
                    sourceOfIncome === 'Other Income' && <OtherIncome sourceOfIncome={sourceOfIncome} resetSourceOfIncome={resetSourceOfIncome} mode={mode} updateData={mode === 'update' ? state.otherIncome : null} />
                }

            </Card>
        </>
    )
}

export default LoanFormApplication