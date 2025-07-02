import { APIAuth } from "../../api";

// Add type imports here if you define them in types.ts

export const mobixCamsLoan = {
  getSignature: async (appraisalId: string, type : 'C1') =>
    APIAuth.get(
      `/mobixCamsLoan/v1/loans/image/details/${appraisalId}/master/${type}/sub/SIGN`
    ),
};
