import moment from "moment";

export function formatCurrency(value: number): string {
  const formattedValue = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedValue;
}

export function removeCurrencySymbol(value: string): string {
  // Remove currency symbols and commas
  return value.replace(/[,]/g, "").trim();
}

export function formatSentence(sentence: string) {
  if (!sentence) return "";
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
}

export function formatName(name: string) {
  if (!name) return "";
  return name
    .toLowerCase() // Convert the whole string to lowercase
    .split(" ") // Split by spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(" "); // Join words back together
}

export const dateFormats = (date: string, dateFormat: string) => {
  const dateObj = new Date(date);
  return moment(dateObj).format(`${dateFormat}`);
};

export function kebabToTitleCase(str: string): string {
  return str
    .split(/[-_]/) // Split on both - and _
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatCamelCase(str: string): string {
  if (!str) return "-";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const formatCNIC = (value: string) => {
  const cleaned = value.replace(/\D/g, ""); // Remove non-numeric characters
  const match = cleaned.match(/^(\d{0,5})(\d{0,7})?(\d{0,1})?$/);
  if (!match) return value;

  return [match[1], match[2], match[3]]
    .filter(Boolean) // Remove empty groups
    .join("-");
};

export const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, ""); // Remove non-numeric characters
  const match = cleaned.match(/^(\d{4})(\d{7})?$/);
  if (!match) return value;

  return [match[1], match[2]].filter(Boolean).join("");
};

// duration = 5, 5
export const splitDuration = (duration: string) => {
  const years = duration.split(",")[0].trim().match(/(\d+)/);
  const months = duration.split(",")[1].trim().match(/(\d+)/);

  return {
    years: years ? years[1] : "0",
    months: months ? months[1] : "0",
  };
};

export const convertStringToNumber = (value: string) => {
  const cleaned = value.replace(/,/g, ""); // Remove commas
  const numberValue = parseFloat(cleaned);
  return isNaN(numberValue) ? 0 : numberValue;
};

export const getRoleName = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Administrator";
    case "BHO":
      return "Branch Head Officer";
    case "CRO":
      return "Customer Relationship Officer";
    case "CO":
      return "Credit Officer";
    case "BM":
      return "Branch Manager";
    case "CC":
      return "Call Center Verification";
    case "IMD":
      return "Islamic Microfinance Division";
    case "CR":
      return "Credit Reviewer";
    case "CA":
      return "Credit Approver";
    case "CAD":
      return "Credit Administrative Division";
    case "AM":
      return "Area Manager";
    case "RBH":
      return "Regional Business Head";
    case "COO":
      return "Chief Operating Officer";
    case "CEO":
      return "Chief Executive Officer";
    case "COP":
      return "----- Credit Operations";
    default:
      return role;
  }
};

export const getDistrict = () => {
  return [
    { label: "Islamabad", value: "Islamabad" },
    { label: "Karachi", value: "Karachi" },
    { label: "Lahore", value: "Lahore" },
    { label: "Faisalabad", value: "Faisalabad" },
    { label: "Rawalpindi", value: "Rawalpindi" },
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Peshawar", value: "Peshawar" },
    { label: "Quetta", value: "Quetta" },
    { label: "Multan", value: "Multan" },
    { label: "Gujranwala", value: "Gujranwala" },
    { label: "Sialkot", value: "Sialkot" },
    { label: "Sargodha", value: "Sargodha" },
    { label: "Bahawalpur", value: "Bahawalpur" },
    { label: "Sukkur", value: "Sukkur" },
    { label: "Larkana", value: "Larkana" },
    { label: "Abbottabad", value: "Abbottabad" },
    { label: "Dera Ghazi Khan", value: "Dera Ghazi Khan" },
    { label: "Mardan", value: "Mardan" },
    { label: "Chiniot", value: "Chiniot" },
    { label: "Khuzdar", value: "Khuzdar" },
    { label: "Gwadar", value: "Gwadar" },
    { label: "Mirpur", value: "Mirpur" },
    { label: "Muzaffarabad", value: "Muzaffarabad" },
    { label: "Gilgit", value: "Gilgit" },
    { label: "Skardu", value: "Skardu" },
  ];
};

export const titleGenderMaritalMap: Record<
  string,
  { gender?: string; maritalStatus?: string }
> = {
  MR: { gender: "M", maritalStatus: "S" },
  MRS: { gender: "F", maritalStatus: "D" },
  MS: { gender: "F", maritalStatus: "S" },
  DR: { gender: undefined, maritalStatus: undefined }, // Could be either
  PROF: { gender: undefined, maritalStatus: undefined },
  ENG: { gender: undefined, maritalStatus: undefined },
  REV: { gender: undefined, maritalStatus: undefined },
  "M/S": { gender: undefined, maritalStatus: undefined }, // Could be firm or group
  MST: { gender: "F", maritalStatus: "S" },
};

export function splitInitialAndSurname(fullName: string): {
  initial: string;
  surname: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { initial: "", surname: "" };
  }
  if (parts.length === 1) {
    return { initial: parts[0].charAt(0).toUpperCase(), surname: "" };
  }

  const surname = parts[parts.length - 1];
  // Initials: first letter of each part except last, joined WITHOUT dot at end, only dots between
  const initialsArray = parts
    .slice(0, -1)
    .map((p) => p.charAt(0).toUpperCase());
  const initial = initialsArray.join(".");

  return { initial, surname };
}
