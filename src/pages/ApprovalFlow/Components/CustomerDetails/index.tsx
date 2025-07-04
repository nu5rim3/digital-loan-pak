import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Collapse, Descriptions, Spin } from "antd";
import type { FC } from "react";
import type { DescriptionsProps } from "antd";
import { APIAuth } from "../../../../services/api";
import { getValueByList } from "../../../../utils/Common";



export const getValuePoliticallyExposed = (key:any) => {
    switch (key) {
        case "N": return "No";
        case "L": return "Legislative";
        case "AF": return "Armed Forces";
        case "JE": return "Judiciary Executive";
        case "A": return "Administrative";
        case "BR": return "By way of Association/Relationship with PEP";
        default: return "Value Not Found";
    }
};

export const getValueAddressType = (key:any) => {
    switch (key) {
        case "TEMPORARY": return "Residential Address";
        case "PERMANANT": return "Permanent Address";
        case "BUSINESS": return "Business Address";
        default: return "Value Not Found";
    }
};

export const getCommonAreaValues = (key:any) => {
    switch (key) {
        case "001": return "COMMON";
        case "KHI": return "KARACHI";
        default: return "Value Not Found";
    }
};

const { Panel } = Collapse;

const CustomerDetails: FC = () => {
  const { appraisalId } = useParams<{ appraisalId: string }>();
  const [loading, setLoading] = useState<boolean>(true);

  const [data, setData] = useState<any>({
    tcDetails: {},
    master: {},
    contact: [],
    residentials: [],
    recipient: {},
    other: {},
    cheque: [],
    originationCommon: {},
  });

  useEffect(() => {
    const fetchData = async () => {
    //   if (active === "3") {
        try {
        //   const tcDetails = await getTcDetails(appraisalId);
          const tcDetails = await APIAuth.get(`/mobixCamsCredit/v1/credit/tc/${appraisalId}`);
          //   const originationCommon = await getOriginationCommon(tcDetails.pTrhdLType);
          const originationCommon = await APIAuth.get(`/mobixCamsCommon/v1/common-details/product/${tcDetails?.data?.pTrhdLType}`);
          
        //   const masterResponse = await getMasterData(appraisalId);
          const masterResponse = await APIAuth.get(`/mobixCamsClientele/v1/clienteles/stakeholder/${appraisalId}/appraisal`);
          const master = masterResponse?.data?.find((item:any) => item.stkType === "C") || {};
          
          //   const clienteleRes = await getOriginationClientele(appraisalId, master.idx);
          const clienteleRes = await APIAuth.get(`/mobixCamsClientele/v1/stakeholder-details/${appraisalId}/stakeholderId/${master.idx}`);

          setData({
            tcDetails,
            master,
            contact: clienteleRes?.data?.contactDetailsDtoList || [],
            residentials: clienteleRes?.data?.residenceInfoDtoList || [],
            recipient: clienteleRes?.data?.recipientDetailsDtoList?.[0] || {},
            other: clienteleRes?.data?.otherInfoDetailsDtoList?.[0] || {},
            cheque: clienteleRes?.data?.postDatedChequeDtoList || [],
            originationCommon: originationCommon?.data,
          });
        } catch (err) {
          console.error("Customer details loading failed", err);
        } finally {
          setLoading(false);
        }
    //   }
    };

    fetchData();
  }, [appraisalId]);

  const renderDesc = (label: string, value?: string | number): NonNullable<DescriptionsProps["items"]>[number] => ({
    key: label,
    label,
    children: value || "\u00A0",
  });

  return (
    <Card>
      {loading ? (
        <Spin fullscreen />
      ) : (
        <Collapse defaultActiveKey={["personal"]} bordered={false}>
          <Panel header="Customer Personal Information" key="personal">
            <Descriptions bordered column={3} size="small"  className="my-5"
            items={[
              renderDesc(
                "Organization Type",
                getValueByList(data.originationCommon.organizationTypeDtoList, data.master.stkOrgType)
              ),
              renderDesc("Customer CNIC", data.master.stkCNic),
              renderDesc("CNIC Issued Date", data.master.stkCNicIssuedDate),
              renderDesc("CNIC Expired Date", data.master.stkCNicExpDate),
              renderDesc(
                "CNIC Status",
                getValueByList(data.originationCommon.cnicStatusDtoList, data.master.stkCNicStatus)
              ),
              renderDesc("Customer Name", data.master.stkCusName),
              renderDesc("Initials", data.master.stkInitials),
              renderDesc("Surname", data.master.stkSurName),
              renderDesc("Other Name", data.master.stkOtherName),
              renderDesc("Date of Birth", data.master.stkDob),
              renderDesc("Age", data.master.stkAge),
              renderDesc(
                "Gender",
                getValueByList(data.originationCommon.genderDtoList, data.master.stkGender)
              ),
              renderDesc(
                "Marital Status",
                getValueByList(data.originationCommon.maritalTypeDtoList, data.master.stkMaritialStatus)
              ),
              renderDesc(
                "Title",
                getValueByList(data.originationCommon.titleDtoList, data.master.stkTitle)
              ),
              renderDesc("Father/Husband Name", data.master.stkFatherOrHusName),
              renderDesc("No. of Dependents", data.master.stkNumOfDependents),
              renderDesc("No. of Earners", data.master.stkNumOfEarners),
              renderDesc(
                "Educational Qualification",
                getValueByList(data.originationCommon.educationLevelDtoList, data.master.stkEduLevel)
              ),
              renderDesc("Customer Code", data.master.stkCusCode),
              renderDesc("Group/Reference No", data.master.stkGrpRefNo),
              renderDesc(
                "Physical Disability",
                data.master.stkPhysDisability === "true" ? "Yes" : "No"
              ),
              renderDesc("Disability Description", data.master.stkPhysDisabilityDesce),
              renderDesc(
                "Head of Family",
                getValueByList(data.originationCommon.headOfFamilyDetailsDtoList, data.master.headOfFamily)
              ),
              renderDesc(
                "Household Contribution",
                getValueByList(data.originationCommon.houseHoldDetailsDtoList, data.master.houseHoldCont)
              ),
            ]} />
          </Panel>

          <Panel header="Contact & Address Information" key="contact">
            {data.contact.map((c:any, i:any) => (
              <Descriptions key={`c-${i}`} size="small" column={2} bordered   className="my-4 shadow-md rounded-md bg-white" items={[
                renderDesc("Phone No Type", c.phoneNoType),
                renderDesc("Phone No", c.phoneNo),
              ]} />
            ))}

            {data.residentials.map((r:any, i:any) => (
              <Descriptions key={`r-${i}`} size="small" className="my-6 shadow-md rounded-md bg-white p-0" column={2} bordered items={[
                renderDesc("Address Type", getValueAddressType(r.addressType)),
                renderDesc("Address Line 1", r.addressLine1),
                renderDesc("Address Line 2", r.addressLine2),
                renderDesc("Address Line 3", r.addressLine3),
                renderDesc("Address Line 4", r.addressLine4),
                renderDesc("Area", getCommonAreaValues(r.area)),
                renderDesc("City", r.city),
                renderDesc("District", r.district),
                renderDesc("Province", getValueByList(data.originationCommon.provinceDtoList, r.province)),
                renderDesc("Community", getValueByList(data.originationCommon.communityDtoList, r.community)),
                renderDesc("Nearby Popular Places", r.nearByPopPlc),
                renderDesc("Duration at Current Location", r.durOfCurrLoc),
                renderDesc("Residence Type", getValueByList(data.originationCommon.residentialTypeDtoList, r.residenceType)),
              ]} />
            ))}
          </Panel>

          <Panel header="Insurance Recipient/Nominee Information" key="insurance">
            <Descriptions bordered size="small" column={2} items={[
              renderDesc("Recipient Name", data.recipient.recipientName),
              renderDesc(
                "Relationship",
                getValueByList(data.originationCommon.familyDetailsDtoList, data.recipient.relationship)
              ),
              renderDesc("CNIC No", data.recipient.cNicNo),
              renderDesc("Phone No", data.recipient.phoneNo),
            ]} />
          </Panel>

          <Panel header="Other Information" key="other">
            <Descriptions bordered size="small" column={2} items={[
              renderDesc("Occupation", getValueByList(data.originationCommon.occupationDtoList, data.other.occupation)),
              renderDesc("Sub Occupation", data.other.subOccupation),
              renderDesc("How Did You Know About Us", getValueByList(data.originationCommon.sourceOfInformationDtoList, data.other.howDidYouKnow)),
              renderDesc("Sector", getValueByList(data.originationCommon.sectorDtoList, data.other.sector)),
              renderDesc("Sub Sector", getValueByList(data.originationCommon.subSectorDtoList, data.other.subSector)),
              renderDesc("Savings Account Required", data.other.savingsReq),
              renderDesc("WHT Declaration", data.other.whtDec),
              renderDesc("Politically Exposed Person", getValuePoliticallyExposed(data.other.poliExpo)),
            ]} />
          </Panel>

          <Panel header="Post Dated Cheque Information" key="cheques">
            {data.cheque.map((cheq:any, i:any) => (
              <Descriptions key={`cheq-${i}`} size="small" className="mb-4" bordered column={2} items={[
                renderDesc("Bank", getValueByList(data.originationCommon.pdBankDtoList, cheq.bank)),
                renderDesc("Cheque No", cheq.chequeNo),
                renderDesc("Account No", cheq.accountNo),
                renderDesc("Account Title", cheq.accountTitle),
              ]} />
            ))}
          </Panel>
        </Collapse>
      )}
    </Card>
  );
};

export default CustomerDetails;
