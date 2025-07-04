import { APIAuth } from "../../api";


export const mobixCamsCredit = {
  getTcDetails: (appraisalId: string) =>
    APIAuth.get(`/mobixCamsCredit/v1/credit/tc/${appraisalId}`),

  getAmountsOfTcDetails: (tcId: string) => {
    const payload = {
      tcNo: tcId,
      mode: "T",
    };
    return APIAuth.post(`/mobixCamsCredit/v1/credit/tc/getTCDetails`, payload);
  },

  getCustomerCreditScoreDetails: (appraisalId: string, productCode: string) =>
    APIAuth.get(`/mobixCamsCredit/v1/credits-scores/products/${productCode}/appraisals/${appraisalId}`),

  getIncomeExpenses: (appraisalId: string) =>
    APIAuth.get(`/mobixCamsCredit/v1/credit/income-expense/${appraisalId}`),

  getSummaryDetails : (appraisalId:string) => 
    APIAuth.get(`/mobixCamsCredit/v1/credits/scores/appraisals/${appraisalId}`),
  
getSalaryLoanDetails:(appraisalId:string) => 
    APIAuth.get(`/mobixCamsCredit/v1/credit/loan/app/sal/${appraisalId}`),

getLoanBusinessDetails : (appraisalId: string) => APIAuth.get(`/mobixCamsCredit/v1/credit/loan/app/bns/${appraisalId}`),

getLiveStockDetails : (appraisalId:string) => 
    APIAuth.get(`/mobixCamsCredit/v1/credit/loan/app/stk/${appraisalId}`),

getCultivationLoanDetails : (appraisalId: string) => 
    APIAuth.get(`/mobixCamsCredit/v1/credit/loan/app/cult/${appraisalId}`),

 getBaraKarobarLoanEmployeeDetails : (appraisalId: string) => 
    APIAuth.get(`/mobixCamsCredit/v1/credit/loan/app/emp/${appraisalId}`),

    getBaraKarobarLoanSupplierDetails : (appraisalId: string) => 
    APIAuth.get(`/mobixCamsCredit/v1/credit/loan/app/sup/${appraisalId}`),

     getBaraKarobarLoanPermanetDetails : (appraisalId: string) => 
    APIAuth.get(`/mobixCamsCredit/v1/credit/loan/app/perm/${appraisalId}`),

     getBaraKarobarLoanSwotDetails : (appraisalId: string) => 
    APIAuth.get(`/mobixCamsCredit/v1/credit/loan/app/swot/${appraisalId}`),

    getOtherIncomeDetails : (appraisalId: string) => 
    APIAuth.get(`/mobixCamsCredit/v1/credit/loan/app/oth/${appraisalId}`)
};
