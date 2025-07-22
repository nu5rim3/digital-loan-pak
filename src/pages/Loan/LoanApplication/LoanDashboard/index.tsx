import { Button, Card, Empty, Spin, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getOnlyStatusByName } from '../../../../utils/MSASActionFunctions';
import useLoanStore from '../../../../store/loanStore';
import { kebabToTitleCase } from '../../../../utils/formatterFunctions';
import LoanStatusTag from '../../../../components/common/tags/LoanStatusTag';
import useStakeholderStore from '../../../../store/stakeholderStore';
import { getStakeholderByType } from '../../../../utils/stakholderFunction';
import { CaretLeftOutlined, SendOutlined } from '@ant-design/icons';
import useCustomerStore from '../../../../store/customerStore';
import BusinessIntroducer from './BusinessIntroducer/BusinessIntroducer';
import CreditScoringPage from './CreditScoring/CreditScoringPage';
import CollateralDetails from './CollateralDetails';
import CustomerRiskProfiling from './CustomerRiskProfiling';
import CustomerDetailsView from './Customer/CustomerDetailsView';
import GuarantorDetailsView from './Guarantor/GuarantorDetailsView';
import WitnessDetails from './Witness/WitnessDetails';
import LiabilityAffidavit from './LiabilityAffidavit';
import GoldFacilityApplication from './GoldFacilityApplication/GoldFacilityApplication';
import CashFlow from './CashFlow';
import ExceptionalApproval from './ExceptionalApproval';
import LoanApplication from './LoanApplication';
import UnderConstruction from '../../../UnderConstroction';

// Add this function to check mandatory completion
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasAllMandatoryCompleted(validations: any[] = []) {
    if (!validations || validations.length === 0) {
        return false;
    }
    return !validations.some(
        v => v.isMandatory === "1" && v.completed === "0"
    );
}

const LoanDaashboard: React.FC = () => {

    const navigate = useNavigate();
    const { appId } = useParams();
    const { loading, applicationValidationLoading, applicationValidates, fetchApplicationValidationsByAppId, completeLoanApplication } = useLoanStore();
    const { stakeholders, fetchStackholderByAppId, fetchContactDetailsByStkId, fetchAddressDetailsByStkId, resetStakeholder } = useStakeholderStore();
    const { customers, fetchCustomerByAppId } = useCustomerStore();
    const [activeTab, setActiveTab] = useState('customer');

    const onCompleteApplication = () => {
        completeLoanApplication({
            appraisalIdx: appId ?? '',
            role: 'CRO',
            status: 'C'
        })
            .then(() => {
                navigate(-1)
            })
            .catch((error) => {
                console.error('Error completing application:', error);
            });
    }

    // For tab changed, fetch contact/address if needed
    const onTabChange = (activeKey: string) => {
        let type = '';
        switch (activeKey) {
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
        setActiveTab(activeKey);
    };

    // Get the right component for a section
    const getComponentByName = (name: string) => {
        switch (name) {
            case 'customer':
                return <CustomerDetailsView formDetails={getStakeholderByType('C', stakeholders ?? [])[0] ?? null} />;
            case 'guarantor':
                return <GuarantorDetailsView formDetails={getStakeholderByType('G', stakeholders ?? []) ?? []} />;
            case 'witness':
                return <WitnessDetails formDetails={getStakeholderByType('W', stakeholders ?? []) ?? []} />;
            case 'liability-affidavit':
                return <LiabilityAffidavit />;
            case 'gold-facility':
                return <GoldFacilityApplication />;
            case 'loan-application':
                return <LoanApplication />;
            case 'image-upload':
                return <UnderConstruction />;
            case 'cash-flow':
                return <CashFlow />;
            case 'credit-scoring':
                return <CreditScoringPage appraisalId={appId ?? ''} />;
            case 'customer-risk-profiling':
                return <CustomerRiskProfiling />;
            case 'exceptional-approval':
                return <ExceptionalApproval />;
            case 'collateral-detail':
                return <CollateralDetails />;
            case 'business-introducer':
                return <BusinessIntroducer />;
            default:
                return <UnderConstruction />;
        }
    };

    const onlyCustomer = [{
        "createdBy": "SYSTEM",
        "creationDate": "2022-08-09T09:24:51.357+00:00",
        "lastModifiedBy": null,
        "lastModifiedDate": null,
        "id": 1,
        "section": "customer",
        "isMandatory": "1",
        "completed": "0",
        "enabled": null,
        "status": "A"
    },]

    // For when there are no applicationValidates
    const _tabItems = onlyCustomer.map((rule) => ({
        key: `${rule.section}`,
        label: (
            <div className="flex flex-col items-start gap-1">
                <span className='text-base font-semibold'>{kebabToTitleCase(rule.section)}</span>
                <div className="flex gap-1">
                    <LoanStatusTag type={'M'} status={rule.isMandatory} />
                    <LoanStatusTag type={'C'} status={rule.completed} />
                </div>
            </div>
        ),
        children: getComponentByName(rule.section),
        disabled: rule.status !== 'A',
    }));

    const tabItems = applicationValidates
        ?.filter(rule => rule.isVisible === "1")
        .map((rule) => ({
            key: `${rule.section}`,
            label: (
                <div className="flex flex-col items-start gap-1">
                    <span className='text-base font-semibold'>{kebabToTitleCase(rule.section)}</span>
                    <div className="flex gap-1">
                        <LoanStatusTag type={'M'} status={rule.isMandatory} />
                        <LoanStatusTag type={'C'} status={rule.completed} />
                    </div>
                </div>
            ),
            children: getComponentByName(rule.section),
            disabled: getOnlyStatusByName(rule.section, applicationValidates) !== 'A'
        }));

    useEffect(() => {
        if (stakeholders.length === 0) {
            fetchStackholderByAppId(appId ?? '')
        } else {
            fetchCustomerByAppId(appId ?? '')
        }
        return () => {
            resetStakeholder()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])

    useEffect(() => {
        fetchStackholderByAppId(appId ?? '')
        fetchApplicationValidationsByAppId(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])

    const isAllMandatoryCompleted = hasAllMandatoryCompleted(applicationValidates);

    if (applicationValidationLoading) {
        return (
            <Spin>
                <Card title={`Loan Application - ${appId}`}>
                    <Empty description={'Loading...'} />
                </Card>
            </Spin>
        )
    }

    if (applicationValidates.length === 0 && _tabItems.length === 0) {
        return (
            <Card title={`Loan Application - ${appId}`}>
                <Empty
                    description={'No Data Found'}
                    children={
                        <>
                            <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                            <Button type="primary" className="ml-3" onClick={() => fetchApplicationValidationsByAppId(appId ?? '')}>Refresh</Button>
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
            }
                className='loan-card'
            >
                <Tabs
                    tabPosition='left'
                    defaultActiveKey={activeTab}
                    onChange={onTabChange}
                    items={tabItems.length === 0 ? _tabItems : tabItems}
                />

                <div className="mt-5">
                    <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                    <Button type="primary" className="ml-3" icon={<SendOutlined />} disabled={!isAllMandatoryCompleted} onClick={onCompleteApplication} loading={loading}>Submit to Approval</Button>
                </div>
            </Card>
        </>
    );
}

export default LoanDaashboard