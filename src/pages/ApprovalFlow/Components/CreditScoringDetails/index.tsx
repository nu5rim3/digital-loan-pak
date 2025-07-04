import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Collapse, Spin, message } from "antd";
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

const CreditScoringDetails: React.FC = () => {
  const { appraisalId } = useParams<{ appraisalId: string }>();

  const [loading, setLoading] = useState(true);
  const [tcDetails, setTcDetails] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      if ( appraisalId) {
        setLoading(true);
        try {
          const data = await API.mobixCamsCredit.getTcDetails(appraisalId);
          setTcDetails(data.data || {});
        } catch (e) {
          message.error("Failed to fetch TC details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [ appraisalId]);

  const product = tcDetails?.pTrhdLType || "";

  return (
    <Card>
      <Spin spinning={loading} tip="Loading...">
        <Collapse accordion>
          <Panel header="FINAL CREDIT SCORING SUMMARY" key="summary">
            <SummaryBar product={product} appraisalId={appraisalId!} />
          </Panel>
          <Panel header="INITIAL DETAILS OF CUSTOMER" key="initial">
            <CustomerDetails product={product} appraisalId={appraisalId!} />
          </Panel>
          <Panel header="CREDIT SCORES FOR CUSTOMER DETAILS" key="customer">
            <CreditScoreCusDetails product={product} appraisalId={appraisalId!} />
          </Panel>
          <Panel header="CREDIT SCORES FOR BUSINESS RELATED FACTS" key="business">
            <CreditScoreBusinessFacts product={product} appraisalId={appraisalId!} />
          </Panel>
        </Collapse>
      </Spin>
    </Card>
  );
};

export default CreditScoringDetails;
