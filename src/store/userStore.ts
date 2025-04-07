import { create, StateCreator } from "zustand";
import { persist, PersistOptions, PersistStorage } from "zustand/middleware";
import { API } from "../services/api";

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
  roles: IUserRols[];
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

export interface IUserRols {
  code: string;
  description: string;
  status: "A" | "I";
  createdBy: string;
  creationDate: string;
}

interface IRole {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IUserState {
  users: IUser[];
  user: IUser | null;
  loading: boolean;
  error: string | null;

  roles: IRole[];
  rolesLoading: boolean;
  rolesError: string | null;

  currentRole: IRole | null;

  fetchUserByUserName: (userName: string) => Promise<void>;
  fetchUserRoles: (userName: string, businessUnit: string) => Promise<void>;
  selectingRole: (role: IRole) => void;
}

type TPersist = (
  config: StateCreator<IUserState>,
  options: PersistOptions<IUserState>
) => StateCreator<IUserState>;

const localStorageWrapper: PersistStorage<IUserState> = {
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

const useUserStore = create<IUserState>(
  (persist as TPersist)(
    (set) => ({
      users: [],
      user: null,
      loading: false,
      error: null,
      roles: [],
      rolesLoading: false,
      rolesError: null,
      currentRole: null,

      fetchUserByUserName: async (userName: string) => {
        set({ loading: true, error: null, user: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/users/${userName}`
          );
          set({ user: response.data, loading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchUserRoles: async (userName: string, businessUnit: string) => {
        set({ rolesLoading: true, rolesError: null, roles: [] });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/users/${userName}/${businessUnit}`
          );
          set({ roles: response.data, rolesLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ rolesError: error.message, rolesLoading: false });
        }
      },

      selectingRole: (role: IRole) => {
        set({ currentRole: role });
      },
    }),
    {
      name: "user-store", // unique name
      storage: localStorageWrapper, // custom storage wrapper
      partialize: (state) => ({ ...state, currentRole: state.currentRole }), // persist the complete IUserState object with the currentRole
    }
  )
);

export default useUserStore;
