import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Typography, Table, Collapse, Spin, message } from "antd";
import { APIAuth } from "../../../../services/api";
import { intoCurrency } from "../../../../utils/Common";

const { Panel } = Collapse;
const { Title } = Typography;

const GoldLoanDetails: React.FC = () => {
  const { appraisalId } = useParams<{ appraisalId: string }>();
  const [loading, setLoading] = useState(true);
  const [goldLoanDetails, setGoldLoanDetails] = useState<any>({});
  const [articleDetails, setArticleDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await APIAuth.get(`/mobixCamsCredit/v1/gold-loan/${appraisalId}/appraisalId`);
        setGoldLoanDetails(response?.data || {});
        setArticleDetails(response?.data?.goldLoanAppArticleDtlsDtoList || []);
      } catch (err) {
        message.error("Failed to load Gold Loan details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appraisalId]);

  const renderDescriptions = (title: string, data: { label: string; value: any }[]) => (
    <Card title={title} className="mb-4">
      <Descriptions column={2} bordered>
        {data.map((item, index) => (
          <Descriptions.Item key={index} label={item.label}>
            {item.value || "-"}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );

  return (
    <Spin spinning={loading} tip="Loading Gold Loan Details...">
      <Card>
        <Title level={5}>Gold Loan Details</Title>

        {renderDescriptions("Basic Info", [
          { label: "TPP Number", value: goldLoanDetails?.tppNumber },
        ])}

        {renderDescriptions("Goldsmith Details", [
          { label: "Goldsmith Name", value: goldLoanDetails?.goldsmithName },
          { label: "Gross Weight", value: goldLoanDetails?.goldGrossWeight },
          { label: "Net Weight", value: goldLoanDetails?.goldNetWeight },
          { label: "Gold Rate per Gram", value: intoCurrency(goldLoanDetails?.goldMarketValue) },
          { label: "Goldsmith Collateral Value", value: intoCurrency(goldLoanDetails?.goldCollateralValue) },
        ])}

        {renderDescriptions("Dencimeter Details", [
          { label: "Gross Weight", value: goldLoanDetails?.denGrossWeight },
          { label: "Net Weight", value: goldLoanDetails?.denNetWeight },
          { label: "Gold Rate per Gram", value: intoCurrency(goldLoanDetails?.denMarketValue) },
          { label: "Dencimeter Collateral Value", value: intoCurrency(goldLoanDetails?.denCollateralValue) },
        ])}

        <Card title="Article Details">
          <Table
            dataSource={articleDetails?.map((item: any, index: number) => ({
              key: index,
              articleDtls: item.articleDtls,
              articleQuantity: item.articleQuantity,
            }))}
            columns={[
              {
                title: "Article Name",
                dataIndex: "articleDtls",
                key: "articleDtls",
              },
              {
                title: "Quantity",
                dataIndex: "articleQuantity",
                key: "articleQuantity",
              },
            ]}
            pagination={false}
          />
        </Card>
      </Card>
    </Spin>
  );
};

export default GoldLoanDetails;
