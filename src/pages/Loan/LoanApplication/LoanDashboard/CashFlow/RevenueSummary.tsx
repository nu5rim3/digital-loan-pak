import { Collapse, Descriptions, Tag } from 'antd'
import React from 'react'
import useCreditStore from '../../../../../store/creditStore'
import { formatCurrency } from '../../../../../utils/formatterFunctions';

const RevenueSummary: React.FC = () => {

    const { grossSalaryIncome, totRevenue, totHouseholdIncome, getMonthValueBasedOnKey } = useCreditStore();

    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                items={[
                    {
                        key: '1',
                        label: `Revenue Summary (Monthly)`,
                        children: (
                            <div className='flex flex-col gap-2'>

                                <Descriptions column={1} bordered>
                                    <Descriptions.Item label="Gross Salary">
                                        {formatCurrency(Number(grossSalaryIncome ?? 0))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Business Income">
                                        {formatCurrency(Number(getMonthValueBasedOnKey('Business 1')) + Number(getMonthValueBasedOnKey('Business 2')))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Agricultural Income">
                                        {formatCurrency(Number(getMonthValueBasedOnKey('Agriculture')))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Other Income">
                                        {formatCurrency(Number(getMonthValueBasedOnKey('Other')))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Rental Income">
                                        {formatCurrency(Number(getMonthValueBasedOnKey('Rental')))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Total Household Income">
                                        {formatCurrency(Number(totHouseholdIncome ?? 0))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<b>Total Revenue</b>} className='font-bold'>
                                        <Tag color='green'><b>{formatCurrency(Number(totRevenue ?? 0))}</b></Tag>
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

export default RevenueSummary