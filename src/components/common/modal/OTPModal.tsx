import React, { useEffect, useRef, useState } from 'react';
import { Modal, Input, Button, Form, Divider } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import useOTPStore from '../../../store/otpStore';
import OTPTimer from '../timer/OTPTimer';

interface OTPModalProps {
    idx: string;
    visible: boolean;
    onCancel: () => void;
    // onCompleted: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ idx, visible, onCancel }) => {

    const { control, handleSubmit, setValue, watch, reset } = useForm();
    const { sendOTP, verifyOTP, otpLoading, otpVerificationLoading, otpVerificationResponse } = useOTPStore()
    const otpRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [resetTrigger, setResetTrigger] = useState(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        const otpValue = Object.values(data).join("");
        verifyOTP(idx, otpValue);
    };

    useEffect(() => {
        if (otpVerificationResponse !== null) {
            onCancel();
            // onCompleted();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otpVerificationResponse]);

    // Move focus to next input
    const handleChange = (index: number, value: string) => {
        if (value.length === 1 && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !watch(`otp${index}`) && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const callOtpHandler = () => {
        sendOTP(idx);
    }

    const resendOTP = () => {
        sendOTP(idx);
        setResetTrigger((prev) => prev + 1);
        setIsResendDisabled(true);
        reset();
    }

    useEffect(() => {
        if (idx && visible) {
            callOtpHandler();
        }
        setIsResendDisabled(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible])


    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            title="OTP"
        >
            <Divider>Enter the 6-digit OTP sent to your mobile number</Divider>
            <div className='text-center mb-2'>
                <OTPTimer duration={60} onTimerEnd={() => setIsResendDisabled(false)} resetTrigger={resetTrigger} />
            </div>

            <Form layout="inline" onFinish={handleSubmit(onSubmit)}>

                <div className='flex flex-col flex-1 gap-3'>
                    <div className='flex justify-center'>
                        {Array.from({ length: 6 }, (_, index) => (
                            <Controller
                                key={index}
                                name={`otp${index}`}
                                control={control}
                                rules={{ required: true, pattern: /^[0-9]$/ }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        ref={(el) => {
                                            otpRefs.current[index] = el as unknown as HTMLInputElement;
                                        }}
                                        maxLength={1}
                                        style={{ width: 40, textAlign: "center", fontSize: "18px", marginRight: 5 }}
                                        onChange={(e) => {
                                            setValue(`otp${index}`, e.target.value.replace(/\D/g, ""));
                                            handleChange(index, e.target.value);
                                        }}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                    />
                                )}
                            />
                        ))}
                    </div>
                    <div className='mt-5 flex justify-end gap-2'>
                        <Button onClick={resendOTP} disabled={isResendDisabled} loading={otpLoading}>Resend OTP</Button>
                        <Button type="primary" htmlType="submit" disabled={!isResendDisabled} loading={otpVerificationLoading}>Submit</Button>
                    </div>
                </div>
            </Form>
        </Modal >
    );
};

export default OTPModal;