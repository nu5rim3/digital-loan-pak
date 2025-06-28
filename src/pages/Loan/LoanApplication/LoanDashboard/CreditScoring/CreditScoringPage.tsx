// ✅ FILE: pages/CreditScoringPage.tsx (clean full version with completion)

import React, { useEffect, useState } from "react";
import {
  Card,
  Select,
  Form,
  Button,
  Collapse,
  message,
  Input,
  Tag,
  InputNumber,
} from "antd";
import { APIAuth } from "../../../../../services/api";

const { Panel } = Collapse;

const customerDetailsFields = [
  { key: "gender", label: "Gender" },
  { key: "age", label: "Age" },
  { key: "maritalStatus", label: "Marital Status" },
  { key: "familyMembers", label: "Family Members" },
  { key: "guardian", label: "Guardian of Family" },
  { key: "otherIncome", label: "Other Source of Income of Customer" },
  { key: "incomeSupport", label: "Household Income Support" },
  { key: "incomeContribution", label: "Household Income Contribution" },
  { key: "residenceStatus", label: "Current Residence Place Status" },
  { key: "billBehaviour", label: "Utility Bill Repayment Behaviour" },
  { key: "perception", label: "Subjective Perception (BGC)" },
];

const businessDetailsFields = [
  { key: "incomeSource", label: "Income Source of Customer" },
  { key: "salaryPerson", label: "If Salary Person Currently Working" },
  { key: "saving", label: "Monthly Net Saving/Salary" },
  { key: "loanTaken", label: "Outstanding Loan Taken" },
  { key: "experience", label: "Experience Business/Work" },
  { key: "maxArrears", label: "Maximum Days in Arrears of Taken" },
  { key: "assetValue", label: "Value of Business Asset" },
  { key: "prevLoanArrears", label: "Days in Arrears in Previous Loan" },
  { key: "ownership", label: "Business Ownership" },
  { key: "location", label: "Geographic Location" },
  { key: "placeStatus", label: "Business Place Status" },
];

const initialCustomerDetailsFields = [
  { key: "branchName", label: "Branch Name" },
  { key: "customerName", label: "Customer Name" },
  { key: "customerCnic", label: "Customer CNIC" },
  { key: "dob", label: "Date of Birth" },
  { key: "product", label: "Product" },
  { key: "appliedAmount", label: "Applied Loan Amount" },
  { key: "tenure", label: "Loan Tenure" },
  { key: "sector", label: "Business Sector" },
];

const CreditScoringPage: React.FC<{
  appraisalId: string;
}> = ({ appraisalId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dropdowns, setDropdowns] = useState<any>({});

  const fetchDropdowns = async () => {
    try {
      const [
        ownership,
        income,
        support,
        bills,
        perception,
        arrears,
        residence,
      ] = await Promise.all([
        APIAuth.get("/mobixCamsCommon/v1/business-owners"),
        APIAuth.get("/mobixCamsCommon/v1/new-other-source-incomes"),
        APIAuth.get("/mobixCamsCommon/v1/house-hold-supports"),
        APIAuth.get("/mobixCamsCommon/v1/utility-bills"),
        APIAuth.get("/mobixCamsCommon/v1/sub-perceptions"),
        APIAuth.get("/mobixCamsCommon/v1/loan-arrears"),
        APIAuth.get("/mobixCamsCommon/v1/current-residences"),
      ]);
      setDropdowns({
        ownership: ownership.data,
        income: income.data,
        support: support.data,
        bills: bills.data,
        perception: perception.data,
        arrears: arrears.data,
        residence: residence.data,
      });
    } catch {
      message.error("Failed to load dropdowns");
    }
  };

  // const mockResult = {
  //   totalScore: 82,
  //   risk: "Low Risk",
  //   eligibility: "Eligible",
  //   maxLoanAmount: 50000,
  //   customerDetails: {
  //     gender: "Female",
  //     age: "31-35 Years",
  //     maritalStatus: "Un-married",
  //     familyMembers: "01 to 02",
  //     guardian: "Own self",
  //     otherIncome: "Nil",
  //     incomeSupport: "Father or Brother Income",
  //     incomeContribution: "Not Applicable",
  //     residenceStatus: "Client ownself own ownership",
  //     billBehaviour: "No default in last three months",
  //     perception: "Positive",
  //   },
  //   businessDetails: {
  //     incomeSource: "Own Business/Work",
  //     salaryPerson: "Not Applicable",
  //     saving: "Not Applicable",
  //     loanTaken: "Not Applicable",
  //     experience: "More than 10 years",
  //     maxArrears: "90+ days or more",
  //     assetValue: "Less than 100,000",
  //     prevLoanArrears: "90+ days or more",
  //     ownership: "Partnership",
  //     location: "Peshawar",
  //     placeStatus: "Rent",
  //   },
  //   initialCustomerDetails: {
  //     branchName: "TAXILA",
  //     customerName: "shabira",
  //     customerCnic: "55888-6666666-6",
  //     dob: "1992-12-09",
  //     product: "PAK OMAN FORI QARZA",
  //     appliedAmount: 50000,
  //     tenure: 3,
  //     sector: "Retail",
  //   },
  // };

  const fetchScore = async (productCode: string) => {
    try {
     
      const res = await APIAuth.get(
        `/mobixCamsCredit/v1/credits-scores/products/${productCode}/appraisals/${appraisalId}`
      );
      setResult(res.data);
    } catch {
      message.error("Failed to fetch scoring result");
    }
  };

  useEffect(() => {
    fetchDropdowns();
    // fetchScore();
  }, [appraisalId]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const resProduct = await APIAuth.get(
        `/mobixCamsCredit/v1/credit/tc/${appraisalId}`
      );

      await APIAuth.post("/mobixCamsCredit/v1/credits-info/scores", {
        appraisalId,
        prodCode: resProduct.data?.pTrhdLType,
        ...values,
        status: "A",
      });
      message.success("Scoring submitted");
        fetchScore(resProduct.data?.pTrhdLType);
      // setResult(mockResult);
    } catch {
      message.error("Submit failed");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) =>
    risk.includes("High") ? "red" : risk.includes("Low") ? "yellow" : "orange";

  return (
    <Card title="Credit Scoring">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div className="grid grid-cols-3 gap-x-5 gap-y-2">
          {[
            {
              label: "Business Ownership",
              name: "bnsOwnership",
              data: dropdowns.ownership,
              field: "description",
            },
            {
              label: "Other Source of Income of Customer",
              name: "otherSourceOfIncome",
              data: dropdowns.income,
              field: "description",
            },
            {
              label: "Household Income Support",
              name: "houseHoldIncomeSup",
              data: dropdowns.support,
              field: "description",
            },
            {
              label: "Utility Bill Repayment Behaviour",
              name: "utilityBillRepayment",
              data: dropdowns.bills,
              field: "billName",
            },
            {
              label: "Subjective Perception (BGC)",
              name: "subjectivePerception",
              data: dropdowns.perception,
              field: "subPerName",
            },
            {
              label: "Maximum Days in arrears of Taken",
              name: "maxLoanArrears",
              data: dropdowns.arrears,
              field: "loanArrearsName",
            },
            {
              label: "Current Residence Place Status",
              name: "curResStatus",
              data: dropdowns.residence,
              field: "description",
            },
          ].map((item) => (
            <Form.Item
              label={item.label}
              name={item.name}
              rules={[{ required: true }]}
            >
              <Select
                options={item.data?.map((x: any) => ({
                  label: x[item.field],
                  value: x.code,
                }))}
              />
            </Form.Item>
          ))}
        </div>
        {/* <Row gutter={16}> */}
        {/* </Row> */}
        <Button type="primary" htmlType="submit" loading={loading} block>
          Get Credit Score
        </Button>
      </Form>
      {result && (
        <Card className="mt-6" title="Scoring Result">
          <Form layout="vertical">
            <div className="grid grid-cols-2  gap-x-5 gap-y-0">

              <Form.Item label="Total Score">
                <Input value={result.totalScore} disabled />
              </Form.Item>
              <Form.Item label="Max Loan Amount">
                <InputNumber
                  value={result.maxLoanAmount}
                  disabled
                  style={{ width: "100%" }}
                  formatter={(val) =>
                    `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item label="Risk">
                <Tag
                  color={getRiskColor(result.risk)}
                  className={`font-bold py-1 px-4`}
                //   style={{ fontSize: "16px", padding: "5px 10px" }}
                >
                  {result.risk}
                </Tag>
              </Form.Item>
              <Form.Item label="Eligibility">
                <Tag
                  color={result.eligibility === "Eligible" ? "green" : "red"}
                  className={`font-bold py-1 px-4`}
                //   style={{ fontSize: "16px", padding: "5px 10px" }}
                >
                  {result.eligibility}
                </Tag>
              </Form.Item>
            </div>
          </Form>

          <Collapse className="mt-4">
            <Panel header="Details of Customer" key="1">
              <Form layout="vertical">
                <div className="grid grid-cols-2 gap-x-5 gap-y-1">

                  {customerDetailsFields.map((field) => (
                    <Form.Item label={field.label}>
                      <Input
                        value={result.customerDetails[field.key]}
                        disabled
                      />
                    </Form.Item>
                  ))}
                </div>
              </Form>
            </Panel>
            <Panel header="Details of Customer's Business" key="2">
              <Form layout="vertical">
                <div className="grid grid-cols-2 gap-x-5 gap-y-1">
                  {businessDetailsFields.map((field) => (
                    <Form.Item label={field.label}>
                      <Input
                        value={result.businessDetails[field.key]}
                        disabled
                      />
                    </Form.Item>
                  ))}
                </div></Form>
            </Panel>
            <Panel header="Initial Details of Customer" key="3">
              <Form layout="vertical">
                <div className="grid grid-cols-2 gap-x-5 gap-y-1">
                  {initialCustomerDetailsFields.map((field) => (
                    <Form.Item label={field.label}>
                      <Input
                        value={result.initialCustomerDetails[field.key]}
                        disabled
                      />
                    </Form.Item>
                  ))}
                </div></Form>
            </Panel>
          </Collapse>
        </Card>
      )}
    </Card>
  );
};

export default CreditScoringPage;
