import { create } from "zustand";
import { API, APIAuth } from "../services/api";

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
  code?: string;
}

interface IVerificationECIBResponse {
  status: string;
  clienteleIdx: string;
  creditHistory: string;
  outstandingLoan: string;
}

interface IfetchECIBReportByIdResponse {
  hasEcib: "Y" | "N";
}
interface IDualNumberCheck {
  cnicNo?: string;
  telNo?:string;
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
  ecribreport: IfetchECIBReportByIdResponse | null;
  ecribreportLoading: boolean;
  ecribreportError: string | null;

  dualNumberCheckError:string | null;
  dualNumberCheckLoading: boolean;
  dualNumberCheckData: any;

  fetchBlacklistByCnic: (cnic: string) => Promise<void>;
  fetchMSASByIdx: (cnic: string) => Promise<void>;
  fetchCRIBByCnic: (cnic: string) => Promise<void>;
  fetchECIBById: (cnic: string) => Promise<void>;
  fetchECIBReportById: (cnic: string) => Promise<void>;
  resetCRIBDetails: () => void;
  dualNumberCheck: (checkNumber: IDualNumberCheck) => Promise<void>;
  resetDualNumberDetails: () => void;


  resetAll: () => void;
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
  ecribreport: null,
  ecribreportLoading: false,
  ecribreportError: null,
  dualNumberCheckError:null,
  dualNumberCheckLoading:false,
  dualNumberCheckData:null,    

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
      const response = await APIAuth.get(
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
      if (response.data?.code === "000") {
        set({ cribDetails: response.data?.object, cribLoading: false });
        return;
      } else if (response.data?.code === "999") {
        set({ cribDetails: [], cribLoading: false });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, cribLoading: false });
    }
  },

  fetchECIBReportById: async (cnic: string) => {
    set({
      ecribreportLoading: true,
      ecribreportError: null,
      ecribreport: null,
    });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credit/ecib/reports/${cnic}`
      );
      set({ ecribreport: response.data, ecribreportLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({ ecribreportError: error.message, ecribreportLoading: false });
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
  
    dualNumberCheck: async (data: IDualNumberCheck) => {
        set({ dualNumberCheckLoading: true });
        try {
           const response = await APIAuth.post(
        "/mobixCamsClientele/v1/clienteles/dual-number-verifications",
        data
      );
         set({ dualNumberCheckData: response.data, dualNumberCheckLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ dualNumberCheckError: error.message, dualNumberCheckLoading: false });
        }
      },

  resetCRIBDetails: () =>
    set({ cribDetails: null, cribLoading: false, error: null }),
 resetDualNumberDetails: () =>
    set({ dualNumberCheckData: null, dualNumberCheckLoading: false, dualNumberCheckError: null }),
  resetAll: () =>
    set(() => ({
      blacklistDetails: null,
      msasDetails: null,
      cribDetails: null,
      ecibDetails: null,
      blLoading: false,
      msasLoading: false,
      cribLoading: false,
      ecibLoading: false,
      error: null,
      ecribreport: null,
      ecribreportLoading: false,
      ecribreportError: null,
    })),
}));

export default useVerificationStore;
