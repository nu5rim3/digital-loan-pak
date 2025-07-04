import { APIAuth } from "../../api";

// Add type imports here if you define them in types.ts

export const mobixCamsCommon = {
  getAllOwnershipResidance: (product: string) =>
    APIAuth.get(`/mobixCamsCommon/v1/ownership-residences/products/${product}`),

  getAllNatureOfBusiness: () =>
    APIAuth.get(`/mobixCamsCommon/v1/nature-of-businesses`),

  getAllJobs: () => APIAuth.get(`/mobixCamsCommon/v1/jobs`),

  getAllNatureOfEmp: () =>
    APIAuth.get(`/mobixCamsCommon/v1/employment-categories`),

  getAllOtherIncomeCategories: () =>
    APIAuth.get(`/mobixCamsCommon/v1/other-income-categories`),
  
  getOriginationCommon: (productCode: string) =>
    APIAuth.get(`/mobixCamsCommon/v1/common-details/product/${productCode}`),
};
