import { create } from "zustand";
import { API, APIAuth } from "../services/api";
import { notification } from "antd";
import { PagableResponse } from "./types/Pagables";

interface ILoan {
  id?: number;
  category: "LOAN" | "CORN";
  longitude: string;
  latitude: string;
  financialUnit: "IBU" | "CONVENTIONAL";
  client: "WEB" | "MOBILE";
}

interface ILoanResponse {
  idx: string;
  status: string;
  category: string;
  isReturned: string | null;
  tcNo: string | null;
  longitude: string;
  latitude: string;
  version: string | null;
  clienteles: string | null;
  contractNo: string | null;
  contractStatus: string | null;
  contractDescription: string | null;
  branchName: string | null;
  productName: string | null;
  client: string | null;
  financialUnit: string | null;
  createdBy: string | null;
  lastModifiedDate: string;
  creationDate: string;
}

interface ILoanApplication {
  appIdx: string;
  appStatus: string;
  appCategory: string;
  appLongitude: number;
  appLatitude: number;
  appVersion: string | null;
  createdBy: string;
  creationDate: string;
  lastModifiedDate: string;
  isReturned: string | null;
  contractNo: string | null;
  contractStatus: string | null;
  contractDescription: string | null;
  client: string;
  financialUnit: string;
  cliIdx: string;
  cliType: string;
  cliIdentifier: string;
  cliIdentifierType: string;
  fullName: string;
  cliSequence: string;
  cliStatus: string;
  cliCity: string | null;
  cliContactNumber: string;
  cliTelcoProvider: string;
  geoLocation: string | null;
  cliRefNo: string | null;
  loanType: string;
  loanAmount: string;
  tcNo: string | null;
}

export interface IProductDetails {
  prodCode: string;
  prodCurrency: string;
  prodName: string;
  applicableCat: string;
  prodCat: string;
  prodCatDesc: string;
  calMethod: string;
  calMethodDesc: string;
  defaultCalMethod: string;
  rewardFlag: string;
  rewardType: string | null;
  rewardDefaultValue: string | null;
  maxRewardAmt: string | null;
  rewardRate: string;
  rewardAddCriteria: string | null;
  prodFlag1: string;
  prodFlag2: string;
  generalInfo: {
    applicableCat: string;
    currencyCode: string;
    defaultLoanAmt: string;
    defaultRate: string;
    defaultTerm: string;
    maxLoanAmt: string;
    maxRate: string;
    maxTerm: string;
    minLoanAmt: string;
    minRate: string;
    minTerm: string;
    penalOdIntRate: string;
    prodCode: string;
    prodSubCode: string;
    refCode: string;
    status: string;
  };
  specialCharges: {
    baseOnCode: string;
    baseOnDesc: string;
    criteriaCode: string;
    criteriaDesc: string;
    currencyCode: string;
    prodCode: string;
    prtbAccrualBasisFlag: string;
    prtbApplicableType: string;
    prtbBnhCode: string;
    prtbCalAmt: string;
    prtbCalMetod: string;
    prtbChargeMaxVal: string | null;
    prtbChargeMinVal: string | null;
    prtbMaxAmt: string;
    prtbMinAmt: string;
    prtbMndFlg: string;
    prtbProportionateFlag: string;
    prtbTrx: string;
    prtxProdSub: string;
  }[];
  tcSubTypes: string[];
  appSubTypes: {
    prodCode: string;
    currencyCode: string;
    appOrgCode: string;
    appOrgDesc: string;
    appStatus: string;
  }[];
  calMethods: {
    calMethodCode: string;
    calMethodDesc: string;
  }[];
}

export interface ILoanStatus {
  createdBy: string;
  creationDate: string;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
  id: number;
  section: string;
  isMandatory: string;
  completed: string;
  status: string;
}

export interface ILiability {
  idx?: string;
  institutionName: string;
  loanNature: string;
  outstandingAmount: string;
}

export interface AppLiabilities {
  appIdx: string;
  totalAmount?: string;
  liabilities: ILiability[];
}

export interface IGoldLoanFacilities {
  idx?: string;
  appraisalIdx?: string;
  facilityObtained?: string | "Y" | "N";
  bankCode: string;
  loanAmount: string;
  renewalDate: string;
}

export interface ITermDepositPlaced {
  appraisalIdx?: string;
  idx?: string;
  bankCode: string;
  depositPlaced?: string;
  maturityDate: string;
  days: string;
  months: string;
  years: string;
  profitOfFrequency: string;
  tdrAmount: string;
}
export interface ILiabilityValidationPayload {
  appraisalIdx: string;
  section: "Y" | "N";
  isEnabled: string;
}

export interface ILiabilityValidationResponse {
  appraisalIdx: string;
  section: "Y" | "N";
  isEnabled: string;
}

export interface IApplicationValidations {
  createdBy: string;
  creationDate: string; // ISO string, e.g. "2025-07-07T09:21:36.871+00:00"
  lastModifiedBy: string;
  lastModifiedDate: string; // ISO string
  id: number;
  section: string;
  isMandatory: "1" | "0"; // "1" or "0"
  isVisible: "1" | "0"; // "1" or "0"
  prodCode: string;
  completed: "1" | "0"; // "1" or "0"
  status: "A" | "I";
}

export interface ICROCompletePayload {
  appraisalIdx: string;
  role: "CRO";
  status: "C";
}

interface ILoanState {
  loans: ILoan[];
  loanStatus: ILoanStatus[];
  loan: ILoanResponse | null;
  selectedLoan: ILoan | null;
  loading: boolean;
  error: string | null;

  liabilitie: AppLiabilities;
  liabilityLoading: boolean;
  liabilityError: string | null;

  // Gold Loan Facilities
  goldLoanFacilities: IGoldLoanFacilities[];
  goldLoanFacilitiesLoading: boolean;
  goldLoanFacilitiesError: string | null;

  termDepositPlaced: ITermDepositPlaced[];
  termDepositPlacedLoading: boolean;
  termDepositPlacedError: string | null;

  productDetails: IProductDetails | null;
  productDetailsLoading: boolean;
  productDetailsError: string | null;

  pageableLoans: PagableResponse<ILoanApplication> | null;
  pageableLoading: boolean;
  pageableError: string | null;

  liabilityValidation: ILiabilityValidationResponse[];
  liabilityValidationLoading: boolean;
  liabilityValidationError: string | null;

  applicationValidates: IApplicationValidations[];
  applicationValidationLoading: boolean;
  applicationValidationError: string | null;

  fetchLoans: (status: string, username: string) => Promise<void>;
  fetchLoanById: (id: number) => Promise<void>;
  addLoan: (loan: ILoan) => Promise<void>;
  updateLoan: (id: number, updatedLoan: ILoan) => Promise<void>;
  fetchLoanStatusById: (appId: string) => Promise<void>;

  // Liabilities
  fetchLiabilities: (appId: string) => Promise<void>;
  addLiability: (AppLiabilities: AppLiabilities) => Promise<void>;
  updateLiability: (
    libIdx: string,
    updatedLiability: ILiability
  ) => Promise<void>;
  deleteLiability: (libIdx: string) => Promise<void>;

  // Gold Loan Facilities
  fetchGoldLoanFacilities: (appId: string) => Promise<void>;
  addGoldLoanFacilities: (
    goldLoanFacilities: IGoldLoanFacilities
  ) => Promise<void>;
  updateGoldLoanFacilities: (
    goldId: string,
    updatedGoldLoanFacilities: IGoldLoanFacilities
  ) => Promise<void>;
  deleteGoldLoanFacilities: (goldId: string) => Promise<void>;

  fetchTermDepositByAppId: (appId: string) => Promise<void>;
  addTermDepositPlaced: (termDepositeData: ITermDepositPlaced) => Promise<void>;
  updateTermDepositPlaced: (
    tdId: string,
    termDepositeData: ITermDepositPlaced
  ) => Promise<void>;
  deleteTermDepositPlaced: (tdId: string) => Promise<void>;

  fetchProductDetails: (
    productCode: string,
    subProductCode: string,
    refCode: string,
    currencyCode: string
  ) => Promise<void>;

  resetProductDetails: () => void;

  fetchPageableLoans: (params?: {
    status?: string;
    appraisalId?: string;
    fromDate?: string;
    toDate?: string;
    customerName?: string;
    loanType?: string;
    loanAmount?: string;
    createdBy?: string;
    page?: number;
    size?: number;
  }) => Promise<void>;

  fetchLiabilityValidation: (appId: string) => Promise<void>;
  addLiabilityValidation: (
    payload: ILiabilityValidationPayload
  ) => Promise<void>;

  fetchApplicationValidationsByAppId: (appId: string) => Promise<void>;

  completeLoanApplication: (payload: ICROCompletePayload) => Promise<void>;
}

const useLoanStore = create<ILoanState>((set) => ({
  loans: [],
  loanStatus: [],
  loan: null,
  selectedLoan: null,
  loading: false,
  error: null,

  liabilitie: {
    appIdx: "",
    totalAmount: "",
    liabilities: [],
  },
  liabilityLoading: false,
  liabilityError: null,

  goldLoanFacilities: [],
  goldLoanFacilitiesLoading: false,
  goldLoanFacilitiesError: null,

  termDepositPlaced: [],
  termDepositPlacedLoading: false,
  termDepositPlacedError: null,

  productDetails: null,
  productDetailsLoading: false,
  productDetailsError: null,

  pageableLoans: null,
  pageableLoading: false,
  pageableError: null,

  liabilityValidation: [],
  liabilityValidationLoading: false,
  liabilityValidationError: null,

  applicationValidates: [],
  applicationValidationLoading: false,
  applicationValidationError: null,

  fetchLoans: async (status: string, username: string) => {
    set({ loading: true, error: null });
    try {
      const response = await API.get(
        `/mobixCamsLoan/v1/appraisals/${status}/user/${username}?unit=&client=MOBILE`
      );
      set({ loans: response.data, loading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, loading: false });
    }
  },

  fetchLoanById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await API.get(`/loan/${id}`);
      set({ selectedLoan: response.data, loading: false });
      notification.success({
        type: "success",
        message: "Loan fetched successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, loading: false });
    }
  },

  fetchLoanStatusById: async (appId: string) => {
    set({ loading: true, error: null, loanStatus: [] });
    try {
      const response = await API.get(
        `/mobixCamsLoan/v1/appraisals/validations/${appId}`
      );
      set({ loanStatus: response.data, loading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, loading: false });
    }
  },

  addLoan: async (loan: ILoan) => {
    set({ loading: true, error: null, loan: null });
    try {
      const response = await APIAuth.post("/mobixCamsLoan/v1/appraisals", loan);
      set({
        loan: response?.data?.data,
        loading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, loading: false });
    }
  },

  updateLoan: async (id: number, updatedLoan: ILoan) => {
    set({ loading: true, error: null });
    try {
      await API.put(`/loan/${id}`, updatedLoan);
      set((state) => ({
        loans: state.loans.map((loan) =>
          loan.id === id ? { ...loan, ...updatedLoan } : loan
        ),
        loading: false,
      }));
      notification.success({
        type: "success",
        message: "Loan updated successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, loading: false });
    }
  },

  fetchLiabilities: async (appId: string) => {
    set({ liabilityLoading: true, liabilityError: null });
    try {
      const response = await API.get(
        `/mobixCamsLoan/v1/liabilities/appraisals/${appId}`
      );
      set({
        liabilitie: response.data,
        liabilityLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ liabilityError: error.message, liabilityLoading: false });
    }
  },

  addLiability: async (AppLiabilities: AppLiabilities) => {
    set({ liabilityLoading: true, liabilityError: null });
    try {
      const response = await APIAuth.post(
        `/mobixCamsLoan/v1/liabilities`,
        AppLiabilities
      );
      set({
        liabilitie: response.data,
        liabilityLoading: false,
      });
      notification.success({
        type: "success",
        message: "Liability added successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ liabilityError: error.message, liabilityLoading: false });
    }
  },

  updateLiability: async (libIdx: string, updatedLiability: ILiability) => {
    set({ liabilityLoading: true, liabilityError: null });
    try {
      await APIAuth.put(
        `/mobixCamsLoan/v1/liabilities/${libIdx}`,
        updatedLiability
      );
      set((state) => ({
        liabilitie: {
          ...state.liabilitie,
          liabilities: state.liabilitie.liabilities.map((liability) =>
            liability.idx === libIdx
              ? { ...liability, ...updatedLiability }
              : liability
          ),
        },
        liabilityLoading: false,
      }));
      notification.success({
        type: "success",
        message: "Liability updated successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ liabilityError: error.message, liabilityLoading: false });
    }
  },

  deleteLiability: async (libIdx: string) => {
    set({ liabilityLoading: true, liabilityError: null });
    try {
      await APIAuth.put(`/mobixCamsLoan/v1/liabilities/${libIdx}/inactive`);
      set((state) => ({
        liabilitie: {
          ...state.liabilitie,
          liabilities: state.liabilitie.liabilities.filter(
            (liability) => liability.idx !== libIdx
          ),
        },
        liabilityLoading: false,
      }));
      notification.success({
        type: "success",
        message: "Liability deleted successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ liabilityError: error.message, liabilityLoading: false });
    }
  },

  // gold loan facilities
  fetchGoldLoanFacilities: async (appId: string) => {
    set({ goldLoanFacilitiesLoading: true, goldLoanFacilitiesError: null });
    try {
      const response = await API.get(
        `/mobixCamsLoan/v1/gold-loan-facilities/appraisals/${appId}`
      );
      set({
        goldLoanFacilities: response.data.data,
        goldLoanFacilitiesLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        goldLoanFacilitiesError: error.message,
        goldLoanFacilitiesLoading: false,
      });
    }
  },

  // /mobixCamsLoan/v1/gold-loan-facilities
  addGoldLoanFacilities: async (goldLoanFacilities: IGoldLoanFacilities) => {
    set({ goldLoanFacilitiesLoading: true, goldLoanFacilitiesError: null });
    try {
      await APIAuth.post(
        `/mobixCamsLoan/v1/gold-loan-facilities`,
        goldLoanFacilities
      );
      set({
        goldLoanFacilitiesLoading: false,
      });
      notification.success({
        type: "success",
        message: "Gold Loan Facilities added successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        goldLoanFacilitiesError: error.message,
        goldLoanFacilitiesLoading: false,
      });
    }
  },

  updateGoldLoanFacilities: async (
    goldId: string,
    updatedGoldLoanFacilities: IGoldLoanFacilities
  ) => {
    set({ goldLoanFacilitiesLoading: true, goldLoanFacilitiesError: null });
    try {
      await APIAuth.put(
        `/mobixCamsLoan/v1/gold-loan-facilities/${goldId}`,
        updatedGoldLoanFacilities
      );
      set(() => ({
        goldLoanFacilitiesLoading: false,
      }));
      notification.success({
        type: "success",
        message: "Gold Loan Facilities updated successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        goldLoanFacilitiesError: error.message,
        goldLoanFacilitiesLoading: false,
      });
    }
  },

  deleteGoldLoanFacilities: async (goldId: string) => {
    set({ goldLoanFacilitiesLoading: true, goldLoanFacilitiesError: null });
    try {
      await APIAuth.put(
        `/mobixCamsLoan/v1/gold-loan-facilities/${goldId}/inactive`
      );
      set(() => ({
        goldLoanFacilitiesLoading: false,
      }));
      notification.success({
        type: "success",
        message: "Gold Loan Facilities deleted successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        goldLoanFacilitiesError: error.message,
        goldLoanFacilitiesLoading: false,
      });
    }
  },

  fetchTermDepositByAppId: async (appId: string) => {
    set({ termDepositPlacedLoading: true, termDepositPlacedError: null });
    try {
      const response = await API.get(
        `/mobixCamsLoan/v1/term-deposits/appraisals/${appId}`
      );
      set({
        termDepositPlaced: response.data.data ?? [],
        termDepositPlacedLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        termDepositPlacedError: error.message,
        termDepositPlacedLoading: false,
      });
    }
  },

  addTermDepositPlaced: async (termDepositeData: ITermDepositPlaced) => {
    set({ termDepositPlacedLoading: true, termDepositPlacedError: null });
    try {
      await APIAuth.post(`/mobixCamsLoan/v1/term-deposits`, termDepositeData);
      set({
        termDepositPlacedLoading: false,
      });
      notification.success({
        type: "success",
        message: "Term Deposit Placed successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        termDepositPlacedError: error.message,
        termDepositPlacedLoading: false,
      });
    }
  },

  updateTermDepositPlaced: async (
    tdId: string,
    termDepositeData: ITermDepositPlaced
  ) => {
    set({ termDepositPlacedLoading: true, termDepositPlacedError: null });
    try {
      await APIAuth.put(
        `/mobixCamsLoan/v1/term-deposits/${tdId}`,
        termDepositeData
      );
      set(() => ({
        termDepositPlacedLoading: false,
      }));
      notification.success({
        type: "success",
        message: "Term Deposit Placed updated successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        termDepositPlacedError: error.message,
        termDepositPlacedLoading: false,
      });
    }
  },

  deleteTermDepositPlaced: async (tdId: string) => {
    set({ termDepositPlacedLoading: true, termDepositPlacedError: null });
    try {
      await APIAuth.put(`/mobixCamsLoan/v1/term-deposits/${tdId}/inactive`);
      set(() => ({
        termDepositPlacedLoading: false,
      }));
      notification.success({
        type: "success",
        message: "Term Deposit Placed deleted successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        termDepositPlacedError: error.message,
        termDepositPlacedLoading: false,
      });
    }
  },

  fetchProductDetails: async (
    productCode: string,
    subProductCode: string,
    refCode: string,
    currencyCode: string
  ) => {
    set({ productDetailsLoading: true, productDetailsError: null });
    try {
      const response = await API.get(
        `/mobixCamsLoan/v1/loans/product/${productCode}/${subProductCode}/${refCode}/${currencyCode}`
      );
      set({
        productDetails: response.data,
        productDetailsLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        productDetailsError: error.message,
        productDetailsLoading: false,
      });
    }
  },

  resetProductDetails: () => {
    set({
      productDetails: null,
      productDetailsLoading: false,
      productDetailsError: null,
    });
  },

  fetchPageableLoans: async (params = {}) => {
    set({ pageableLoading: true, pageableError: null });

    // Build query string from params
    const defaultParams = {
      status: "PENDING",
      appraisalId: "",
      fromDate: "",
      toDate: "",
      customerName: "",
      loanType: "",
      loanAmount: "",
      createdBy: "",
      unit: "IBU",
      page: 0,
      size: 7,
    };
    const query = new URLSearchParams({
      ...defaultParams,
      ...(Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ) as unknown as [string, string][]),
    }).toString();

    try {
      const response = await API.get(
        `/mobixCamsLoan/v1/loan-request/filters?${query}`
      );
      if (!response.data) {
        throw new Error("No data received from the server");
      }
      if (!response.data.content) {
        throw new Error("No content found in the response");
      }
      if (!response.data.pageable) {
        throw new Error("Pageable information is missing in the response");
      }
      const data: PagableResponse<ILoanApplication> = response.data;

      set({ pageableLoans: data, pageableLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        pageableError: error.message ?? "Failed to fetch loans",
        pageableLoading: false,
      });
    }
  },

  fetchLiabilityValidation: async (appId: string) => {
    set({ liabilityValidationLoading: true, liabilityValidationError: null });
    try {
      const response = await API.get(
        `/mobixCamsLoan/v1/liability-validations/appraisals/${appId}`
      );
      set({
        liabilityValidation: response.data.data ?? [],
        liabilityValidationLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        liabilityValidationError: error.message,
        liabilityValidationLoading: false,
      });
    }
  },

  addLiabilityValidation: async (payload: ILiabilityValidationPayload) => {
    set({ liabilityValidationLoading: true, liabilityValidationError: null });
    try {
      await APIAuth.post(`/mobixCamsLoan/v1/liability-validations`, payload);
      set({
        // liabilityValidation: response.data,
        liabilityValidationLoading: false,
      });
      notification.success({
        type: "success",
        message: "Liability Validation added successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        liabilityValidationError: error.message,
        liabilityValidationLoading: false,
      });
    }
  },

  fetchApplicationValidationsByAppId: async (appId: string) => {
    set({
      applicationValidationLoading: true,
      applicationValidationError: null,
    });

    try {
      const response = await APIAuth.get(
        `/mobixCamsLoan/v1/ibu-web-validations/${appId}`
      );
      set({
        applicationValidates: response.data ?? [],
        applicationValidationLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        applicationValidationLoading: false,
        applicationValidationError: error.message,
      });
    }
  },

  completeLoanApplication: async (payload: ICROCompletePayload) => {
    set({ loading: true, error: null });
    try {
      await APIAuth.post(
        `/mobixCamsLoan/v1/appraisals/${payload.appraisalIdx}/roles/${payload.role}/statues/${payload.status}`
      );
      set({ loading: false });
      notification.success({
        type: "success",
        message: "Loan application completed successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, loading: false });
    }
  },
}));

export default useLoanStore;
