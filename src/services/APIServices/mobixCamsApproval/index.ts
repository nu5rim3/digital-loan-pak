

// Add type imports here if you define them in types.ts

import { APIAuth } from "../../api";

export const mobixCamsApproval = {
    getApprovalCombinedSteps: (appraisalId: string) =>
    APIAuth.get(`/mobixCamsApproval/v1/ibu-wf2-approvals/combined-steps/${appraisalId}`),
    approvalFirstFlow: (data: any) =>
    APIAuth.post(`/mobixCamsApproval/v1/ibu-wf1-approvals/steps`, {
      params: data
    }),
    approvalSecondFlow: (data: any) =>
    APIAuth.post(`/mobixCamsApproval/v1/ibu-wf2-approvals/steps`, {
      params: data
    }),
};
