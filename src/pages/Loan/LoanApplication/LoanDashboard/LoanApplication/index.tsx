import { Button, Empty } from 'antd';
import React from 'react'
// import { useParams } from 'react-router-dom';
import {
    PlusOutlined,
    //  EditOutlined, SaveOutlined, DeleteOutlined, UndoOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const LoanApplication: React.FC = () => {
    // const { appId } = useParams()

    const navigate = useNavigate()

    const handleCreateLoanApplication = () => {
        navigate('loan-application')
    }

    return (
        <>
            <div className='flex justify-end'>
                <Button type='primary' icon={<PlusOutlined />} onClick={handleCreateLoanApplication}>
                    Create a Loan Application
                </Button>
            </div>
            {/* <div>LoanApplication {appId}</div>` */}
            <Empty description="No Loan Application Found" />
        </>

    )
}

export default LoanApplication