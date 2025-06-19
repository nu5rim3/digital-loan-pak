import { create } from "zustand";
import { API, APIAuth } from "../services/api";

interface IExceptionalApprovalCategory {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IExceptionalApprovalPayload {
  appraisalIdx: string;
  type: string;
  category: string;
  remark: string;
  roleCode: string;
  role: string;
  categoryDec: string;
}

interface IOBExceptionalPayload {
  appraisalIdx: string;
  type: string;
  remark: string;
  clienteleIdx: string;
}

interface IApproval {
  idx: string;
  appraisalIdx: string;
  type: string;
  category: string;
  categoryDec: string;
  remark: string;
  roleCode: string;
  role: string;
  status: string;
  createdBy: string;
  creationDate: number;
  lastModifiedBy: string;
  lastModifiedDate: number;
  actionPerson: string | null;
  actionDate: number | null;
  comments: string | null;
}

interface IApprovalState {
  exceptionalApprovalCategories: IExceptionalApprovalCategory[];
  exceptionalApprovalCategoriesLoading: boolean;
  exceptionalApprovalCategoriesError: string | null;

  appraisalApprovalResponse: null;
  appraisalApprovalLoading: boolean;
  appraisalApprovalError: string | null;

  ExceptionalApprovalPerson: null;
  ExceptionalApprovalPersonLoading: boolean;
  ExceptionalApprovalPersonError: null;

  approvals: IApproval[];
  approvalsLoading: boolean;
  approvalsError: string | null;

  obExceptionalApprovalResponse: null;
  obExceptionalApprovalLoading: boolean;
  obExceptionalApprovalError: string | null;

  fetchExceptionalApprovalCategories: () => Promise<void>;
  requestExceptionalApproval: (
    payload: IExceptionalApprovalPayload
  ) => Promise<void>;
  fetchExceptionalApprovalPerson: (category: string) => Promise<void>;
  fetchApprovals: (appraisalIdx: string) => Promise<void>;
  deleteApproval: (idx: string) => Promise<void>;
  obExceptionalApproval: (payload: IOBExceptionalPayload) => Promise<void>;
}

const useApprovalStore = create<IApprovalState>((set) => ({
  exceptionalApprovalCategories: [],
  exceptionalApprovalCategoriesLoading: false,
  exceptionalApprovalCategoriesError: null,

  appraisalApprovalResponse: null,
  appraisalApprovalLoading: false,
  appraisalApprovalError: null,

  ExceptionalApprovalPerson: null,
  ExceptionalApprovalPersonLoading: false,
  ExceptionalApprovalPersonError: null,

  approvals: [],
  approvalsLoading: false,
  approvalsError: null,

  obExceptionalApprovalResponse: null,
  obExceptionalApprovalLoading: false,
  obExceptionalApprovalError: null,

  fetchExceptionalApprovalCategories: async () => {
    set({
      exceptionalApprovalCategoriesLoading: true,
      exceptionalApprovalCategoriesError: null,
    });
    try {
      const response = await API.get(
        `/mobixCamsCommon/v1/exceptional-approval-categories`
      );
      set({
        exceptionalApprovalCategories: response.data,
        exceptionalApprovalCategoriesLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        exceptionalApprovalCategoriesError: error.message,
        exceptionalApprovalCategoriesLoading: false,
      });
    }
  },

  requestExceptionalApproval: async (payload) => {
    set({
      appraisalApprovalLoading: true,
      appraisalApprovalError: null,
      appraisalApprovalResponse: null,
    });
    try {
      const response = await APIAuth.post(
        `/mobixCamsApproval/v1/approvals/appraisal`,
        payload
      );
      set({
        appraisalApprovalResponse: response.data,
        appraisalApprovalLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        appraisalApprovalError: error.message,
        appraisalApprovalLoading: false,
      });
    }
  },

  fetchExceptionalApprovalPerson: async (category: string) => {
    set({
      ExceptionalApprovalPersonLoading: true,
      ExceptionalApprovalPersonError: null,
    });

    try {
      const response = await API.get(
        `/mobixCamsCommon/v1/exceptional-approval-categories/${category}`
      );
      set({
        ExceptionalApprovalPerson: response.data,
        ExceptionalApprovalPersonLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        ExceptionalApprovalPersonError: error.message,
        ExceptionalApprovalPersonLoading: false,
      });
    }
  },

  fetchApprovals: async (appraisalIdx: string) => {
    set({
      approvalsLoading: true,
      approvalsError: null,
    });

    try {
      const response = await API.get(
        `/mobixCamsApproval/v1/approvals/appraisal/${appraisalIdx}`
      );
      set({
        approvals: response.data,
        approvalsLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        approvalsError: error.message,
        approvalsLoading: false,
      });
    }
  },

  deleteApproval: async (idx: string) => {
    set({
      appraisalApprovalLoading: true,
      appraisalApprovalError: null,
    });
    try {
      await APIAuth.put(
        `/mobixCamsApproval/v1/approvals/appraisal/${idx}/inactive`
      );
      set({
        appraisalApprovalLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        appraisalApprovalError: error.message,
        appraisalApprovalLoading: false,
      });
    }
  },

  obExceptionalApproval: async (payload) => {
    set({
      obExceptionalApprovalLoading: true,
      obExceptionalApprovalError: null,
      obExceptionalApprovalResponse: null,
    });
    try {
      const response = await APIAuth.post(
        `/mobixCamsApproval/v1/approvals/on-boarding`,
        payload
      );
      set({
        obExceptionalApprovalResponse: response.data,
        obExceptionalApprovalLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        obExceptionalApprovalError: error.message,
        obExceptionalApprovalLoading: false,
      });
    }
  },
}));

export default useApprovalStore;
