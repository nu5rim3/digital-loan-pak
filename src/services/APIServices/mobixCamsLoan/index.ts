import { APIAuth, APIFileInstance } from "../../api";

// Add type imports here if you define them in types.ts

export const mobixCamsLoan = {
  getSignature: async (appraisalId: string, type : 'C1' | 'CUSTOMER1') =>
    APIAuth.get(
      `/mobixCamsLoan/v1/loans/image/details/${appraisalId}/master/${type}/sub/SIGN`
    ),
  getLiabilityDetails: async (appraisalId: string) =>
    APIAuth.get(
      `/mobixCamsLoan/v1/liabilities/appraisals/${appraisalId}`
    ),

  getAllImages : (appraisalId: string) => 
    APIAuth.get(`/mobixCamsLoan/v1/loans/image/details/${appraisalId}`),

  exportAsPdf : (appraisalId:string) => 
    APIAuth.get(`/mobixCamsLoan/v1/loans/resources/image-attachment/${appraisalId}`),

  viewImageOrPDF : (hashIdentifier:string) => 
    APIFileInstance.get(`/mobixCamsLoan/v1/loans/static-assets/${hashIdentifier}`),

  getThumb : (appraisalId:string, type:string) => APIAuth.get(`/mobixCamsLoan/v1/loans/image/details/${appraisalId}/master/${type}/sub/1`),

  getFirstFlowApprovals: async (filterData: any) =>
    APIAuth.get(`/mobixCamsLoan/v1/ibu-wf1-appraisals/filters`, {
      params: {
        ...filterData
      }
    }),

  getSecondFlowApprovals: async (filterData: any) =>
    APIAuth.get(`/mobixCamsLoan/v1/ibu-wf2-appraisals/filters`, {
      params: {
        ...filterData
      }
    }),
  getExcaptionalApprovals: async (filterData: any) =>
    APIAuth.get(`/mobixCamsLoan/v1/appraisals/exceptional-approvals/filters`, {
      params: {
        ...filterData
      }
    }),



}
