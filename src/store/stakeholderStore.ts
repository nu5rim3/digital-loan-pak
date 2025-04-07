import { create } from "zustand";
import { API } from "../services/api";
import { notification } from "antd";

export interface IStakeholder {
  appraisalID: string;
  idx: string;
  lastModifiedDate: string;
  modeOfSecurity: string;
  relationship: string;
  status: string;
  stkAge: string;
  stkCNic: string;
  stkCNicExpDate: string;
  stkCNicIssuedDate: string;
  stkCNicStatus: string;
  stkCusCode: string;
  stkCusName: string;
  stkDob: string;
  stkEduLevel: string;
  stkFatherOrHusName: string;
  stkGender: string;
  stkGrpRefNo: string;
  stkInitials: string;
  stkMaritialStatus: string;
  stkMaritialComment: string;
  stkNumOfDependents: string;
  stkNumOfEarners: string;
  stkOrgType: string;
  stkOtherName: string;
  stkPhysDisability: string;
  stkPhysDisabilityDesce: string;
  stkSequence: string;
  stkSurName: string;
  stkTitle: string;
  stkType: "C" | "W" | "G";
  currentResidences: string;
  maritalStatus: "MARRIED" | "SINGLE" | "DIVORCED" | "WIDOWED";
  disabilityChecked: boolean;
  eduOther: boolean;
  headOfFamily: string;
  houseHoldCont: string;
  healthCondition: string;
  currentResPlace: string;
  geoLocation: string;
  stkEmpNo: string;
  new: boolean;
  update: boolean;
}

interface IStackholderState {
  stakeholders: IStakeholder[];
  stakeholder: IStakeholder | null;
  selectedStakeholder: IStakeholder | null;
  stakeholderLoading: boolean;
  stakeholderError: string | null;

  //   fetchStakeholdes: () => Promise<void>;
  // fetchStakeholderById: (idx: string) => Promise<void>;
  // fetchStakeholderByCNIC: (cnic: string) => Promise<void>;
  addStakeholder: (stakeholder: IStakeholder) => Promise<void>;
  fetchStackholderByAppId: (appraisalId: string) => Promise<void>;
  updateStakeholder: (idx: string, updatedUser: IStakeholder) => Promise<void>;
}

const useStakeholderStore = create<IStackholderState>((set) => ({
  stakeholders: [],
  stakeholder: null,
  selectedStakeholder: null,
  stakeholderLoading: false,
  stakeholderError: null,

  //   fetchStakeholdes: async () => {
  //     set({ stakeholderLoading: true, stakeholderError: null });
  //     try {
  //       const response = await API.get("/stakeholders");
  //       set({ stakeholders: response.data, stakeholderLoading: false });
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     } catch (error: any) {
  //       set({ stakeholderError: error.message, stakeholderLoading: false });
  //     }
  //   },

  addStakeholder: async (stakeholder: IStakeholder) => {
    set({ stakeholderLoading: true, stakeholderError: null });
    try {
      const response = await API.post(
        "/mobixCamsClientele/v1/clienteles/stakeholder",
        stakeholder
      );
      set({ selectedStakeholder: response.data, stakeholderLoading: false });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Stakeholder Created successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ stakeholderError: error.message, stakeholderLoading: false });
    }
  },

  updateStakeholder: async (idx: string, updatedUser: IStakeholder) => {
    set({ stakeholderLoading: true, stakeholderError: null });
    try {
      const response = await API.put(
        `/mobixCamsClientele/v1/clienteles/stakeholder/${idx}`,
        updatedUser
      );
      set({ stakeholders: response.data, stakeholderLoading: false });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Stakeholder Updated successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ stakeholderError: error.message, stakeholderLoading: false });
    }
  },

  fetchStackholderByAppId: async (appraisalId: string) => {
    set({ stakeholderLoading: true, stakeholderError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/stakeholder/${appraisalId}/appraisal`
      );
      set({ stakeholders: response.data, stakeholderLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ stakeholderError: error.message, stakeholderLoading: false });
    }
  },
}));

export default useStakeholderStore;
