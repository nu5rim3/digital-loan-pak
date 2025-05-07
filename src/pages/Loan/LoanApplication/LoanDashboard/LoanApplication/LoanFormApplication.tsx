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
                        title: 'Loan Application'
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
                    sourceOfIncome === 'Agricultural Income' && <AgricultureIncome sourceOfIncome={sourceOfIncome} resetSourceOfIncome={resetSourceOfIncome} formMode={mode} updateData={mode === 'update' ? state.agricultureIncome : null} />
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