import { create } from "zustand";
import { API, APIAuth } from "../services/api";
import { notification } from "antd";

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

  fetchLoans: () => Promise<void>;
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

  fetchLoans: async () => {
    set({ loading: true, error: null });
    try {
      const response = await API.get("/");
      set({ loans: response.data, loading: false });
      notification.success({
        type: "success",
        message: "Loans fetched successfully",
      });
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
      const response = await API.post("/mobixCamsLoan/v1/appraisals", loan);
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
        // goldLoanFacilities: response.data,
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
        // goldLoanFacilities: state.goldLoanFacilities.map((gold) =>
        //   gold.appraisalIdx === goldId
        //     ? { ...gold, ...updatedGoldLoanFacilities }
        //     : gold
        // ),
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

  // /mobixCamsLoan/v1/gold-loan-facilities/{gl_id}/inactive
  deleteGoldLoanFacilities: async (goldId: string) => {
    set({ goldLoanFacilitiesLoading: true, goldLoanFacilitiesError: null });
    try {
      await APIAuth.put(
        `/mobixCamsLoan/v1/gold-loan-facilities/${goldId}/inactive`
      );
      set(() => ({
        // goldLoanFacilities: state.goldLoanFacilities.filter(
        //   (gold) => gold.appraisalIdx !== goldId
        // ),
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
}));

export default useLoanStore;
