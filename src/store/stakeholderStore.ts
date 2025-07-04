import { create } from "zustand";
import { API, APIAuth } from "../services/api";
import { notification } from "antd";
import { getStakeholderByType } from "../utils/stakholderFunction";

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
  stkMaritialStatus:
    | string
    | "MARRIED"
    | "SINGLE"
    | "DIVORCED"
    | "WIDOWED"
    | null;
  maritalStatus: string | "MARRIED" | "SINGLE" | "DIVORCED" | "WIDOWED" | null;
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
  stkType: "C" | "W" | "G" | "BI";
  currentResidences: string;
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

export interface IContactDetails {
  phoneNoType: string | "Home" | "Mobile";
  phoneNo: string;
  status?: string;
  idx?: string;
}
export interface IAddressDetails {
  idx: string;
  addressType: "PERMANANT" | "TEMPORARY" | "OTHER"; // Use a union type for predefined values
  addressLine1: string;
  addressLine2?: string | null; // Optional line
  addressLine3?: string | null; // Optional line
  addressLine4?: string | null; // Optional line
  area: string;
  city: string;
  district: string;
  province: string;
  community: string;
  nearByPopPlc: string;
  durOfCurrLoc: string; // Duration as a string (e.g., "2Y,10M")
  residenceType: "O" | "R" | "C" | "P" | "T"; // O = Own, R = Rent, C = Company, P = Parent, T = Other
  status: "A" | "I"; // Active (A) or Inactive (I)
  createdBy?: string;
  creationDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface IRecipient {
  idx?: string;
  recipientName: string | null;
  relationship: string;
  cNicNo: string;
  phoneNo: string;
  status?: "A" | "I";
  createdBy?: string;
  creationDate?: string; // ISO date string
  lastModifiedBy?: string;
  lastModifiedDate?: string; // ISO date string
  isBorrowerRelatedParty: string | "Y" | "N";
}

export interface IOtherInfo {
  idx?: string;
  occupation: string;
  howDidYouKnow: string;
  prefLang: string;
  sector: string;
  subSector?: string;
  savingsReq: string;
  poliExpo: string;
  status?: string;
  createdBy?: string;
  creationDate?: string; // ISO string format for date
  lastModifiedBy?: string;
  lastModifiedDate?: string; // ISO string format for date
}

export interface IPDCDetails {
  idx?: string;
  bank: string;
  chequeNo: string;
  accountNo: string;
  accountTitle: string;
  status?: string;
  createdBy?: string;
  creationDate?: string; // ISO string format for date
  lastModifiedBy?: string;
  lastModifiedDate?: string; // ISO string format for date
}

export interface IIncomeDetails {
  idx?: string;
  sourceOfIncome: string;
  monthlyIncome: string;
  assetsDesc: string;
  totValAssets: string;
  totMonIncome: string;
  status?: string;
  createdBy?: string;
  creationDate?: string; // ISO date string
  lastModifiedBy?: string;
  lastModifiedDate?: string; // ISO date string
}
interface IStackholderState {
  stakeholders: IStakeholder[];
  stakeholder: IStakeholder | null;
  customerStakeholder: IStakeholder | IStakeholder[] | null;
  guarantorStakeholder: IStakeholder | IStakeholder[] | null;
  witnessStakeholder: IStakeholder | IStakeholder[] | null;
  selectedStakeholder: IStakeholder | null;
  stakeholderLoading: boolean;
  stakeholderError: string | null;

  contactDetails: IContactDetails[];
  contactDetail: IContactDetails | null;
  contactDetailsLoading: boolean;
  contactDetailsError: string | null;

  addressDetails: IAddressDetails[];
  addressDetailsLoading: boolean;
  addressDetailsError: string | null;

  recipients: IRecipient[];
  recipientLoading: boolean;
  recipientError: string | null;

  otherInfo: IOtherInfo[];
  otherInfoLoading: boolean;
  otherInfoError: string | null;

  PDCDetails: IPDCDetails[];
  pdcDetailsLoading: boolean;
  pdcDetailsError: string | null;

  incomesDetails: IIncomeDetails[];
  incomeDetailsLoading: boolean;
  incomeDetailsError: string | null;

  qrdetails: {
    qrImageUrl: string;
  };
  qrdetailsLoading: boolean;
  qrdetailsError: string | null;

  //   fetchStakeholdes: () => Promise<void>;
  // fetchStakeholderById: (idx: string) => Promise<void>;
  // fetchStakeholderByCNIC: (cnic: string) => Promise<void>;
  addStakeholder: (stakeholder: IStakeholder) => Promise<void>;
  fetchStackholderByAppId: (appraisalId: string) => Promise<void>;
  updateStakeholder: (idx: string, updatedUser: IStakeholder) => Promise<void>;
  deleteStakeholder: (idx: string) => Promise<void>;
  resetStakeholder: () => void;

  fetchContactDetailsByStkId: (stkId: string) => Promise<void>;
  addContactDetail: (
    stkId: string,
    contactDetail: IContactDetails[]
  ) => Promise<void>;
  updateContactDetail: (
    conId: string,
    contactDetail: IContactDetails
  ) => Promise<void>;
  inActivateContactDetail: (conId: string) => Promise<void>;

  fetchAddressDetailsByStkId: (stkId: string) => Promise<void>;
  addAddressDetail: (
    stkId: string,
    addressDetail: IAddressDetails[]
  ) => Promise<void>;
  updateAddressDetail: (
    resId: string,
    addressDetail: IAddressDetails
  ) => Promise<void>;
  inActivateAddressDetail: (resId: string) => Promise<void>;

  fetchRecipientByStkId: (stkId: string) => Promise<void>;
  addRecipient: (stkId: string, recipientDetails: IRecipient) => Promise<void>;
  updateRecipient: (idx: string, recipientDetails: IRecipient) => Promise<void>;

  fetchOtherInfoByStkId: (stkId: string) => Promise<void>;
  addOtherInfo: (stkId: string, otherInfo: IOtherInfo) => Promise<void>;
  updateOtherInfo: (othId: string, otherInfo: IOtherInfo) => Promise<void>;

  fetchPDCDetailsByStkId: (stkId: string) => Promise<void>;
  addPDCDetail: (stkId: string, pdcDetails: IPDCDetails) => Promise<void>;
  updatePDCDetail: (pdId: string, pdcDetails: IPDCDetails) => Promise<void>;
  deletePDCDetail: (pdId: string) => Promise<void>;

  fetchIncomeDetailsByStkId: (stkId: string) => Promise<void>;
  addIncomeDetail: (
    stkId: string,
    incomeDetails: IIncomeDetails
  ) => Promise<void>;
  updateIncomeDetail: (
    incId: string,
    incomeDetails: IIncomeDetails
  ) => Promise<void>;

  getStakeHolderByCNIC: (cnic: string) => Promise<void>;
  getQRDetailsByStkId: (cliIdx: string) => Promise<void>;
}

const useStakeholderStore = create<IStackholderState>((set) => ({
  stakeholders: [],
  stakeholder: null,
  customerStakeholder: null,
  guarantorStakeholder: null,
  witnessStakeholder: null,
  selectedStakeholder: null,
  stakeholderLoading: false,
  stakeholderError: null,

  contactDetails: [],
  contactDetail: null,
  customerContactDetails: null,
  guarantorContactDetails: null,
  witnessContactDetails: null,
  contactDetailsLoading: false,
  contactDetailsError: null,

  addressDetails: [],
  addressDetailsLoading: false,
  addressDetailsError: null,

  recipients: [],
  recipientLoading: false,
  recipientError: null,

  otherInfo: [],
  otherInfoLoading: false,
  otherInfoError: null,

  PDCDetails: [],
  pdcDetailsLoading: false,
  pdcDetailsError: null,

  incomesDetails: [],
  incomeDetailsLoading: false,
  incomeDetailsError: null,

  qrdetails: {
    qrImageUrl: "",
  },
  qrdetailsLoading: false,
  qrdetailsError: null,

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
      const response = await APIAuth.post(
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
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/stakeholder/${idx}`,
        updatedUser
      );
      set({ selectedStakeholder: response.data, stakeholderLoading: false });
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

  deleteStakeholder: async (idx: string) => {
    set({ stakeholderLoading: true, stakeholderError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/stakeholder/${idx}/inactive`
      );
      set({ stakeholderLoading: false });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Stakeholder Deleted successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ stakeholderError: error.message, stakeholderLoading: false });
    }
  },

  fetchStackholderByAppId: async (appraisalId: string) => {
    set({
      stakeholderLoading: true,
      stakeholderError: null,
      customerStakeholder: null,
      guarantorStakeholder: null,
      witnessStakeholder: null,
    });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/stakeholder/${appraisalId}/appraisal`
      );
      set({
        stakeholders: response.data,
        customerStakeholder: getStakeholderByType("C", response.data),
        guarantorStakeholder: getStakeholderByType("G", response.data),
        witnessStakeholder: getStakeholderByType("W", response.data),
        stakeholderLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ stakeholderError: error.message, stakeholderLoading: false });
    }
  },

  fetchContactDetailsByStkId: async (stkId: string) => {
    set({ contactDetailsLoading: true, contactDetailsError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/contacts/${stkId}`
      );
      set({
        contactDetails: response.data,
        contactDetailsLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ contactDetailsError: error.message, contactDetailsLoading: false });
    }
  },

  addContactDetail: async (stkId: string, contactDetail: IContactDetails[]) => {
    set({ contactDetailsLoading: true, contactDetailsError: null });
    try {
      const response = await APIAuth.post(
        `/mobixCamsClientele/v1/clienteles/contacts/${stkId}`,
        contactDetail
      );
      set({
        contactDetails: response.data,
        contactDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Contact Detail Created successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ contactDetailsError: error.message, contactDetailsLoading: false });
    }
  },

  updateContactDetail: async (
    conId: string,
    contactDetail: IContactDetails
  ) => {
    set({ contactDetailsLoading: true, contactDetailsError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/contacts/${conId}`,
        contactDetail
      );
      set({
        contactDetail: response.data,
        contactDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Contact Detail Updated successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ contactDetailsError: error.message, contactDetailsLoading: false });
    }
  },

  inActivateContactDetail: async (conId: string) => {
    set({ contactDetailsLoading: true, contactDetailsError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/contacts/${conId}/inactive`
      );
      set({
        // contactDetails: response.data,
        contactDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Contact Detail Deleted successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ contactDetailsError: error.message, contactDetailsLoading: false });
    }
  },

  fetchAddressDetailsByStkId: async (stkId: string) => {
    set({ addressDetailsLoading: true, addressDetailsError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/residence/${stkId}`
      );
      set({
        addressDetails: response.data,
        addressDetailsLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ addressDetailsError: error.message, addressDetailsLoading: false });
    }
  },

  addAddressDetail: async (
    stkId: string,
    addAddressDetail: IAddressDetails[]
  ) => {
    set({ addressDetailsLoading: true, addressDetailsError: null });
    try {
      const response = await APIAuth.post(
        `/mobixCamsClientele/v1/clienteles/residence/${stkId}`,
        addAddressDetail
      );
      set({
        addressDetails: response.data,
        addressDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Address Detail Created successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ addressDetailsError: error.message, addressDetailsLoading: false });
    }
  },

  updateAddressDetail: async (
    resId: string,
    addressDetail: IAddressDetails
  ) => {
    set({ addressDetailsLoading: true, addressDetailsError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/residence/${resId}`,
        addressDetail
      );
      set({
        // addressDetails: response.data,
        addressDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Address Detail Updated successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ addressDetailsError: error.message, addressDetailsLoading: false });
    }
  },

  inActivateAddressDetail: async (resId: string) => {
    set({ addressDetailsLoading: true, addressDetailsError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/residence/${resId}/inactive`
      );
      set({
        // addressDetails: response.data,
        addressDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Address Detail Deleted successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ addressDetailsError: error.message, addressDetailsLoading: false });
    }
  },

  fetchRecipientByStkId: async (stkId: string) => {
    set({ recipientLoading: true, recipientError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/recipient/${stkId}`
      );
      set({
        recipients: response.data,
        recipientLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ recipientError: error.message, recipientLoading: false });
    }
  },

  addRecipient: async (stkId: string, recipientDetails: IRecipient) => {
    set({ recipientLoading: true, recipientError: null });
    try {
      const response = await APIAuth.post(
        `/mobixCamsClientele/v1/clienteles/recipient/${stkId}`,
        recipientDetails
      );
      set({
        // recipients: response.data,
        recipientLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Recipient Detail Created successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ recipientError: error.message, recipientLoading: false });
    }
  },

  updateRecipient: async (recId: string, recipientDetails: IRecipient) => {
    set({ recipientLoading: true, recipientError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/recipient/${recId}`,
        recipientDetails
      );
      set({
        // recipients: response.data,
        recipientLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Recipient Detail Updated successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ recipientError: error.message, recipientLoading: false });
    }
  },

  fetchOtherInfoByStkId: async (stkId: string) => {
    set({ otherInfoLoading: true, otherInfoError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/other/${stkId}`
      );
      set({
        otherInfo: response.data,
        otherInfoLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ otherInfoError: error.message, otherInfoLoading: false });
    }
  },

  addOtherInfo: async (stkId: string, otherInfo: IOtherInfo) => {
    set({ otherInfoLoading: true, otherInfoError: null });
    try {
      const response = await APIAuth.post(
        `/mobixCamsClientele/v1/clienteles/other/${stkId}`,
        otherInfo
      );
      set({
        // otherInfo: response.data,
        otherInfoLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Other Info Created successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ otherInfoError: error.message, otherInfoLoading: false });
    }
  },

  updateOtherInfo: async (othId: string, otherInfo: IOtherInfo) => {
    set({ otherInfoLoading: true, otherInfoError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/other/${othId}`,
        otherInfo
      );
      set({
        // otherInfo: response.data,
        otherInfoLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Other Info Updated successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ otherInfoError: error.message, otherInfoLoading: false });
    }
  },

  fetchPDCDetailsByStkId: async (stkId: string) => {
    set({ pdcDetailsLoading: true, pdcDetailsError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/pdc/${stkId}`
      );
      set({
        PDCDetails: response.data,
        pdcDetailsLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ pdcDetailsError: error.message, pdcDetailsLoading: false });
    }
  },

  addPDCDetail: async (stkId: string, pdcDetails: IPDCDetails) => {
    set({ pdcDetailsLoading: true, pdcDetailsError: null });
    try {
      const response = await APIAuth.post(
        `/mobixCamsClientele/v1/clienteles/pdc/${stkId}`,
        pdcDetails
      );
      set({
        // PDCDetails: response.data,
        pdcDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "PDC Detail Created successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ pdcDetailsError: error.message, pdcDetailsLoading: false });
    }
  },

  updatePDCDetail: async (pdId: string, pdcDetails: IPDCDetails) => {
    set({ pdcDetailsLoading: true, pdcDetailsError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/pdc/${pdId}`,
        pdcDetails
      );
      set({
        // PDCDetails: response.data,
        pdcDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "PDC Detail Updated successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ pdcDetailsError: error.message, pdcDetailsLoading: false });
    }
  },

  deletePDCDetail: async (pdId: string) => {
    set({ pdcDetailsLoading: true, pdcDetailsError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/pdc/${pdId}/inactive`
      );
      set({
        // PDCDetails: response.data,
        pdcDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "PDC Detail Deleted successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ pdcDetailsError: error.message, pdcDetailsLoading: false });
    }
  },

  fetchIncomeDetailsByStkId: async (stkId: string) => {
    set({ incomeDetailsLoading: true, incomeDetailsError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/guarantor/income/${stkId}`
      );
      set({
        incomesDetails: response.data,
        incomeDetailsLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ incomeDetailsError: error.message, incomeDetailsLoading: false });
    }
  },

  updateIncomeDetail: async (incId: string, incomeDetails: IIncomeDetails) => {
    set({ incomeDetailsLoading: true, incomeDetailsError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsClientele/v1/clienteles/guarantor/income/${incId}`,
        incomeDetails
      );
      set({
        // incomesDetails: response.data,
        incomeDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Income Detail Updated successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ incomeDetailsError: error.message, incomeDetailsLoading: false });
    }
  },

  addIncomeDetail: async (stkId: string, incomeDetails: IIncomeDetails) => {
    set({ incomeDetailsLoading: true, incomeDetailsError: null });
    try {
      const response = await APIAuth.post(
        `/mobixCamsClientele/v1/clienteles/guarantor/income/${stkId}`,
        incomeDetails
      );
      set({
        // incomesDetails: response.data,
        incomeDetailsLoading: false,
      });
      notification.success({
        message: "Success",
        description:
          response.data.message ?? "Income Detail Created successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ incomeDetailsError: error.message, incomeDetailsLoading: false });
    }
  },

  getStakeHolderByCNIC: async (cnic: string) => {
    set({ stakeholderLoading: true, stakeholderError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/identifiers/${cnic}`
      );
      set({
        stakeholder: response.data,
        stakeholderLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ stakeholderError: error.message, stakeholderLoading: false });
    }
  },

  // /mobixCamsClientele/v1/clienteles/{cliIdx}/qr-codes
  getQRDetailsByStkId: async (cliIdx: string) => {
    set({ qrdetailsLoading: true, qrdetailsError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/${cliIdx}/qr-codes`,
        { responseType: "blob" }
      );
      const qrImageUrl = URL.createObjectURL(response.data);
      set({
        qrdetails: { qrImageUrl },
        qrdetailsLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ qrdetailsError: error.message, qrdetailsLoading: false });
    }
  },
  // only reset stakeholders
  resetStakeholder: () =>
    set(() => ({
      stakeholders: [],
    })),
}));

export default useStakeholderStore;
