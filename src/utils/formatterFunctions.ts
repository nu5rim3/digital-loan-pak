import moment from "moment";

export function formatCurrency(value: number): string {
  const formattedValue = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedValue;
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
    .split("-")
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

// duration = 5Y, 5M
export const splitDuration = (duration: string) => {
  const years = duration.match(/(\d+)Y/);
  const months = duration.match(/(\d+)M/);

  return {
    years: years ? years[1] + "Y" : "0Y",
    months: months ? months[1] + "M" : "0M",
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
