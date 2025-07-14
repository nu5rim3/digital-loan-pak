import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Collapse, Spin } from "antd";
// import { getTcDetails } from "services/tc.service";
// import CreditScoreCusDetails from "./CreditScoreCustomerDetails";
// import CreditScoreBusinessFacts from "./CreditScoreBusiness";
// import CustomerDetails from "./CustomerDetails";
import SummaryBar from "./SummaryBar";
import API from "../../../../services/APIServices";
import CustomerDetails from "./CustomerDetails";
import CreditScoreCusDetails from "./CreditScoreCusDetails";
import CreditScoreBusinessFacts from "./CreditScoreBusinessFacts";

const { Panel } = Collapse;

const CreditScoringDetails: React.FC<{ tcDetails: any }> = ({ tcDetails }) => {
  const { appraisalId } = useParams<{ appraisalId: string }>();

  const [loading, setLoading] = useState(true);
   const [customerDetails, setCustomerDetails] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (appraisalId && tcDetails) {
        const product = tcDetails?.pTrhdLType || "";
        setLoading(true);
        try {
          const response = await API.mobixCamsCredit.getCustomerCreditScoreDetails(appraisalId, product);
          setCustomerDetails(response?.data);
        } catch (error) {
          console.error("Failed to load credit score details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [ appraisalId, tcDetails]);


  return (
    <Card>
      <Spin spinning={loading} tip="Loading...">
        <Collapse accordion>
          <Panel header="FINAL CREDIT SCORING SUMMARY" key="summary">
            <SummaryBar customerDetails={customerDetails} />
          </Panel>
          <Panel header="INITIAL DETAILS OF CUSTOMER" key="initial">
            <CustomerDetails customerDetails={customerDetails} />
          </Panel>
          <Panel header="CREDIT SCORES FOR CUSTOMER DETAILS" key="customer">
            <CreditScoreCusDetails customerDetails={customerDetails} />
          </Panel>
          <Panel header="CREDIT SCORES FOR BUSINESS RELATED FACTS" key="business">
            <CreditScoreBusinessFacts customerDetails={customerDetails} />
          </Panel>
        </Collapse>
      </Spin>
    </Card>
  );
};

export default CreditScoringDetails;
