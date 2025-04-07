import { Card, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import useCustomerStore from '../../../store/customerStore';
// import useGuarantorStore from '../../../store/guarantorStore';

interface IViewDetails {
    type: string;
    setIdx: (idx: string) => void;
    setCnic: (cnic: string) => void;
}

const ViewDetails: React.FC<IViewDetails> = ({ type, setCnic, setIdx }) => {
    const { customer } = useCustomerStore();
    // const { guarantor } = useGuarantorStore();
    const [form] = useForm();

    const loadData = () => {
        if (type === 'C') {
            form.setFieldsValue(customer);
            setCnic(customer?.identificationNumber ?? '');
            setIdx(customer?.idx ?? '');
        } else if (type === 'G') {
            // form.setFieldsValue(guarantor);
        }
    };

    loadData();


    return (
        <Card title={type === 'C' ? 'Customer' : 'Guarantor' + ` Details`}>
            <Form form={form} layout="vertical">
                <div className="grid grid-cols-3 gap-3">
                    <Form.Item label="Appraisal ID" name="appraisalId">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Full Name" name="fullName">
                        <Input value="saaman m" disabled />
                    </Form.Item>
                    <Form.Item label="Identification Number" name="identificationNumber">
                        <Input value="12343-2344323-4" disabled />
                    </Form.Item>
                </div>
                {/* Add more Form.Item components for other user details */}
            </Form>
        </Card>
    );
};

export default ViewDetails;