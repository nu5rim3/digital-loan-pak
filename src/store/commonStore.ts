import { create } from "zustand";
import { API } from "../services/api";
// import { notification } from "antd";

interface IOperator {
  vendorCode: string;
  vendorDesc: string;
  vendorTelcoCode: string;
  status: "A" | "I";
}

interface ICommonState {
  operators: IOperator[];
  operatorLoading: boolean;
  operatorError: string | null;

  ecibReportUrl: string | null;
  ecibReportLoading: boolean;
  ecibReportError: string | null;

  fetchOperators: () => Promise<void>;
  fetchECIBReport: (cnic: string) => Promise<void>;
}

const useCommonStore = create<ICommonState>((set) => ({
  operators: [],
  operatorLoading: false,
  operatorError: null,
  ecibReportError: null,
  ecibReportLoading: false,
  ecibReportUrl: null,

  fetchOperators: async () => {
    set({ operatorLoading: true, operatorError: null });
    try {
      const response = await API.get("/mobixCamsCommon/v1/sms/vendors");
      set({ operators: response.data, operatorLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ operatorError: error.message, operatorLoading: false });
    }
  },

  fetchECIBReport: async (cnic) => {
    set({
      ecibReportLoading: true,
      ecibReportError: null,
      ecibReportUrl: null,
    });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credit/ecib/resources/${cnic}`,
        { responseType: "arraybuffer" } // Important for binary PDF data
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);

      set({ ecibReportUrl: pdfUrl, ecibReportLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ ecibReportError: error.message, ecibReportLoading: false });
    }
  },
}));

export default useCommonStore;
