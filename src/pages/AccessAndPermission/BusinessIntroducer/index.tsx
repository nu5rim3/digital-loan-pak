/* eslint-disable @typescript-eslint/no-explicit-any */
// ✅ FILE 1: BusinessIntroducerPage.tsx

import React, { useEffect, useState } from "react";
import { Table, Input, Button, Select, Tag, Card, message, Modal } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import CreateModal from "./CreateModal";
import { APIAuth } from "../../../services/api";
import { Typography } from "antd";
const { Link } = Typography;

const { Option } = Select;
const { confirm } = Modal;

const PAGE_SIZE = 7;

const searchFields = [
  { label: "Employee No", value: "empNo" },
  { label: "Employee Name", value: "empName" },
  { label: "Display Name", value: "empDisplayName" },
  { label: "Last Modified Date", value: "lastModifiedDate" },
  { label: "Status", value: "status" },
];

const BusinessIntroducerPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchBy, setSearchBy] = useState("empNo");
  const [searchValue, setSearchValue] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  const fetchData = async (pageIndex = 0) => {
    setLoading(true);
    try {
      const res = await APIAuth.get("/mobixCamsCommon/v1/employees/filters", {
        params: {
          page: pageIndex,
          size: PAGE_SIZE,
          empNo: searchBy === "empNo" ? searchValue : "",
          empName: searchBy === "empName" ? searchValue : "",
          empDisplayName: searchBy === "empDisplayName" ? searchValue : "",
          status: searchBy === "status" ? searchValue : "",
          fromDate: "",
          toDate: "",
          cnic: "",
        },
      });

      setData(res.data.content || []);
      setTotal(res.data.totalElements || 0);
    } catch {
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchData(0);
  };

  const handleReset = () => {
    setSearchValue("");
    fetchData(0);
  };

  const confirmAction = (record: any, status: "A" | "I") => {
    confirm({
      title: `Are you sure you want to ${
        status === "A" ? "activate" : "deactivate"
      } this record?`,
      onOk: async () => {
        try {
          if (status === "I") {
            await APIAuth.put(
              `/mobixCamsCommon/v1/employees/${record.empNo}/inactive`,
              {
                // ...record,
                // status,
              }
            );
          } else {
            await APIAuth.put(`/mobixCamsCommon/v1/employees/${record.empNo}`, {
              ...record,
              status,
            });
          }
          message.success(
            `Record ${
              status === "A" ? "activated" : "deactivated"
            } successfully`
          );
          fetchData(page);
        } catch {
          message.error("Action failed");
        }
      },
    });
  };

  const handleCreate = async (newData: any) => {
    try {
      if (editRecord) {
        await APIAuth.put(`/mobixCamsCommon/v1/employees/${editRecord.empNo}`, {
          ...editRecord,
          ...newData,
        });
        message.success("Record updated successfully");
      } else {
        await APIAuth.post("/mobixCamsCommon/v1/employees", newData);
        message.success("Record created successfully");
      }
      setShowCreateModal(false);
      setEditRecord(null);
      fetchData(0);
    } catch {
      message.error("Operation failed");
    }
  };

  const columns = [
    {
      title: "Employee No",
      dataIndex: "empNo",
    },
    {
      title: "CNIC",
      dataIndex: "empCnic",
    },
    {
      title: "Employee Name",
      dataIndex: "empName",
    },
    {
      title: "Display Name",
      dataIndex: "empDisplayName",
    },
    {
      title: "Last Modified Date",
      dataIndex: "lastModifiedDate",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) =>
        status === "A" ? (
          <Tag color="green">ACTIVE</Tag>
        ) : (
          <Tag color="red">INACTIVE</Tag>
        ),
    },
    // {
    //   title: 'Action',
    //   render: (_: any, record: any) => (
    //     <>
    //       {record.status === 'I' ? (
    //         <Button type="primary" onClick={() => confirmAction(record, 'A')}>Activate</Button>
    //       ) : (
    //         <>
    //           <Button icon={<EditOutlined />} onClick={() => { setEditRecord(record); setShowCreateModal(true); }}>Update</Button>
    //           <Button icon={<StopOutlined />} danger style={{ marginLeft: 8 }} onClick={() => confirmAction(record, 'I')}>Deactivate</Button>
    //         </>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <>
          {record.status === "I" ? (
            <Link onClick={() => confirmAction(record, "A")}>Activate</Link>
          ) : (
            <>
              <Link
                onClick={() => {
                  setEditRecord(record);
                  setShowCreateModal(true);
                }}
              >
                Update
              </Link>
              <span style={{ margin: "0 8px" }}>|</span>
              <Link onClick={() => confirmAction(record, "I")} type="danger">
                Deactivate
              </Link>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Business Introducers</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditRecord(null);
            setShowCreateModal(true);
          }}
        >
          Create Business Introducers
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Select
            value={searchBy}
            onChange={setSearchBy}
            style={{ width: 180 }}
          >
            {searchFields.map((f) => (
              <Option key={f.value} value={f.value}>
                {f.label}
              </Option>
            ))}
          </Select>
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            icon={<SearchOutlined />}
            onClick={handleSearch}
            type="primary"
          >
            Search
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </div>

        <Table
          rowKey="empNo"
          columns={columns}
          dataSource={data}
          pagination={{
            current: page + 1,
            total,
            pageSize: PAGE_SIZE,
            onChange: (p) => setPage(p - 1),
            showSizeChanger: false,
          }}
          loading={loading}
          locale={{
            emptyText: (
              <div style={{ padding: "55px 0", textAlign: "center" }}>
                No Matching Data Found
              </div>
            ),
          }}
        />
      </Card>

      <CreateModal
        visible={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditRecord(null);
        }}
        onCreate={handleCreate}
        editRecord={editRecord}
      />
    </div>
  );
};

export default BusinessIntroducerPage;
