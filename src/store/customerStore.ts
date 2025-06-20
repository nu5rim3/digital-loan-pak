import { create } from "zustand";
import { API, APIAuth } from "../services/api";
import { notification } from "antd";

interface ICustomer {
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
  type: "G" | "C" | "W";
  status?: "A" | "I";
  loanAmount?: string | null;
  createdBy?: string;
  creationDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  client: "WEB";
}

interface ICustomerState {
  customers: ICustomer[];
  customer: ICustomer | null;
  selectedCustomer: ICustomer | null;
  customerLoading: boolean;
  customerError: string | null;

  fetchCustomer: () => Promise<void>;
  fetchCustomerByAppId: (idx: string) => Promise<void>;
  fetchCustomerByCNIC: (cnic: string) => Promise<void>;
  addCustomer: (customer: ICustomer) => Promise<void>;
  updateCustomer: (idx: string, updatedUser: ICustomer) => Promise<void>;
  deleteCustomer: (idx: string) => Promise<void>;
  resetCustomer: () => void;
}

const useCustomerStore = create<ICustomerState>((set) => ({
  customers: [],
  customer: null,
  selectedCustomer: null,
  customerLoading: false,
  customerError: null,

  fetchCustomer: async () => {
    set({ customerLoading: true, customerError: null });
    try {
      const response = await API.get("/");
      set({ customers: response.data, customerLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ customerError: error.message, customerLoading: false });
    }
  },

  fetchCustomerByAppId: async (appId: string) => {
    set({ customerLoading: true, customerError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/${appId}/type/customer`
      );
      set({ customers: response.data, customerLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ customerError: error.message, customerLoading: false });
    }
  },

  fetchCustomerByCNIC: async (cnic: string) => {
    set({ customerLoading: true, customerError: null });
    try {
      const response = await API.get(
        `/mobixCamsClientele/v1/clienteles/identifiers/${cnic}`
      );
      set({ selectedCustomer: response.data?.data, customerLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ customerError: error.message, customerLoading: false });
    }
  },

  addCustomer: async (customer: ICustomer) => {
    set({ customerLoading: true, customerError: null, customer: null });
    try {
      const response = await APIAuth.post("/mobixCamsClientele/v1/clienteles", {
        ...customer,
        type: "C",
      });
      set((state) => ({
        customer: response.data,
        customers: [...state.customers, response.data],
        customerLoading: false,
      }));
      notification.success({
        message: "Success",
        description: "Customer Created successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ customerError: error.message, customerLoading: false });
    }
  },

  updateCustomer: async (idx: string, updatedCustomer: ICustomer) => {
    set({ customerLoading: true, customerError: null });
    try {
      await API.put(`/customer/${idx}`, updatedCustomer);
      set((state) => ({
        users: state.customers.map((customer) =>
          customer.idx === idx ? { ...customer, ...updatedCustomer } : customer
        ),
        customerLoading: false,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ customerError: error.message, customerLoading: false });
    }
  },

  deleteCustomer: async (idx: string) => {
    set({ customerLoading: true, customerError: null });
    try {
      await API.delete(`/customer/${idx}`);
      set((state) => ({
        customers: state.customers.filter((customer) => customer.idx !== idx),
        customerLoading: false,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ customerError: error.message, customerLoading: false });
    }
  },

  resetCustomer: () =>
    set({
      customer: null,
      selectedCustomer: null,
      customerLoading: false,
      customerError: null,
      customers: [],
    }),
}));

export default useCustomerStore;
