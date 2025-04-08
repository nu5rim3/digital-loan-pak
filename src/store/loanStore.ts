import { create } from "zustand";
import { API } from "../services/api";
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

interface ILoanState {
  loans: ILoan[];
  loanStatus: ILoanStatus[];
  loan: ILoanResponse | null;
  selectedLoan: ILoan | null;
  loading: boolean;
  error: string | null;

  fetchLoans: () => Promise<void>;
  fetchLoanById: (id: number) => Promise<void>;
  addLoan: (loan: ILoan) => Promise<void>;
  updateLoan: (id: number, updatedLoan: ILoan) => Promise<void>;
  fetchLoanStatusById: (appId: string) => Promise<void>;
  //   deleteLoan: (id: number) => Promise<void>;
}

const useLoanStore = create<ILoanState>((set) => ({
  loans: [],
  loanStatus: [],
  loan: null,
  selectedLoan: null,
  loading: false,
  error: null,

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
}));

export default useLoanStore;
