import { create } from "zustand";
import { API, APIAuth } from "../services/api";
import { notification } from "antd";

interface IGuarantor {
  idx?: string;
  appraisalId?: string;
  lastName: string;
  surName: string;
  initials: string;
  fullName: string;
  telcoProvider: string;
  contactNumber: string;
  identificationType: string;
  identificationNumber: string;
  type: "G";
  status?: "A" | "I";
  loanAmount?: string | null;
  createdBy?: string;
  creationDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  client: "WEB";
  sequence: string;
}

interface ICustomerState {
  guarantors: IGuarantor[];
  guarantor: IGuarantor | null;
  selectedGuarantor: IGuarantor | null;
  guarantorLoading: boolean;
  guarantorError: string | null;

  fetchGuarantor: () => Promise<void>;
  fetchGuarantorByAppId: (appId: string) => Promise<void>;
  fetchGuarantorByCNIC: (cnic: string) => Promise<void>;
  addGuarantor: (guarantor: IGuarantor) => Promise<void>;
  updateGuarantor: (idx: string, updatedUser: IGuarantor) => Promise<void>;
  resetGuarantor: () => void;
}

const useGuarantorStore = create<ICustomerState>((set) => ({
  guarantors: [],
  guarantor: null,
  selectedGuarantor: null,
  guarantorLoading: false,
  guarantorError: null,

  fetchGuarantor: async () => {
    set({ guarantorLoading: true, guarantorError: null });
    try {
      const response = await API.get("/");
      set({ guarantors: response.data, guarantorLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ guarantorError: error.message, guarantorLoading: false });
    }
  },

  fetchGuarantorByAppId: async (appId: string) => {
    set({ guarantorLoading: true, guarantorError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/${appId}/type/guarantor`
      );
      set({ guarantors: response.data, guarantorLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ guarantorError: error.message, guarantorLoading: false });
    }
  },

  fetchGuarantorByCNIC: async (cnic: string) => {
    set({ guarantorLoading: true, guarantorError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/identifiers/${cnic}`
      );
      set({ selectedGuarantor: response.data?.data, guarantorLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ guarantorError: error.message, guarantorLoading: false });
    }
  },

  addGuarantor: async (guarantor: IGuarantor) => {
    set({ guarantorLoading: true, guarantorError: null, guarantor: null });
    try {
      const response = await APIAuth.post("/mobixCamsClientele/v1/clienteles", {
        ...guarantor,
        type: "G",
      });
      set((state) => ({
        guarantor: response.data,
        guarantors: [...state.guarantors, response.data],
        guarantorLoading: false,
      }));
      notification.success({
        message: "Success",
        description: "Customer Created successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ guarantorError: error.message, guarantorLoading: false });
    }
  },

  updateGuarantor: async (idx: string, updatedCustomer: IGuarantor) => {
    set({ guarantorLoading: true, guarantorError: null });
    try {
      await API.put(`/customer/${idx}`, updatedCustomer);
      set((state) => ({
        users: state.guarantors.map((guarantor) =>
          guarantor.idx === idx
            ? { ...guarantor, ...updatedCustomer }
            : guarantor
        ),
        guarantorLoading: false,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ guarantorError: error.message, guarantorLoading: false });
    }
  },

  resetGuarantor: () => set({ guarantor: null }),
}));

export default useGuarantorStore;
