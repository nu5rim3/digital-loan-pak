import { create } from "zustand";
import { API } from "../services/api";

interface IVerificationBlacklistResponse {
  cnicNo: string;
  blacklistStatus: "REJECT" | "APPROVE";
  blacklistReason: string;
  blacklistedDate: string;
  blacklistedUser: string;
  rejectClientName: string;
  detail: string;
  message: string;
}

interface IVerificationMSASResponse {
  clientele: {
    idx: string;
    appraisalId: string;
    type: string;
    identificationNumber: string;
    identificationType: string;
    fullName: string;
    contactNumber: string;
    sequence: number;
    status: string;
    loanAmount: string | null;
    createdBy: string;
    creationDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
  };
  rules: {
    name: string;
    description: string;
    status: string;
  }[];
  status: string | null;
  msasDetailsDto: string | null;
}

interface IVerificationCRIBResponse {
  clientName: string;
  clientType: string;
  contractNo: string;
  contractStatus: string;
  payType: string;
  rentsPaid: string;
  companyCode: string;
  assetType: string;
  leasedValue: string;
  currentRent: string;
  futureRent: string;
  totalDues: string;
  overdueInterest: string;
  nofInstallmentsArrears: string;
  contractExpiryDate: string;
  detail: string;
  message: string;
}

interface IVerificationECIBResponse {
  status: string;
  clienteleIdx: string;
  creditHistory: string;
  outstandingLoan: string;
}

interface IVerificationState {
  blacklistDetails: IVerificationBlacklistResponse | null;
  msasDetails: IVerificationMSASResponse | null;
  cribDetails: IVerificationCRIBResponse[] | null;
  ecibDetails: IVerificationECIBResponse | null;
  blLoading: boolean;
  msasLoading: boolean;
  cribLoading: boolean;
  ecibLoading: boolean;
  error: string | null;

  fetchBlacklistByCnic: (cnic: string) => Promise<void>;
  fetchMSASByIdx: (cnic: string) => Promise<void>;
  fetchCRIBByCnic: (cnic: string) => Promise<void>;
  fetchECIBById: (cnic: string) => Promise<void>;
  resetCRIBDetails: () => void;
}

const useVerificationStore = create<IVerificationState>((set) => ({
  blacklistDetails: null,
  msasDetails: null,
  cribDetails: null,
  ecibDetails: null,
  blLoading: false,
  msasLoading: false,
  cribLoading: false,
  ecibLoading: false,
  error: null,

  fetchBlacklistByCnic: async (cnic: string) => {
    set({ blLoading: true, error: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/blacklist/${cnic}`
      );
      set({ blacklistDetails: response.data?.object, blLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, blLoading: false });
    }
  },

  fetchMSASByIdx: async (idx: string) => {
    set({ msasLoading: true, error: null, msasDetails: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/verifications/get-by-clientele/${idx}`
      );
      set({ msasDetails: response.data, msasLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, msasLoading: false });
    }
  },

  fetchCRIBByCnic: async (cnic: string) => {
    set({ cribLoading: true, error: null });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credits/crib/internal/${cnic}`
      );
      set({ cribDetails: response.data?.object, cribLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, cribLoading: false });
    }
  },

  fetchECIBById: async (idx: string) => {
    set({ ecibLoading: true, error: null, ecibDetails: null });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credits/crib/external/clientele/${idx}`
      );
      set({ ecibDetails: response.data, ecibLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, ecibLoading: false });
    }
  },

  resetCRIBDetails: () =>
    set({ cribDetails: null, cribLoading: false, error: null }),
}));

export default useVerificationStore;
