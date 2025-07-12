import React, { useEffect, useState } from "react";
import { Typography, Card, Table, Descriptions } from "antd";
import { APIAuth } from "../../../../services/api";
import { getFacilityTypeName, getProdName, intoCurrency } from "../../../../utils/Common";

const { Title } = Typography;

const CalculationDetails: React.FC<{ tcDetails: any }> = ({ tcDetails }) => {
  // const { appraisalId } = useParams<{ appraisalId: string }>();
  const [loading, setLoading] = useState(true);
  // const [tcDetails, setTcDetails] = useState<any>(null);
  const [amountsOfTcDetails, setAmountsOfTcDetails] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const tcResponse: any = await APIAuth.get(`/mobixCamsCredit/v1/credit/tc/${appraisalId}`);
        // setTcDetails(tcResponse?.data || {});

        const tcNo = tcDetails?.tcNo;
        if (tcNo) {
          const amountsResponse: any = await APIAuth.post(`/mobixCamsCredit/v1/credit/tc/getTCDetails`, {
            tcNo,
            mode: "T",
          });
          setAmountsOfTcDetails(amountsResponse?.data);
        }
      } catch (err) {
        console.error("Calculation details error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tcDetails]);

  const rentalRows = amountsOfTcDetails?.object?.facilityDetails?.map((item: any, i: number) => ({
    key: i,
    seq: item.seq || "-",
    term: item.term || "-",
    instalment: intoCurrency(Number(item.instalment || '0')),
  })) || [];





  return (
    <Card loading={loading} title={<Title level={5}>Loan Installment Calculation</Title>}>
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="TC No">{amountsOfTcDetails?.object?.tcNo}</Descriptions.Item>
        <Descriptions.Item label="Loan Amount">{intoCurrency(Number(amountsOfTcDetails?.object?.loanAmount || 0))}</Descriptions.Item>
        <Descriptions.Item label="Markup">{tcDetails?.pTrhdTr}</Descriptions.Item>
        <Descriptions.Item label="Term">{tcDetails?.pTrhdTerm}</Descriptions.Item>
        <Descriptions.Item label="Total Receivable">{intoCurrency(Number(amountsOfTcDetails?.object?.totalReceivable || 0))}</Descriptions.Item>
        <Descriptions.Item label="Down Payment">{intoCurrency(Number(amountsOfTcDetails?.object?.downPayment || 0))}</Descriptions.Item>
        {amountsOfTcDetails?.object?.facilityDetails?.[0]?.instalment && (
          <Descriptions.Item label="Rental Amount">{intoCurrency(Number(amountsOfTcDetails?.object?.facilityDetails?.[0]?.instalment || 0))}</Descriptions.Item>
        )}
        {tcDetails?.pTrhdColMeth && tcDetails?.pTrhdMethod === 'B' && (
          <Descriptions.Item label="Rental Method">
            {tcDetails?.pTrhdColMeth === 'Q' && 'Quarterly'}
            {tcDetails?.pTrhdColMeth === 'A' && 'Annually'}
            {tcDetails?.pTrhdColMeth === 'BA' && 'Bi-annually'}
            {tcDetails?.pTrhdColMeth === 'HY' && 'Half Yearly'}
          </Descriptions.Item>
        )}
        {tcDetails?.pFacilityType && (
          <Descriptions.Item label="Facility Type">
            {getFacilityTypeName(tcDetails.pFacilityType) || tcDetails.pFacilityType}
          </Descriptions.Item>
        )}
      </Descriptions>

      {tcDetails?.pFacilityType === 'RO' && (
        <Descriptions bordered column={1} size="small" className="mt-4" title="Roll Over Details">
          <Descriptions.Item label="Previous Loan Product">{getProdName(tcDetails?.prevLoanProd)}</Descriptions.Item>
          <Descriptions.Item label="Previous Loan Contract No">{tcDetails?.prevLoanContractNo}</Descriptions.Item>
          <Descriptions.Item label="Previous Loan Outstanding">{intoCurrency(Number(tcDetails?.prevLoanOutstanding || 0))}</Descriptions.Item>
          <Descriptions.Item label="Count of Roll Over">{tcDetails?.countOfRollOver}</Descriptions.Item>
        </Descriptions>
      )}

      {rentalRows.length > 0 && (
        <Table
          className="my-6"
          size="small"
          title={() => <Title level={5}>Rental Schedule</Title>}
          pagination={false}
          columns={[
            { title: "Seq", dataIndex: "seq" },
            { title: "Months", dataIndex: "term" },
            { title: "Amount", dataIndex: "instalment" },
          ]}
          dataSource={rentalRows}
        />
      )}
    </Card>
  );
};

export default CalculationDetails;
