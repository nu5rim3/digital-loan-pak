// ✅ FILE: pages/GeneralAppraisalList.tsx

import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, DatePicker, Row, Col, Card, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { mainURL } from "../../../../App";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../../../store/userStore";
import API from "../../../../services/APIServices";
import { EyeOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const statusOptions = [
  { label: "Approval Pending", value: "APPROVAL_PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const filterOptions = [
  { label: "Appraisal ID", value: "appraisalId" },
  { label: "Customer CNIC", value: "customerCnic" },
  { label: "Customer Name", value: "customerName" },
  { label: "Contract ID", value: "contractId" },
];

const GeneralAppraisalList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [status, setStatus] = useState("APPROVAL_PENDING");
  const [searchField, setSearchField] = useState("appraisalId");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  const { currentRole, user } = useUserStore()
  const {flow} = useParams<{ flow: string }>();

  const navigate = useNavigate();
  const { Link } = Typography;

  const fetchData = async () => {
    console.log('branch', user);
    setLoading(true);
    try {
      const fromDate = dateRange?.[0]?.isValid() ? dateRange[0].format("YYYY-MM-DD") : "";
      const toDate = dateRange?.[1]?.isValid() ? dateRange[1].format("YYYY-MM-DD") : "";


        const params: any = {
        role: currentRole?.code,
        status,
        page: page - 1,
        size: 7,
        fromDate,
        toDate,
        branch: user?.branches[0].code
      };

      if (searchText && searchField) {
        params[searchField] = searchText;
      }

      // const res = await APIAuth.get(
      //   "mobixCamsLoan/v1/appraisals/filters",
      //   { params }
      // );

      let res

      if(flow === "firstFlow") {
 res = await API.mobixCamsLoan.getFirstFlowApprovals({
        ...params,
      });
      }else{
 res = await API.mobixCamsLoan.getSecondFlowApprovals({
        ...params,
      });
      }
      

      setData(res.data.content);
      setTotal(res.data.totalElements);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, status, flow]);

  const columns = [
    {
      title: "Appraisal ID",
      dataIndex: "idx",
      render: (text: string) => <Tag color="#faad14">{text}</Tag>,
    },
    {
      title: "Contract ID",
      dataIndex: "contractNo",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
    },
    {
      title: "Customer CNIC",
      dataIndex: "identificationNumber",
    },
    {
      title: "Customer Name",
      dataIndex: "fullName",
    },
    {
      title: "Created Date",
      dataIndex: "creationDate",
      render: (val: string) => dayjs(val).format("YYYY-MM-DD | HH:mm:ss"),
    },
    {
      title: "Branch Name",
      dataIndex: "branchDesc",
    },
    {
      title: "Last Modified Date",
      dataIndex: "lastModifiedDate",
      render: (val: string) => dayjs(val).format("YYYY-MM-DD | HH:mm:ss"),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: 'center' as const,
      render: (status: string) =>
        status === "C" ? (
          <Tag color="yellow">APPROVAL PENDING</Tag>
        ) : 
        status === "R" ? (
          <Tag color="yellow">RETURN</Tag>
        ) :
        status === "J" ? (
          <Tag color="yellow">REJECTED</Tag>
        ) :(
          <Tag color="red">{status}</Tag>
        ),
    },
    {
  title: "Action",
  render: (_: any, record: any) => (
    <Link
      onClick={() =>
        navigate(
          flow === "firstFlow"
            ? `${mainURL}/approval/preview/firstFlow/${record.idx}`
            : `${mainURL}/approval/preview/secondFlow/${record.idx}`
        )
      }
    >
      <EyeOutlined style={{ marginRight: 4 }} />
    </Link>
  ),
},
  ];

  return (
    <Card title={flow == "firstFlow" ? "First Flow Appraisal Origination" : "Second Flow Appraisal Origination"} style={{ marginTop: 16 }}>
      <Row gutter={[16, 16]}>
        <Col><Select value={status} onChange={setStatus} style={{ width: 180 }} options={statusOptions} /></Col>
        <Col><Select value={searchField} onChange={setSearchField} style={{ width: 160 }} options={filterOptions} /></Col>
        <Col><Input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search..." /></Col>
        <Col><RangePicker value={dateRange} onChange={setDateRange} /></Col>
        <Col><Button onClick={() => { setPage(1); fetchData(); }} type="primary">Search</Button></Col>
        <Col><Button onClick={() => { setSearchText(""); setDateRange(null); fetchData(); }}>Reset</Button></Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="idx"
        pagination={{
          current: page,
          pageSize: 7,
          total,
          onChange: (p) => setPage(p),
        }}
        style={{ marginTop: 24 }}
      />
    </Card>
  );
};

export default GeneralAppraisalList;
