import { create, StateCreator } from "zustand";
import { persist, PersistOptions, PersistStorage } from "zustand/middleware";
import { API } from "../services/api";
// import { notification } from "antd";

interface IOperator {
  vendorCode: string;
  vendorDesc: string;
  vendorTelcoCode: string;
  status: "A" | "I";
}

interface IOrganizationType {
  code: string;
  description: string;
  status: "A" | "I";
}

interface ICnicType {
  code: string;
  description: string;
}

interface IEducationLevel {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IHeadofFamily {
  productCode: string;
  code: string;
  description: string;
  creditScore: string;
  status: "A" | "I";
}

interface IHealthCondition {
  productCode: string;
  code: string;
  description: string;
  creditScore: string;
  status: "A" | "I";
}

interface IResidenceType {
  code: string;
  description: string;
  status: "A" | "I";
}

interface ICommunity {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IArea {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IRelationship {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IOccupation {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IInformationSource {
  code: string;
  description: string;
  status: "A" | "I";
}

interface ILanguages {
  code: string;
  description: string;
  status: "A" | "I";
}

interface ISector {
  code: string;
  description: string;
  status: "A" | "I";
}

interface ISubSector {
  code: string;
  sector: string;
  description: string;
  status: "A" | "I";
}
interface IBank {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IArticleMaster {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IMarketValue {
  id: string;
  valueAmount: string;
  valueStatus: string | "A" | "I";
  valueComment: string;
  createdBy: string;
  creationDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  valueDate: string;
}

interface IGoldsmith {
  id: string;
  branchIdFx: string;
  shopName: string;
  ownerName: string;
  contactNumber: string;
  address: string;
  addLineOne: string;
  addLineTwo: string | null;
  goldsmithStatus: string | "A" | "I";
  createdBy: string;
  creationDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  branchName: string;
}

interface IFacilityPurpose {
  code: string;
}

interface INatureOfBusiness {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IRepeatCustomers {
  productCode: string;
  code: string;
  description: string;
  creditScore: string;
  status: "A" | "I";
}

interface IBusinessOwnership {
  code: string;
  description: string;
  creditScore: string;
  status: "A" | "I";
}

interface ILoanPurpose {
  description: string;
  creditScore: string;
  status: "A" | "I";
}
interface ICultLoanPurpose {
  description: string;
  creditScore: string;
  status: "A" | "I";
  code: string;
  productCode: string;
}

interface IFloodsFactor {
  code: string;
  description: string;
  creditScore: string;
  status: "A" | "I";
}

interface IIrrigation {
  code: string;
  description: string;
  creditScore: string;
  status: "A" | "I";
}

interface IAgriMethods {
  code: string;
  description: string;
  creditScore: string;
  status: "A" | "I";
}

interface IProofOfCultivation {
  code: string;
  description: string;
  creditScore: string;
  status: "A" | "I";
}

interface INatureofEmployment {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IJobs {
  code: string;
  description: string;
  status: "A" | "I";
}

interface IDistanceForResidenceOrWork {
  code: string;
  description: string;
  status: "A" | "I";
  creditScore: string;
}

interface ISalary {
  code: string;
  description: string;
  status: "A" | "I";
  creditScore: string;
}

interface IOwnership {
  code: string;
  description: string;
  status: "A" | "I";
  creditScore: string;
}

interface IMarketCheck {
  code: string;
  description: string;
  status: "A" | "I";
  creditScore: string;
  productCode: string;
}
interface IFacilityType {
  code: string;
  description: string;
  status: "A" | "I";
}
interface IProductType {
  prodCode: string;
  prodCurrency: string;
  prodName: string;
  applicableCat: string;
  prodCat: string;
  prodCatDesc: string;
  calMethod: string;
  calMethodDesc: string;
  defaultCalMethod: string;
  rewardFlag: string;
  rewardType: string | null;
  rewardDefaultValue: string | null;
  maxRewardAmt: string | null;
  rewardRate: string;
  rewardAddCriteria: string | null;
  prodFlag1: string;
  prodFlag2: string;
  generalInfo: string | null;
  specialCharges: string | null;
  tcSubTypes: string | null;
  appSubTypes: string | null;
  calMethods: string | null;
}

interface ISubProductType {
  prodCode: string;
  currency: string;
  subTypeCode: string;
  subTypeDesc: string;
  subTypeStatus: string;
  subTypeDefault: string;
}

interface ILocations {
  code: string;
  productCode: string;
  locationName: string;
  creditScore: string;
  status: "A" | "I";
}
interface ICommonState {
  operators: IOperator[];
  operatorLoading: boolean;
  operatorError: string | null;

  ecibReportUrl: string | null;
  ecibReportLoading: boolean;
  ecibReportError: string | null;

  organizationType: IOrganizationType[];
  organizationTypeLoading: boolean;
  organizationTypeError: string | null;

  cnicStaus: ICnicType[];
  cnicStausLoading: boolean;
  cnicStausError: string | null;

  educationLevel: IEducationLevel[];
  educationLevelLoading: boolean;
  educationLevelError: string | null;

  headOfFamily: IHeadofFamily[];
  headOfFamilyLoading: boolean;
  headOfFamilyError: string | null;

  healthCondition: IHealthCondition[];
  healthConditionLoading: boolean;
  healthConditionError: string | null;

  residenceType: IResidenceType[];
  residenceTypeLoading: boolean;
  residenceTypeError: string | null;

  communities: ICommunity[];
  communityLoading: boolean;
  communityError: string | null;

  areas: IArea[];
  areaLoading: boolean;
  areaError: string | null;

  relationship: IRelationship[];
  relationshipLoading: boolean;
  relationshipError: string | null;

  occupations: IOccupation[];
  occupationLoading: boolean;
  occupationError: string | null;

  informationSources: IInformationSource[];
  informationSourceLoading: boolean;
  informationSourceError: string | null;

  languages: ILanguages[];
  languageLoading: boolean;
  languageError: string | null;

  sectors: ISector[];
  sectorLoading: boolean;
  sectorError: string | null;

  subSectors: ISubSector[];
  subSectorLoading: boolean;
  subSectorError: string | null;

  banks: IBank[];
  bankLoading: boolean;
  bankError: string | null;

  marketValue: IMarketValue | null;
  marketValueLoading: boolean;
  marketValueError: string | null;

  articleMaster: IArticleMaster[];
  articleMasterLoading: boolean;
  articleMasterError: string | null;

  goldsmiths: IGoldsmith[];
  goldsmithLoading: boolean;
  goldsmithError: string | null;

  facilityPurpose: IFacilityPurpose[];
  facilityPurposeLoading: boolean;
  facilityPurposeError: string | null;

  natureOfBusiness: INatureOfBusiness[];
  natureOfBusinessLoading: boolean;
  natureOfBusinessError: string | null;

  repeatCustomers: IRepeatCustomers[];
  repeatCustomersLoading: boolean;
  repeatCustomersError: string | null;

  businessOwnership: IBusinessOwnership[];
  businessOwnershipLoading: boolean;
  businessOwnershipError: string | null;

  loanPurposes: ILoanPurpose[];
  loanPurposesLoading: boolean;
  loanPurposesError: string | null;

  floodsFactor: IFloodsFactor[];
  floodsFactorLoading: boolean;
  floodsFactorError: string | null;

  irrigation: IIrrigation[];
  irrigationLoading: boolean;
  irrigationError: string | null;

  agriMethods: IAgriMethods[];
  agriMethodsLoading: boolean;
  agriMethodsError: string | null;

  proofOfCultivation: IProofOfCultivation[];
  proofOfCultivationLoading: boolean;
  proofOfCultivationError: string | null;

  natureOfEmployment: INatureofEmployment[];
  natureOfEmploymentLoading: boolean;
  natureOfEmploymentError: string | null;

  jobs: IJobs[];
  jobsLoading: boolean;
  jobsError: string | null;

  distanceForResidenceOrWork: IDistanceForResidenceOrWork[];
  distanceForResidenceOrWorkLoading: boolean;
  distanceForResidenceOrWorkError: string | null;

  salary: ISalary[];
  salaryLoading: boolean;
  salaryError: string | null;

  ownership: IOwnership[];
  ownershipLoading: boolean;
  ownershipError: string | null;

  cultLoanPurposes: ICultLoanPurpose[];
  cultLoanPurposesLoading: boolean;
  cultLoanPurposesError: string | null;

  marketCheck: IMarketCheck[];
  marketCheckLoading: boolean;
  marketCheckError: string | null;

  facilityTypes: IFacilityType[];
  facilityTypesLoading: boolean;
  facilityTypesError: string | null;

  productTypes: IProductType[];
  productTypesLoading: boolean;
  productTypesError: string | null;

  subProductTypes: ISubProductType[];
  subProductTypesLoading: boolean;
  subProductTypesError: string | null;

  locations: ILocations[];
  locationsLoading: boolean;
  locationsError: string | null;

  productCategory: {
    code: string;
    description: string;
  }[];

  fetchOperators: () => Promise<void>;
  fetchECIBReport: (cnic: string) => Promise<void>;
  fetchOrganizationType: () => Promise<void>;
  fetchCNICStaus: () => Promise<void>;
  fetchEducationLevel: () => Promise<void>;
  fetchHeadOfFamily: () => Promise<void>;
  fetchHealthCondition: () => Promise<void>;
  fetchResidenceType: () => Promise<void>;
  fetchCommunities: () => Promise<void>;
  fetchAreas: () => Promise<void>;
  fetchRelationship: () => Promise<void>;
  fetchOccupations: () => Promise<void>;
  fetchInformationSources: () => Promise<void>;
  fetchLanguages: () => Promise<void>;
  fetchSectors: () => Promise<void>;
  fetchSubSectors: (secId: string) => Promise<void>;
  fetchBanks: () => Promise<void>;
  fetchMarketValue: () => Promise<void>;
  fetchArticleMaster: () => Promise<void>;
  fetchGoldsmith: (branchCode: string) => Promise<void>;
  fetchFacilityPurpose: () => Promise<void>;
  fetchNatureOfBusiness: () => Promise<void>;
  fetchRepeatCustomers: () => Promise<void>;
  fetchBusinessOwnership: () => Promise<void>;
  fetchLoanPurposes: (productCode: string) => Promise<void>;
  fetchFloodsFactor: (productCode: string) => Promise<void>;
  fetchIrrigation: (productCode: string) => Promise<void>;
  fetchAgriMethods: (productCode: string) => Promise<void>;
  fetchProofOfCultivation: (productCode: string) => Promise<void>;
  fetchNatureOfEmployment: () => Promise<void>;
  fetchJobs: () => Promise<void>;
  fetchDistanceForResidenceOrWork: (productCode: string) => Promise<void>;
  fetchSalary: (productCode: string) => Promise<void>;
  fetchRepeatCustomersWithProdCode: (productCode: string) => Promise<void>;
  fetchOwnership: (productCode: string) => Promise<void>;
  fetchCultLoanPurposes: (productCode: string) => Promise<void>;
  fetchMarketCheck: (productCode: string) => Promise<void>;
  fetchFacilityTypes: () => Promise<void>;
  fetchProductTypes: (facilityCode: string) => Promise<void>;
  fetchSubProductTypes: (prodCode: string) => Promise<void>;
  fetchLocations: () => Promise<void>;
}

type TPersist = (
  config: StateCreator<ICommonState>,
  options: PersistOptions<ICommonState>
) => StateCreator<ICommonState>;

const localStorageWrapper: PersistStorage<ICommonState> = {
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

const useCommonStore = create<ICommonState>(
  (persist as TPersist)(
    (set) => ({
      operators: [],
      operatorLoading: false,
      operatorError: null,

      ecibReportError: null,
      ecibReportLoading: false,
      ecibReportUrl: null,

      organizationType: [],
      organizationTypeLoading: false,
      organizationTypeError: null,

      cnicStaus: [],
      cnicStausLoading: false,
      cnicStausError: null,

      educationLevel: [],
      educationLevelLoading: false,
      educationLevelError: null,

      headOfFamily: [],
      headOfFamilyLoading: false,
      headOfFamilyError: null,

      healthCondition: [],
      healthConditionLoading: false,
      healthConditionError: null,

      residenceType: [],
      residenceTypeLoading: false,
      residenceTypeError: null,

      communities: [],
      communityLoading: false,
      communityError: null,

      areas: [],
      areaLoading: false,
      areaError: null,

      relationship: [],
      relationshipLoading: false,
      relationshipError: null,

      occupations: [],
      occupationLoading: false,
      occupationError: null,

      informationSources: [],
      informationSourceLoading: false,
      informationSourceError: null,

      languages: [],
      languageLoading: false,
      languageError: null,

      sectors: [],
      sectorLoading: false,
      sectorError: null,

      subSectors: [],
      subSectorLoading: false,
      subSectorError: null,

      banks: [],
      bankLoading: false,
      bankError: null,

      marketValue: null,
      marketValueLoading: false,
      marketValueError: null,

      articleMaster: [],
      articleMasterLoading: false,
      articleMasterError: null,

      goldsmiths: [],
      goldsmithLoading: false,
      goldsmithError: null,

      facilityPurpose: [],
      facilityPurposeLoading: false,
      facilityPurposeError: null,

      natureOfBusiness: [],
      natureOfBusinessLoading: false,
      natureOfBusinessError: null,

      repeatCustomers: [],
      repeatCustomersLoading: false,
      repeatCustomersError: null,

      businessOwnership: [],
      businessOwnershipLoading: false,
      businessOwnershipError: null,

      loanPurposes: [],
      loanPurposesLoading: false,
      loanPurposesError: null,

      floodsFactor: [],
      floodsFactorLoading: false,
      floodsFactorError: null,

      irrigation: [],
      irrigationLoading: false,
      irrigationError: null,

      agriMethods: [],
      agriMethodsLoading: false,
      agriMethodsError: null,

      proofOfCultivation: [],
      proofOfCultivationLoading: false,
      proofOfCultivationError: null,

      natureOfEmployment: [],
      natureOfEmploymentLoading: false,
      natureOfEmploymentError: null,

      jobs: [],
      jobsLoading: false,
      jobsError: null,

      distanceForResidenceOrWork: [],
      distanceForResidenceOrWorkLoading: false,
      distanceForResidenceOrWorkError: null,

      salary: [],
      salaryLoading: false,
      salaryError: null,

      ownership: [],
      ownershipLoading: false,
      ownershipError: null,

      cultLoanPurposes: [],
      cultLoanPurposesLoading: false,
      cultLoanPurposesError: null,

      marketCheck: [],
      marketCheckLoading: false,
      marketCheckError: null,

      facilityTypes: [],
      facilityTypesLoading: false,
      facilityTypesError: null,

      productTypes: [],
      productTypesLoading: false,
      productTypesError: null,

      subProductTypes: [],
      subProductTypesLoading: false,
      subProductTypesError: null,

      locations: [],
      locationsLoading: false,
      locationsError: null,

      productCategory: [
        {
          code: "A",
          description: "Lease",
        },
        {
          code: "C",
          description: "Loan",
        },
      ],

      fetchOperators: async () => {
        set({ operatorLoading: true, operatorError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/sms/vendors");
          set({ operators: response.data, operatorLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ operatorError: error.message, operatorLoading: false });
        }
      },

      fetchECIBReport: async (cnic: string) => {
        set({
          ecibReportLoading: true,
          ecibReportError: null,
          ecibReportUrl: null,
        });
        try {
          const response = await API.get(
            `/mobixCamsCredit/v1/credit/ecib/resources/${cnic}`,
            { responseType: "arraybuffer" } // Important for binary PDF data
          );

          const blob = new Blob([response.data], { type: "application/pdf" });
          const pdfUrl = URL.createObjectURL(blob);

          set({ ecibReportUrl: pdfUrl, ecibReportLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ ecibReportError: error.message, ecibReportLoading: false });
        }
      },

      fetchOrganizationType: async () => {
        set({ operatorLoading: true, operatorError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/organizations");
          set({
            organizationType: response.data,
            organizationTypeLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ organizationTypeError: error.message, operatorLoading: false });
        }
      },

      fetchCNICStaus: async () => {
        set({ cnicStausLoading: true, cnicStausError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/cnic-status");
          set({ cnicStaus: response.data, cnicStausLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ cnicStausError: error.message, cnicStausLoading: false });
        }
      },

      fetchEducationLevel: async () => {
        set({ educationLevelLoading: true, educationLevelError: null });
        try {
          const response = await API.get(
            "/mobixCamsCommon/v1/education-levels"
          );
          set({ educationLevel: response.data, educationLevelLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            educationLevelError: error.message,
            educationLevelLoading: false,
          });
        }
      },

      fetchHeadOfFamily: async () => {
        set({ headOfFamilyLoading: true, headOfFamilyError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/fml-heads");
          set({ headOfFamily: response.data, headOfFamilyLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ headOfFamilyError: error.message, headOfFamilyLoading: false });
        }
      },

      fetchHealthCondition: async () => {
        set({ healthConditionLoading: true, healthConditionError: null });
        try {
          const response = await API.get(
            "/mobixCamsCommon/v1/health-conditions/products/IE"
          );
          set({
            healthCondition: response.data,
            healthConditionLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            healthConditionError: error.message,
            healthConditionLoading: false,
          });
        }
      },

      fetchResidenceType: async () => {
        set({ residenceTypeLoading: true, residenceTypeError: null });
        try {
          const response = await API.get(
            "/mobixCamsCommon/v1/residential-types"
          );
          set({ residenceType: response.data, residenceTypeLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            residenceTypeError: error.message,
            residenceTypeLoading: false,
          });
        }
      },

      fetchCommunities: async () => {
        set({ communityLoading: true, communityError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/communities");
          set({ communities: response.data, communityLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ communityError: error.message, communityLoading: false });
        }
      },

      // /mobixCamsCommon/v1/cities/areas
      fetchAreas: async () => {
        set({ areaLoading: true, areaError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/cities/areas");
          set({ areas: response.data, areaLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ areaError: error.message, areaLoading: false });
        }
      },

      fetchRelationship: async () => {
        set({ relationshipLoading: true, relationshipError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/fml-details");
          set({ relationship: response.data, relationshipLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            relationshipError: error.message,
            relationshipLoading: false,
          });
        }
      },

      // /mobixCamsCommon/v1/occupations
      fetchOccupations: async () => {
        set({ occupationLoading: true, occupationError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/occupations");
          set({ occupations: response.data, occupationLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ occupationError: error.message, occupationLoading: false });
        }
      },

      // mobixCamsCommon/v1/information-sources
      fetchInformationSources: async () => {
        set({ informationSourceLoading: true, informationSourceError: null });
        try {
          const response = await API.get(
            "/mobixCamsCommon/v1/information-sources"
          );
          set({
            informationSources: response.data,
            informationSourceLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            informationSourceError: error.message,
            informationSourceLoading: false,
          });
        }
      },

      // /mobixCamsCommon/v1/languages
      fetchLanguages: async () => {
        set({ languageLoading: true, languageError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/languages");
          set({ languages: response.data, languageLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ languageError: error.message, languageLoading: false });
        }
      },

      // /mobixCamsCommon/v1/sectors
      fetchSectors: async () => {
        set({ sectorLoading: true, sectorError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/sectors");
          set({ sectors: response.data, sectorLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ sectorError: error.message, sectorLoading: false });
        }
      },

      // /mobixCamsCommon/v1/sub-sectors/{sec_id}
      fetchSubSectors: async (secId: string) => {
        set({ subSectorLoading: true, subSectorError: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/sub-sectors/${secId}`
          );
          set({ subSectors: response.data, subSectorLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ subSectorError: error.message, subSectorLoading: false });
        }
      },

      fetchBanks: async () => {
        set({ bankLoading: true, bankError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/pd-banks");
          set({ banks: response.data, bankLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ bankError: error.message, bankLoading: false });
        }
      },

      fetchMarketValue: async () => {
        set({ marketValueLoading: true, marketValueError: null });
        const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/market-value/${currentDate}`
          );
          set({ marketValue: response.data, marketValueLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ marketValueError: error.message, marketValueLoading: false });
        }
      },

      fetchArticleMaster: async () => {
        set({ articleMasterLoading: true, articleMasterError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/article-master");
          set({ articleMaster: response.data, articleMasterLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            articleMasterError: error.message,
            articleMasterLoading: false,
          });
        }
      },

      fetchGoldsmith: async (branchCode: string) => {
        set({ goldsmithLoading: true, goldsmithError: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/goldsmith/${branchCode}/branchCode`
          );
          set({ goldsmiths: response.data, goldsmithLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ goldsmithError: error.message, goldsmithLoading: false });
        }
      },

      // /mobixCamsCommon/v1/facility-purposes
      fetchFacilityPurpose: async () => {
        set({ facilityPurposeLoading: true, facilityPurposeError: null });
        try {
          const response = await API.get(
            "/mobixCamsCommon/v1/facility-purposes"
          );
          set({
            facilityPurpose: response.data,
            facilityPurposeLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            facilityPurposeError: error.message,
            facilityPurposeLoading: false,
          });
        }
      },

      // /mobixCamsCommon/v1/nature-of-businesses
      fetchNatureOfBusiness: async () => {
        set({ natureOfBusinessLoading: true, natureOfBusinessError: null });
        try {
          const response = await API.get(
            "/mobixCamsCommon/v1/nature-of-businesses"
          );
          set({
            natureOfBusiness: response.data,
            natureOfBusinessLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            natureOfBusinessError: error.message,
            natureOfBusinessLoading: false,
          });
        }
      },

      // /mobixCamsCommon/v1/repeat-customers
      fetchRepeatCustomers: async () => {
        set({ repeatCustomersLoading: true, repeatCustomersError: null });
        try {
          const response = await API.get(
            "/mobixCamsCommon/v1/repeat-customers"
          );
          set({
            repeatCustomers: response.data,
            repeatCustomersLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            repeatCustomersError: error.message,
            repeatCustomersLoading: false,
          });
        }
      },

      // /mobixCamsCommon/v1/business-ownerships
      fetchBusinessOwnership: async () => {
        set({ businessOwnershipLoading: true, businessOwnershipError: null });
        try {
          const response = await API.get(
            "/mobixCamsCommon/v1/business-ownerships"
          );
          set({
            businessOwnership: response.data,
            businessOwnershipLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            businessOwnershipError: error.message,
            businessOwnershipLoading: false,
          });
        }
      },

      // /mobixCamsCommon/v1/loan-purposes/products/{product_code}
      fetchLoanPurposes: async (productCode: string) => {
        set({ loanPurposesLoading: true, loanPurposesError: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/loan-purposes/products/${productCode}`
          );
          set({ loanPurposes: response.data, loanPurposesLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ loanPurposesError: error.message, loanPurposesLoading: false });
        }
      },

      // /mobixCamsCommon/v1/floods-factors/products/{product_code}
      fetchFloodsFactor: async (productCode: string) => {
        set({ floodsFactorLoading: true, floodsFactorError: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/floods-factors/products/${productCode}`
          );
          set({ floodsFactor: response.data, floodsFactorLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ floodsFactorError: error.message, floodsFactorLoading: false });
        }
      },

      // /mobixCamsCommon/v1/irrigations/products/{product_code}
      fetchIrrigation: async (productCode: string) => {
        set({ irrigationLoading: true, irrigationError: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/irrigations/products/${productCode}`
          );
          set({ irrigation: response.data, irrigationLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ irrigationError: error.message, irrigationLoading: false });
        }
      },

      // /mobixCamsCommon/v1/agri-methods/products/{product_code}
      fetchAgriMethods: async (productCode: string) => {
        set({ agriMethodsLoading: true, agriMethodsError: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/agri-methods/products/${productCode}`
          );
          set({ agriMethods: response.data, agriMethodsLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ agriMethodsError: error.message, agriMethodsLoading: false });
        }
      },

      // /mobixCamsCommon/v1/cultivation-proofs/products/{product_code}
      fetchProofOfCultivation: async (productCode: string) => {
        set({
          proofOfCultivationLoading: true,
          proofOfCultivationError: null,
        });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/cultivation-proofs/products/${productCode}`
          );
          set({
            proofOfCultivation: response.data,
            proofOfCultivationLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            proofOfCultivationError: error.message,
            proofOfCultivationLoading: false,
          });
        }
      },

      fetchNatureOfEmployment: async () => {
        set({ natureOfEmploymentLoading: true, natureOfEmploymentError: null });
        try {
          const response = await API.get(
            "/mobixCamsCommon/v1/employment-categories"
          );
          set({
            natureOfEmployment: response.data,
            natureOfEmploymentLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            natureOfEmploymentError: error.message,
            natureOfEmploymentLoading: false,
          });
        }
      },

      // /mobixCamsCommon/v1/jobs
      fetchJobs: async () => {
        set({ jobsLoading: true, jobsError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/jobs");
          set({ jobs: response.data, jobsLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ jobsError: error.message, jobsLoading: false });
        }
      },

      // /mobixCamsCommon/v1/applicant-distances/products/{prodCode}
      fetchDistanceForResidenceOrWork: async (productCode: string) => {
        set({
          distanceForResidenceOrWorkLoading: true,
          distanceForResidenceOrWorkError: null,
        });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/applicant-distances/products/${productCode}`
          );
          set({
            distanceForResidenceOrWork: response.data,
            distanceForResidenceOrWorkLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            distanceForResidenceOrWorkError: error.message,
            distanceForResidenceOrWorkLoading: false,
          });
        }
      },
      // /mobixCamsCommon/v1/salary-information/products/{product_code}
      fetchSalary: async (productCode: string) => {
        set({ salaryLoading: true, salaryError: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/salary-information/products/${productCode}`
          );
          set({ salary: response.data, salaryLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ salaryError: error.message, salaryLoading: false });
        }
      },

      // /mobixCamsCommon/v1/repeat-customers/products/{product_code}
      fetchRepeatCustomersWithProdCode: async (productCode: string) => {
        set({
          repeatCustomersLoading: true,
          repeatCustomersError: null,
        });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/repeat-customers/products/${productCode}`
          );
          set({
            repeatCustomers: response.data,
            repeatCustomersLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            repeatCustomersError: error.message,
            repeatCustomersLoading: false,
          });
        }
      },

      // /mobixCamsCommon/v1/cultivation-ownerships/products/{product_code}
      fetchOwnership: async (productCode: string) => {
        set({ ownershipLoading: true, ownershipError: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/cultivation-ownerships/products/${productCode}`
          );
          set({ ownership: response.data, ownershipLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ ownershipError: error.message, ownershipLoading: false });
        }
      },

      fetchCultLoanPurposes: async (productCode: string) => {
        set({ cultLoanPurposesLoading: true, cultLoanPurposesError: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/loan-purposes/products/${productCode}`
          );
          set({
            cultLoanPurposes: response.data,
            cultLoanPurposesLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            cultLoanPurposesError: error.message,
            cultLoanPurposesLoading: false,
          });
        }
      },

      fetchMarketCheck: async (productCode: string) => {
        set({ marketCheckLoading: true, marketCheckError: null });
        try {
          const response = await API.get(
            `/mobixCamsCommon/v1/field-verifications/products/${productCode}`
          );
          set({ marketCheck: response.data, marketCheckLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ marketCheckError: error.message, marketCheckLoading: false });
        }
      },

      // /mobixCamsCommon/v1/facility-types
      fetchFacilityTypes: async () => {
        set({ facilityTypesLoading: true, facilityTypesError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/facility-types");
          set({ facilityTypes: response.data, facilityTypesLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            facilityTypesError: error.message,
            facilityTypesLoading: false,
          });
        }
      },

      // /mobixCamsLoan/v1/loans/product-all/{id}
      fetchProductTypes: async (facilityCode: string) => {
        set({ productTypesLoading: true, productTypesError: null });
        try {
          const response = await API.get(
            `/mobixCamsLoan/v1/loans/product-all/${facilityCode}`
          );
          set({ productTypes: response.data, productTypesLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ productTypesError: error.message, productTypesLoading: false });
        }
      },

      // /mobixCamsLoan/v1/loans/sub-product/{id}
      fetchSubProductTypes: async (prodCode: string) => {
        set({ subProductTypesLoading: true, subProductTypesError: null });
        try {
          const response = await API.get(
            `/mobixCamsLoan/v1/loans/sub-product/${prodCode}`
          );
          set({
            subProductTypes: response.data,
            subProductTypesLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            subProductTypesError: error.message,
            subProductTypesLoading: false,
          });
        }
      },

      // /mobixCamsCommon/v1/geo-locations
      fetchLocations: async () => {
        set({ locationsLoading: true, locationsError: null });
        try {
          const response = await API.get("/mobixCamsCommon/v1/geo-locations");
          set({ locations: response.data, locationsLoading: false });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ locationsError: error.message, locationsLoading: false });
        }
      },
    }),

    {
      name: "common-store", // unique name
      storage: localStorageWrapper, // custom storage wrapper
      partialize: (state) => ({
        ...state,
        areas: state.areas,
        communities: state.communities,
        residenceType: state.residenceType,
        healthCondition: state.healthCondition,
        headOfFamily: state.headOfFamily,
        educationLevel: state.educationLevel,
        relationship: state.relationship,
        occupations: state.occupations,
        informationSources: state.informationSources,
        languages: state.languages,
        sectors: state.sectors,
        subSectors: state.subSectors,
        banks: state.banks,
        organizationType: state.organizationType,
      }),
    }
  )
);

export default useCommonStore;
