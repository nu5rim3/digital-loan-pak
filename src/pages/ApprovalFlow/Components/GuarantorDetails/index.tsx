import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Collapse,
  Descriptions,
  Typography,
  Spin,
  Row,
  Col,
  Button,
  Table,
  message,
} from "antd";
// import NumberFormat from "react-number-format";
// import AsyncImage from "pages/ApplicationManagement/ImageDetails/async_images";
// import { getTcDetails, getAmountsOfTcDetails } from "services/tc.service";
// import {
//   masterInformation,
//   contactInformation,
//   residentialInformation,
//   incomeInformation,
//   getSignature,
//   getThumb,
//   getMasterData,
// } from "services/guarantor.service";
// import { getOriginationCommon } from "services/common.service";
// import { getValueByList, getValueAddressType } from "services/util.service";
import { APIAuth } from "../../../../services/api";
import { getValueAddressType, getValueByList, getValueContactType, getValueIncomeSource, intoCurrency } from "../../../../utils/Common";
import AsyncImage from "../ImageContainers/AsyncImage";

const { Panel } = Collapse;
const { Title } = Typography;

interface GuarantorDetailsProps {
  productDetails: any;
  stakeholders: any;
  tcAmount: any;
}

const GuarantorDetails: React.FC<GuarantorDetailsProps> = ({ stakeholders, tcAmount, productDetails }) => {
  const { appraisalId } = useParams();
  const [loading, setLoading] = useState(true);
  const [loanDetails, setLoanDetails] = useState<any>({});
  const [guarantors, setGuarantors] = useState<any[]>([]);
  const [selectedOrgType, setSelectedOrgType] = useState<string>();
  const [guarantorDetails, setGuarantorDetails] = useState<any>({
    master: null,
    contacts: [],
    addresses: [],
    income: null,
    signatures: [],
    thumbs: [],
  });
  const [originationCommon, setOriginationCommon] = useState<any>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      //   if (active === "4") {
      try {
        //   const tc = await getTcDetails(appraisalId);
        // const tc: any = await APIAuth.get(
        //   `/mobixCamsCredit/v1/credit/tc/${appraisalId}`
        // );
        // if (tcDetails?.tcNo) {
        //   // const amounts = await getAmountsOfTcDetails(tc.data.tcNo);
        //   const amounts: any = await APIAuth.post(
        //     `/mobixCamsCredit/v1/credit/tc/getTCDetails`,
        //     { tcNo: tcDetails.tcNo, mode: "T" }
        //   );
          setLoanDetails(tcAmount);
        // }

        // const master = await getMasterData(appraisalId);
        // const master:any = await APIAuth.get(
        //   `/mobixCamsClientele/v1/clienteles/stakeholder/${appraisalId}/appraisal`
        // );
        setGuarantors(stakeholders?.filter((item: any) => item.stkType === "G"));

        // const common = await getOriginationCommon(tc?.pTrhdLType);
        // const common:any = await APIAuth.get(
        //   `/mobixCamsCommon/v1/common-details/product/${tcDetails
        //   ?.pTrhdLType}`
        // );
        setOriginationCommon(productDetails || {});
      } catch (err) {
        console.error("Guarantor details loading failed", err);
      } finally {
        setLoading(false);
      }
      //   }
    };

    fetchInitialData();
  }, [ appraisalId]);
useEffect(() => {
    const fetchOrgTypeByCode = async (orgTypeCode:string) => {
      setLoading(true);
      try {
        const response:any = await APIAuth.get(`/mobixCamsCommon/v1/organizations/${orgTypeCode}`);
        if(response?.data && response?.data?.description){
            setSelectedOrgType(response?.data?.description);
        }
        
      } catch (error) {
        console.error("Failed to fetch organization Type", error);
         setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    if(guarantorDetails?.master?.stkOrgType){
       fetchOrgTypeByCode(guarantorDetails.master.stkOrgType);
    }
  }, [guarantorDetails?.master?.stkOrgType]);
  const loadGuarantorDetails = async (guarantor: any, index: number) => {
    setLoading(true);
    try {
      const [master, contacts, addresses, incomes, signs, thumbs]: any =
        await Promise.allSettled([
          // masterInformation(guarantor.idx),
          // contactInformation(guarantor.idx),
          // residentialInformation(guarantor.idx),
          // incomeInformation(guarantor.idx),
          // getSignature(appraisalId, `G${index + 1}`),
          // getThumb(appraisalId, `G${index + 1}FINGER`),
          APIAuth.get(
            `/mobixCamsClientele/v1/clienteles/stakeholder/${guarantor.idx}`
          ),
          APIAuth.get(
            `/mobixCamsClientele/v1/clienteles/contacts/${guarantor.idx}`
          ),
          APIAuth.get(
            `/mobixCamsClientele/v1/clienteles/residence/${guarantor.idx}`
          ),
          APIAuth.get(
            `/mobixCamsClientele/v1/clienteles/guarantor/income/${guarantor.idx}`
          ),
          APIAuth.get(
            `/mobixCamsLoan/v1/loans/image/details/${appraisalId}/master/G${
              index + 1
            }/sub/SIGN`
          ),
          APIAuth.get(
            `/mobixCamsLoan/v1/loans/image/details/${appraisalId}/master/G${
              index + 1
            }FINGER/sub/1`
          ),
         
        ]);

      setGuarantorDetails({
        master: master.status === "fulfilled" ? master.value?.data : null,
        contacts: contacts.status === "fulfilled" ? contacts.value?.data : [],
        addresses: addresses.status === "fulfilled" ? addresses.value?.data : [],
        income: incomes.status === "fulfilled" ? incomes?.value?.data[0] || {} : null,
        signatures: signs.status === "fulfilled" ? signs.value?.data : [],
        thumbs: thumbs.status === "fulfilled" ? thumbs.value?.data : [],
      });
    } catch (err) {
      message.error("Failed to load some guarantor details.");
      console.error("Guarantor detail fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  console.log('guarantorDetails', guarantorDetails);

  const renderDesc = (label: string, value: any) => (
    <Descriptions.Item label={label}>{value || "\u00A0"}</Descriptions.Item>
  );

  return (
    <Card>
      <Spin spinning={loading} fullscreen={false}>
        <Title level={4}>Guarantor List</Title>
        <Table
          dataSource={guarantors}
          rowKey={(record) => record.idx}
          pagination={false}
          columns={[
            {
              title: "Name",
              dataIndex: "stkCusName",
              key: "stkCusName",
            },
            {
              title: "CNIC",
              dataIndex: "stkCNic",
              key: "stkCNic",
            },
            {
              title: "Action",
              key: "action",
              render: (_, record, index) => (
                <Button
                  type="primary"
                  onClick={() => loadGuarantorDetails(record, index)}
                >
                  Load
                </Button>
              ),
            },
          ]}
        />

        {guarantorDetails.master && (
          <>
            <Title level={4} style={{ marginTop: 24 }}>
              Guarantor: {guarantorDetails.master?.stkCusName}
            </Title>
            <Collapse defaultActiveKey={["1"]}>
              <Panel header="Personal Information" key="1">
                <Descriptions bordered column={3} size="small">
                  {renderDesc(
                    "Organization Type",
                    selectedOrgType
                  )}
                  {renderDesc("Customer CNIC", guarantorDetails.master.stkCNic)}
                  {renderDesc(
                    "CNIC Status",
                    getValueByList(
                      originationCommon.cnicStatusDtoList,
                      guarantorDetails.master.stkCNicStatus
                    )
                  )}
                  {renderDesc(
                    "Customer Name",
                    guarantorDetails.master.stkCusName
                  )}
                  {renderDesc("Surname", guarantorDetails.master.stkSurName)}
                  {renderDesc(
                    "Gender",
                    getValueByList(
                      originationCommon.genderDtoList,
                      guarantorDetails.master.stkGender
                    )
                  )}
                  {renderDesc("Age", guarantorDetails.master.stkAge)}
                  {renderDesc("Date of Birth", guarantorDetails.master.stkDob)}
                  {renderDesc(
                    "Father/Husband Name",
                    guarantorDetails.master.stkFatherOrHusName
                  )}
                  {renderDesc(
                    "Educational Qualification",
                    getValueByList(
                      originationCommon.educationLevelDtoList,
                      guarantorDetails.master.stkEduLevel
                    )
                  )}
                </Descriptions>
              </Panel>

              <Panel header="Contact & Address Information" key="2">
                {guarantorDetails?.contacts?.map((c: any, i: any) => (
                  <Descriptions key={i} size="small" column={2} bordered className="my-4 shadow-md rounded-md bg-white">
                  {renderDesc("Phone No Type", getValueContactType(c.phoneNoType))}
                    {renderDesc("Phone No", c.phoneNo)}
                  </Descriptions>
                ))}
                {guarantorDetails?.addresses?.map((r: any, i: any) => (
                  <Descriptions key={i} size="small" column={2} bordered className="my-4 shadow-md rounded-md bg-white">
                    {renderDesc(
                      "Address Type",
                      getValueAddressType(r.addressType)
                    )}
                    {renderDesc("Address Line 1", r.addressLine1)}
                    {renderDesc("Address Line 2", r.addressLine2)}
                    {renderDesc("City", r.city)}
                    {renderDesc("District", r.district)}
                    {renderDesc(
                      "Province",
                      getValueByList(
                        originationCommon.provinceDtoList,
                        r.province
                      )
                    )}
                    {renderDesc(
                      "Community",
                      getValueByList(
                        originationCommon.communityDtoList,
                        r.community
                      )
                    )}
                    {renderDesc("Nearby Popular Places", r.nearByPopPlc)}
                    {renderDesc("Duration at Current Location", r.durOfCurrLoc)}
                    {renderDesc(
                      "Residence Type",
                      getValueByList(
                        originationCommon.residentialTypeDtoList,
                        r.residenceType
                      )
                    )}
                  </Descriptions>
                ))}
              </Panel>

              <Panel header="Income / Asset Details" key="3">
                <Descriptions bordered column={2} size="small">
                  {renderDesc(
                    "Source of Income",
                    getValueIncomeSource(guarantorDetails.income?.sourceOfIncome)
                  )}
                  {renderDesc(
                    "Monthly Income",
                    intoCurrency(guarantorDetails.income?.monthlyIncome)
                  )}
                  {renderDesc(
                    "Asset Description",
                    guarantorDetails.income?.assetsDesc
                  )}
                  {renderDesc(
                    "Total Value Assets",
                    intoCurrency(guarantorDetails.income?.totValAssets)
                  )}
                  {renderDesc(
                    "Total Monthly Income",
                    intoCurrency(guarantorDetails.income?.totMonIncome)
                  )}
                </Descriptions>
              </Panel>

              <Panel header="Acknowledgement & Signature" key="4">
                <p style={{ direction: "rtl" }}>
                  میں بقائمی ہوش وحواس{" "}
                  <u>{guarantorDetails.master?.stkCusName}</u> کو دئیے جانے والے
                  مبلغ{" "}
                  <u>
                    {/* <NumberFormat
                      value={loanDetails?.object?.loanAmount}
                      displayType={"text"}
                      thousandSeparator={true}
                    /> */}
                    {intoCurrency(loanDetails?.object?.loanAmount)}
                  </u>{" "}
                  روپے کے قرض کی ضمانت قبول کرتا ہوں...
                </p>
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    <Card title="Guarantor Thumbnail">
                      {guarantorDetails.thumbs.map(
                        (sign: any, index: any) =>
                          sign.status === "A" && (
                            <AsyncImage key={index} src={sign.hashIdentifier} />
                          )
                      )}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Guarantor Signature">
                      {guarantorDetails.signatures.map(
                        (sign: any, index: any) =>
                          sign.status === "A" && (
                            <AsyncImage key={index} src={sign.hashIdentifier} />
                          )
                      )}
                    </Card>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </>
        )}
      </Spin>
    </Card>
  );
};

export default GuarantorDetails;
