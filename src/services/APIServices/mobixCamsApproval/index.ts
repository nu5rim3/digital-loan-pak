

// Add type imports here if you define them in types.ts

import { APIAuth } from "../../api";

export const mobixCamsApproval = {
    getApprovalCombinedSteps: (appraisalId: string) =>
    APIAuth.get(`/mobixCamsApproval/v1/ibu-wf2-approvals/combined-steps/${appraisalId}`),
    approvalFirstFlow: (data: any) =>
    APIAuth.post(`/mobixCamsApproval/v1/ibu-wf1-approvals/steps`, data),
    approvalSecondFlow: (data: any) =>
    APIAuth.post(`/mobixCamsApproval/v1/ibu-wf2-approvals/steps`, data),
    getAllExceptionalApprovals: (appraisalId: string) => 
    APIAuth.get(`/mobixCamsApproval/v1/approvals/appraisal/${appraisalId}`),
    getAllOriginationApproval : (appraisalId:string) => 
    APIAuth.get(`/mobixCamsApproval/v1/approval-details/${appraisalId}`),
    verifyApprovalUser :(username: string) => 
    APIAuth.get(`/mobixCamsApproval/v1/approvals/users/${username}`),
    createApprovalComment :(data: any) => 
    APIAuth.post("/mobixCamsApproval/v1/approvals/comments", data)
};
