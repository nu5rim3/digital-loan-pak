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
interface IAddressDetails {
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

interface IRecipient {
  idx?: string;
  recipientName: string | null;
  relationship: string;
  cNicNo: string;
  phoneNo: string;
  status: "A" | "I";
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

  //   fetchStakeholdes: () => Promise<void>;
  // fetchStakeholderById: (idx: string) => Promise<void>;
  // fetchStakeholderByCNIC: (cnic: string) => Promise<void>;
  addStakeholder: (stakeholder: IStakeholder) => Promise<void>;
  fetchStackholderByAppId: (appraisalId: string) => Promise<void>;
  updateStakeholder: (idx: string, updatedUser: IStakeholder) => Promise<void>;

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

  // /mobixCamsClientele/v1/clienteles/recipient/{stk_id}
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
        recipients: response.data,
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
      const response = await APIAuth.post(
        `/mobixCamsClientele/v1/clienteles/recipient/${recId}`,
        recipientDetails
      );
      set({
        recipients: response.data,
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
}));

export default useStakeholderStore;
