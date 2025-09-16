import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Collapse,
  Descriptions,
  Spin,
  Typography,
  Tabs,
  message,
  Table,
} from "antd";
// import { getValueByList } from "services/util.service";
// import AsyncImage from "../ImageDetails/async_images";
import API from "../../../../services/APIServices";
import { getValueByList, getValueNatureOfBorrowe, getValueOwnershipOfLand } from "../../../../utils/Common";
import moment from "moment";
import AsyncImage from "../ImageContainers/AsyncImage";

const { Panel } = Collapse;
const { Title } = Typography;
const { TabPane } = Tabs;


interface TabState {
  business: string;
  supplier: string;
  otherIncome: string;
}

interface LoanData {
  tcDetails: any;
  jobs: any[];
  natureOfEmp: any[];
  natureOfBusiness: any[];
  otherIncomeCategories: any[];
  signature: any[];
  salaryLoanDetails: any;
  businessLoanDetails: any[];
  liveStockLoanDetails: any;
  cultivationLoanDetails: any;
  baraKarobarEmployeeLoanDetails: any;
  baraKarobarSupplierLoanDetails: any[];
  baraKarobarPermanetLoanDetails: any;
  baraKarobarSwotLoanDetails: any;
  otherIncomeDetails: any[];
  originationCommon: any;
}

const LoanDetails: React.FC = () => {
  const { appraisalId } = useParams<{ appraisalId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<LoanData>({
    tcDetails: {},
    jobs: [],
    natureOfEmp: [],
    natureOfBusiness: [],
    otherIncomeCategories: [],
    signature: [],
    salaryLoanDetails: null,
    businessLoanDetails: [],
    liveStockLoanDetails: null,
    cultivationLoanDetails: null,
    baraKarobarEmployeeLoanDetails: null,
    baraKarobarSupplierLoanDetails: [],
    baraKarobarPermanetLoanDetails: null,
    baraKarobarSwotLoanDetails: null,
    otherIncomeDetails: [],
    originationCommon: null,
  });

  const [activeTabs, setActiveTabs] = useState<TabState>({
    business: "0",
    supplier: "0",
    otherIncome: "0",
  });

  const fetchData = useCallback(async () => {
    if(!appraisalId) {
      message.error("Appraisal ID is missing.");
      return;
    }
  setLoading(true);
  try {
    const tcDetails:any = await API.mobixCamsCredit.getTcDetails(appraisalId);
    const pTrhdLType = tcDetails?.data?.pTrhdLType;

    const promises:any = [
      API.mobixCamsCommon.getAllJobs(),
      API.mobixCamsCommon.getAllNatureOfEmp(),
      API.mobixCamsCommon.getAllNatureOfBusiness(),
      API.mobixCamsCommon.getAllOtherIncomeCategories(),
      API.mobixCamsLoan.getSignature(appraisalId, "C1"),
      API.mobixCamsCredit.getSalaryLoanDetails(appraisalId),
      API.mobixCamsCredit.getLoanBusinessDetails(appraisalId),
      API.mobixCamsCredit.getLiveStockDetails(appraisalId),
      API.mobixCamsCredit.getCultivationLoanDetails(appraisalId),
      API.mobixCamsCredit.getBaraKarobarLoanEmployeeDetails(appraisalId),
      API.mobixCamsCredit.getBaraKarobarLoanSupplierDetails(appraisalId),
      API.mobixCamsCredit.getBaraKarobarLoanPermanetDetails(appraisalId),
      API.mobixCamsCredit.getBaraKarobarLoanSwotDetails(appraisalId),
      API.mobixCamsCredit.getOtherIncomeDetails(appraisalId),
      pTrhdLType ? API.mobixCamsCommon.getOriginationCommon(pTrhdLType) : Promise.resolve([]),
    ];

    const [
      jobs,
      natureOfEmp,
      natureOfBusiness,
      otherIncomeCategories,
      signature,
      salaryLoanDetails,
      businessLoanDetails,
      liveStockLoanDetails,
      cultivationLoanDetails,
      baraKarobarEmployeeLoanDetails,
      baraKarobarSupplierLoanDetails,
      baraKarobarPermanetLoanDetails,
      baraKarobarSwotLoanDetails,
      otherIncomeDetails,
      originationCommon,
    ] = await Promise.all(
      promises.map((p:any) =>
        p.then((res:any) => ({ status: "fulfilled", value: res }))
         .catch((err:any) => {
           console.warn("API failed:", err);
           return { status: "rejected", value: undefined };
         })
      )
    ).then((results) => results.map((r) => r.status === "fulfilled" ? r.value?.data : r.value?.data ?? [])); // Default for failed APIs

    setData({
      tcDetails,
      jobs,
      natureOfEmp,
      natureOfBusiness,
      otherIncomeCategories,
      signature,
      salaryLoanDetails,
      businessLoanDetails,
      liveStockLoanDetails,
      cultivationLoanDetails,
      baraKarobarEmployeeLoanDetails,
      baraKarobarSupplierLoanDetails,
      baraKarobarPermanetLoanDetails,
      baraKarobarSwotLoanDetails,
      otherIncomeDetails,
      originationCommon,
    });
  } catch (error) {
    message.error("Unexpected error occurred while loading loan details.");
  } finally {
    setLoading(false);
  }
}, [appraisalId]);

const assetColumns = [
  {
    title: "Ownership",
    dataIndex: "ownership",
    key: "ownership",
    render: (text: string) => text || "\u00A0",
  },
  {
    title: "Quantity",
    dataIndex: "qty",
    key: "qty",
    render: (text: string) => text || "\u00A0",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (text: string) => text || "\u00A0",
  },
];

  useEffect(() => {
      fetchData();
  }, []);



    const renderDesc = (label: string, value: any) => (
      <Descriptions.Item label={label}>{value || "\u00A0"}</Descriptions.Item>
    );

   const renderSalaryLoanDetails = () => {
    if (!data?.salaryLoanDetails?.length) return null;

    return (
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="SALARY/INDIVIDUAL LOAN" key="1">
          <Descriptions  bordered column={2} size="small">
        {renderDesc("Profession", data?.salaryLoanDetails.profession)}
        {renderDesc("Nature of Employment", getValueByList(data?.originationCommon?.employmentCategoryDtoList, data?.salaryLoanDetails.natureOfEmp))}
        {renderDesc("Source of Income", data?.salaryLoanDetails.sourceOfIncome)}
        {renderDesc("Residence or working place of applicant is above 15km of branch / service center", getValueByList(data?.originationCommon?.applicantDistanceDtoList, data?.salaryLoanDetails.residenceOrWorking))}
        {renderDesc("Employer", data?.salaryLoanDetails.employer)}
        {renderDesc("Salary information, Proof of Salary", getValueByList(data?.originationCommon?.salaryInformationDtoList, data?.salaryLoanDetails.proofOfSalary))}
        {renderDesc("Type of Business", getValueByList(data?.originationCommon?.natureOfBusinessDtoList, data?.salaryLoanDetails.typeOfBusiness))}
        {renderDesc("Repeat Customer", getValueByList(data?.originationCommon?.repeatCustomerDtoList, data?.salaryLoanDetails.repeatCustomer))}
        {renderDesc("Designation", data?.salaryLoanDetails.designation)}
        {renderDesc("Contact No", data?.salaryLoanDetails.contactNo)}
        {renderDesc("Experience", data?.salaryLoanDetails.currEmpPeriod)}
        {renderDesc("Employer address", data?.salaryLoanDetails.empAddress)}
        {renderDesc("Type of Job", getValueByList(data?.originationCommon?.typeOfJobDtoList, data?.salaryLoanDetails.typeOfJob))}
      </Descriptions>
        </Panel>
      </Collapse>
    );
  };

    const renderBusinessLoanDetails = () => {
    const { businessLoanDetails, originationCommon } = data;
    if (!businessLoanDetails || businessLoanDetails.length === 0) return null;

    return (
      <Collapse defaultActiveKey={["2"]} className="my-4">
        <Panel header="INDIVIDUAL LOAN BUSINESS DETAILS" key="2">
          <Tabs type="card" activeKey={activeTabs.business} onChange={(key) => setActiveTabs({ ...activeTabs, business: key })}>
            {businessLoanDetails.map((item, index) => (
              <TabPane tab={`Business`} key={index.toString()}>
                <Descriptions layout="vertical" bordered column={2} size="small">
                  {renderDesc("Business Name", item.bnsName)}
                  {renderDesc("Nature of Business", getValueByList(originationCommon?.natureOfBusinessDtoList, item.natureOfBns))}
                  {renderDesc("Business Address", item.bnsAddress)}
                  {renderDesc("Phone No", item.phoneNo)}
                  {renderDesc("Description", item.description)}
                  {renderDesc("Previous Experience in Business", item.prevExpInBns)}
                  {renderDesc("Ownership of Business Place", getValueByList(originationCommon?.businessPlaceOwnershipDtoList, item.ownOfBnsPlace))}
                  {renderDesc("Business Assets + Stocks", item.costOfBns)}
                  {renderDesc("Repeat Customer", getValueByList(originationCommon?.repeatCustomerDtoList, item.repeatCustomer))}
                </Descriptions>
              </TabPane>
            ))}
          </Tabs>
        </Panel>
      </Collapse>
    );
  };

    const renderLiveStockLoanDetails = () => {
    const { liveStockLoanDetails, originationCommon } = data;
    if (!liveStockLoanDetails?.length) return null;

    return (
      <Collapse defaultActiveKey={["3"]} className="my-4">
        <Panel header="LIVE STOCK LOAN DETAILS" key="3">
          <Descriptions layout="vertical" bordered column={2} size="small">
            {renderDesc("Borrower District", liveStockLoanDetails.borrowerDistrict)}
            {renderDesc("S/O, W/O, D/O", liveStockLoanDetails.sowodo)}
            {renderDesc("Loan Tenure in Days", liveStockLoanDetails.loanTenure)}
            {renderDesc("Insurance Company", liveStockLoanDetails.insCompany)}
            {renderDesc("Date of Policy Issued", moment(liveStockLoanDetails.policyIssuedDate).format("YYYY-MM-DD"))}
            {renderDesc("Policy Expired Date", moment(liveStockLoanDetails.policyExpiredDate).format("YYYY-MM-DD"))}
            {renderDesc("Premium Paid Receipt No", liveStockLoanDetails.receiptNo)}
            {renderDesc("Premium Rate", liveStockLoanDetails.premiumRate)}
            {renderDesc("Animal/ Crop", liveStockLoanDetails.animalOrCrop)}
            {renderDesc("Buffaloes", liveStockLoanDetails.buffaloes)}
            {renderDesc("Cows", liveStockLoanDetails.cows)}
            {renderDesc("Bulls", liveStockLoanDetails.bulls)}
            {renderDesc("Collateral", liveStockLoanDetails.collateral)}
            {renderDesc("Number of Times Claim Lodged", liveStockLoanDetails.claimLodged)}
            {renderDesc("Animal Tagging", liveStockLoanDetails.animalTagging)}
            {renderDesc("Purpose of Loan", getValueByList(originationCommon?.loanPurposeDtoList, liveStockLoanDetails.purposeOfLoan))}
            {renderDesc("Nature of the Borrower", liveStockLoanDetails.natureOfTheBorrower)}
            {renderDesc("Ownership of Land", liveStockLoanDetails.ownOfLand)}
            {renderDesc("Floods Factor", getValueByList(originationCommon?.floodsFactorDtoList, liveStockLoanDetails.floodsFactor))}
            {renderDesc("Irrigation", getValueByList(originationCommon?.irrigationDtoList, liveStockLoanDetails.irrigation))}
            {renderDesc("Agriculture Machineries Method", getValueByList(originationCommon?.agriMethodDtoList, liveStockLoanDetails.methods))}
            {renderDesc("Proof of Cultivation", getValueByList(originationCommon?.proofOfCultivationDtoList, liveStockLoanDetails.proofOfCult))}
            {renderDesc("Experience in Cultivation", liveStockLoanDetails.expInCult)}
            {renderDesc("Market Check", getValueByList(originationCommon?.fieldVerificationDtoList, liveStockLoanDetails.marketCheck))}
            {renderDesc("Agri Secured", liveStockLoanDetails.agriSecured)}
          </Descriptions>
        </Panel>
      </Collapse>
    );
  };

   const renderCultivationLoanDetails = () => {
    const { cultivationLoanDetails, originationCommon, signature } = data;
    if (!cultivationLoanDetails?.length) return null;

    return (
      <Collapse defaultActiveKey={["4"]} className="my-4">
        <Panel header="CULTIVATION LOAN DETAILS" key="4">
          <Descriptions layout="vertical" bordered column={2} size="small">
            {renderDesc("Nature of the borrower", getValueNatureOfBorrowe(cultivationLoanDetails.natureOfTheBorrower))}
            {renderDesc("", getValueByList(originationCommon.farmCultivationOwnershipDtoList, cultivationLoanDetails.ownOfCult))}
            {renderDesc("Ownership of Land", getValueOwnershipOfLand(cultivationLoanDetails.ownOfLand))}
            {renderDesc("Owner Name", cultivationLoanDetails.ownName)}
            {renderDesc("Owner CNIC", cultivationLoanDetails.ownCNIC)}
            {renderDesc("Owner Address", cultivationLoanDetails.ownAddress)}
            {renderDesc("Owner Contact", cultivationLoanDetails.ownContact)}
            {renderDesc("Acres Owned", cultivationLoanDetails.acresOwned)}
            {renderDesc("Acres Rented", cultivationLoanDetails.acresRented)}
            {renderDesc("Acres Total", cultivationLoanDetails.acresTotal)}

           

            {renderDesc("District", cultivationLoanDetails.district)}
            {renderDesc("Loan Tenure in Days", cultivationLoanDetails.loanTenure)}
            {renderDesc("Insurance Company", cultivationLoanDetails.insCompany)}
            {renderDesc("Policy Issued Date", moment(cultivationLoanDetails.policyIssuedDate).format("YYYY-MM-DD"))}
            {renderDesc("Receipt No", cultivationLoanDetails.receiptNo)}
            {renderDesc("Premium Rate", cultivationLoanDetails.premiumRate)}
            {renderDesc("Premium Rate for Sugarcane", cultivationLoanDetails.premiumRateForSugar)}
            {renderDesc("Experience in Cultivation", cultivationLoanDetails.expInCult)}
            {renderDesc("Total Assets Value", cultivationLoanDetails.totAssetsValue)}
            {renderDesc("Evidence", cultivationLoanDetails.evidance)}
            {renderDesc("Claim Lodged", cultivationLoanDetails.claimLodged)}
            {renderDesc("Other Info 1", cultivationLoanDetails.otherInfo1)}
            {renderDesc("Other Info 2", cultivationLoanDetails.otherInfo2)}
            {renderDesc("Other Info 3", cultivationLoanDetails.otherInfo3)}
          </Descriptions>

          <Descriptions layout="vertical" bordered column={2} size="small">
            {renderDesc("Acres of Rabi", cultivationLoanDetails.acresOfRabi)}
            {renderDesc("Rabi Harvesting Date", moment(cultivationLoanDetails.rabiHarvestingDate).format("YYYY-MM-DD"))}
            {renderDesc("Rabi Cultivation Date", moment(cultivationLoanDetails.rabiCultivationDate).format("YYYY-MM-DD"))}
            {renderDesc("Acres of Kharif", cultivationLoanDetails.acresOfKharif)}
            {renderDesc("Kharif Harvesting Date", moment(cultivationLoanDetails.kharifHarvestingDate).format("YYYY-MM-DD"))}
            {renderDesc("Kharif Cultivation Date", moment(cultivationLoanDetails.kharifCultivationDate).format("YYYY-MM-DD"))}
          </Descriptions>

          <Descriptions layout="vertical" bordered column={2} size="small">
            {renderDesc("Location of Land", cultivationLoanDetails?.ownLandLoc)}
            {renderDesc("", cultivationLoanDetails?.rentedLandLoc)}
            {renderDesc("Deh/Tehsi/District", cultivationLoanDetails?.district)}
            
            {renderDesc("Crop to be Cultivated 1", cultivationLoanDetails?.cropsToBeCult?.[0])}
            {renderDesc("Crop to be Cultivated 2", cultivationLoanDetails?.cropsToBeCult?.[1])}
            {renderDesc("Crop to be Cultivated 3", cultivationLoanDetails?.cropsToBeCult?.[2])}
            {renderDesc("Crop to be Cultivated 4", cultivationLoanDetails?.cropsToBeCult?.[3])}
            {renderDesc("Crop to be Cultivated 5", cultivationLoanDetails?.cropsToBeCult?.[4])}
            {renderDesc("Crop to be Cultivated 6", cultivationLoanDetails?.cropsToBeCult?.[5])}

            {renderDesc("Crops Name", cultivationLoanDetails?.cropsName)}
            {renderDesc("Land Details", cultivationLoanDetails?.landDetails)}
            {renderDesc("Comment", cultivationLoanDetails?.comment)}
            </Descriptions>

            <Descriptions layout="vertical" bordered column={2} size="small">
            {renderDesc("Loan Limit Rabi", cultivationLoanDetails?.loanLimitRabi)}
            {renderDesc("Loan Limit Kharif", cultivationLoanDetails?.loanLimitKharif)}
            {renderDesc("Loan Limit Total", cultivationLoanDetails?.loanLimitTotal)}
            {renderDesc("Purpose of Loan", getValueByList(originationCommon?.loanPurposeDtoList, cultivationLoanDetails?.purposeOfLoan))}
            {renderDesc("Floods Factor", getValueByList(originationCommon?.floodsFactorDtoList, cultivationLoanDetails?.floodsFactor))}
            {renderDesc("Irrigation", getValueByList(originationCommon?.irrigationDtoList, cultivationLoanDetails?.irrigation))}
            {renderDesc("Agriculture Machineries Method", getValueByList(originationCommon?.agriMethodDtoList, cultivationLoanDetails?.methods))}
            {renderDesc("Proof of Cultivation", getValueByList(originationCommon?.proofOfCultivationDtoList, cultivationLoanDetails?.proofOfCult))}
            {renderDesc("Experience in Cultivation", cultivationLoanDetails?.expInCult)}
            {renderDesc("Market Check through Field Verification", getValueByList(originationCommon?.fieldVerificationDtoList, cultivationLoanDetails?.marketCheck))}
            {renderDesc("Agri Secured", cultivationLoanDetails?.agriSecured)}
            </Descriptions>

{cultivationLoanDetails?.assets?.length > 0 && (
  <div className="my-4">
    <Title level={5}>Assets</Title>
    <Table
      size="small"
      bordered
      pagination={false}
      columns={assetColumns}
      dataSource={cultivationLoanDetails.assets.map((item:any, idx:any) => ({
        ...item,
        key: idx,
      }))}
    />
  </div>
)}

<Descriptions
  layout="horizontal"
  bordered
  size="small"
  column={3}
  className="my-4"
>
  <Descriptions.Item label=" ">&nbsp;</Descriptions.Item>
  <Descriptions.Item label="Total Assets Value" span={1}>
    {cultivationLoanDetails?.totAssetsValue || "\u00A0"}
  </Descriptions.Item>
  <Descriptions.Item label=" ">&nbsp;</Descriptions.Item>
</Descriptions>

<Descriptions layout="vertical" bordered column={2} size="small">
  {renderDesc("Loan Tenure in Days", cultivationLoanDetails?.loanTenure)}
  {renderDesc("Insurance Company", cultivationLoanDetails?.insCompany)}
  {renderDesc(
    "Date of Policy Issued",
    cultivationLoanDetails?.policyIssuedDate
      ? moment(cultivationLoanDetails.policyIssuedDate).format("YYYY-MM-DD")
      : "-"
  )}
  {renderDesc("Premium Paid Receipt No", cultivationLoanDetails?.receiptNo)}
  {renderDesc("Premium Rate", cultivationLoanDetails?.premiumRate)}
  {renderDesc("Premium Rate for Sugarcane", cultivationLoanDetails?.premiumRateForSugar)}
  {renderDesc("Evidence of Land Holding/Cultivation", cultivationLoanDetails?.evidance)}
  {renderDesc("Number of Times Claim Lodged", cultivationLoanDetails?.claimLodged)}
  {renderDesc("Other Information 1", cultivationLoanDetails?.otherInfo1)}
  {renderDesc("Other Information 2", cultivationLoanDetails?.otherInfo2)}
  {renderDesc("Other Information 3", cultivationLoanDetails?.otherInfo3)}
</Descriptions>

<Card title="Customer Signature" className="witness-signature-card" size="small">
  {signature && signature.length > 0 ? (
    signature
      .filter((sign: any) => sign.status === "A")
      .map((sign: any, index: number) => (
        <AsyncImage src={sign.hashIdentifier} key={index} />
      ))
  ) : (
    <p>-</p>
  )}
</Card>

        </Panel>
      </Collapse>
    );
  };

   const renderBaraKarobarEmployeeLoanDetails = () => {
    const { baraKarobarEmployeeLoanDetails} = data;
    if (!baraKarobarEmployeeLoanDetails?.length) return null;

    return (
        <Collapse defaultActiveKey={["4"]} className="my-4">
        <Panel header="BARA KAROBAR LOAN DETAILS" key="4">

        </Panel>
        </Collapse>
    )


}

  return <Card>
      <Spin spinning={loading} tip="Loading...">
        {renderSalaryLoanDetails()}
        {renderBusinessLoanDetails()}
        {renderLiveStockLoanDetails()}
        {renderCultivationLoanDetails()}
        {renderBaraKarobarEmployeeLoanDetails()}
      </Spin>
    </Card>;
};

export default LoanDetails;

