import React from "react";
import { Card, Table, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Props {
  customerDetails: any;
}

const CreditScoreBusinessFacts: React.FC<Props> = ({ customerDetails }) => {
  // const [loading, setLoading] = useState(false);
  // const [customerDetails, setCustomerDetails] = useState<any>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (product && appraisalId) {
  //       setLoading(true);
  //       const [customerResponse] = await Promise.all([
  //        API.mobixCamsCredit.getCustomerCreditScoreDetails(product, appraisalId),
  //       //   API.mobixCamsCredit.getSummaryDetails(appraisalId),
  //       ]);
  //       setCustomerDetails(customerResponse);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [product, appraisalId]);

  const data = [
    [
      "Income Source of Customer",
      customerDetails?.sourceOfIncome?.description ?? "",
      "Business Place Status",
      customerDetails?.businessPlaceOwnership?.description ?? "",
    ],
    [
      "Monthly Net Saving/Salary",
      customerDetails?.monthlyNetSaving?.description ?? "",
      "If Salary Person, (Current Job Status)",
      customerDetails?.currentJobStatus?.description ?? "",
    ],
    [
      "Experience Business/Works (Years)",
      customerDetails?.businessExperience?.description ?? "",
      "Outstanding Loan Taken From Any MFIs",
      customerDetails?.outStandingLoan?.description ?? "",
    ],
    [
      "Value of Business Asset and Stock",
      customerDetails?.businessCost?.description ?? "",
      "Maximum days in arrears of taken loans",
      customerDetails?.loanArrears?.loanArrearsName ?? "",
    ],
    [
      "Business Ownership",
      customerDetails?.businessOwner?.description ?? "",
      "Days in arrears in previous LOLC loans",
      customerDetails?.repeatCustomer?.description ?? "",
    ],
    [
      "Geographic Location",
      customerDetails?.geoLocation?.locationName ?? "",
      "",
      "",
    ],
  ];

  const columns: ColumnsType<any> = [
    {
      title: "Particulars",
      dataIndex: "particular1",
      key: "particular1",
    },
    {
      title: "Score",
      dataIndex: "score1",
      key: "score1",
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
    },
  ];

  const tableData = data.map((row, index) => ({
    key: index,
    particular1: row[0],
    score1: row[1],
    particular2: row[2],
    score2: row[3],
  }));

  return (
    <Card>
      <Spin spinning={!customerDetails} tip="Loading...">
        <Table
          bordered
          columns={columns}
          dataSource={tableData}
          pagination={false}
        />
      </Spin>
    </Card>
  );
};

export default CreditScoreBusinessFacts;
