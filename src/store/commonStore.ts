import { create } from "zustand";
import { API } from "../services/api";
// import { notification } from "antd";

interface IOperator {
  vendorCode: string;
  vendorDesc: string;
  vendorTelcoCode: string;
  status: "A" | "I";
}

interface IOrganizationType {
  code: string;
  description: string;
  status: "A" | "I";
}

interface ICnicType {
  code: string;
  description: string;
}

interface IEducationLevel {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IHeadofFamily {
  productCode: string;
  code: string;
  description: string;
  creditScore: string;
  status: "A" | "I";
}

interface IHealthCondition {
  productCode: string;
  code: string;
  description: string;
  creditScore: string;
  status: "A" | "I";
}

interface IResidenceType {
  code: string;
  description: string;
  status: "A" | "I";
}

interface ICommonState {
  operators: IOperator[];
  operatorLoading: boolean;
  operatorError: string | null;

  ecibReportUrl: string | null;
  ecibReportLoading: boolean;
  ecibReportError: string | null;

  organizationType: IOrganizationType[];
  organizationTypeLoading: boolean;
  organizationTypeError: string | null;

  cnicStaus: ICnicType[];
  cnicStausLoading: boolean;
  cnicStausError: string | null;

  educationLevel: IEducationLevel[];
  educationLevelLoading: boolean;
  educationLevelError: string | null;

  headOfFamily: IHeadofFamily[];
  headOfFamilyLoading: boolean;
  headOfFamilyError: string | null;

  healthCondition: IHealthCondition[];
  healthConditionLoading: boolean;
  healthConditionError: string | null;

  residenceType: IResidenceType[];
  residenceTypeLoading: boolean;
  residenceTypeError: string | null;

  fetchOperators: () => Promise<void>;
  fetchECIBReport: (cnic: string) => Promise<void>;
  fetchOrganizationType: () => Promise<void>;
  fetchCNICStaus: () => Promise<void>;
  fetchEducationLevel: () => Promise<void>;
  fetchHeadOfFamily: () => Promise<void>;
  fetchHealthCondition: () => Promise<void>;
  fetchResidenceType: () => Promise<void>;
}

const useCommonStore = create<ICommonState>((set) => ({
  operators: [],
  operatorLoading: false,
  operatorError: null,

  ecibReportError: null,
  ecibReportLoading: false,
  ecibReportUrl: null,

  organizationType: [],
  organizationTypeLoading: false,
  organizationTypeError: null,

  cnicStaus: [],
  cnicStausLoading: false,
  cnicStausError: null,

  educationLevel: [],
  educationLevelLoading: false,
  educationLevelError: null,

  headOfFamily: [],
  headOfFamilyLoading: false,
  headOfFamilyError: null,

  healthCondition: [],
  healthConditionLoading: false,
  healthConditionError: null,

  residenceType: [],
  residenceTypeLoading: false,
  residenceTypeError: null,

  relationship: [],
  relationshipLoading: false,
  relationshipError: null,

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

  fetchOrganizationType: async () => {
    set({ operatorLoading: true, operatorError: null });
    try {
      const response = await API.get("/mobixCamsCommon/v1/organizations");
      set({
        organizationType: response.data,
        organizationTypeLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ organizationTypeError: error.message, operatorLoading: false });
    }
  },

  fetchCNICStaus: async () => {
    set({ cnicStausLoading: true, cnicStausError: null });
    try {
      const response = await API.get("/mobixCamsCommon/v1/cnic-status");
      set({ cnicStaus: response.data, cnicStausLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ cnicStausError: error.message, cnicStausLoading: false });
    }
  },

  fetchEducationLevel: async () => {
    set({ educationLevelLoading: true, educationLevelError: null });
    try {
      const response = await API.get("/mobixCamsCommon/v1/education-levels");
      set({ educationLevel: response.data, educationLevelLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ educationLevelError: error.message, educationLevelLoading: false });
    }
  },

  fetchHeadOfFamily: async () => {
    set({ headOfFamilyLoading: true, headOfFamilyError: null });
    try {
      const response = await API.get("/mobixCamsCommon/v1/fml-heads");
      set({ headOfFamily: response.data, headOfFamilyLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ headOfFamilyError: error.message, headOfFamilyLoading: false });
    }
  },

  fetchHealthCondition: async () => {
    set({ healthConditionLoading: true, healthConditionError: null });
    try {
      const response = await API.get(
        "/mobixCamsCommon/v1/health-conditions/products/IE"
      );
      set({ healthCondition: response.data, healthConditionLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        healthConditionError: error.message,
        healthConditionLoading: false,
      });
    }
  },

  fetchResidenceType: async () => {
    set({ residenceTypeLoading: true, residenceTypeError: null });
    try {
      const response = await API.get("/mobixCamsCommon/v1/residential-types");
      set({ residenceType: response.data, residenceTypeLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ residenceTypeError: error.message, residenceTypeLoading: false });
    }
  },
}));

export default useCommonStore;
