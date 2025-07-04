import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Collapse, Table, Typography, Spin, message } from "antd";
import API from "../../../../services/APIServices";
import { intoCurrency } from "../../../../utils/Common";

const { Panel } = Collapse;

interface LiabilityData {
  liabilities: any[];
  totalAmount: number | null;
}

const LiabilityDetails: React.FC = () => {
  const { appraisalId } = useParams<{ appraisalId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<LiabilityData>({
    liabilities: [],
    totalAmount: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if ( appraisalId) {
        setLoading(true);
        try {
          const response:any = await API.mobixCamsLoan.getLiabilityDetails(appraisalId);
          setData({
            liabilities: response?.data?.liabilities || [],
            totalAmount: response?.data?.totalAmount || null,
          });
        } catch (e) {
          message.error("Failed to fetch liability details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [appraisalId]);

  const format = (value: any) => (
    intoCurrency(value)
  );

  const columns = [
    {
      title: "Institution",
      dataIndex: "institutionName",
      key: "institutionName",
    },
    {
      title: "Nature of Loan",
      dataIndex: "loanNature",
      key: "loanNature",
    },
    {
      title: "Outstanding Amount",
      dataIndex: "outstandingAmount",
      key: "outstandingAmount",
      render: format,
    },
  ];

  return (
    <Card>
      <Spin spinning={loading} tip="Loading...">
        <Collapse accordion>
          <Panel header="LIABILITY DETAILS" key="1">
            <Table
              dataSource={data.liabilities.map((item, index) => ({
                ...item,
                key: index,
              }))}
              columns={columns}
              pagination={false}
              bordered
              size="small"
            />
            {data.totalAmount !== null && (
              <Typography.Paragraph className="mt-3" strong>
                Total Outstanding Amount: {format(data.totalAmount)}
              </Typography.Paragraph>
            )}
          </Panel>
        </Collapse>
      </Spin>
    </Card>
  );
};

export default LiabilityDetails;
