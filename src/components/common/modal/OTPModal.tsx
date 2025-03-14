import React, { useRef } from 'react';
import { Modal, Input, Button, Form, Divider } from 'antd';
import { useForm, Controller } from 'react-hook-form';

interface OTPModalProps {
    visible: boolean;
    onCancel: () => void;
    // onConfirm: (otp: string) => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ visible, onCancel }) => {

    const { control, handleSubmit, setValue, watch } = useForm();
    const otpRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        const otpValue = Object.values(data).join("");
        console.log("OTP Submitted:", otpValue);
        onCancel();
    };

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

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            title="OTP"
        >
            <Divider>Enter the 6-digit OTP sent to your mobile number</Divider>
            <div className='text-center mb-2'>
                <b>00:30s</b>
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
                        <Button>Resend OTP</Button>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </div>
                </div>
            </Form>
        </Modal >
    );
};

export default OTPModal;