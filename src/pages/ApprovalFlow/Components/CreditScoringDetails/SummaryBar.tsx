import React from "react";
import { Card, Col, Row, Progress, Spin, Tag } from "antd";

interface SummaryBarProps {
  customerDetails: any;
}

const SummaryBar: React.FC<SummaryBarProps> = ({ customerDetails }) => {
  // const [loading, setLoading] = useState(true);
  // const [customerDetails, setCustomerDetails] = useState<any>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (product && appraisalId) {
  //       setLoading(true);
  //       try {
  //         const response = await API.mobixCamsCredit.getCustomerCreditScoreDetails(appraisalId, product);
  //         setCustomerDetails(response?.data);
  //       } catch (error) {
  //         console.error("Failed to load credit score details:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [product, appraisalId]);

  const score = customerDetails?.totalCreditScore ?? 0;
  const getColor = (score: number) => {
    if (score < 50) return "red";
    if (score < 60) return "orange";
    if (score < 70) return "blue";
    return "green";
  };

  return (
    <Spin spinning={!customerDetails} tip="Loading...">
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Progress
              percent={score}
              strokeColor={getColor(score)}
              showInfo
              format={percent => ` Credit Score - ${percent}`}
            //   size="large"
            />
          </Col>

          <Col span={12}>
            <Card bordered>
              <strong>Maximum Loan Amount:</strong>{" "}
              {customerDetails?.loanAmount ?? "-"}
            </Card>
          </Col>

          <Col span={12}>
            <Card bordered>
              <strong>Eligibility Status:</strong>{" "}
              {customerDetails?.decision === "Eligible" ? (
                <Tag color="green">Eligible</Tag>
              ) : customerDetails?.decision === "Not Eligible" ? (
                <Tag color="red">Not Eligible</Tag>
              ) : (
                <Tag>Unknown</Tag>
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};

export default SummaryBar;
