import { IStakeholder } from "../store/stakeholderStore";

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
