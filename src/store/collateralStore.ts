import { create } from "zustand";
import { API, APIAuth } from "../services/api";
import { categoryMap } from "../utils/Common";

// Common interfaces
interface IBaseItem {
  code: string;
  description: string;
  status?: string;
}
interface ownerShipData {
  bankGuaranteeOwnership?: IBaseItem;
  machineryOwnership?: IBaseItem;
  propertyOwnership?: IBaseItem;
  vehicleOwnership?: IBaseItem;
}

interface conditionData {
  machineryCondition?: IBaseItem;
  vehicleCondition?: IBaseItem;
  leaseCondition?: IBaseItem;
}

interface categoryData {
  vehicleCategory?: IBaseItem;
  leaseCategory?: IBaseItem;
  
}

interface typesData {
  vehicleType?: IBaseItem;
  savingsType?: IBaseItem;
  propertyType?: IBaseItem;
  machineryType?: IBaseItem;
  landStockType?: IBaseItem;
  bankGuaranteeType?: IBaseItem;
  leaseVehicleType?: IBaseItem;
}
interface subTypesData {
  savingsSubType?: IBaseItem;
  propertySubType?: IBaseItem;
  landStockSubType?: IBaseItem;
}

interface IType extends IBaseItem {
  morgType?: string;
}

// Bank Guarantee interface for API
interface BankGuaranteePayload {
  appraisalId: string;
  type: string;
  ownership: string;
  fdNo?: string;
  fdValue?: string;
  startDate?: string;
  expiryDate?: string;
  referenceNo?: string;
  guaranteeValue?: string;
  guaranteeTo?: string;
  institutionName?: string;
  valueOfGuarantee?: string;
  renewedBy?: string;
  insuCompany?: string;
  insuRefNo?: string;
  bankGuaranteeSecCategory: string;
  bankGuaranteeSecType: string;
}

// Land Stock interface for API
interface LandStockPayload {
  appraisalId: string;
  landStockType: string;
  landStockSubType?: string;
  landStockOwnership: string;
  landStockMarketValue?: number;
  landStockFsv?: number;
  landStockBondNo?: string;
  landStockDeedTransferNo?: string;
  landStockAgreementNo?: string;
  landStockLawyerName?: string;
  landStockDescription?: string;
  landStockSecDate?: string;
  landStockSecCategory?: string;
  landStockSecType?: string;
}

// Machinery Equipment interface for API
interface MachineryPayload {
  appraisalId: string;
  type: string;
  ownership: string;
  supplier: string;
  condition: string;
  model?: string;
  engineNo?: string;
  serialChasisNo: string;
  description?: string;
  bondNo?: string;
  bondValue?: string;
  marketValue?: number;
  fsv?: number;
  valuedBy?: string;
  insuCompany?: string;
  refNo?: string;
  machineryEquipSecCategory: string;
  machineryEquipSecType: string;
}

// Property Mortgage interface for API
interface PropertyMortgagePayload {
  appraisalId: string;
  mortgageType: string;
  mortgageSubType: string;
  mortgageOwnership: string;
  mortgageBondType: string;
  mortgagePropertyType: string;
  mortgageBondNo: string;
  mortgageBondDate: string;
  mortgageDeedNo: string;
  mortgageBondValue?: number;
  mortgageSurveyPlanNo: string;
  mortgagePoa: string;
  mortgagePoaNo: string;
  mortgageCompany: string;
  mortgageLawyerName: string;
  mortgageTitleInsurance: string;
  mortgageInsOfBuilding: string;
  mortgageInsuranceValue?: number;
  mortgageMarketValue?: number;
  mortgageFsv?: number;
  mortgageLotNo: string;
  mortgageInsuranceCompany?: string;
  mortgageReferenceNo?: string;
  mortgageSecCategory: string;
  mortgageSecType: string;
}

// Savings interface for API
interface SavingsPayload {
  appraisalId: string;
  type: string;
  ownership: string;
  savingsNo?: string;
  fdNo?: string;
  amount?: number;
  maturityDate?: string;
  company?: string;
  description?: string;
  savingsBuildValue?: string;
  subType?: string;
  insuCompany?: string;
  refNo?: string;
  savingsSecCategory: string;
  savingsSecType: string;
}

// Vehicle interface for API
interface VehiclePayload {
  appraisalId: string;
  vehicleType: string;
  vehicleSecCategory: string;
  vehicleSecType: string;
  ownership: string;
  supplier: string;
  condition: string;
  category: string;
  make: string;
  model: string;
  enginNo?: string;
  chasisNo?: string;
  regNo?: string;
  desc?: string;
  yearOfManufacture?: string;
  marketValue?: string | number;
  foreSaleValue?: string | number;
  dateOfFirstReg?: string;
  regBookNo?: string;
  bookReceivedDate?: string;
  crReleasedDate?: string;
  insuCompany?: string;
  refNo?: string;
}

// Lease interface for API
interface LeasePayload {
  appraisalId: string;
  leaseEquipType: string;
  leaseCost: string | number;
  leaseSupplierCode: string;
  leaseEquipName: string;
  leaseCondition: string;
  leaseCategory: string;
  leaseDepreciationCode: string;
  leaseVehiType: string;
  leaseManufacture: string;
  leaseVehiModel: string;
  leaseEnginCapacityCC: string;
  leaseEnginCapacityHP: string;
  enginNo?: string;
  chasisNo?: string;
  duplicateKey?: string;
  leaseModel?: string;
  leaseVehiNo?: string;
  leaseRegBookNo?: string;
  leaseRegDate?: string;
  leaseRegYear?: string;
  marketValue?: string | number;
  foreSaleValue?: string | number;
  leaseProvince?: string;
  insuCompany?: string;
  refNo?: string;
}

// Collateral interface
interface Collateral {
  id: string;
  type: string;
  [key: string]: any;
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
  collaterals: Collateral[];
  vehicleCategories: IBaseItem[];
  depreciationRates: IBaseItem[];

  insuaranceCompanyData: IBaseItem;
  ownershipData: ownerShipData;
  typesData: typesData;
  conditionData: conditionData;
  securityCategoryData: any;
  securityTypeData: any;
  subTypesData: subTypesData;
  vehicleCategoryData: categoryData;


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
  vehicleCategoriesLoading: boolean;
  savingBankGuarantee: boolean;
  updatingBankGuarantee: boolean;
  fetchingBankGuarantee: boolean;
  fetchingCollaterals: boolean;
  deletingCollateral: boolean;
  savingLandStock: boolean;
  updatingLandStock: boolean;
  fetchingLandStock: boolean;
  savingMachinery: boolean;
  updatingMachinery: boolean;
  fetchingMachinery: boolean;
  savingPropertyMortgage: boolean;
  updatingPropertyMortgage: boolean;
  fetchingPropertyMortgage: boolean;
  savingSavings: boolean;
  updatingSavings: boolean;
  fetchingSavings: boolean;
  savingVehicle: boolean;
  updatingVehicle: boolean;
  fetchingVehicle: boolean;
  fetchingDepreciationRates: boolean;
  savingLease: boolean;
  updatingLease: boolean;
  fetchingLease: boolean;

  insuranceCompanyByCodeLoading: boolean;
  ownershipByCodeLoading: boolean;
  typeByCodeLoading: boolean;
  subTypeByCodeLoading: boolean;
  conditionByCodeLoading: boolean;
  securityCategoryDataLoading: boolean;
  vehicleCategoryLoading: boolean;


  // Error states
  saveBankGuaranteeError: string | null;
  updateBankGuaranteeError: string | null;
  fetchBankGuaranteeError: string | null;
  fetchCollateralsError: string | null;
  deleteCollateralError: string | null;
  saveLandStockError: string | null;
  updateLandStockError: string | null;
  fetchLandStockError: string | null;
  saveMachineryError: string | null;
  updateMachineryError: string | null;
  fetchMachineryError: string | null;
  savePropertyMortgageError: string | null;
  updatePropertyMortgageError: string | null;
  fetchPropertyMortgageError: string | null;
  saveSavingsError: string | null;
  updateSavingsError: string | null;
  fetchSavingsError: string | null;
  saveVehicleError: string | null;
  updateVehicleError: string | null;
  fetchVehicleError: string | null;
  fetchDepreciationRatesError: string | null;
  saveLeaseError: string | null;
  updateLeaseError: string | null;
  fetchLeaseError: string | null;

  // Fetch functions
  fetchTypes: (type: string, category?: string) => Promise<void>;
  fetchSubTypes: (type: string) => Promise<void>;
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

  // Bank Guarantee API functions
  saveBankGuarantee: (data: BankGuaranteePayload) => Promise<any>;
  updateBankGuarantee: (id: string, data: BankGuaranteePayload) => Promise<any>;
  getBankGuarantee: (id: string) => Promise<any>;
  deactivateBankGuarantee: (id: string, appraisalId?: string) => Promise<any>;

  // Land Stock API functions
  saveLandStock: (data: LandStockPayload) => Promise<any>;
  updateLandStock: (id: string, data: LandStockPayload) => Promise<any>;
  getLandStock: (id: string) => Promise<any>;
  deactivateLandStock: (id: string, appraisalId?: string) => Promise<any>;

  // Machinery Equipment API functions
  saveMachinery: (data: MachineryPayload) => Promise<any>;
  updateMachinery: (id: string, data: MachineryPayload) => Promise<any>;
  getMachinery: (id: string) => Promise<any>;
  deactivateMachinery: (id: string, appraisalId?: string) => Promise<any>;

  // Property Mortgage API functions
  savePropertyMortgage: (data: PropertyMortgagePayload) => Promise<any>;
  updatePropertyMortgage: (
    id: string,
    data: PropertyMortgagePayload
  ) => Promise<any>;
  getPropertyMortgage: (id: string) => Promise<any>;
  deactivatePropertyMortgage: (
    id: string,
    appraisalId?: string
  ) => Promise<any>;

  // Savings API functions
  saveSavings: (data: SavingsPayload) => Promise<any>;
  updateSavings: (id: string, data: SavingsPayload) => Promise<any>;
  getSavings: (id: string) => Promise<any>;
  deactivateSavings: (id: string, appraisalId?: string) => Promise<any>;

  // Vehicle API functions
  saveVehicle: (data: VehiclePayload) => Promise<any>;
  updateVehicle: (id: string, data: VehiclePayload) => Promise<any>;
  getVehicle: (id: string) => Promise<any>;
  deactivateVehicle: (id: string, appraisalId?: string) => Promise<any>;
  fetchVehicleCategories: () => Promise<void>;

  // Lease API functions
  fetchDepreciationRates: () => Promise<void>;
  saveLease: (data: LeasePayload) => Promise<any>;
  updateLease: (id: string, data: LeasePayload) => Promise<any>;
  getLease: (id: string) => Promise<any>;
  deactivateLease: (id: string, appraisalId?: string) => Promise<any>;

  // Collateral API functions
  fetchCollaterals: (appraisalId: string) => Promise<Collateral[]>;
  deleteCollateral: (
    id: string,
    type: string,
    appraisalId?: string
  ) => Promise<boolean>;

  fetchInsuranceCompaniesByCode(code: string): Promise<void>;
  fetchOwnershipByCode(field: string, code: string): Promise<void>;
  fetchTypeByCode(typeFieldName:string, type: string, code: string): Promise<void>;
  fetchSubTypeByCode(subTypeFieldName:string,type: string, code: string): Promise<void>;
  fetchSecurityCategoryByCode: (code: string) => Promise<void>;
  fetchConditionByCode: (field: string, code: string) => Promise<void>;
  fetchVehicleCategoryByCode: (field: string,code: string) => Promise<void>;

}

const useCollateralStore = create<ICollateralState>((set, get) => ({
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
  collaterals: [],
  vehicleCategories: [],
  depreciationRates: [],

  insuaranceCompanyData: {} as IBaseItem,
  ownershipData: {} as ownerShipData,
  typesData: {} as typesData,
  subTypesData: {} as subTypesData,
  conditionData: {} as conditionData,
  securityCategoryData: {} as IBaseItem,
  securityTypeData: {},
  vehicleCategoryData: {} as categoryData,


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
  vehicleCategoriesLoading: false,
  savingBankGuarantee: false,
  updatingBankGuarantee: false,
  fetchingBankGuarantee: false,
  fetchingCollaterals: false,
  deletingCollateral: false,
  savingLandStock: false,
  updatingLandStock: false,
  fetchingLandStock: false,
  savingMachinery: false,
  updatingMachinery: false,
  fetchingMachinery: false,
  savingPropertyMortgage: false,
  updatingPropertyMortgage: false,
  fetchingPropertyMortgage: false,
  savingSavings: false,
  updatingSavings: false,
  fetchingSavings: false,
  savingVehicle: false,
  updatingVehicle: false,
  fetchingVehicle: false,
  fetchingDepreciationRates: false,
  savingLease: false,
  updatingLease: false,
  fetchingLease: false,

  insuranceCompanyByCodeLoading: false,
  ownershipByCodeLoading: false,
  typeByCodeLoading: false,
  subTypeByCodeLoading: false,
  conditionByCodeLoading: false,
  securityCategoryDataLoading: false,
  vehicleCategoryLoading: false,


  // Initialize error states
  saveBankGuaranteeError: null,
  updateBankGuaranteeError: null,
  fetchBankGuaranteeError: null,
  fetchCollateralsError: null,
  deleteCollateralError: null,
  saveLandStockError: null,
  updateLandStockError: null,
  fetchLandStockError: null,
  saveMachineryError: null,
  updateMachineryError: null,
  fetchMachineryError: null,
  savePropertyMortgageError: null,
  updatePropertyMortgageError: null,
  fetchPropertyMortgageError: null,
  saveSavingsError: null,
  updateSavingsError: null,
  fetchSavingsError: null,
  saveVehicleError: null,
  updateVehicleError: null,
  fetchVehicleError: null,
  fetchDepreciationRatesError: null,
  saveLeaseError: null,
  updateLeaseError: null,
  fetchLeaseError: null,

  fetchTypes: async (securityType, category) => {
    set({ typesLoading: true });
    try {
      const endpoint = `/mobixCamsCommon/v1/sub-security/types-1/${securityType}`;
      const response = await API.get(endpoint);
      set({ types: response.data });
      if (category) {
        set((prev) => ({
          securityTypeData: {
            ...prev.securityTypeData,
            [category]: response.data, // store by category
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    } finally {
      set({ typesLoading: false });
    }
  },

  fetchSubTypes: async (type) => {
    set({ subTypesLoading: true });
    try {
      const endpoint = `/mobixCamsCommon/v1/sub-security/types-2/${type}`;
      const response = await API.get(endpoint);
      set({ subTypes: response.data });
    } catch (error) {
      console.error("Error fetching sub types:", error);
    } finally {
      set({ subTypesLoading: false });
    }
  },

  fetchOwnerships: async () => {
    set({ ownershipsLoading: true });
    try {
      const response = await API.get("/mobixCamsCommon/v1/ownerships");
      set({ ownerships: response.data });
    } catch (error) {
      console.error("Error fetching ownerships:", error);
    } finally {
      set({ ownershipsLoading: false });
    }
  },

  fetchSecurityTypes: async () => {
    set({ securityTypesLoading: true });
    try {
      const response = await API.get("/mobixCamsCommon/v1/security/types");
      set({ securityTypes: response.data });
    } catch (error) {
      console.error("Error fetching security types:", error);
    } finally {
      set({ securityTypesLoading: false });
    }
  },

  fetchSecurityCategories: async () => {
    set({ securityCategoriesLoading: true });
    try {
      const response = await API.get("/mobixCamsCommon/v1/security/categories");
      set({ securityCategories: response.data });
    } catch (error) {
      console.error("Error fetching security categories:", error);
    } finally {
      set({ securityCategoriesLoading: false });
    }
  },

  fetchCompanies: async () => {
    set({ companiesLoading: true });
    try {
      const response = await API.get("/mobixCamsCommon/v1/fd-companies");
      set({ companies: response.data });
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      set({ companiesLoading: false });
    }
  },

  fetchBondTypes: async () => {
    set({ bondTypesLoading: true });
    try {
      const response = await API.get("/mobixCamsCommon/v1/bond-types");
      set({ bondTypes: response.data });
    } catch (error) {
      console.error("Error fetching bond types:", error);
    } finally {
      set({ bondTypesLoading: false });
    }
  },

  fetchPropertyTypes: async () => {
    set({ propertyTypesLoading: true });
    try {
      const response = await API.get("/mobixCamsCommon/v1/property-types");
      set({ propertyTypes: response.data });
    } catch (error) {
      console.error("Error fetching property types:", error);
    } finally {
      set({ propertyTypesLoading: false });
    }
  },

  fetchBondRenewals: async () => {
    set({ bondRenewalsLoading: true });
    try {
      const response = await API.get("/mobixCamsCommon/v1/bond-renewals");
      set({ bondRenewals: response.data });
    } catch (error) {
      console.error("Error fetching bond renewals:", error);
    } finally {
      set({ bondRenewalsLoading: false });
    }
  },

  fetchInsuranceCompanies: async () => {
    set({ insuranceCompaniesLoading: true });
    try {
      const response = await API.get("/mobixCamsCommon/v1/insurance-companies");
      set({ insuranceCompanies: response.data });
    } catch (error) {
      console.error("Error fetching insurance companies:", error);
    } finally {
      set({ insuranceCompaniesLoading: false });
    }
  },

  fetchSuppliers: async () => {
    set({ suppliersLoading: true });
    try {
      const response = await API.get("/mobixCamsCommon/v1/suppliers");
      set({ suppliers: response.data });
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      set({ suppliersLoading: false });
    }
  },

  fetchConditions: async () => {
    set({ conditionsLoading: true });
    try {
      const response = await API.get("/mobixCamsCommon/v1/conditions");
      set({ conditions: response.data });
    } catch (error) {
      console.error("Error fetching conditions:", error);
    } finally {
      set({ conditionsLoading: false });
    }
  },

  fetchMakes: async () => {
    set({ makesLoading: true });
    try {
      const response = await API.get(
        "/mobixCamsCommon/v1/equipment-vehicle/manufactures"
      );
      set({ makes: response.data });
    } catch (error) {
      console.error("Error fetching makes:", error);
    } finally {
      set({ makesLoading: false });
    }
  },

  fetchVehicleCategories: async () => {
    set({ vehicleCategoriesLoading: true });
    try {
      const response = await API.get(
        "/mobixCamsCommon/v1/equipment-vehicle/types"
      );
      set({ vehicleCategories: response.data });
    } catch (error) {
      console.error("Error fetching Vehicle Categories:", error);
    } finally {
      set({ vehicleCategoriesLoading: false });
    }
  },

  fetchModels: async (makeCode) => {
    set({ modelsLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCommon/v1/equipment-vehicle/manufacture/${makeCode}`
      );
      set({ models: [...response.data] });
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      set({ modelsLoading: false });
    }
  },

  saveBankGuarantee: async (data: BankGuaranteePayload) => {
    set({ savingBankGuarantee: true, saveBankGuaranteeError: null });
    try {
      const response = await APIAuth.post(
        "/mobixCamsCollateral/v1/bank-guarantees",
        data
      );
      set({ savingBankGuarantee: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error saving bank guarantee:", error);
      set({ saveBankGuaranteeError: "Failed to save bank guarantee" });
      throw error;
    } finally {
      set({ savingBankGuarantee: false });
    }
  },

  updateBankGuarantee: async (id: string, data: BankGuaranteePayload) => {
    set({ updatingBankGuarantee: true, updateBankGuaranteeError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/bank-guarantees/${id}`,
        data
      );
      set({ updatingBankGuarantee: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error updating bank guarantee:", error);
      set({ updateBankGuaranteeError: "Failed to update bank guarantee" });
      throw error;
    } finally {
      set({ updatingBankGuarantee: false });
    }
  },

  getBankGuarantee: async (id: string) => {
    set({ fetchingBankGuarantee: true, fetchBankGuaranteeError: null });
    try {
      const response = await API.get(
        `/mobixCamsCollateral/v1/bank-guarantees/${id}`
      );
      set({ fetchingBankGuarantee: false });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching bank guarantee:", error);
      set({ fetchBankGuaranteeError: "Failed to fetch bank guarantee" });
      throw error;
    } finally {
      set({ fetchingBankGuarantee: false });
    }
  },

  deactivateBankGuarantee: async (id: string, appraisalId?: string) => {
    set({ updatingBankGuarantee: true, updateBankGuaranteeError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/bank-guarantees/${id}/inactive`
      );
      set({ updatingBankGuarantee: false });

      if (appraisalId) {
        get().fetchCollaterals(appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error deactivating bank guarantee:", error);
      set({ updateBankGuaranteeError: "Failed to deactivate bank guarantee" });
      throw error;
    } finally {
      set({ updatingBankGuarantee: false });
    }
  },

  saveLandStock: async (data: LandStockPayload) => {
    set({ savingLandStock: true, saveLandStockError: null });
    try {
      const response = await APIAuth.post(
        "/mobixCamsCollateral/v1/land-stocks",
        data
      );
      set({ savingLandStock: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error saving land stock:", error);
      set({ saveLandStockError: "Failed to save land stock" });
      throw error;
    } finally {
      set({ savingLandStock: false });
    }
  },

  updateLandStock: async (id: string, data: LandStockPayload) => {
    set({ updatingLandStock: true, updateLandStockError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/land-stocks/${id}`,
        data
      );
      set({ updatingLandStock: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error updating land stock:", error);
      set({ updateLandStockError: "Failed to update land stock" });
      throw error;
    } finally {
      set({ updatingLandStock: false });
    }
  },

  getLandStock: async (id: string) => {
    set({ fetchingLandStock: true, fetchLandStockError: null });
    try {
      const response = await API.get(
        `/mobixCamsCollateral/v1/land-stocks/${id}`
      );
      set({ fetchingLandStock: false });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching land stock:", error);
      set({ fetchLandStockError: "Failed to fetch land stock" });
      throw error;
    } finally {
      set({ fetchingLandStock: false });
    }
  },

  deactivateLandStock: async (id: string, appraisalId?: string) => {
    set({ updatingLandStock: true, updateLandStockError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/land-stocks/${id}/inactive`
      );
      set({ updatingLandStock: false });

      if (appraisalId) {
        get().fetchCollaterals(appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error deactivating land stock:", error);
      set({ updateLandStockError: "Failed to deactivate land stock" });
      throw error;
    } finally {
      set({ updatingLandStock: false });
    }
  },

  saveMachinery: async (data: MachineryPayload) => {
    set({ savingMachinery: true, saveMachineryError: null });
    try {
      const response = await APIAuth.post(
        "/mobixCamsCollateral/v1/machinery-equipments",
        data
      );
      set({ savingMachinery: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error saving machinery equipment:", error);
      set({ saveMachineryError: "Failed to save machinery equipment" });
      throw error;
    } finally {
      set({ savingMachinery: false });
    }
  },

  updateMachinery: async (id: string, data: MachineryPayload) => {
    set({ updatingMachinery: true, updateMachineryError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/machinery-equipments/${id}`,
        data
      );
      set({ updatingMachinery: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error updating machinery equipment:", error);
      set({ updateMachineryError: "Failed to update machinery equipment" });
      throw error;
    } finally {
      set({ updatingMachinery: false });
    }
  },

  getMachinery: async (id: string) => {
    set({ fetchingMachinery: true, fetchMachineryError: null });
    try {
      const response = await API.get(
        `/mobixCamsCollateral/v1/machinery-equipments/${id}`
      );
      set({ fetchingMachinery: false });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching machinery equipment:", error);
      set({ fetchMachineryError: "Failed to fetch machinery equipment" });
      throw error;
    } finally {
      set({ fetchingMachinery: false });
    }
  },

  deactivateMachinery: async (id: string, appraisalId?: string) => {
    set({ updatingMachinery: true, updateMachineryError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/machinery-equipments/${id}/inactive`
      );
      set({ updatingMachinery: false });

      if (appraisalId) {
        get().fetchCollaterals(appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error deactivating machinery equipment:", error);
      set({ updateMachineryError: "Failed to deactivate machinery equipment" });
      throw error;
    } finally {
      set({ updatingMachinery: false });
    }
  },

  savePropertyMortgage: async (data: PropertyMortgagePayload) => {
    set({ savingPropertyMortgage: true, savePropertyMortgageError: null });
    try {
      const response = await APIAuth.post(
        "/mobixCamsCollateral/v1/mortgages",
        data
      );
      set({ savingPropertyMortgage: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error saving property mortgage:", error);
      set({ savePropertyMortgageError: "Failed to save property mortgage" });
      throw error;
    } finally {
      set({ savingPropertyMortgage: false });
    }
  },

  updatePropertyMortgage: async (id: string, data: PropertyMortgagePayload) => {
    set({ updatingPropertyMortgage: true, updatePropertyMortgageError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/mortgages/${id}`,
        data
      );
      set({ updatingPropertyMortgage: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error updating property mortgage:", error);
      set({
        updatePropertyMortgageError: "Failed to update property mortgage",
      });
      throw error;
    } finally {
      set({ updatingPropertyMortgage: false });
    }
  },

  getPropertyMortgage: async (id: string) => {
    set({ fetchingPropertyMortgage: true, fetchPropertyMortgageError: null });
    try {
      const response = await API.get(`/mobixCamsCollateral/v1/mortgages/${id}`);
      set({ fetchingPropertyMortgage: false });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching property mortgage:", error);
      set({ fetchPropertyMortgageError: "Failed to fetch property mortgage" });
      throw error;
    } finally {
      set({ fetchingPropertyMortgage: false });
    }
  },

  deactivatePropertyMortgage: async (id: string, appraisalId?: string) => {
    set({ updatingPropertyMortgage: true, updatePropertyMortgageError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/mortgages/${id}/inactive`
      );
      set({ updatingPropertyMortgage: false });

      if (appraisalId) {
        get().fetchCollaterals(appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error deactivating property mortgage:", error);
      set({
        updatePropertyMortgageError: "Failed to deactivate property mortgage",
      });
      throw error;
    } finally {
      set({ updatingPropertyMortgage: false });
    }
  },

  saveSavings: async (data: SavingsPayload) => {
    set({ savingSavings: true, saveSavingsError: null });
    try {
      const response = await APIAuth.post("/mobixCamsCollateral/v1/savings", data);
      set({ savingSavings: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error saving savings:", error);
      set({ saveSavingsError: "Failed to save savings" });
      throw error;
    } finally {
      set({ savingSavings: false });
    }
  },

  updateSavings: async (id: string, data: SavingsPayload) => {
    set({ updatingSavings: true, updateSavingsError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/savings/${id}`,
        data
      );
      set({ updatingSavings: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error updating savings:", error);
      set({ updateSavingsError: "Failed to update savings" });
      throw error;
    } finally {
      set({ updatingSavings: false });
    }
  },

  getSavings: async (id: string) => {
    set({ fetchingSavings: true, fetchSavingsError: null });
    try {
      const response = await API.get(`/mobixCamsCollateral/v1/savings/${id}`);
      set({ fetchingSavings: false });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching savings:", error);
      set({ fetchSavingsError: "Failed to fetch savings" });
      throw error;
    } finally {
      set({ fetchingSavings: false });
    }
  },

  deactivateSavings: async (id: string, appraisalId?: string) => {
    set({ updatingSavings: true, updateSavingsError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/savings/${id}/inactive`
      );
      set({ updatingSavings: false });

      if (appraisalId) {
        get().fetchCollaterals(appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error deactivating savings:", error);
      set({ updateSavingsError: "Failed to deactivate savings" });
      throw error;
    } finally {
      set({ updatingSavings: false });
    }
  },

  saveVehicle: async (data: VehiclePayload) => {
    set({ savingVehicle: true, saveVehicleError: null });
    try {
      const response = await APIAuth.post("/mobixCamsCollateral/v1/vehicles", data);
      set({ savingVehicle: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error saving vehicle:", error);
      set({ saveVehicleError: "Failed to save vehicle" });
      throw error;
    } finally {
      set({ savingVehicle: false });
    }
  },

  updateVehicle: async (id: string, data: VehiclePayload) => {
    set({ updatingVehicle: true, updateVehicleError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/vehicles/${id}`,
        data
      );
      set({ updatingVehicle: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error updating vehicle:", error);
      set({ updateVehicleError: "Failed to update vehicle" });
      throw error;
    } finally {
      set({ updatingVehicle: false });
    }
  },

  getVehicle: async (id: string) => {
    set({ fetchingVehicle: true, fetchVehicleError: null });
    try {
      const response = await API.get(`/mobixCamsCollateral/v1/vehicles/${id}`);
      set({ fetchingVehicle: false });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      set({ fetchVehicleError: "Failed to fetch vehicle" });
      throw error;
    } finally {
      set({ fetchingVehicle: false });
    }
  },

  deactivateVehicle: async (id: string, appraisalId?: string) => {
    set({ updatingVehicle: true, updateVehicleError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/vehicles/${id}/inactive`
      );
      set({ updatingVehicle: false });

      if (appraisalId) {
        get().fetchCollaterals(appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error deactivating vehicle:", error);
      set({ updateVehicleError: "Failed to deactivate vehicle" });
      throw error;
    } finally {
      set({ updatingVehicle: false });
    }
  },

  fetchDepreciationRates: async () => {
    set({ fetchingDepreciationRates: true, fetchDepreciationRatesError: null });
    try {
      const response = await API.get("/mobixCamsCommon/v1/depreciation-rates");
      set({ depreciationRates: response.data });
    } catch (error) {
      console.error("Error fetching depreciation rates:", error);
      set({
        fetchDepreciationRatesError: "Failed to fetch depreciation rates",
      });
    } finally {
      set({ fetchingDepreciationRates: false });
    }
  },

  saveLease: async (data: LeasePayload) => {
    set({ savingLease: true, saveLeaseError: null });
    try {
      const response = await APIAuth.post("/mobixCamsCollateral/v1/leases", data);
      set({ savingLease: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error saving lease:", error);
      set({ saveLeaseError: "Failed to save lease" });
      throw error;
    } finally {
      set({ savingLease: false });
    }
  },

  updateLease: async (id: string, data: LeasePayload) => {
    set({ updatingLease: true, updateLeaseError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/leases/${id}`,
        data
      );
      set({ updatingLease: false });

      if (data.appraisalId) {
        get().fetchCollaterals(data.appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error updating lease:", error);
      set({ updateLeaseError: "Failed to update lease" });
      throw error;
    } finally {
      set({ updatingLease: false });
    }
  },

  getLease: async (id: string) => {
    set({ fetchingLease: true, fetchLeaseError: null });
    try {
      const response = await API.get(`/mobixCamsCollateral/v1/leases/${id}`);
      set({ fetchingLease: false });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching lease:", error);
      set({ fetchLeaseError: "Failed to fetch lease" });
      throw error;
    } finally {
      set({ fetchingLease: false });
    }
  },

  deactivateLease: async (id: string, appraisalId?: string) => {
    set({ updatingLease: true, updateLeaseError: null });
    try {
      const response = await APIAuth.put(
        `/mobixCamsCollateral/v1/leases/${id}/inactive`
      );
      set({ updatingLease: false });

      if (appraisalId) {
        get().fetchCollaterals(appraisalId);
      }

      return response.data;
    } catch (error) {
      console.error("Error deactivating lease:", error);
      set({ updateLeaseError: "Failed to deactivate lease" });
      throw error;
    } finally {
      set({ updatingLease: false });
    }
  },

  fetchCollaterals: async (appraisalId: string) => {
    if (!appraisalId) {
      console.warn("No appraisalId provided to fetchCollaterals");
      return [];
    }

    set({ fetchingCollaterals: true, fetchCollateralsError: null });
    try {
      const response = await API.get(
        `/mobixCamsCollateral/v1/collaterals/appraisals/${appraisalId}`
      );

      const collateralsData = response.data?.data || {};

      const processedCollaterals: Collateral[] = [
        ...(collateralsData.bankGuarantees || []).map((item: any) => ({
          ...item,
          id: item.bankGuaranteeIdx,
          bankGuaranteeType: item.type,
          type: "bank-guarantee",
        })),
        ...(collateralsData.vehicles || []).map((item: any) => ({
          ...item,
          id: item.vehIdx,
          type: "vehicle",
          typeCode: item.type,
          engineNo: item.enginNo,
          chassisNo: item.chasisNo,
          registrationNo: item.regNo,
          description: item.desc,
          mv: item.marketValue,
          fsv: item.foreSaleValue,
          yearManufacture: item.yearOfManufacture,
        })),
        ...(collateralsData.machineryAndEquipments || []).map((item: any) => ({
          ...item,
          id: item.machineryEquipIdx,
          type: "machinery",
          machineryType: item.type,
          machineryOwnership: item.ownership,
          machinerySupplier: item.supplier,
          machineryCondition: item.condition,
          machineryModel: item.model,
          machineryEngineNo: item.engineNo,
          machinerySerialNo: item.serialChasisNo,
          machineryDescription: item.description,
          machineryBondNo: item.bondNo,
          machineryBondValue: item.bondValue,
          machineryMV: item.marketValue,
          machineryFSV: item.fsv,
          machineryValuedBy: item.valuedBy,
          machineryInsuranceCompany: item.insuCompany,
          machineryReferenceNo: item.refNo,
        })),
        ...(collateralsData.mortgages || []).map((item: any) => ({
          ...item,
          id: item.mortgageIdx,
          type: "property-mortgage",
          propertyType: item.mortgageType,
          propertySubType: item.mortgageSubType,
          propertyOwnership: item.mortgageOwnership,
          propertyBondType: item.mortgageBondType,
          propertyPropertyType: item.mortgagePropertyType,
          propertyBondNo: item.mortgageBondNo,
          propertyBondDate: item.mortgageBondDate,
          propertyDeedNo: item.mortgageDeedNo,
          propertyBondValue: item.mortgageBondValue,
          propertySurveyPlanNo: item.mortgageSurveyPlanNo,
          propertyPOA: item.mortgagePoa,
          propertyPOANumber: item.mortgagePoaNo,
          propertyCompany: item.mortgageCompany,
          propertyLawyerName: item.mortgageLawyerName,
          propertyTitleInsurance: item.mortgageTitleInsurance,
          propertyInsuranceOfBuilding: item.mortgageInsOfBuilding,
          propertyInsuranceValue: item.mortgageInsuranceValue,
          propertyMarketValue: item.mortgageMarketValue,
          propertyFSV: item.mortgageFsv,
          propertyLotNo: item.mortgageLotNo,
          propertyInsuranceCompany: item.mortgageInsuranceCompany,
          propertyReferenceNo: item.mortgageReferenceNo,
        })),
        ...(collateralsData.landStocks || []).map((item: any) => ({
          ...item,
          id: item.landStockIdx,
          type: "land-stock",
        })),
        ...(collateralsData.savings || []).map((item: any) => ({
          ...item,
          id: item.savingsIdx,
          type: "savings",
          savingsType: item.type,
          savingsSubType: item.subType,
          savingsOwnership: item.ownership,
          savingsFDNo: item.fdNo,
          savingsAmount: item.amount,
          savingsMaturityDate: item.maturityDate,
          savingsCompany: item.company,
          savingsDescription: item.description,
          savingsNo: item.savingsNo,
          savingsBuildUpValue: item.savingsBuildValue,
        })),
        ...(collateralsData.leases || []).map((item: any) => ({
          ...item,
          id: item.leaseIdx,
          type: "lease",
          equipmentType: item.leaseEquipType,
          equipmentCost: item.leaseCost,
          supplierCode: item.leaseSupplierCode,
          equipmentName: item.leaseEquipName,
          condition: item.leaseCondition,
          category: item.leaseCategory,
          depreciationCode: item.leaseDepreciationCode,
          vehicleType: item.leaseVehiType,
          manufacturer: item.leaseManufacture,
          model: item.leaseVehiModel,
          engineCapacityCC: item.leaseEnginCapacityCC,
          engineCapacityHP: item.leaseEnginCapacityHP,
          engineNo: item.enginNo,
          chassisNo: item.chasisNo,
          duplicateKey: item.duplicateKey,
          vehicleNo: item.leaseVehiNo,
          registrationBookNo: item.leaseRegBookNo,
          registrationDate: item.leaseRegDate,
          registrationYear: item.leaseRegYear,
          mv: item.marketValue,
          fsv: item.foreSaleValue,
          province: item.leaseProvince,
          insuranceCompany: item.insuCompany,
          referenceNo: item.refNo,
           leaseEquipType: item.leaseEquipType === "V" ? "Vehicle" : "Equipment",
        })),
      ];

      set({ collaterals: processedCollaterals, fetchingCollaterals: false });
      return processedCollaterals;
    } catch (error) {
      console.error("Error fetching collaterals:", error);
      set({
        fetchCollateralsError: "Failed to fetch collaterals",
        fetchingCollaterals: false,
      });
      return [];
    }
  },

  deleteCollateral: async (id: string, type: string, appraisalId?: string) => {
    if (!id || !type) {
      console.warn("Invalid id or type provided to deleteCollateral");
      return false;
    }

    set({ deletingCollateral: true, deleteCollateralError: null });

    try {
      let endpoint = "";

      switch (type) {
        case "BANK_GUARANTEE":
          endpoint = `/mobixCamsCollateral/v1/bank-guarantees/${id}`;
          break;
        case "VEHICLE":
          endpoint = `/mobixCamsCollateral/v1/vehicles/${id}`;
          break;
        case "MACHINERY":
          endpoint = `/mobixCamsCollateral/v1/machinery-equipments/${id}`;
          break;
        case "PROPERTY_MORTGAGE":
          endpoint = `/mobixCamsCollateral/v1/mortgages/${id}`;
          break;
        case "SAVINGS":
          endpoint = `/mobixCamsCollateral/v1/savings/${id}`;
          break;
        case "LAND_STOCK":
          endpoint = `/mobixCamsCollateral/v1/land-stocks/${id}`;
          break;
        case "LEASE":
          endpoint = `/mobixCamsCollateral/v1/leases/${id}`;
          break;
        default:
          throw new Error(`Unsupported collateral type: ${type}`);
      }

      await API.delete(endpoint);

      if (appraisalId) {
        setTimeout(async () => {
          await get().fetchCollaterals(appraisalId);
        }, 500);
      }

      set({ deletingCollateral: false });
      return true;
    } catch (error) {
      console.error(`Error deleting ${type} collateral:`, error);
      set({
        deleteCollateralError: `Failed to delete ${type} collateral`,
        deletingCollateral: false,
      });
      return false;
    }
  },
  fetchOwnershipByCode: async (field: string, code: string) => {
    set({ ownershipsLoading: true });
    try {
      const response = await API.get(`/mobixCamsCommon/v1/ownerships/${code}`);
      set((prev) => ({
        ownershipData: {
          ...prev.ownershipData,
          [field]: response.data, // store separately by field
        },
      }));
    } catch (error) {
      console.error(`Error fetching ownerships for by code:`, error);
    } finally {
      set({ ownershipsLoading: false });
    }
  },

  fetchInsuranceCompaniesByCode: async (code: string) => {
    set({ insuranceCompanyByCodeLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCommon/v1/insurance-companies/${code}`
      );
      set({ insuaranceCompanyData: response.data });
    } catch (error) {
      console.error("Error fetching insurance companies by code:", error);
    } finally {
      set({ insuranceCompanyByCodeLoading: false });
    }
  },
  fetchTypeByCode: async (typeFieldName,securityType, code) => {
  
    set({ typeByCodeLoading: true });
    try {
      const endpoint = `/mobixCamsCommon/v1/sub-security/types-1/${securityType}/types/${code}`;
      const response = await API.get(endpoint);
      set((prev) => ({
        typesData: {
          ...prev.typesData,
          // store by securityType+code to avoid collisions
          [typeFieldName]: response.data,
        },
      }));
    } catch (error) {
      console.error("Error fetching types by code:", error);
    } finally {
      set({ typeByCodeLoading: false });
    }
  },
  fetchSubTypeByCode: async (subTypeFieldName, securityType, code) => {

    set({ subTypeByCodeLoading: true });
    try {
      const endpoint = `/mobixCamsCommon/v1/sub-security/types-2/${securityType}/types/${code}`;
      const response = await API.get(endpoint);
      set((prev) => ({
        subTypesData: {
          ...prev.subTypesData,
         
          [subTypeFieldName]: response.data,
        },
      }));
    } catch (error) {
      console.error("Error fetching types by code:", error);
    } finally {
      set({ subTypeByCodeLoading: false });
    }
  },

  fetchSecurityCategoryByCode: async (code: string) => {
    set({ securityCategoryDataLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCommon/v1/security/categories/${code}`
      );
      set({ securityCategoryData: response.data });
    } catch (error) {
      console.error("Error fetching security category by code:", error);
    } finally {
      set({ securityCategoryDataLoading: false });
    }
  },



  fetchConditionByCode: async (field: string, code: string) => {
    set({ conditionByCodeLoading: true });
    try {
      const response = await API.get(`/mobixCamsCommon/v1/conditions/${code}`);
      set((prev) => ({
        conditionData: {
          ...prev.conditionData,
          [field]: response.data, // store separately by field
        },
      }));
    } catch (error) {
      console.error(`Error fetching  condition`,error);
    } finally {
      set({ conditionByCodeLoading: false });
    }
  },

  fetchVehicleCategoryByCode: async (field: string,code: string) => {
    set({ vehicleCategoryLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCommon/v1/equipment-vehicle/types/${code}`
      );
       set((prev) => ({
        vehicleCategoryData: {
          ...prev.vehicleCategoryData,
          [field]: response.data, // store separately by field
        },
      }));
    } catch (error) {
      console.error("Error fetching vehicle type by code", error);
    } finally {
      set({ vehicleCategoryLoading: false });
    }
  },



}));

export default useCollateralStore;
