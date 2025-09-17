import { Button, Card, Empty, Spin, Tabs } from 'antd'
import React, { useEffect, useRef } from 'react'
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
import CheckMobile from '../../../CheckMobile';
import useCreditStore from '../../../../store/creditStore';

// Add this function to check mandatory completion
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasAllMandatoryCompleted(validations: any[] = []) {
    if (!validations || validations.length === 0) {
        return false;
    }
    return !validations.some(
        v => v.isMandatory === "1" && v.completed === "0" && v.isVisible ==="1"
    );
}

const LoanDaashboard: React.FC = () => {

    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollRef2 = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { appId } = useParams();
    const { loading, applicationValidationLoading, applicationValidates, fetchApplicationValidationsByAppId, completeLoanApplication } = useLoanStore();
    const { stakeholders, fetchStackholderByAppId, fetchContactDetailsByStkId, fetchAddressDetailsByStkId, resetStakeholder } = useStakeholderStore();
    const {activeStep , setActiveStep } = useCreditStore()
    const { customers,customerLoading, fetchCustomerByAppId } = useCustomerStore();
    // const [activeTab, setActiveTab] = useState('customer');

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
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            scrollRef2.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
      //   setActiveKey(activeKey);
         setActiveStep(activeKey)
    };

    // Get the right component for a section
    const getComponentByName = (name: string, ref: React.Ref<HTMLDivElement>) => {
        switch (name) {
            case 'customer':
                return (
                    <div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}>
                        <CustomerDetailsView formDetails={getStakeholderByType('C', stakeholders ?? [])[0] ?? null} />
                    </div>);
            case 'guarantor':
                return (
                    <div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}>
                        <GuarantorDetailsView formDetails={getStakeholderByType('G', stakeholders ?? []) ?? []} />
                    </div >);
            case 'witness':
                return (
                    <div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}>
                        <WitnessDetails formDetails={getStakeholderByType('W', stakeholders ?? []) ?? []} />
                    </div>);
            case 'liability-affidavit':
                return (
                    <div ref={ref} style={{ height: '150vh', overflowY: 'auto' }}>
                        <LiabilityAffidavit />
                    </div>);
            case 'gold-facility':
                return (
                    <div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}>
                        <GoldFacilityApplication />
                    </div>);
            case 'loan-application':
                return (
                    <div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}>
                        <LoanApplication />
                    </div>);
            case 'cash-flow':
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><CashFlow /></div>);
            case 'credit-scoring':
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><CreditScoringPage appraisalId={appId ?? ''} /></div>);
            case 'customer-risk-profiling':
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><CustomerRiskProfiling /></div>);
            case 'exceptional-approval':
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><ExceptionalApproval /></div>);
            case 'collateral-detail':
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><CollateralDetails /></div>);
            case 'business-introducer':
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><BusinessIntroducer /></div>);
            case 'customer-biometric':
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><CheckMobile /></div>);
            case 'guarantor-biometric':
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><CheckMobile /></div>);
            case 'image-upload':
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><CheckMobile /></div>);
            case 'customer-acknowledgement':
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><CheckMobile /></div>);
            default:
                return (<div ref={ref} style={{ height: '100vh', overflowY: 'auto' }}><UnderConstruction /></div>);
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
        children: getComponentByName(rule.section, scrollRef),
        disabled: rule.status !== 'A',
    }));

    const tabItems = applicationValidates
        ?.filter(rule => rule.isVisible === "1")
        .map((rule) => ({
            key: `${rule.section}`,
            label: (
                <div className="flex flex-col items-start gap-1">
                    <span className='text-base font-semibold'>{rule.section === "loan-application"? "Facility Application":kebabToTitleCase(rule.section)}</span>
                    <div className="flex gap-1">
                        <LoanStatusTag type={'M'} status={rule.isMandatory} />
                        <LoanStatusTag type={'C'} status={rule.completed} />
                    </div>
                </div>
            ),
            children: getComponentByName(rule.section, scrollRef),
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
console.log('applicationValidates',applicationValidates)
    const isAllMandatoryCompleted = hasAllMandatoryCompleted(applicationValidates);
    console.log('sssss',isAllMandatoryCompleted)

    if (applicationValidationLoading) {
        return (
            <Spin>
                <Card title={`Facility Application - ${appId}`}>
                    <Empty description={'Loading...'} />
                </Card>
            </Spin>
        )
    }

    if (applicationValidates.length === 0 && _tabItems.length === 0) {
        return (
            <Card title={`Facility Application - ${appId}`}>
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
        <Spin spinning={customerLoading}>
            <Card
                className='loan-card mb-3'
            >
                <div className='flex justify-between'>
                    <div className='text-lg'>Facility Application: {appId}</div>
                    <div className='text-lg'>Customer Name: {customers[0]?.fullName}</div>
                </div>
            </Card>
        </Spin>
            
            <div ref={scrollRef2} style={{ height: '70vh', overflowY: 'auto' }}>
                <Tabs
                    tabPosition='left'
                    activeKey={activeStep}
                    onChange={onTabChange}
                    items={tabItems.length === 0 ? _tabItems : tabItems}
                />
            </div>
            <Card className='mt-3'>


                <div className="flex justify-end">
                    <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                    <Button type="primary" className="ml-3" icon={<SendOutlined />} disabled={!isAllMandatoryCompleted} onClick={onCompleteApplication} loading={loading}>Submit to Approval</Button>
                </div>
            </Card>
        </>
    );
}

export default LoanDaashboard