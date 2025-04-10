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

interface IApprovalState {
  exceptionalApprovalCategories: IExceptionalApprovalCategory[];
  exceptionalApprovalCategoriesLoading: boolean;
  exceptionalApprovalCategoriesError: string | null;

  appraisalApprovalResponse: null;
  appraisalApprovalLoading: boolean;
  appraisalApprovalError: string | null;

  fetchExceptionalApprovalCategories: () => Promise<void>;
  requestExceptionalApproval: (
    payload: IExceptionalApprovalPayload
  ) => Promise<void>;
}

const useApprovalStore = create<IApprovalState>((set) => ({
  exceptionalApprovalCategories: [],
  exceptionalApprovalCategoriesLoading: false,
  exceptionalApprovalCategoriesError: null,

  appraisalApprovalResponse: null,
  appraisalApprovalLoading: false,
  appraisalApprovalError: null,

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
}));

export default useApprovalStore;
