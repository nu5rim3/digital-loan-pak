import React from "react";
import { Tabs, Typography } from "antd";
import InitialDetails from "./InitialDetails";
import CalculationDetails from "./CalculationDetails";
import { getValueOfClientele } from "../../../../utils/Common";

const { TabPane } = Tabs;
const { Title } = Typography;

const OnBoardingDetails: React.FC<{ appraisalId: string , tcDetails: any, clienteles: any[] }> = ({ appraisalId, tcDetails, clienteles }) => {
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchClienteles = async () => {
  //     try {
  //       const response:any = await APIAuth.get(`/mobixCamsLoan/v1/appraisals/${appraisalId}/clienteles`);
  //       // console.log('response clienteles', response);
  //       const sorted = response?.data?.clienteles?.sort((a: any, b: any) =>
  //         a.type.toLowerCase().localeCompare(b.type.toLowerCase())
  //       );
  //       // console.log('sorted clienteles', sorted);
  //       setClienteles(sorted);
  //     } catch (error) {
  //       console.error("Failed to fetch clienteles", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchClienteles();
  // }, [appraisalId]);

  // console.log('clienteles', clienteles);

  // if (loading) return <Spin />;

  return (
    <>
      <Title level={5} className="mb-3">Client Onboarding</Title>
      <Tabs tabPosition="top">
        {clienteles?.map((clientele, index) => (
          <TabPane
            tab={`${getValueOfClientele(clientele?.type)} - ${clientele?.fullName}`}
            key={index}
          >
            <InitialDetails clientele={clientele} appraisalId={appraisalId} />
            {clientele.type === "C" && (
              <div className="mt-5">
                {/* <Title level={5} className="mt-4">Loan Installment Calculation</Title> */}
                <CalculationDetails tcDetails={tcDetails} />
              </div>
            )}
          </TabPane>
        ))}
      </Tabs>
    </>
  );
};

export default OnBoardingDetails;
