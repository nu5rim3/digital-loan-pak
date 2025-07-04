import React, { useEffect, useState } from "react";
import { Descriptions, Spin, message, Card } from "antd";
import API from "../../../../services/APIServices";

interface Props {
  product: string;
  appraisalId: string;
}

const CustomerDetails: React.FC<Props> = ({ product, appraisalId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  // const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!product || !appraisalId) return;

      setLoading(true);
      try {
        const [
          customer, 
          // summary
        ] = await Promise.all([
          API.mobixCamsCredit.getCustomerCreditScoreDetails(product, appraisalId),
          // API.mobixCamsCredit.getSummaryDetails(appraisalId),
        ]);
        setCustomerDetails(customer);
        // setSummary(summary);
      } catch (e) {
        message.error("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [product, appraisalId]);

  return (
    <Spin spinning={loading} tip="Loading...">
      <Card>
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="Customer Name">{customerDetails?.stkCusName || "-"}</Descriptions.Item>
          <Descriptions.Item label="Applied Loan Amount">{customerDetails?.loanAmount || "-"}</Descriptions.Item>
          <Descriptions.Item label="Customer CNIC">{customerDetails?.stkCNic || "-"}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">{customerDetails?.stkDob || "-"}</Descriptions.Item>
          <Descriptions.Item label="Loan Tenure">{customerDetails?.loanTenure || "-"}</Descriptions.Item>
          <Descriptions.Item label="Product">{customerDetails?.prodName || "-"}</Descriptions.Item>
          <Descriptions.Item label="Business Sector">{customerDetails?.businessSector || "-"}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Spin>
  );
};

export default CustomerDetails;
