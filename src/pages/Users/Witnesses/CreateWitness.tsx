import React, { useEffect } from 'react'
import { Form, Input, Select, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { formatCNIC, splitInitialAndSurname } from '../../../utils/formatterFunctions';
import useStakeholderStore, { IStakeholder } from '../../../store/stakeholderStore';
import { SaveOutlined, UndoOutlined } from "@ant-design/icons";

interface ICreateWitness {
    appId: string;
    mode: string | 'create' | 'update';
    onClose: () => void;
    witnessDetails?: IStakeholder | null;
}

const schema = yup.object().shape({
    stkTitle: yup.string().required("Title is required").matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    stkCusName: yup.string().required("Full Name is required").matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    stkInitials: yup.string().required("Initial is required").matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    stkSurName: yup.string().matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    stkCNic: yup.string().required("CNIC Number is required").matches(/^\d{5}-\d{7}-\d$/, 'CNIC must be in format xxxxx-xxxxxxx-x'),
});

const CreateWitness: React.FC<ICreateWitness> = ({ appId, mode, witnessDetails, onClose }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm({
        resolver: yupResolver(schema),
    });

    // const { witness, witnessLoading, addWitness } = useWitnessStore();
    const { stakeholderLoading, addStakeholder, updateStakeholder } = useStakeholderStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        if (mode === 'create') {
            addStakeholder({ ...data, appraisalID: appId, stkType: 'W', new: true, }).then(() => {
                reset();
                onClose()
            })
        } else if (mode === 'update') {
            updateStakeholder(witnessDetails?.idx ?? '', { ...data, appraisalID: appId, stkType: 'W', update: true, }).then(() => {
                reset();
                onClose()
            })
        }

    }

    useEffect(() => {
        if (witnessDetails !== null) {
            setValue("stkTitle", witnessDetails?.stkTitle ?? '');
            setValue("stkCusName", witnessDetails?.stkCusName ?? '');
            setValue("stkInitials", witnessDetails?.stkInitials ?? '');
            setValue("stkSurName", witnessDetails?.stkSurName ?? '');
            setValue("stkCNic", witnessDetails?.stkCNic ?? '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [witnessDetails])

    const fullName = watch('stkCusName')


    useEffect(() => {
        if (fullName !== undefined && fullName !== '') {
            const { initial, surname } = splitInitialAndSurname(fullName?.toString());
            setValue("stkInitials", initial);
            setValue("stkSurName", surname);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullName])


    return (
        <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
        >
            <div className="grid grid-cols-2 gap-3">
                <Form.Item label="Title" validateStatus={errors.stkTitle ? "error" : ""} help={errors.stkTitle?.message} required>
                    <Controller
                        name="stkTitle"
                        control={control}
                        render={({ field }) =>
                            <Select
                                {...field}
                                allowClear
                                options={[
                                    { value: 'MR', label: 'Mr.' },
                                    { value: 'MRS', label: 'Mrs.' },
                                    { value: 'MS', label: 'Ms.' },
                                    { value: 'DR', label: 'Dr.' },
                                    { value: 'PROF', label: 'Prof.' },
                                    { value: 'ENG', label: 'Eng.' },
                                    { value: 'REV', label: 'Rev.' },
                                    { value: 'M/S', label: 'M/S' },
                                    { value: 'MST', label: 'Mst.' },
                                ]}
                                placeholder="Select Title"
                            />}
                    />
                </Form.Item>
                <Form.Item label="Full Name" validateStatus={errors.stkCusName ? "error" : ""} help={errors.stkCusName?.message} required>
                    <Controller
                        name="stkCusName"
                        control={control}
                        render={({ field }) =>
                            <Input {...field} placeholder="Enter Full Name" value={field.value || ''} maxLength={50}
                                onChange={(e) => {
                                    const formatted = e.target.value.replace(/[^a-zA-Z\s.]/g, '');
                                    setValue("stkCusName", formatted, { shouldValidate: true });
                                }}
                            />}
                    />
                </Form.Item>

                <Form.Item label="Initial" validateStatus={errors.stkInitials ? "error" : ""} help={errors.stkInitials?.message} required>
                    <Controller
                        name="stkInitials"
                        control={control}
                        render={({ field }) =>
                            <Input
                                {...field}
                                placeholder="Enter Initial"
                                onChange={(value) => {
                                    field.onChange(value);
                                }}
                                disabled
                            />
                        }
                    />
                </Form.Item>

                <Form.Item label="Surname" validateStatus={errors.stkSurName ? "error" : ""} help={errors.stkSurName?.message}>
                    <Controller
                        name="stkSurName"
                        control={control}
                        render={({ field }) =>
                            <Input
                                {...field}
                                placeholder="Enter Surname"
                                onChange={(value) => {
                                    field.onChange(value);
                                }}
                                disabled
                            />
                        }
                    />
                </Form.Item>

                <Form.Item label="CNIC" validateStatus={errors.stkCNic ? "error" : ""} help={errors.stkCNic?.message} required>
                    <Controller
                        name="stkCNic"
                        control={control}
                        render={({ field }) => <Input {...field}
                            maxLength={15} // Max length considering dashes
                            placeholder="xxxxx-xxxxxxx-x"
                            onChange={(e) => {
                                const formatted = formatCNIC(e.target.value);
                                setValue("stkCNic", formatted, { shouldValidate: true });
                            }}
                        />}
                    />
                </Form.Item>
            </div>

            <div className="flex gap-2 justify-end">
                <Button type="primary" htmlType="submit" loading={stakeholderLoading} icon={<SaveOutlined />}>{mode === 'create' ? 'Save' : 'Update'}</Button>
                <Button type="default" htmlType="reset" onClick={() => reset()} danger icon={<UndoOutlined />}>Reset</Button>
            </div>
        </Form>
    )
}

export default CreateWitness