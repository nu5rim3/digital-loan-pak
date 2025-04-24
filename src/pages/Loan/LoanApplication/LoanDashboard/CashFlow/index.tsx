import React from 'react'
import HouseHoldExpenses from './HouseHoldExpenses'
import ApplicantRevenue from './ApplicantRevenue'
import Summary from './Summary'
import HouseHoldContribution from './HouseHoldContribution'
import BnsOrAgriExpenses from './BnsOrAgriExpenses'
import { Card } from 'antd'
import RevenueSummary from './RevenueSummary'
import ExpensesSummary from './ExpensesSummary'

const CashFlow: React.FC = () => {
    return (
        <div className='flex flex-col gap-3'>
            <Card>
                <div className='flex flex-col gap-3'>
                    <div>
                        <ApplicantRevenue />
                    </div>
                    <div>
                        <HouseHoldContribution />
                    </div>
                    <div>
                        <RevenueSummary />
                    </div>
                </div>
            </Card>
            <Card>
                <div className='flex flex-col gap-3'>
                    <div>
                        <HouseHoldExpenses />
                    </div>
                    <div>
                        <BnsOrAgriExpenses />
                    </div>
                    <div>
                        <ExpensesSummary />
                    </div>
                </div>
            </Card>
            <Summary />
        </div>
    )
}

export default CashFlow