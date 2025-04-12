import { create, StateCreator } from "zustand";
import { persist, PersistOptions, PersistStorage } from "zustand/middleware";
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

interface ICommunity {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IArea {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IRelationship {
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

  communities: ICommunity[];
  communityLoading: boolean;
  communityError: string | null;

  areas: IArea[];
  areaLoading: boolean;
  areaError: string | null;

  relationship: IRelationship[];
  relationshipLoading: boolean;
  relationshipError: string | null;

  fetchOperators: () => Promise<void>;
  fetchECIBReport: (cnic: string) => Promise<void>;
  fetchOrganizationType: () => Promise<void>;
  fetchCNICStaus: () => Promise<void>;
  fetchEducationLevel: () => Promise<void>;
  fetchHeadOfFamily: () => Promise<void>;
  fetchHealthCondition: () => Promise<void>;
  fetchResidenceType: () => Promise<void>;
  fetchCommunities: () => Promise<void>;
  fetchAreas: () => Promise<void>;
  fetchRelationship: () => Promise<void>;
}

type TPersist = (
  config: StateCreator<ICommonState>,
  options: PersistOptions<ICommonState>
) => StateCreator<ICommonState>;

const localStorageWrapper: PersistStorage<ICommonState> = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

const useCommonStore = create<ICommonState>(
  (persist as TPersist)(
    (set) => ({
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

      communities: [],
      communityLoading: false,
      communityError: null,

      areas: [],
      areaLoading: false,
      areaError: null,

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

      fetchECIBReport: async (cnic: string) => {
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
          const response = await API.get(
            "/mobixCamsCommon/v1/education-levels"
          );
          set({ educationLevel: response.data, educationLevelLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            educationLevelError: error.message,
            educationLevelLoading: false,
          });
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
          set({
            healthCondition: response.data,
            healthConditionLoading: false,
          });
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
          const response = await API.get(
            "/mobixCamsCommon/v1/residential-types"
          );
          set({ residenceType: response.data, residenceTypeLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            residenceTypeError: error.message,
            residenceTypeLoading: false,
          });
        }
      },

      fetchCommunities: async () => {
        set({ communityLoading: true, communityError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/communities");
          set({ communities: response.data, communityLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ communityError: error.message, communityLoading: false });
        }
      },

      // /mobixCamsCommon/v1/cities/areas
      fetchAreas: async () => {
        set({ areaLoading: true, areaError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/cities/areas");
          set({ areas: response.data, areaLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ areaError: error.message, areaLoading: false });
        }
      },

      fetchRelationship: async () => {
        set({ relationshipLoading: true, relationshipError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/fml-details");
          set({ relationship: response.data, relationshipLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            relationshipError: error.message,
            relationshipLoading: false,
          });
        }
      },
    }),

    {
      name: "common-store", // unique name
      storage: localStorageWrapper, // custom storage wrapper
      partialize: (state) => ({
        ...state,
        areas: state.areas,
        communities: state.communities,
        residenceType: state.residenceType,
        healthCondition: state.healthCondition,
        headOfFamily: state.headOfFamily,
        educationLevel: state.educationLevel,
      }),
    }
  )
);

export default useCommonStore;
