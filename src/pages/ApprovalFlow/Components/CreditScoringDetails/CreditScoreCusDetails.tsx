import React, { useEffect, useState } from "react";
import { Card, Spin, Table, Typography, message } from "antd";
import API from "../../../../services/APIServices";

const { Title } = Typography;

interface Props {
  product: string;
  appraisalId: string;
}

const CreditScoreCusDetails: React.FC<Props> = ({ product, appraisalId }) => {
  const [loading, setLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!product || !appraisalId) return;

      setLoading(true);
      try {
        const customerResponse = await API.mobixCamsCredit.getCustomerCreditScoreDetails(product, appraisalId)
        setCustomerDetails(customerResponse);
      } catch (e) {
        message.error("Failed to load customer score details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [product, appraisalId]);

  const data: { key: string; particular1: string; score1: string; particular2?: string; score2?: string }[] = [
    {
      key: "1",
      particular1: "Gender",
      score1: customerDetails?.gender?.description || "-",
      particular2: "Other Source of Income",
      score2: customerDetails?.newOtherSourceOfIncome?.description || "-",
    },
    {
      key: "2",
      particular1: "Age",
      score1: customerDetails?.ageRange?.description || "-",
      particular2: "Household Income Support",
      score2: customerDetails?.houseHoldSupport?.description || "-",
    },
    {
      key: "3",
      particular1: "Marital Status",
      score1: customerDetails?.maritalStatus?.description || "-",
      particular2: "Household Income Contribution Amount",
      score2: customerDetails?.houseHoldDetails?.description || "-",
    },
    {
      key: "4",
      particular1: "Family Members",
      score1: customerDetails?.dependents?.description || "-",
      particular2: "Current Residential Place Status",
      score2: customerDetails?.currentResidence?.description || "-",
    },
    {
      key: "5",
      particular1: "Guardian of Family",
      score1: customerDetails?.headOfFamily?.description || "-",
      particular2: "Utility Bill Repayment Behaviour",
      score2: customerDetails?.utilityBill?.billName || "-",
    },
    {
      key: "6",
      particular1: "Subjective Perception",
      score1: customerDetails?.subjectivePerception?.subPerName || "-",
    },
  ];

  const columns = [
    {
      title: "Particulars",
      dataIndex: "particular1",
      key: "particular1",
    },
    {
      title: "Score",
      dataIndex: "score1",
      key: "score1",
      align: "center" as const,
    },
    {
      title: "Particulars",
      dataIndex: "particular2",
      key: "particular2",
    },
    {
      title: "Score",
      dataIndex: "score2",
      key: "score2",
      align: "center" as const,
    },
  ];

  return (
    <Spin spinning={loading} tip="Loading...">
      <Card>
        <Title level={5}>Customer Credit Scoring Details</Title>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          size="small"
        />
      </Card>
    </Spin>
  );
};

export default CreditScoreCusDetails;
