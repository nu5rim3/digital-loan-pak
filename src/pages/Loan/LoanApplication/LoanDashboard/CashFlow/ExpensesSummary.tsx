import { Collapse, Descriptions, Tag } from 'antd'
import React from 'react'
import useCreditStore from '../../../../../store/creditStore'
import { formatCurrency } from '../../../../../utils/formatterFunctions';

const ExpensesSummary: React.FC = () => {

    const { totHouseholdExpense, totBusinessExpense, totExpense, getMonthValueBasedOnKeyExpenses } = useCreditStore();

    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                items={[
                    {
                        key: '1',
                        label: `Expenses Summary (Monthly)`,
                        children: (
                            <div className='flex flex-col gap-2'>

                                <Descriptions column={1} bordered>
                                    <Descriptions.Item label="Total Household Expenses">
                                        {formatCurrency(Number(totHouseholdExpense ?? 0))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Business Expenses">
                                        {formatCurrency(Number(totBusinessExpense ?? 0))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Agricultural Expenses">
                                        {formatCurrency(Number(getMonthValueBasedOnKeyExpenses('Agriculture')))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Other Expenses">
                                        {formatCurrency(Number(getMonthValueBasedOnKeyExpenses('Other')))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Rental Expenses">
                                        {formatCurrency(Number(getMonthValueBasedOnKeyExpenses('Rental')))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<b>Total Expenses</b>} className='font-bold'>
                                        <Tag color='green'><b>{formatCurrency(Number(totExpense ?? 0))}</b></Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        )
                    }
                ]}
            />
        </>
    )
}

export default ExpensesSummary