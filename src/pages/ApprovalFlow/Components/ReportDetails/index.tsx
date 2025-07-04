import React from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Button, Space, Card } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";

const ReportDetails: React.FC = () => {
  const { appraisalId } = useParams();

  return (
    <Row justify="center">
      <Col span={24}>
        <Card title="Report Previews">
          <Space wrap size="middle">
            <Link
              target="_blank"
              to={`/pakoman-digital-loan/credit-appraisals/documents/pro-note/reports/${appraisalId}`}
            >
              <Button type="primary" icon={<FilePdfOutlined />}>
                Pro Note Report
              </Button>
            </Link>

            <Link
              target="_blank"
              to={`/pakoman-digital-loan/credit-appraisals/documents/iqar-name/reports/${appraisalId}`}
            >
              <Button type="primary" icon={<FilePdfOutlined />}>
                Iqar Nama Report
              </Button>
            </Link>

            <Link
              target="_blank"
              to={`/pakoman-digital-loan/credit-appraisals/documents/land-verification/reports/${appraisalId}`}
            >
              <Button type="primary" icon={<FilePdfOutlined />}>
                Land Verification Report
              </Button>
            </Link>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default ReportDetails;
