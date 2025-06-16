import { Button, Card, Collapse, Descriptions, Tag } from 'antd'
import React, { useEffect } from 'react'
import { formatCurrency } from '../../../../../utils/formatterFunctions';
import useCreditStore, { ICashFlowData } from '../../../../../store/creditStore';
import { SaveOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const Summary: React.FC = () => {
    const { appId } = useParams()
    const { cashFlows, cashFlowsLoading, taxableAmount, bnsOrAgriExpenses, houseHoldExpenses, houseHoldContribution, applicantRevenue, totExpense, totBusinessExpense, totHouseholdExpense, totRevenue, totHouseholdIncome, totBusinessIncome, isAlegibleFroLoan, grossSalaryIncome, annualDisposable, annualHousehold, maxDebtBurden, netMonthlyDisposable, maxLoanValue, product, productDefinition, fetchProduct, fetchProductDefinition, addCashFlows, fetchCashFlows } = useCreditStore();

    useEffect(() => {
        fetchProduct(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (product?.pTrhdLType) {
            fetchProductDefinition(product?.pTrhdLType ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product])

    const onSubmitCashFlow = () => {
        const data: ICashFlowData = {
            appraisalId: appId ?? '',
            grossSalaryIncome: grossSalaryIncome?.toString() ?? '0',
            totBusinessIncome: totBusinessIncome?.toString() ?? '0',
            totHouseholdIncome: totHouseholdIncome?.toString() ?? '0',
            totRevenue: totRevenue?.toString() ?? '0',
            totHouseholdExpense: totHouseholdExpense?.toString() ?? '0',
            totBusinessExpense: totBusinessExpense?.toString() ?? '0',
            totExpense: totExpense?.toString() ?? '0',
            netMonthlyDisposable: netMonthlyDisposable?.toString() ?? '0',
            annualDisposableIncome: annualDisposable?.toString() ?? '0',
            taxableAmount: taxableAmount?.toString() ?? '0',
            beBiRate: productDefinition?.beBiRate ?? '0',
            dscr: productDefinition?.dscr ?? '0',
            maxDebtBurden: maxDebtBurden?.toString() ?? '0',
            tenure: product?.pTrhdTerm ?? '',
            maxLoanValue: maxLoanValue?.toString() ?? '0',
            annualHouseIncome: annualHousehold?.toString() ?? '0',
            applicantRevenue: applicantRevenue ?? [],
            houseHoldContribution: houseHoldContribution ?? [],
            houseHoldExpenses: houseHoldExpenses ?? [],
            bnsOrAgriExpenses: bnsOrAgriExpenses ?? []
        }

        addCashFlows(appId ?? '', data)
    }

    useEffect(() => {
        fetchCashFlows(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId, addCashFlows])


    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                items={[
                    {
                        key: '1',
                        label: `Revenue & Expenses Summary`,
                        children: (
                            <Card className='flex flex-col' bordered={false} loading={cashFlowsLoading}>
                                <Descriptions column={1} bordered>
                                    <Descriptions.Item label="Requested Loan Amount">
                                        <Tag color='blue'><b>{formatCurrency(Number(product?.pTrhdLocCost ?? 0))}</b></Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Net Monthly Disposable">
                                        {formatCurrency(Number(netMonthlyDisposable ?? 0))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Debt-Service Ration (%)">
                                        {productDefinition?.dscr ?? 0}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Max Debt Burden">
                                        {formatCurrency(Number(maxDebtBurden ?? 0))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Tenure">
                                        {product?.pTrhdTerm ?? 0}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Max Loan Value">
                                        {formatCurrency(Number(maxLoanValue ?? 0))}
                                    </Descriptions.Item>
                                    {/* <Descriptions.Item label="Tax Rate (%)">
                                        {productDefinition?.taxRate ?? 0}
                                    </Descriptions.Item> */}
                                    {/* <Descriptions.Item label="Taxable Amount">
                                        {formatCurrency(Number(taxableAmount ?? 0))}
                                    </Descriptions.Item> */}
                                    <Descriptions.Item label="Annual Household">
                                        {formatCurrency(Number(annualHousehold ?? 0))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Annual Disposable">
                                        {formatCurrency(Number(annualDisposable ?? 0))}
                                    </Descriptions.Item>
                                    {/* <Descriptions.Item label="Annual Revenue">
                                        {formatCurrency(Number(annualRevenue ?? 0))}
                                    </Descriptions.Item> */}
                                    <Descriptions.Item label="Loan Eligibility Status">
                                        <Tag color={isAlegibleFroLoan ? 'green' : 'red'}><b>{isAlegibleFroLoan ? 'Suceess' : 'Reject'}</b></Tag>
                                    </Descriptions.Item>
                                </Descriptions>

                                <div className='mt-5' hidden={cashFlows?.annualHouseIncome !== null}>
                                    <Button type='primary' icon={<SaveOutlined />} onClick={onSubmitCashFlow} disabled={!isAlegibleFroLoan}>
                                        Save Cash Flow
                                    </Button>
                                </div>
                            </Card>
                        )
                    }
                ]}
            />
        </>
    )
}


// success - 

export default Summary