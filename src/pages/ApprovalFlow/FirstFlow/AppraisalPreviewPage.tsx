// ✅ FILE: pages/AppraisalPreviewPage.tsx (base layout for preview)

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Collapse, Typography, Spin, message } from "antd";

import OnBoardingDetails from "../Components/OnboardingDetails.tsx/OnBoardingDetails";
import { API, APIAuth } from "../../../services/api";
import GoldLoanDetails from "../Components/GoldLoanDetails";
import CustomerDetails from "../Components/CustomerDetails";
import GuarantorDetails from "../Components/GuarantorDetails";
import WitnessDetails from "../Components/WitnessDetails";
import LoanDetails from "../Components/LoanDetails";
import IncomeExpensesDetails from "../Components/IncomeExpensesDetails";
import LiabilityDetails from "../Components/LiabilityDetails";
import CreditScoringDetails from "../Components/CreditScoringDetails";
import ImageDetails from "../Components/ImageDetails";
import UndertakingDetails from "../Components/UndertakingDetails";
import ReportDetails from "../Components/ReportDetails";
import ApprovalDetails from "../Components/ApprovalDetails";
// import CustomerDetails from "./components/CustomerDetails";
// import GuarantorDetails from "./components/GuarantorDetails";
// import WitnessDetails from "./components/WitnessDetails";
// import LoanDetails from "./components/LoanDetails";
// import IncomeExpensesDetails from "./components/IncomeExpensesDetails";
// import LiabilityDetails from "./components/LiabilityDetails";
// import CreditScoringDetails from "./components/CreditScoringDetails";
// import ImageDetails from "./components/ImageDetails";
// import GeoDetails from "./components/GeoDetails";
// import UndertakingDetails from "./components/UndertakingDetails";
// import ReportDetails from "./components/ReportDetails";
// import ApprovalDetails from "./components/ApprovalDetails";
// import GoldLoanDetails from "./components/GoldLoanDetails";

// import { getOnBoardClienteles } from "services/on_board.service";
// import { getTcDetails } from "services/tc.service";

const { Title } = Typography;
const { Panel } = Collapse;

const AppraisalPreviewPage: React.FC = () => {
  const { appraisalId } = useParams<{ appraisalId: string }>();
  const [loading, setLoading] = useState(true);
  const [isReturned, setIsReturned] = useState(false);
  const [isGoldProduct, setIsGoldProduct] = useState(false);
  const [tcDetails,setTcDetails] = useState<any>(null);
  const [clienteles, setClienteles] = useState<any[]>([]);
  const [stakeholders, setStakeholders] = useState<any[]>([]);
  const [tcAmount, setTcAmount] = useState<any[]>([]);
  const [productDetails, setProductDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchMetaData = async () => {
        console.log('ttttttt');
      try {
        const onboarding:any = await APIAuth.get(
        `/mobixCamsLoan/v1/appraisals/${appraisalId}/clienteles`,
      );
        const sorted = onboarding?.data?.clienteles?.sort((a: any, b: any) =>
          a.type.toLowerCase().localeCompare(b.type.toLowerCase())
        );
        setClienteles(sorted);
        setIsReturned(onboarding?.data?.isReturned === 'Y');

        const tcDetailsRes:any = await API.get(
          `/mobixCamsCredit/v1/credit/tc/${appraisalId}`);

          console.log('tcDetailsxxxxxxxx', tcDetailsRes);
        setTcDetails(tcDetailsRes?.data || {});

        const stakeholderResponse = await APIAuth.get(`/mobixCamsClientele/v1/clienteles/stakeholder/${appraisalId}/appraisal`);
setStakeholders(stakeholderResponse?.data || []);
        console.log('stakeholders', stakeholderResponse?.data);

        const tcAmountsRes: any = await APIAuth.post(
                    `/mobixCamsCredit/v1/credit/tc/getTCDetails`,
                    { tcNo: tcDetailsRes?.data?.tcNo, mode: "T" }
                  );
        
        setTcAmount(tcAmountsRes?.data || []);
        console.log('tcAmount', tcAmountsRes?.data);

        const originationCommon = await APIAuth.get(`/mobixCamsCommon/v1/common-details/product/${tcDetailsRes?.data?.pTrhdLType}`);
        setProductDetails(originationCommon?.data || []);

        const goldTypes = ['EG', 'GL', 'GN', 'MG'];
        if (goldTypes.includes(tcDetails?.data?.pTrhdLType)) {
          setIsGoldProduct(true);
        }

      } catch (err) {
        message.error("Failed to fetch appraisal data");
      } finally {
        setLoading(false);
      }
    };

    fetchMetaData();
  }, [appraisalId]);

  if (loading) return <Spin fullscreen />;


  return (
    <Card>
      <Title className="mb-5" level={5}>Appraisal ID: {appraisalId} {isReturned ? '[Returned]' : ''}</Title>

      <Collapse 
      defaultActiveKey={["onboarding"]}  
      // defaultActiveKey={["onboarding","customer","loan","liability","creditscore","images"]}  
      className="custom-collapse">
        <Panel header="ON BOARDING DETAILS" key="onboarding">
          <OnBoardingDetails appraisalId={appraisalId || ''} tcDetails={tcDetails} clienteles={clienteles} amountsOfTcDetails={tcAmount}/>
        </Panel>

        <Panel header="CUSTOMER DETAILS" key="customer">
          <CustomerDetails tcDetails={tcDetails} stakeholders={stakeholders} productDetails={productDetails}/>
        </Panel>

        {!isGoldProduct && (
          <Panel header="GUARANTOR DETAILS" key="guarantor">
            <GuarantorDetails stakeholders={stakeholders} tcAmount={tcAmount} productDetails={productDetails}/>
          </Panel>
        )}

        <Panel header="WITNESS DETAILS" key="witness">
          <WitnessDetails stakeholders={stakeholders} />
        </Panel>

        <Panel header="LOAN DETAILS" key="loan">
          <LoanDetails />
        </Panel>

         {isGoldProduct && (
          <Panel header="GOLD LOAN DETAILS" key="goldloan">
            <GoldLoanDetails />
          </Panel>
        )}

        <Panel header="CASH FLOW DETAILS" key="cashflow">
          <IncomeExpensesDetails />
        </Panel>

        <Panel header="LIABILITY DETAILS" key="liability">
          <LiabilityDetails />
        </Panel>

        {!isGoldProduct && (
          <Panel header="CREDIT SCORE DETAILS" key="creditscore">
            <CreditScoringDetails tcDetails={tcDetails}/>
          </Panel>
        )}

        <Panel header="IMAGE DETAILS" key="images">
          <ImageDetails/>
        </Panel>

        {/* <Panel header="GEO DETAILS" key="geo">
          <GeoDetails appraisalId={appraisalId} />
        </Panel> */}

        <Panel header="CUSTOMER UNDERTAKING" key="undertaking">
          <UndertakingDetails/>
        </Panel>

        <Panel header="REPORT DETAILS" key="reports">
          <ReportDetails />
        </Panel>

        <Panel header="APPROVAL DETAILS" key="approval">
          <ApprovalDetails tcDetails={tcDetails} tcAmount={tcAmount}/>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default AppraisalPreviewPage;
