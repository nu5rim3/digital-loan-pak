import { create } from "zustand";
import { API } from "../services/api";

interface IWitness {
  appraisalID: string;
  idx: string | null;
  lastModifiedDate: string | null;
  modeOfSecurity: string | null;
  relationship: string | null;
  status: string | null;
  stkAge: string;
  stkCNic: string;
  stkCNicExpDate: string | null;
  stkCNicIssuedDate: string | null;
  stkCNicStatus: string | null;
  stkCusCode: string | null;
  stkCusName: string;
  stkDob: string | null;
  stkEduLevel: string | null;
  stkFatherOrHusName: string;
  stkGender: string | null;
  stkGrpRefNo: string | null;
  stkInitials: string | null;
  stkMaritialStatus: string | null;
  stkNumOfDependents: number | null;
  stkNumOfEarners: number | null;
  stkOrgType: string | null;
  stkOtherName: string | null;
  stkPhysDisability: string | null;
  stkPhysDisabilityDesce: string | null;
  stkSequence: string | null;
  stkSurName: string | null;
  stkTitle: string | null;
  stkType: string;
  currentResidences: string | null;
  maritalStatus: string;
  disabilityChecked: boolean;
  eduOther: boolean;
  new: boolean;
  update: boolean;
}

interface IWitnessState {
  witnesses: IWitness[];
  witness: IWitness | null;
  selectedWitness: IWitness | null;
  witnessLoading: boolean;
  witnessError: string | null;

  fetchWitness: () => Promise<void>;
  fetchWitnessByAppId: (appId: string) => Promise<void>;
  addWitness: (witness: IWitness) => Promise<void>;
  updateWitness: (idx: string, updatedUser: IWitness) => Promise<void>;
}

const useWitnessStore = create<IWitnessState>((set) => ({
  witnesses: [],
  witness: null,
  selectedWitness: null,
  witnessLoading: false,
  witnessError: null,

  fetchWitness: async () => {
    set({ witnessLoading: true, witnessError: null });
    try {
      const response = await API.get("/witness");
      set({ witnesses: response.data, witnessLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ witnessError: error.message, witnessLoading: false });
    }
  },

  fetchWitnessByAppId: async (appId: string) => {
    set({ witnessLoading: true, witnessError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/${appId}/type/witness`
      );
      set({ witnesses: response.data, witnessLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ witnessError: error.message, witnessLoading: false });
    }
  },

  addWitness: async (witness: IWitness) => {
    set({ witnessLoading: true, witnessError: null });
    try {
      const response = await API.post(
        "/mobixCamsClientele/v1/clienteles/witness",
        witness
      );
      set({ witnesses: response.data, witnessLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ witnessError: error.message, witnessLoading: false });
    }
  },

  updateWitness: async (idx: string, updatedUser: IWitness) => {
    set({ witnessLoading: true, witnessError: null });
    try {
      const response = await API.put(
        `/mobixCamsClientele/v1/clienteles/${idx}/type/witness`,
        updatedUser
      );
      set({ witnesses: response.data, witnessLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ witnessError: error.message, witnessLoading: false });
    }
  },
}));

export default useWitnessStore;
