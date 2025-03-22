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

type Rule = {
  name: string;
  description: string;
  status: string;
};

enum ActionType {
  APPROVE = "APPROVE",
  SPECIAL_APPROVAL = "SPECIAL_APPROVAL",
  CLOSE = "CLOSE",
  REFRESH = "REFRESH",
  INVALID = "INVALID",
}

export const getApprovalStatus = (rules: Rule[]): string => {
  if (!rules || rules.length === 0) return ActionType.INVALID;

  const cnicRule = rules.find(
    (rule) => rule.name === "RUL_CNIC_ID_VERIFICATION"
  );
  const nameRule = rules.find(
    (rule) => rule.name === "RUL_CNIC_NAME_VERIFICATION"
  );

  if (!cnicRule || !nameRule) {
    return ActionType.INVALID; // If any required rule is missing
  }

  if (cnicRule.status === "N" && nameRule.status === "N") {
    return ActionType.APPROVE;
  }

  if (cnicRule.status === "N" && nameRule.status === "Y") {
    return ActionType.SPECIAL_APPROVAL;
  }

  if (cnicRule.status === "Y") {
    return ActionType.CLOSE;
  }

  if (cnicRule.status === "P" && nameRule.status === "P") {
    return ActionType.REFRESH;
  }

  return ActionType.INVALID;
};

export const getVerificationStatus = (rules: Rule[]) => {
  const cnicRule = rules.find(
    (rule) => rule.name === "RUL_CNIC_ID_VERIFICATION"
  );
  const nameRule = rules.find(
    (rule) => rule.name === "RUL_CNIC_NAME_VERIFICATION"
  );

  return {
    isNameVerify: nameRule ? nameRule.status === "N" : false, // "N" means Verified
    isCnicVerify: cnicRule ? cnicRule.status === "N" : false, // "N" means Verified
  };
};
