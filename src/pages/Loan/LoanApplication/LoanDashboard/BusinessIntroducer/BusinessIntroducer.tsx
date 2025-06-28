import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Select, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { APIAuth } from "../../../../../services/api";
import { useParams } from "react-router-dom";

type Employee = {
  empNo: string;
  empCnic: string;
  empName: string;
};

const BusinessIntroducerForm: React.FC = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const { appId } = useParams();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await  APIAuth.get("/mobixCamsCommon/v1/employees");
        setEmployees(res.data || []);
      } catch (err) {
        message.error("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const onEmployeeChange = (empNo: string) => {
    const emp = employees.find((e) => e.empNo === empNo);
    if (emp) {
      form.setFieldsValue({
        employeeId: emp.empNo,
        employeeCnic: emp.empCnic,
      });
    } else {
      form.resetFields(["employeeId", "employeeCnic"]);
    }
  };

  const onAdd = async () => {
    const values = form.getFieldsValue();
    try {
      await APIAuth.post("mobixCamsClientele/v1/clienteles/stakeholder", {
        appraisalID: appId,
        idx: null,
        lastModifiedDate: null,
        modeOfSecurity: null,
        relationship: null,
        status: null,
        stkAge: "0",
        stkCNic: values?.employeeCnic,
        stkCNicExpDate: null,
        stkCNicIssuedDate: null,
        stkCNicStatus: null,
        stkCusCode: null,
        stkCusName: values.employeeName,
        stkDob: null,
        stkEduLevel: null,
        stkFatherOrHusName: "",
        stkGender: null,
        stkGrpRefNo: null,
        stkInitials: null,
        stkMaritialStatus: null,
        stkNumOfDependents: null,
        stkNumOfEarners: null,
        stkOrgType: null,
        stkOtherName: null,
        stkPhysDisability: null,
        stkPhysDisabilityDesce: null,
        stkSequence: null,
        stkSurName: null,
        stkTitle: null,
        stkType: "BI",
        currentResidences: null,
        maritalStatus: "",
        disabilityChecked: false,
        eduOther: false,
        new: true,
        update: false,
      });
      message.success("Business Introducer Saved");
    } catch (error: any) {
      message.error("Error while saving");
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Card title="Business Introducer" style={{ backgroundColor: "white" }}>
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-3 gap-3">
          <Form.Item
            label="Name of the Employee"
            name="employeeName"
            rules={[{ required: true, message: "Please select an employee" }]}
          >
            <Select
              placeholder="Select Employee"
              onChange={onEmployeeChange}
              options={employees.map((e) => ({
                label: e.empName,
                value: e.empNo,
              }))}
              loading={loading}
              allowClear
              style={{ width: 200 }}
            />
          </Form.Item>

          <Form.Item label="Employee ID" name="employeeId">
            <Input placeholder="Employee ID" disabled style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Employee CNIC" name="employeeCnic">
            <Input
              placeholder="Employee CNIC"
              disabled
              style={{ width: 200 }}
            />
          </Form.Item>
        </div>

        <div className="mt-5 flex justify-end">
          <Button type="default" onClick={onReset}>
            Reset
          </Button>
          <Button
            type="primary"
            className="ml-3"
            onClick={onAdd}
            icon={<SaveOutlined />}
          >
            Save
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default BusinessIntroducerForm;
