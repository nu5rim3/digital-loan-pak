import { Button, Card, Empty, Form, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import useVerificationStore from '../../../store/verificationStore';
import { formatCurrency, formatName } from '../../../utils/formatterFunctions';
import { calculateLoanStats } from '../../../utils/loanStats';
import CommonModal from '../modal/commonModal';

interface ICRIBDetails {
    idx: string;
    cnic: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LoanCards = (loanData: any) => {
    if (!Array.isArray(loanData)) {
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                <Typography.Text>
                    No loan data available.
                </Typography.Text>
            } />
        );
    }

    return (
        <div style={{ display: "flex", overflowX: "auto", gap: "10px", padding: "20px", whiteSpace: "nowrap" }}>

            {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                loanData.map((loan: any, index: number) => (
                    <Card key={index} title={loan.clientName} style={{ minWidth: "250px" }}>
                        <p>Contract No: <b>{loan.contractNo}</b></p>
                        <p>Status: <b>{loan.contractStatus}</b></p>
                        <p>Leased Value:<b>{formatCurrency(Number(loan.leasedValue))}</b></p>
                        <p>Current Rent:<b>{formatCurrency(Number(loan.currentRent))}</b></p>
                        <p>Total Dues:<b>{formatCurrency(Number(loan.totalDues))}</b></p>
                    </Card>
                ))}
        </div>
    );
};

const CRIBDetails: React.FC<ICRIBDetails> = ({ cnic }) => {

    const { cribDetails, cribLoading, fetchCRIBByCnic } = useVerificationStore()
    const [openModal, setOpenModal] = useState(false);

    const [cribLoan, setCribLoan] = useState({
        numberOfPreviousLoans: 0,
        numberOfActiveLoans: 0,
        activeLoansAmount: 0,
        activeOutstanding: 0,
        overdue: 0,
        activeInstallmentValue: 0,
        arrearsAmount: 0
    })


    useEffect(() => {
        fetchCRIBByCnic(cnic)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cnic])

    const onRefresh = () => {
        fetchCRIBByCnic(cnic)
    }

    useEffect(() => {

        // Ensure cribDetails is an array before passing to calculateLoanStats
        if (Array.isArray(cribDetails)) {
            setCribLoan(calculateLoanStats(cribDetails));
        } else {
            setCribLoan(calculateLoanStats([])); // Pass an empty array as fallback
        }
    }, [cribDetails]);

    return (
        <>
            <Card title={'Internal CRIB Details'} loading={cribLoading} extra={
                <>
                    <Button type="default" icon={<EyeOutlined />} onClick={() => setOpenModal(true)} disabled={cribDetails?.detail === null}>View More</Button>
                    <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
                </>
            }>
                <Form>
                    <div className="grid grid-cols-3 gap-3">
                        {cribDetails?.detail === null ? <Form.Item><b>{cribDetails.message}</b></Form.Item> :
                            <>
                                <Form.Item label="Name">
                                    <b>{formatName(cribDetails?.clientName ?? '-') ?? '-'}</b>
                                </Form.Item>
                                <Form.Item label="CNIC">
                                    <b>{cnic ?? '-'}</b>
                                </Form.Item>
                                <Form.Item label="Previous Loans">
                                    <b>{cribLoan.numberOfPreviousLoans}</b>
                                </Form.Item>
                                <Form.Item label="Active Loans">
                                    <b>{cribLoan.numberOfActiveLoans}</b>
                                </Form.Item>
                                <Form.Item label="Active Loans Amount">
                                    <b>{formatCurrency(cribLoan.activeLoansAmount ?? 0)}</b>
                                </Form.Item>
                                <Form.Item label="Active Outstanding">
                                    <b>{formatCurrency(cribLoan.activeOutstanding ?? 0)}</b>
                                </Form.Item>
                                <Form.Item label="Overdue">
                                    <b>{formatCurrency(cribLoan.overdue ?? 0)}</b>
                                </Form.Item>
                                <Form.Item label="Active Installment Value">
                                    <b>{formatCurrency(cribLoan.activeInstallmentValue ?? 0)}</b>
                                </Form.Item>
                                <Form.Item label="Active Arrers Amount">
                                    <b>{formatCurrency(cribLoan.arrearsAmount ?? 0)}</b>
                                </Form.Item>
                            </>
                        }
                    </div>
                </Form>
            </Card>
            <CommonModal open={openModal} onClose={() => setOpenModal(false)} title={'CRIB Details'} size='large' footer={true}>
                <>
                    {cribDetails !== null && LoanCards(cribDetails)}
                </>
            </CommonModal>
        </>
    )
}

export default CRIBDetails