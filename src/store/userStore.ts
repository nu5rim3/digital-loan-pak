// mobixCamsCommon/v1/users/
import { create } from "zustand";
import { API } from "../services/api";
// import { notification } from "antd";

interface IUser {
  idx: string;
  userName: string;
  meCode: string | null;
  profileUser: string;
  mobileNo: string;
  email: string;
  status: "A" | "I";
  lastModifiedDate: string;
  lastModifiedBy: string;
  roles: {
    code: string;
    description: string;
    status: "A" | "I";
    createdBy: string;
    creationDate: string;
  }[];
  branches: {
    code: string;
    lsbrBranchCode: string;
    description: string;
    lsbrProv: number;
    lsbrDist: string;
    lsbrRgnCode: number;
    lsbrZone: string;
    lsbrAdd1: string;
    lsbrAdd2: string;
    lsbrAdd3: string;
    lsbrAdd4: string | null;
  }[];
  devices: {
    code: string;
    model: string;
    status: "A" | "I";
  }[];
}

interface IUserState {
  users: IUser[];
  user: IUser | null;
  loading: boolean;
  error: string | null;

  // fetchLoans: () => Promise<void>;
  fetchUserByUserName: (userName: string) => Promise<void>;
  // addLoan: (loan: IUser) => Promise<void>;
  // updateLoan: (id: number, updatedLoan: IUser) => Promise<void>;
  //   deleteLoan: (id: number) => Promise<void>;
}

const useUserStore = create<IUserState>((set) => ({
  users: [],
  user: null,
  loading: false,
  error: null,

  //   TODO: must modify this api endpoint - params are username, businessUnit must return user roles
  fetchUserByUserName: async (userName: string) => {
    set({ loading: true, error: null, user: null });
    try {
      const response = await API.get(`/mobixCamsCommon/v1/users/${userName}`);
      set({ user: response.data, loading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useUserStore;
