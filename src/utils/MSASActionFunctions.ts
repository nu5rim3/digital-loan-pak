import { ILoanStatus } from "../store/loanStore";

export type TRule = {
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

/**
 * getApprovalStatus
 * @param rules
 * @returns
 */
export const getApprovalStatus = (rules: TRule[]): string => {
  if (!rules || rules.length === 0) return ActionType.INVALID;

  const cnicRule = rules.find(
    (rule) => rule.name === "RUL_CNIC_ID_VERIFICATION"
  );
  const nameRule = rules.find(
    (rule) => rule.name === "RUL_CNIC_NAME_VERIFICATION"
  );

  if (!cnicRule || !nameRule) {
    return ActionType.APPROVE; // If any required rule is missing
  }

  if (cnicRule.status === "N" && nameRule.status === "N") {
    return ActionType.APPROVE;
  }

  if (cnicRule.status === "N" && nameRule.status === "Y") {
    return ActionType.SPECIAL_APPROVAL;
  }

  // if (cnicRule.status === "Y") {
  //   return ActionType.CLOSE;
  // }

  // if (cnicRule.status === "P" || nameRule.status === "P") {
  //   return ActionType.REFRESH;
  // }

  return ActionType.INVALID;
};

/**
 * getVerificationStatus
 * @param rules
 * @returns
 */
export const getVerificationStatus = (rules: TRule[]) => {
  const cnicRule = rules.find(
    (rule) => rule.name === "RUL_CNIC_ID_VERIFICATION"
  );
  const nameRule = rules.find(
    (rule) => rule.name === "RUL_CNIC_NAME_VERIFICATION"
  );

  return [
    {
      name: "CNIC ID Verification",
      status: cnicRule ? cnicRule.status : "P",
    },
    {
      name: "CNIC Name Verification",
      status: nameRule ? nameRule.status : "P",
    },
  ];
};

enum OtpActionType {
  INVALID = "INVALID",
  VERIFIED = "VERIFIED",
  NOT_VERIFIED = "NOT_VERIFIED",
}

/**
 * getOTPVerificationStatus
 * @param rules
 * @returns
 */
export const getOTPVerificationStatus = (rules: TRule[]): string => {
  if (!rules || rules.length === 0) return OtpActionType.INVALID;

  const otpRule = rules.find(
    (rule) => rule.name === "RUL_CLI_OTP_VERIFICATION"
  );

  if (!otpRule) {
    return OtpActionType.INVALID; // If any required rule is missing
  }

  if (otpRule.status === "N" || otpRule.status === "P") {
    return OtpActionType.NOT_VERIFIED;
  }

  if (otpRule.status === "Y") {
    return OtpActionType.VERIFIED;
  }

  return OtpActionType.INVALID;
};

/**
 * getStatusByName
 * @param ruleName
 * @param rules
 * @returns
 */
export const getStatusByName = (ruleName: string, rules: TRule[]): string => {
  const rule = rules.find((r) => r.name === ruleName);
  return rule ? rule.status : "P"; // Return status if found, else null
};

/**
 * getStatusByName
 * @param ruleName
 * @param rules
 * @returns
 */
export const getLoanStatusByName = (
  ruleName: string,
  rules: ILoanStatus[]
): { isCompleted: string; isMandatory: string } => {
  const rule = rules.find((r) => r.section === ruleName);
  return rule
    ? {
        isCompleted: rule.completed,
        isMandatory: rule.isMandatory,
      }
    : {
        isCompleted: "",
        isMandatory: "",
      };
};

/**
 * getOnlyStatusByName
 * @param ruleName
 * @param rules
 * @returns
 */
export const getOnlyStatusByName = (
  ruleName: string,
  rules: ILoanStatus[]
): string => {
  const rule = rules.find((r) => r.section === ruleName);
  return rule ? rule.status : "P"; // Return status if found, else null
};
