import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Card, Table, Button, Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { APIAuth } from "../../../../services/api";

const { Title } = Typography;

const InitialDetails: React.FC<{ clientele: any; appraisalId: string }> = ({ clientele, appraisalId }) => {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<any[]>([]);
  const [internalCrib, setInternalCrib] = useState<any>(null);
  const [approval, setApproval] = useState<any>(null);
  const [msas, setMsas] = useState<any>({});

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    console.log('clientele', clientele);

    try {
      const [rulesRes, cribRes, approvalRes] = await Promise.allSettled([
        APIAuth.get(`/mobixCamsClientele/v1/clienteles/verifications/get-by-clientele/${clientele.idx}`),
        APIAuth.get(`/mobixCamsCredit/v1/credits/crib/internal/clientele/${clientele.idx}`),
        APIAuth.get(`/mobixCamsApproval/v1/approvals/on-boarding/appraisals/${appraisalId}/clienteles/${clientele.idx}/type/BLACKLIST`)
      ]);

      if (rulesRes.status === "fulfilled") {
        setRules(rulesRes.value?.data?.rules || []);
        setMsas(rulesRes.value?.data?.msasDetailsDto || {});
      }

      if (cribRes.status === "fulfilled") {
        setInternalCrib(cribRes.value?.data || {});
      } else {
        console.warn("Crib API failed:", cribRes.reason);
      }

      if (approvalRes.status === "fulfilled") {
        setApproval(approvalRes.value?.data || {});
      } else {
        console.warn("Approval API failed:", approvalRes.reason);
      }

    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [clientele, appraisalId]);


  const getRuleStatus = (ruleName: string) => rules.find(r => r.name === ruleName);

  const renderStatus = (status?: string) => {
    if (status === "Y") return <Tag color="red">Not Verified</Tag>;
    if (status === "N") return <Tag color="green">Verified</Tag>;
    return <Tag color="orange">Pending</Tag>;
  };

  const verificationRows = [
    {
      label: "MSAS CNIC ID VERIFICATION",
      rule: getRuleStatus("RUL_CNIC_ID_VERIFICATION"),
      extra: <>
        {msas?.pepNic && <Tag color="red">Politically Exposed</Tag>}
        {msas?.sanNic && <Tag color="red">Sanction Listed</Tag>}
      </>
    },
    {
      label: "MSAS CNIC NAME VERIFICATION",
      rule: getRuleStatus("RUL_CNIC_NAME_VERIFICATION"),
      extra: (
        <Space>
          {msas?.pepName && (
            <Link to={`/pakoman-digital-loan/credit-appraisals/documents/pep/${clientele.idx}`}>
              <Button size="small" danger>PEP Document</Button>
            </Link>
          )}
          {msas?.sanName && (
            <Link to={`/pakoman-digital-loan/credit-appraisals/documents/sanc/${clientele.idx}`}>
              <Button size="small" danger>Sanction Doc</Button>
            </Link>
          )}
        </Space>
      )
    },
    {
      label: "INTERNAL BLACKLIST STATUS",
      rule: approval ? { status: "Y" } : { status: "N" }
    },
    {
      label: "INTERNAL CREDIT HISTORY",
      rule: internalCrib ? { status: "Y" } : undefined,
      extra: internalCrib && (
        <Link to={`/pakoman-digital-loan/credit-appraisals/documents/credit-history/${clientele.idx}`}>
          <Button size="small" type="link">Preview</Button>
        </Link>
      )
    },
    {
      label: "NADRA BIOMETRIC VERIFICATION",
      rule: getRuleStatus("RUL_BIOMETRIC_VERIFICATION"),
      extra: getRuleStatus("RUL_BIOMETRIC_VERIFICATION")?.status === "Y" && (
        <Link to={`/pakoman-digital-loan/credit-appraisals/documents/biometric/${clientele.idx}`}>
          <Button size="small" type="link">Preview</Button>
        </Link>
      )
    },
    {
      label: "ECIB VERIFICATION",
      rule: getRuleStatus("RUL_ECIB_VERIFICATION"),
      extra: getRuleStatus("RUL_ECIB_VERIFICATION")?.status === "Y" && (
        <Link to={`/pakoman-digital-loan/credit-appraisals/documents/ecib/${clientele.identificationNumber}`}>
          <Button size="small" type="link">Preview</Button>
        </Link>
      )
    }
  ];

  return (
    <>
      <Card loading={loading}>
        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <Title level={5} className="m-0 text-primary">
              {clientele.fullName}
            </Title>
          </Col>
          <Col span={12}>
            <Title level={5} className="m-0 text-primary" style={{ textAlign: "right" }}>
              {clientele.identificationNumber}
            </Title>
          </Col>
        </Row>

        <Table
          dataSource={verificationRows}
          pagination={false}
          rowKey="label"
          columns={[
            {
              title: "Verification",
              dataIndex: "label",
              key: "label",
              render: text => <strong>{text}</strong>
            },
            {
              title: "Status",
              dataIndex: "rule",
              key: "status",
              render: rule => renderStatus(rule?.status)
            },
            {
              title: "Details",
              dataIndex: "extra",
              key: "extra"
            }
          ]}
        />
      </Card>
    </>
  );
};

export default InitialDetails;
