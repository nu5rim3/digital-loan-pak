import { create } from 'zustand';
import { API } from '../services/api';

// Common interfaces
interface IBaseItem {
  code: string;
  description: string;
  status: string;
}

interface IType extends IBaseItem {
  morgType?: string;
}

// Store state interface
interface ICollateralState {
  // Data arrays
  types: IType[];
  subTypes: IBaseItem[];
  ownerships: IBaseItem[];
  securityTypes: IBaseItem[];
  securityCategories: IBaseItem[];
  companies: IBaseItem[];
  bondTypes: IBaseItem[];
  propertyTypes: IBaseItem[];
  bondRenewals: IBaseItem[];
  insuranceCompanies: IBaseItem[];
  suppliers: IBaseItem[];
  conditions: IBaseItem[];
  makes: IBaseItem[];
  models: IBaseItem[];

  // Loading states
  typesLoading: boolean;
  subTypesLoading: boolean;
  ownershipsLoading: boolean;
  securityTypesLoading: boolean;
  securityCategoriesLoading: boolean;
  companiesLoading: boolean;
  bondTypesLoading: boolean;
  propertyTypesLoading: boolean;
  bondRenewalsLoading: boolean;
  insuranceCompaniesLoading: boolean;
  suppliersLoading: boolean;
  conditionsLoading: boolean;
  makesLoading: boolean;
  modelsLoading: boolean;

  // Fetch functions
  fetchTypes: (type: 'vehicle' | 'machinery' | 'bank-guarantee' | 'property-mortgage' | 'savings' | 'land-stock') => Promise<void>;
  fetchSubTypes: (type: 'vehicle' | 'machinery' | 'bank-guarantee' | 'property-mortgage' | 'savings' | 'land-stock') => Promise<void>;
  fetchOwnerships: () => Promise<void>;
  fetchSecurityTypes: () => Promise<void>;
  fetchSecurityCategories: () => Promise<void>;
  fetchCompanies: () => Promise<void>;
  fetchBondTypes: () => Promise<void>;
  fetchPropertyTypes: () => Promise<void>;
  fetchBondRenewals: () => Promise<void>;
  fetchInsuranceCompanies: () => Promise<void>;
  fetchSuppliers: () => Promise<void>;
  fetchConditions: () => Promise<void>;
  fetchMakes: () => Promise<void>;
  fetchModels: (makeCode: string) => Promise<void>;
}

const useCollateralStore = create<ICollateralState>((set) => ({
  // Initialize state
  types: [],
  subTypes: [],
  ownerships: [],
  securityTypes: [],
  securityCategories: [],
  companies: [],
  bondTypes: [],
  propertyTypes: [],
  bondRenewals: [],
  insuranceCompanies: [],
  suppliers: [],
  conditions: [],
  makes: [],
  models: [],

  // Initialize loading states
  typesLoading: false,
  subTypesLoading: false,
  ownershipsLoading: false,
  securityTypesLoading: false,
  securityCategoriesLoading: false,
  companiesLoading: false,
  bondTypesLoading: false,
  propertyTypesLoading: false,
  bondRenewalsLoading: false,
  insuranceCompaniesLoading: false,
  suppliersLoading: false,
  conditionsLoading: false,
  makesLoading: false,
  modelsLoading: false,

  // Fetch functions
  fetchTypes: async () => {
    set({ typesLoading: true });
    try {
      const endpoint = `/mobixCamsCommon/v1/sub-security/types-1`;
      const response = await API.get(endpoint);
      set({ types: response.data });
    } catch (error) {
      console.error('Error fetching types:', error);
    } finally {
      set({ typesLoading: false });
    }
  },

  fetchSubTypes: async () => {
    set({ subTypesLoading: true });
    try {
      const endpoint = `/mobixCamsCommon/v1/sub-security/types-2`;
      const response = await API.get(endpoint);
      set({ subTypes: response.data });
    } catch (error) {
      console.error('Error fetching sub types:', error);
    } finally {
      set({ subTypesLoading: false });
    }
  },

  fetchOwnerships: async () => {
    set({ ownershipsLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/ownerships');
      set({ ownerships: response.data });
    } catch (error) {
      console.error('Error fetching ownerships:', error);
    } finally {
      set({ ownershipsLoading: false });
    }
  },

  fetchSecurityTypes: async () => {
    set({ securityTypesLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/security/types');
      set({ securityTypes: response.data });
    } catch (error) {
      console.error('Error fetching security types:', error);
    } finally {
      set({ securityTypesLoading: false });
    }
  },

  fetchSecurityCategories: async () => {
    set({ securityCategoriesLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/security/categories');
      set({ securityCategories: response.data });
    } catch (error) {
      console.error('Error fetching security categories:', error);
    } finally {
      set({ securityCategoriesLoading: false });
    }
  },

  fetchCompanies: async () => {
    set({ companiesLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/fd-companies');
      set({ companies: response.data });
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      set({ companiesLoading: false });
    }
  },

  fetchBondTypes: async () => {
    set({ bondTypesLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/bond-types');
      set({ bondTypes: response.data });
    } catch (error) {
      console.error('Error fetching bond types:', error);
    } finally {
      set({ bondTypesLoading: false });
    }
  },

  fetchPropertyTypes: async () => {
    set({ propertyTypesLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/property-types');
      set({ propertyTypes: response.data });
    } catch (error) {
      console.error('Error fetching property types:', error);
    } finally {
      set({ propertyTypesLoading: false });
    }
  },

  fetchBondRenewals: async () => {
    set({ bondRenewalsLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/bond-renewals');
      set({ bondRenewals: response.data });
    } catch (error) {
      console.error('Error fetching bond renewals:', error);
    } finally {
      set({ bondRenewalsLoading: false });
    }
  },

  fetchInsuranceCompanies: async () => {
    set({ insuranceCompaniesLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/insurance-companies');
      set({ insuranceCompanies: response.data });
    } catch (error) {
      console.error('Error fetching insurance companies:', error);
    } finally {
      set({ insuranceCompaniesLoading: false });
    }
  },

  fetchSuppliers: async () => {
    set({ suppliersLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/suppliers');
      set({ suppliers: response.data });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      set({ suppliersLoading: false });
    }
  },

  fetchConditions: async () => {
    set({ conditionsLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/conditions');
      set({ conditions: response.data });
    } catch (error) {
      console.error('Error fetching conditions:', error);
    } finally {
      set({ conditionsLoading: false });
    }
  },

  fetchMakes: async () => {
    set({ makesLoading: true });
    try {
      const response = await API.get('/mobixCamsCommon/v1/equipment-vehicle/manufactures');
      set({ makes: response.data });
    } catch (error) {
      console.error('Error fetching makes:', error);
    } finally {
      set({ makesLoading: false });
    }
  },

  fetchModels: async (makeCode: string) => {
    set({ modelsLoading: true });
    try {
      const response = await API.get(`/mobixCamsCommon/v1/models/${makeCode}`);
      set({ models: response.data });
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      set({ modelsLoading: false });
    }
  },
}));

export default useCollateralStore; 