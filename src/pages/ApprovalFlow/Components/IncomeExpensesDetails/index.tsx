import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Collapse, Table, Spin, message } from "antd";
import API from "../../../../services/APIServices";
import { intoCurrency } from "../../../../utils/Common";

const { Panel } = Collapse;

const IncomeExpensesDetails: React.FC = () => {
  const { appraisalId } = useParams<{ appraisalId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({
    incomeExpenses: {},
    applicantRevenue: [],
    houseHoldContribution: [],
    houseHoldExpenses: [],
    bnsOrAgriExpenses: []
  });

  useEffect(() => {
    const fetchData = async () => {
      if (appraisalId) {
        setLoading(true);
        try {
          const [
            // tc,
            income
          ]: any = await Promise.all([
            // API.mobixCamsCredit.getTcDetails(appraisalId),
            API.mobixCamsCredit.getIncomeExpenses(appraisalId)
          ]);
          setData({
            incomeExpenses: income?.data,
            applicantRevenue: income?.data?.applicantRevenue || [],
            houseHoldContribution: income?.data?.houseHoldContribution || [],
            houseHoldExpenses: income?.data?.houseHoldExpenses || [],
            bnsOrAgriExpenses: income?.data?.bnsOrAgriExpenses || []
          });
        } catch (e) {
          message.error("Failed to fetch income and expenses data.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [ appraisalId]);

  const format = (value: any) => (
    // <NumberFormat value={value} displayType="text" thousandSeparator renderText={(val:any) => <span>{val}</span>} />
    intoCurrency(value)
  );

  const columnsWithPeriods = [
    {
      title: "",
      dataIndex: "key",
      key: "key",
      render: (text: string) => {
        return <strong>{text}</strong>;
      }
    },
    {
      title: "Monthly",
      dataIndex: "monthly",
      key: "monthly",
      render: format
    },
    {
      title: "Semi-Annually",
      dataIndex: "semiAnnual",
      key: "semiAnnual",
      render: format
    },
    {
      title: "Annually",
      dataIndex: "annually",
      key: "annually",
      render: format
    }
  ];

  const columnsRevenueSummary = [
    {
      title: "Revenue & Expenses Summary",
      dataIndex: "label",
      key: "label"
    },
    {
      title: "Monthly",
      dataIndex: "value",
      key: "value",
      render: (value:any,record:any) =>{
        return record.label !== "Tenure"? format(value) : value
      } 
    }
  ];

  const renderTableSection = (title: string, data: any[], columns: any) => (
    <Panel header={title} key={title}>
      <Table 
        dataSource={data} 
        columns={columns} 
        pagination={false} 
        bordered 
        size="small" 
      />
    </Panel>
  );

  const renderRevenueSummary = () => {
    const { incomeExpenses } = data;
    const summaryData = [
      { label: "Gross Salary/Pension Income", value: incomeExpenses?.grossSalaryIncome },
      { label: "Total Business/Agri Income", value: incomeExpenses?.totBusinessIncome },
      { label: "Total Household Contribution", value: incomeExpenses?.totHouseholdIncome },
      { label: "Total Revenue", value: incomeExpenses?.totRevenue }
    ];
    return renderTableSection("REVENUE SUMMARY", summaryData, columnsRevenueSummary);
  };

  const renderFinalSummary = () => {
    const { incomeExpenses } = data;
    const finalData = [
      { label: "Net Monthly Disposable Income", value: incomeExpenses?.netMonthlyDisposable },
      // { label: "Taxable Amount", value: incomeExpenses?.taxableAmount },
      // { label: "BE/BI", value: incomeExpenses?.beBiRate },
      { label: "Debt-Service Ratio", value: incomeExpenses?.dscr },
      { label: "Max Debt Burden", value: incomeExpenses?.maxDebtBurden },
      { label: "Tenure", value: incomeExpenses?.tenure },
      { label: "Max Loan Value", value: incomeExpenses?.maxLoanValue },
      { label: "Annual Household Income", value: incomeExpenses?.annualHouseIncome },
      { label: "Annual Disposable Income", value: incomeExpenses?.annualDisposableIncome },
      { label: "Status", value: "Successful" },
    ];
    return renderTableSection("FINAL SUMMARY", finalData, columnsRevenueSummary);
  };

  console.log('xxxx', data);

  const { applicantRevenue, houseHoldContribution, houseHoldExpenses, bnsOrAgriExpenses, incomeExpenses } = data;

  return (
    <Card>
      <Spin spinning={loading} tip="Loading...">
        <Collapse accordion>
          {applicantRevenue.length > 0 && renderTableSection("APPLICANT REVENUE", applicantRevenue, columnsWithPeriods)}
          {houseHoldContribution.length > 0 && renderTableSection("HOUSEHOLD CONTRIBUTION", houseHoldContribution, columnsWithPeriods)}
          {renderRevenueSummary()}
          {houseHoldExpenses.length > 0 && renderTableSection("HOUSEHOLD EXPENSES", houseHoldExpenses, columnsWithPeriods)}
          {bnsOrAgriExpenses.length > 0 && renderTableSection("BUSINESS/AGRI EXPENSES", bnsOrAgriExpenses, columnsWithPeriods)}
          {renderTableSection("EXPENSES SUMMARY", [
            { label: "Total Business/Agri Expenses", value: incomeExpenses?.totBusinessExpense },
            { label: "Total Household Expenses", value: incomeExpenses?.totHouseholdExpense },
            { label: "Rental Expenses", value: '-' },
            { label: "Other Expenses", value: '-' },
            { label: "Total Expenses", value: incomeExpenses?.totExpense },
          ], columnsRevenueSummary)}
          {renderFinalSummary()}
        </Collapse>
      </Spin>
    </Card>
  );
};

export default IncomeExpensesDetails;
