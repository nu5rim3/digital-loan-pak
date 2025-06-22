import React, { useEffect } from "react";
import { Button, Col, Form, Input, Modal, Row, message } from "antd";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (values: any) => void;
  editRecord?: any;
};

const CreateModal: React.FC<Props> = ({
  visible,
  onClose,
  onCreate,
  editRecord,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editRecord) {
      form.setFieldsValue(editRecord);
    } else {
      form.resetFields();
    }
  }, [editRecord, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
      })
      .catch(() => message.error("Please fix the errors above."));
  };

  return (
    <Modal
      open={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      footer={null}
      title={
        editRecord ? "Update Business Introducer" : "Create Business Introducer"
      }
      width={800}
    >
      <Form form={form} layout="vertical" className="pt-4">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Employee No"
              name="empNo"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Enter Employee No" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Employee CNIC (12345-1234567-8)"
              name="empCnic"
              // rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Enter Employee CNIC" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Employee Name"
              name="empName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Enter Employee Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Display Name"
              name="empDisplayName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Enter Display Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="empEmail">
              <Input placeholder="Enter Email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Contact No (03075105336)"
              name="empContactNo"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const pattern =
                      /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
                    return pattern.test(value)
                      ? Promise.resolve()
                      : Promise.reject("Invalid contact number format");
                  },
                },
              ]}
            >
              <Input placeholder="Enter Contact No" />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end">
          <Button type="primary" onClick={handleSubmit}>
            {editRecord ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateModal;
