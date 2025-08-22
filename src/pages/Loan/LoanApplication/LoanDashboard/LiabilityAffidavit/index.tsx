import { Card, Collapse, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import LiabilityAffidavitForm from './LiabilityAffidavitForm'
import GoldLoanFacilitiesObtained from './GoldLoanFacilitiesObtained'
import TermDepositPlaced from './TermDepositPlaced'
import useLoanStore from '../../../../../store/loanStore'
import { useParams } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ILiabilityAffidavit {

}

const LiabilityAffidavit: React.FC<ILiabilityAffidavit> = () => {

    const { appId } = useParams()

    const { liabilityValidation, liabilityLoading, fetchLiabilityValidation, addLiabilityValidation } = useLoanStore()
    const [glSwitch, setGlSwitch] = useState(false);

    const [activeGlKey, setActiveGlKey] = useState<string[]>(['0']);
    const [tdpSwitch, setTdpSwitch] = useState(false);
    const [activeTdpKey, setActiveTdpKey] = useState<string[]>(['0']);

    useEffect(() => {
        // Fetch liability validation on component mount
        fetchLiabilityValidation(appId ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId, glSwitch, tdpSwitch]);

    useEffect(() => {
        // Set the initial state of switches based on fetched liability validation
        if (liabilityValidation) {
            const glSection = Array.isArray(liabilityValidation) ? liabilityValidation.find(item => item.section === 'gold-facility') : undefined;
            const tdpSection = Array.isArray(liabilityValidation) ? liabilityValidation.find(item => item.section === 'term-deposit') : undefined;

            setGlSwitch(glSection?.isEnabled === 'Y' ? true : false);
            setTdpSwitch(tdpSection?.isEnabled === 'Y' ? true : false);

            setActiveGlKey(glSection?.isEnabled === 'Y' ? ['1'] : ['0']);
            setActiveTdpKey(tdpSection?.isEnabled === 'Y' ? ['1'] : ['0']);
        }
    }, [liabilityValidation]);

    const onLiabilityEnabledHandle = (isEnabled: 'Y' | 'N', section: string) => {
        if (section === 'gold-facility') {
            setGlSwitch(isEnabled === 'Y');
            setActiveGlKey(isEnabled === 'Y' ? ['1'] : ['0']);
            addLiabilityValidation({
                appraisalIdx: appId ?? '',
                isEnabled: isEnabled,
                section: section
            });
        }
        if (section === 'term-deposit') {
            setTdpSwitch(isEnabled === 'Y');
            setActiveTdpKey(isEnabled === 'Y' ? ['1'] : ['0']);
            addLiabilityValidation({
                appraisalIdx: appId ?? '',
                isEnabled: isEnabled,
                section: section
            });
        }
    }


    return (
        <Card>
            <div className='flex flex-col gap-3'>
                <Collapse
                    defaultActiveKey={['1']}
                    items={[
                        {
                            key: '1',
                            label: `Liability Affidavit`,
                            children: <div className='w-full h-full'>
                                <LiabilityAffidavitForm />
                            </div>
                        }
                    ]}
                />

                <Collapse
                    activeKey={activeGlKey}
                    items={[
                        {
                            key: '1',
                            label: `Gold Loan Facilities`,
                            children: <div className='w-full h-full'>
                                <GoldLoanFacilitiesObtained />
                            </div>,
                            extra:
                                <Switch
                                    checkedChildren="Available"
                                    unCheckedChildren="Not Available"
                                    defaultChecked
                                    checked={glSwitch}
                                    loading={liabilityLoading}
                                    onClick={(checked, event) => {
                                        // If you don't want click extra trigger collapse, you can prevent this:
                                        event.stopPropagation(); // Correctly access the event object
                                        onLiabilityEnabledHandle(checked ? 'Y' : 'N', 'gold-facility');
                                    }} />,

                        }
                    ]}
                />


                <Collapse
                    activeKey={activeTdpKey}
                    items={[
                        {
                            key: '1',
                            label: `Term Deposit Placed`,
                            children: <div className='w-full h-full'>
                                <TermDepositPlaced />
                            </div>,
                            extra:
                                <Switch
                                    checkedChildren="Available"
                                    unCheckedChildren="Not Available"
                                    defaultChecked
                                    checked={tdpSwitch}
                                    loading={liabilityLoading}
                                    onClick={(checked, event) => {
                                        // If you don't want click extra trigger collapse, you can prevent this:
                                        event.stopPropagation(); // Correctly access the event object
                                        onLiabilityEnabledHandle(checked ? 'Y' : 'N', 'term-deposit');
                                    }} />,
                        }
                    ]}
                />

            </div>
        </Card>
    )
}

export default LiabilityAffidavit