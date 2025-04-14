import { Collapse } from 'antd'
import React from 'react'
import LiabilityAffidavitForm from './LiabilityAffidavitForm'
import GoldLoanFacilitiesObtained from './GoldLoanFacilitiesObtained'
import TermDepositPlaced from './TermDepositPlaced'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ILiabilityAffidavit {

}

const LiabilityAffidavit: React.FC<ILiabilityAffidavit> = () => {
    return (
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
                defaultActiveKey={['1']}
                items={[
                    {
                        key: '1',
                        label: `Gold Loan Facilities Obtained`,
                        children: <div className='w-full h-full'>
                            <GoldLoanFacilitiesObtained />
                        </div>
                    }
                ]}
            />


            <Collapse
                defaultActiveKey={['1']}
                items={[
                    {
                        key: '1',
                        label: `Term Deposit Placed`,
                        children: <div className='w-full h-full'>
                            <TermDepositPlaced />
                        </div>
                    }
                ]}
            />

        </div>
    )
}

export default LiabilityAffidavit