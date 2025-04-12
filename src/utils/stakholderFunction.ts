import { IStakeholder } from "../store/stakeholderStore";
import { formatSentence } from "./formatterFunctions";

export function getStakeholderByType(
  stkType: string,
  stakeholders: IStakeholder[]
): IStakeholder[] {
  return (
    stakeholders &&
    stakeholders.filter((stakeholder) => stakeholder.stkType === stkType)
  );
}

export function getResidenceType(value: string) {
  switch (value) {
    case "O":
      return "Owned";
    case "R":
      return "Rented";
    case "C":
      return "Company Provided";
    case "P":
      return "Parental";
    case "H":
      return "Hostel";
    case "T":
      return "Other";
  }
}

export function getAddressType(value: string) {
  switch (value) {
    case "PERMANANT":
      return "Permanent";
    case "TEMPORARY":
      return "Temporary";
    case "BUSINESS":
      return "Business";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getArea(areaCode: string): string {
  switch (areaCode) {
    case "KHI":
      return "Karachi";
    case "001":
      return "Common";
    default:
      return areaCode;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getProvince(areaCode: string, areas: any[]): string {
  if (!areaCode) return "-";
  if (!areas) return "-";
  if (areas.length === 0) return "-";
  if (areas.length === 1) return areas[0].description;
  if (areas.length > 1) {
    areas = areas.filter((item) => item.code === areaCode);
    if (areas.length === 0) return "-";
    if (areas.length === 1) return areas[0].description;
    if (areas.length > 1) return areas[0].description;
  }
  return "-";
}

export function getCommunity(
  communityCode: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  communities: any[]
): string {
  if (!communityCode) return "-";
  if (!communities) return "-";
  if (communities.length === 0) return "-";
  if (communities.length === 1) return communities[0].description;
  if (communities.length > 1) {
    communities = communities.filter((item) => item.code === communityCode);
    if (communities.length === 0) return "-";
    if (communities.length === 1) return communities[0].description;
    if (communities.length > 1) return communities[0].description;
  }
  return "-";
}

export function getDescriptionByFamilyCode(code: string): string {
  const data = [
    { code: "1", description: "FATHER" },
    { code: "2", description: "MOTHER" },
    { code: "3", description: "BROTHER" },
    { code: "4", description: "SISTER" },
    { code: "5", description: "SON" },
    { code: "6", description: "DAUGHTER" },
    { code: "7", description: "GRANDFATHER" },
    { code: "8", description: "GRANDMOTHER" },
    { code: "9", description: "HUSBAND" },
    { code: "10", description: "WIFE" },
    { code: "11", description: "UNCLE" },
    { code: "12", description: "AUNT" },
    { code: "13", description: "NIECE" },
    { code: "14", description: "NEPHEW" },
    { code: "15", description: "COUSIN" },
    { code: "16", description: "GRANDSON" },
    { code: "17", description: "GRANDDAUGHTER" },
    { code: "18", description: "FATHER IN LAW" },
    { code: "19", description: "MOTHER IN LAW" },
    { code: "20", description: "SON IN LAW" },
    { code: "21", description: "DAUGHTER IN LAW" },
    { code: "22", description: "BROTHER IN LAW" },
    { code: "23", description: "SISTER IN LAW" },
  ];

  const item = data.find((item) => item.code === code);
  return item ? formatSentence(item.description) : "-";
}
