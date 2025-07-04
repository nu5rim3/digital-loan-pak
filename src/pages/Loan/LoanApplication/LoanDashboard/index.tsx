import { Button, Card, Collapse, CollapseProps, Empty } from 'antd'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getLoanStatusByName, getOnlyStatusByName } from '../../../../utils/MSASActionFunctions';
import useLoanStore from '../../../../store/loanStore';
import { kebabToTitleCase } from '../../../../utils/formatterFunctions';
import LoanStatusTag from '../../../../components/common/tags/LoanStatusTag';
import useStakeholderStore from '../../../../store/stakeholderStore';
import { getStakeholderByType } from '../../../../utils/stakholderFunction';
import { CaretLeftOutlined } from '@ant-design/icons';
import useCustomerStore from '../../../../store/customerStore';
import BusinessIntroducer from './BusinessIntroducer/BusinessIntroducer';
import CreditScoringPage from './CreditScoring/CreditScoringPage';
import CollateralDetails from './CollateralDetails';
import CustomerRiskProfiling from './CustomerRiskProfiling';
import { SendOutlined } from '@ant-design/icons';
import CustomerDetailsView from './Customer/CustomerDetailsView';
import GuarantorDetailsView from './Guarantor/GuarantorDetailsView';
import WitnessDetails from './Witness/WitnessDetails';
import LiabilityAffidavit from './LiabilityAffidavit';
import GoldFacilityApplication from './GoldFacilityApplication/GoldFacilityApplication';
import CashFlow from './CashFlow';
import ExceptionalApproval from './ExceptionalApproval';
import LoanApplication from './LoanApplication';

interface StatusProps {
    isCompleted: string;
    isMandatory: string;
}

const LoanDaashboard: React.FC = () => {

    const navigate = useNavigate();
    const { appId } = useParams();
    const { loading, loanStatus, fetchLoanStatusById } = useLoanStore();
    const { stakeholders, fetchStackholderByAppId, fetchContactDetailsByStkId, fetchAddressDetailsByStkId, resetStakeholder } = useStakeholderStore();
    const { customers, fetchCustomerByAppId } = useCustomerStore()

    // TODO: have to call the apprisal api to get the status of the loan application

    const onChange = (key: string | string[]) => {
        const triggerKey = key[0]
        let type = ''
        switch (triggerKey) {
            case 'customer':
                type = 'C'
                break;
            case 'guarantor':
                type = 'G'
                break;
            case 'witness':
                type = 'W'
                break;
            default:
                break;
        }
        const selectedIdx = getStakeholderByType(type, stakeholders ?? [])[0]?.idx
        if (selectedIdx) {
            fetchContactDetailsByStkId(selectedIdx ?? '')
            fetchAddressDetailsByStkId(selectedIdx ?? '')
        }
    };

    const genExtra = ({ isCompleted, isMandatory }: StatusProps) => (
        <>
            <LoanStatusTag type={'C'} status={isCompleted} />
            <LoanStatusTag type={'M'} status={isMandatory} />
        </>
    );

    const getComponentByName = (name: string) => {
        switch (name) {
            case 'customer':
                return <CustomerDetailsView formDetails={getStakeholderByType('C', stakeholders ?? [])[0] ?? null} />;
            case 'guarantor':
                return <GuarantorDetailsView formDetails={getStakeholderByType('G', stakeholders ?? []) ?? []} />;
            case 'witness':
                return <WitnessDetails formDetails={getStakeholderByType('W', stakeholders ?? []) ?? []} />;
            case 'Liability-Affidavit':
                return <LiabilityAffidavit />;
            case 'LOAN_COLLATERAL':
                return <div>Collateral</div>;
            case 'gold-facility-application':
                return <GoldFacilityApplication />;
            case 'loan-application':
                return <LoanApplication />;
            case 'LOAN_APPLICATION_APPROVAL':
                return <div>Loan Application Approval</div>;
            case 'image-upload':
                return <div>Image Upload</div>;
            case 'cash-flow':
                return <CashFlow />;
            case 'credit-scoring':
                return <CreditScoringPage appraisalId={appId ?? ''} />;
            case 'customer-risk-profiling':
                return <CustomerRiskProfiling />;
            case 'exceptional-approval':
                return <ExceptionalApproval />;
            case 'customer-acknowledgement':
                return <div>Customer Acknowledgement</div>;
            case 'guarantor-acknowledgement':
                return <div>Guarantor Acknowledgement</div>;
            case 'witness-acknowledgement':
                return <div>Witness Acknowledgement</div>;
            case 'term-deposit':
                return <div>Term Deposit</div>;
            case 'collateral-details':
                return <CollateralDetails />;
            case 'business-introducer':
                return <BusinessIntroducer />;
            default:
                return null;
        }
    };



    const dummyLoanStatus = [
        {
            "createdBy": "SYSTEM",
            "creationDate": "2022-08-09T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 1,
            "section": "customer",
            "isMandatory": "1",
            "completed": "1",
            "enabled": null,
            "status": "A"
        },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2022-08-09T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 2,
            "section": "guarantor",
            "isMandatory": "1",
            "completed": "0",
            "enabled": null,
            "status": "A"
        },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2024-07-11T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 3,
            "section": "witness",
            "isMandatory": "1",
            "completed": "1",
            "enabled": null,
            "status": "A"
        },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2024-07-11T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 12,
            "section": "business-introducer",
            "isMandatory": "0",
            "completed": "1",
            "enabled": null,
            "status": "A"
        },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2022-08-09T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 5,
            "section": "loan-application",
            "isMandatory": "1",
            "completed": "1",
            "enabled": null,
            "status": "A"
        },
        // {
        //     "createdBy": "SYSTEM",
        //     "creationDate": "2024-07-11T09:24:51.357+00:00",
        //     "lastModifiedBy": null,
        //     "lastModifiedDate": null,
        //     "id": 6,
        //     "section": "gold-facility-application",
        //     "isMandatory": "0",
        //     "completed": "1",
        //     "enabled": null,
        //     "status": "A"
        // },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2022-08-09T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 7,
            "section": "cash-flow",
            "isMandatory": "1",
            "completed": "1",
            "enabled": null,
            "status": "A"
        },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2024-07-11T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 4,
            "section": "Liability-Affidavit",
            "isMandatory": "1",
            "completed": "1",
            "enabled": null,
            "status": "A"
        },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2024-07-11T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 15,
            "section": "collateral-details",
            "isMandatory": "0",
            "completed": "1",
            "enabled": null,
            "status": "A"
        },
        // {
        //     "createdBy": "SYSTEM",
        //     "creationDate": "2022-08-09T09:24:51.357+00:00",
        //     "lastModifiedBy": null,
        //     "lastModifiedDate": null,
        //     "id": 11,
        //     "section": "customer-risk-profiling",
        //     "isMandatory": "0",
        //     "completed": "1",
        //     "enabled": null,
        //     "status": "A"
        // },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2022-08-09T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 10,
            "section": "credit-scoring",
            "isMandatory": "0",
            "completed": "1",
            "enabled": null,
            "status": "A"
        },
        // {
        //     "createdBy": "SYSTEM",
        //     "creationDate": "2024-07-11T09:24:51.357+00:00",
        //     "lastModifiedBy": null,
        //     "lastModifiedDate": null,
        //     "id": 13,
        //     "section": "term-deposit",
        //     "isMandatory": "0",
        //     "completed": "1",
        //     "enabled": null,
        //     "status": "A"
        // },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2022-08-09T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 12,
            "section": "exceptional-approval",
            "isMandatory": "0",
            "completed": "1",
            "enabled": null,
            "status": "A"
        },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2022-08-09T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 8,
            "section": "image-upload",
            "isMandatory": "1",
            "completed": "0",
            "enabled": null,
            "status": "A"
        },
        {
            "createdBy": "SYSTEM",
            "creationDate": "2022-08-09T09:24:51.357+00:00",
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "id": 13,
            "section": "customer-acknowledgement",
            "isMandatory": "1",
            "completed": "1",
            "enabled": null,
            "status": "A"
        },
    ]

    const items: CollapseProps['items'] = dummyLoanStatus && dummyLoanStatus.map((rule) => ({ //loanStatus
        key: `${rule.section}`,
        label: kebabToTitleCase(rule.section),
        children: getComponentByName(rule.section),
        extra: genExtra(getLoanStatusByName(rule.section, dummyLoanStatus)),
        collapsible: getOnlyStatusByName(rule.section, dummyLoanStatus) !== 'A' ? 'disabled' : undefined,
    }));

    useEffect(() => {
        if (loanStatus.length === 0) {
            fetchLoanStatusById(appId ?? '')
        }
        if (customers.length === 0) {
            fetchCustomerByAppId(appId ?? '')
        }
        if (stakeholders.length === 0) {
            fetchStackholderByAppId(appId ?? '')
        }
        return () => {
            resetStakeholder()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])

    useEffect(() => {
        fetchStackholderByAppId(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    if (loading) {
        return (
            <Card title={`Loan Application - ${appId}`}>
                <Empty description={'Loading...'} />
            </Card>
        )
    }

    if (loanStatus.length === 0) {
        return (
            <Card title={`Loan Application - ${appId}`}>
                <Empty
                    description={'No Data Found'}
                    children={
                        <>
                            <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                            <Button type="primary" className="ml-3" onClick={() => fetchLoanStatusById(appId ?? '')}>Refresh</Button>
                        </>
                    }
                />
            </Card>
        )
    }

    return (
        <>
            <Card title={
                <div className='flex justify-between'>
                    <div>Loan Application: {appId}</div>
                    <div>Customer Name: {customers[0]?.fullName}</div>
                </div>
            }>
                <Collapse
                    accordion
                    size="large"
                    defaultActiveKey={['customer']}
                    expandIconPosition={'start'}
                    onChange={onChange}
                    items={items}
                />

                <div className="mt-5">
                    <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                    <Button type="primary" className="ml-3" icon={<SendOutlined />}>Submit to Approval</Button>
                </div>
            </Card>
        </>
    );
}

export default LoanDaashboard