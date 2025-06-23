import { create } from "zustand";
import { API, APIAuth } from "../services/api";
import { notification } from "antd";

export interface IGoldLoanAppArticleDetails {
  articleDtls: string;
  articleQuantity: number;
  articleStatus: string;
  masterArticleCode: string;
}

export interface IGoldLoanAppDetails {
  appIdx?: string;
  id?: string;
  tppNumber: string;

  goldLoanAppType: string | "GOD" | "DEN";

  goldsmithIdFx?: string;
  goldsmithId?: string;
  goldCollateralValue?: string;
  goldGrossWeight?: string;
  goldLoanAppArticleDtlsDtoList?: IGoldLoanAppArticleDetails[] | null;
  goldMarketValue?: string;
  goldNetWeight?: string;
  goldsmithName?: string;

  denCollateralValue?: string;
  denGrossWeight?: string;
  denMarketValue?: string;
  denNetWeight?: string;

  loanAppStatus?: string | "A" | "I";
}

export interface IProduct {
  tcNo: string;
  pMode: string;
  pFacilityType: string;
  pUser: string;
  pTrhdMe: string;
  pTrhdLType: string;
  pTrhdMethod: string;
  pTrhdBrh: string;
  pTrhdTerm: string;
  pTrhdNoPre: string;
  pTrhdNoDw: string;
  pTrhdTr: string;
  pTrhdLocCost: string;
  pTrhdStmYn: string;
  pTrhdStmPer?: string | null;
  pTrhdStmDuty?: string | null;
  pTrhdCurCode: string;
  pTrhdInvTax: string;
  pTrhdBus: string;
  pTrhdInvTaxRt: string;
  pTrhdCrib: string;
  pTrhdFlexi: string;
  pTrhdBsCd?: string | null;
  pTrhdBsTr?: string | null;
  pTrhdMgTr?: string | null;
  pTrhdReSeq?: string | null;
  pTrhdCustTyp: string;
  pTrhdReward: string;
  pTrhdLCode: string | null;
  pTrhdQuo: string;
  pTrhdStmApp: string;
  pTrhdInsuCoverFlg: string;
  pTrhdInsuCoverAmt: string | null;
  pTrhdIntrType: string | null;
  pTrhdRewardPre: string | null;
  pTrhdRewardType: string | null;
  pTrhdRewardBusagent: string | null;
  pTrhdRewardAddMethod: string | null;
  pTrhdSplitReward: string | null;
  pInsuOption: string | null;
  pInsuAddCrit: string | null;
  pTrhdColMeth: string | null;
  prevLoanProd: string | null;
  prevLoanContractNo: string | null;
  prevLoanOutstanding: string | null;
  countOfRollOver: string | null;
  pTrtx: {
    trtxTrx: string;
    trtxAmt: string;
    trtxAddcrit: string;
    trtxCalMethod: string;
    prtbMndFlg: string;
  }[];
  pStru: {
    struSeq: string;
    struPrds: string;
    struRent: string | null;
  }[];
}

export interface IProductDefinition {
  proCode: string;
  proName: string;
  taxRate: string;
  beBiRate: string;
  dscr: string;
  maxLoanAmount: string;
  loanLimitPrecent: string;
  annualNetOfBnsIncome: string;
  status: string;
  createdBy: string;
  creationDate: string; // ISO date string
  lastModifiedBy: string;
  lastModifiedDate: string; // ISO date string
}
export interface IFinancialEntry {
  key: string;
  monthly?: string;
  semiAnnual?: string;
  annually?: string;
  createdBy?: string;
  creationDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  supportBy?: string | null;
}

export interface ICashFlowData {
  appraisalId: string;
  grossSalaryIncome: string;
  totBusinessIncome: string;
  totHouseholdIncome: string;
  totRevenue: string;
  totHouseholdExpense: string;
  totBusinessExpense: string;
  totExpense: string;
  netMonthlyDisposable: string;
  taxableAmount: string | null;
  beBiRate: string | null;
  dscr: string;
  maxDebtBurden: string;
  tenure: string;
  maxLoanValue: string;
  annualHouseIncome: string;
  annualDisposableIncome: string;

  applicantRevenue: IFinancialEntry[];
  houseHoldContribution: IFinancialEntry[];
  houseHoldExpenses: IFinancialEntry[];
  bnsOrAgriExpenses: IFinancialEntry[];
}

export interface IBusinessIncome {
  appraisalId?: string;
  idx?: string;
  _idx?: string;
  profession: string;
  sourceOfIncome: string;
  purposeOfLoan: string;
  bnsName: string;
  natureOfBns: string;
  bnsAddress: string;
  phoneNo: string;
  description: string;
  prevExpInBns: string;
  ownOfBnsPlace: string;
  costOfBns: string;
  // bnsRatings: string;
  repeatCustomer: string;
  status?: string;
}

export interface IOwnerships {
  ownership: string;
  qty: string;
  amount: string;
  totalAmount?: string;
  status?: string;
  createdBy?: string;
  creationDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface IAgricultureIncome {
  appraisalId?: string;
  idx?: string;
  profession: string;
  sourceOfIncome: string;
  natureOfTheBorrower: string;
  ownOfCult: string;
  ownOfLand: string;
  ownName: string;
  ownCNIC: string;
  ownAddress: string;
  ownContact: string;
  acresOwned: string;
  acresRented: string;
  acresTotal: string;
  acresOfRabi: string;
  rabiHarvestingDate: string;
  rabiCultivationDate: string;
  acresOfKharif: string;
  kharifHarvestingDate: string;
  kharifCultivationDate: string;
  ownLandLoc: string;
  rentedLandLoc: string;
  district: string;
  cropsToBeCult: string[];
  cropsName: string;
  landDetails: string;
  comment: string;
  loanLimitRabi: string;
  loanLimitKharif: string;
  loanLimitTotal: string;
  purposeOfLoan: string;
  floodsFactor: string;
  irrigation: string;
  methods: string;
  proofOfCult: string;
  expInCult: string;
  marketCheck: string;
  agriSecured: string;
  borrowerDistrict: string;
  loanTenure: string;
  insCompany: string;
  policyIssuedDate: string;
  policyExpiredDate: string;
  receiptNo: string;
  premiumRate: string;
  premiumRateForSugar: string;
  evidance: string;
  claimLodged: string;
  otherInfo1: string;
  otherInfo2: string;
  otherInfo3: string;
  assets: IOwnerships[];
  totAssetsValue: string;
  status?: string;
  createdBy?: string;
  creationDate?: string;
  rabiCrop: string;
  kharifCrop: string;
}

export interface ISalaryIncome {
  appraisalId?: string;
  idx?: string;
  profession: string;
  sourceOfIncome: string;
  purposeOfLoan: string;
  employer: string;
  typeOfBusiness: string;
  designation: string;
  currEmpPeriod: string;
  empAddress: string;
  typeOfJob: string;
  natureOfEmp: string;
  contactNo: string;
  residenceOrWorking: string;
  proofOfSalary: string;
  repeatCustomer: string | undefined;
  status?: string;
  createdBy?: string;
  creationDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface ILiveStockIncome {
  appraisalId?: string;
  idx?: string;
  profession: string;
  sourceOfIncome: string;
  purposeOfLoan: string;
  animalOrCrop: string;
  buffaloes: string;
  cows: string;
  bulls: string;
  collateral: string;
  claimLodged: string;
  animalTagging: string;
  borrowerDistrict: string;
  sowodo: string;
  loanTenure: string;
  insCompany: string;
  policyIssuedDate: string;
  policyExpiredDate: string;
  receiptNo: string;
  premiumRate: string;
  floodsFactor: string;
  irrigation: string;
  methods: string;
  proofOfCult: string;
  expInCult: string;
  agriSecured: string;
  marketCheck: string;
  natureOfTheBorrower: string;
  ownOfLand: string;
}

export interface IOtherIncome {
  appraisalId?: string;
  idx?: string;
  profession: string;
  sourceOfIncome: string;
  purposeOfLoan: string;
  incomeCategory: string;
  description: string;
  status?: string;
  createdBy?: string;
  creationDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface ISpecialCharge {
  trtxTrx: string | undefined;
  trtxAmt: string | undefined;
  trtxAddcrit: string | undefined;
  trtxCalMethod: string | undefined;
  prtbMndFlg: string | undefined;
}

export interface ITrailCalulation {
  tcNo?: string;
  pMode: string;
  pUser: string;
  prodCat: string;
  pFacilityType: string;
  pTrhdMe: string;
  pTrhdLType: string;
  pTrhdMethod: string;
  pTrhdBrh: string;
  pTrhdTerm: string;
  pTrhdNoPre: string;
  pTrhdNoDw: string;
  pTrhdTr: string;
  pTrhdLocCost: string;
  pTrhdStmYn: string;
  pTrhdStmPer1: string;
  pTrhdStmDuty1?: string;
  pTrhdCurCode: string;
  pTrhdInvTax: string;
  pTrhdBus: string;
  pTrhdInvTaxRt: string;
  pTrhdCrib: string;
  pTrhdFlexi: string;
  pTrhdBsCd: string;
  pTrhdBsTr: string;
  pTrhdMgTr: string;
  pTrhdReSeq: string;
  pTrhdCustTyp: string;
  pTrhdReward: string;
  pTrhdLCode: string;
  pTrhdQuo: string;
  pTrhdStmPer: string;
  pTrhdStmDuty?: string;
  pTrhdStmApp: string;
  pTrhdInsuCoverFlg: string;
  pTrhdInsuCoverAmt: string;
  pTrhdIntrType: string;
  pTrhdRewardPre: string;
  pTrhdRewardType: string;
  pTrhdRewardBusagent: string;
  pTrhdRewardAddMethod: string;
  pTrhdSplitReward: string;
  pInsuOption: string;
  pInsuAddCrit: string;
  pTrhdColMeth: string;
  prevLoanProd?: string;
  prevLoanContractNo?: string | null;
  prevLoanOutstanding?: string | null;
  countOfRollOver?: string | null;
  pTrtx: ISpecialCharge[];
  pStru: {
    struSeq: number;
    struPrds: string;
    struRent: string;
  }[];
}

export interface ITrailCalulationResponse {
  code: string;
  object: {
    tcNo: string;
    code: string;
    message: string;
    detail: string;
  };
  message: string;
}

export interface ITrailCalulationDetailsPayload {
  tcNo: string;
  mode: "T" | "P";
}

export interface ITrailCalulationDetailsResponse {
  code: string;
  object: {
    tcNo: string;
    code: string;
    message: string;
    detail: string;
    totalReceivable: string;
    loanAmount: string;
    downPayment: string;
    facilityDetails: {
      seq: string;
      term: string;
      instalment: string;
    }[];
    trtx: {
      trtxTrx: string;
      trtxAmt: string;
      trtxAddcrit: string;
      trtxCalMethod: string;
    }[];
  };
}

interface ICreditState {
  goldLoanAppDetails: IGoldLoanAppDetails[];
  goldLoanAppDetailsLoading: boolean;
  goldLoanAppDetailsError: string | null;

  applicantRevenue: IFinancialEntry[];
  houseHoldContribution: IFinancialEntry[];
  houseHoldExpenses: IFinancialEntry[];
  bnsOrAgriExpenses: IFinancialEntry[];

  cashFlows: ICashFlowData | null;
  cashFlowsLoading: boolean;
  cashFlowsError: string | null;

  grossSalaryIncome: number | string | null;
  totBusinessIncome: number | string | null;
  totHouseholdIncome: number | string | null;
  totRevenue: number | string | null;

  totHouseholdExpense: number | string | null;
  totBusinessExpense: number | string | null;
  totExpense: number | string | null;

  annualHouseIncome: number | string | null;
  annualDisposableIncome: number | string | null;

  netMonthlyDisposable: number | string | null;

  product: IProduct | null;
  productLoading: boolean;
  productError: string | null;

  productDefinition: IProductDefinition | null;
  productDefinitionLoading: boolean;
  productDefinitionError: string | null;

  maxDebtBurden: number | string | null;
  maxLoanValue: number | string | null;
  taxableAmount: number | string | null;

  annualDisposable: number | string | null;
  annualHousehold: number | string | null;
  annualRevenue: number | string | null;

  isAlegibleFroLoan: boolean;

  businessIncome: IBusinessIncome[];
  businessIncomeLoading: boolean;
  businessIncomeError: string | null;

  agricultureIncome: IAgricultureIncome[];
  agricultureIncomeLoading: boolean;
  agricultureIncomeError: string | null;

  salaryIncome: ISalaryIncome[];
  salaryIncomeLoading: boolean;
  salaryIncomeError: string | null;

  ownerships: IOwnerships[];

  businessIncomeList: IBusinessIncome[];

  liveStockIncome: ILiveStockIncome[];
  liveStockIncomeLoading: boolean;
  liveStockIncomeError: string | null;

  otherIncome: IOtherIncome[];
  otherIncomeLoading: boolean;
  otherIncomeError: string | null;

  trailCalulation: ITrailCalulationResponse | null;
  trailCalulationLoading: boolean;
  trailCalulationError: string | null;

  trailCalulationDetails: ITrailCalulationDetailsResponse | null;
  trailCalulationDetailsLoading: boolean;
  trailCalulationDetailsError: string | null;

  trailCalulationDetailsByAppId: ITrailCalulation | null;
  trailCalulationDetailsByAppIdLoading: boolean;
  trailCalulationDetailsByAppIdError: string | null;

  fetachGoldLoanAppDetails: (appId: string) => Promise<void>;
  addGoldLoanAppDetails: (data: IGoldLoanAppDetails) => Promise<void>;
  updateGoldLoanAppDetails: (
    goldId: string,
    data: IGoldLoanAppDetails
  ) => Promise<void>;

  addCashFlows: (appId: string, data: ICashFlowData) => Promise<void>;
  fetchCashFlows: (appId: string) => Promise<void>;

  addApplicantRevenue: (
    data: IFinancialEntry | IFinancialEntry[]
  ) => Promise<void>;
  updateApplicantRevenue: (key: string, data: IFinancialEntry) => Promise<void>;
  fetchApplicantRevenue: () => Promise<void>;
  removeApplicantRevenue: (key: string) => Promise<void>;

  addHouseHoldContribution: (
    data: IFinancialEntry | IFinancialEntry[]
  ) => Promise<void>;
  updateHouseHoldContribution: (
    key: string,
    data: IFinancialEntry
  ) => Promise<void>;
  fetchHouseHoldContribution: () => Promise<void>;
  removeHouseHoldContribution: (key: string) => Promise<void>;

  addHouseHoldExpenses: (
    data: IFinancialEntry | IFinancialEntry[]
  ) => Promise<void>;
  updateHouseHoldExpenses: (
    key: string,
    data: IFinancialEntry
  ) => Promise<void>;
  fetchHouseHoldExpenses: () => Promise<void>;
  removeHouseHoldExpenses: (key: string) => Promise<void>;

  addBnsOrAgriExpenses: (
    data: IFinancialEntry | IFinancialEntry[]
  ) => Promise<void>;
  updateBnsOrAgriExpenses: (
    key: string,
    data: IFinancialEntry
  ) => Promise<void>;
  fetchBnsOrAgriExpenses: () => Promise<void>;
  removeBnsOrAgriExpenses: (key: string) => Promise<void>;

  getMonthValueBasedOnKey: (key: string) => number;
  calulateGrossSalary: () => void;
  calculateTotalHouseRevenue: () => void;
  getTotalBusinessRevenue: () => void;
  calculateTotalRevenue: () => void;

  getMonthValueBasedOnKeyExpenses: (key: string) => number;
  calculateTotalHouseholdExpense: () => void;
  calculateTotalBusinessExpense: () => void;
  calculateTotalExpense: () => void;

  calculateNetMonthlyDisposable: () => void;

  calculateMaxDebtBurden: () => void;
  calucalteMaxLoanValue: () => void;
  calculateAnnualDisposable: () => void;
  calculateAnnualHousehold: () => void;
  calculateAnnualRevenue: () => void;
  calculateTaxableAmount: () => void;

  checkAlegibleFroLoan: () => void;

  fetchProduct: (appId: string) => Promise<void>;
  fetchProductDefinition: (prodCode: string) => Promise<void>;

  fetchBusinessIncome: (appId: string) => Promise<void>;
  addBusinessIncome: (data: IBusinessIncome) => Promise<void>;
  removeBusinessIncome: (index: number) => Promise<void>;
  updateBusinessIncomeList: (
    _idx: string,
    data: IBusinessIncome
  ) => Promise<void>;
  loadBusinessIncomeList: () => Promise<void>;
  resetBusinessIncomeList: () => Promise<void>;
  saveBusinessIncome: (appId: string, data: IBusinessIncome) => Promise<void>;
  updateBusinessIncome: (appId: string, data: IBusinessIncome) => Promise<void>;

  fetchAgricultureIncome: (appId: string) => Promise<void>;
  addAgricultureIncome: (
    appId: string,
    data: IAgricultureIncome
  ) => Promise<void>;
  updateAgricultureIncome: (
    appId: string,
    data: IAgricultureIncome
  ) => Promise<void>;

  fetchSalaryIncome: (appId: string) => Promise<void>;
  addSalaryIncome: (appId: string, data: ISalaryIncome) => Promise<void>;
  updateSalaryIncome: (appId: string, data: ISalaryIncome) => Promise<void>;

  addOwnerships: (data: IOwnerships) => Promise<void>;
  addOwnershipsList: (data: IOwnerships[]) => Promise<void>;
  updateOwnerships: (key: string, data: IOwnerships) => Promise<void>;
  fetchOwnerships: () => Promise<void>;
  removeOwnerships: (key: string) => Promise<void>;
  resetOwnerships: () => Promise<void>;

  addLiveStockIncome: (appId: string, data: ILiveStockIncome) => Promise<void>;
  updateLiveStockIncome: (
    appId: string,
    data: ILiveStockIncome
  ) => Promise<void>;
  fetchLiveStockIncome: (appId: string) => Promise<void>;

  fetchOtherIncome: (appId: string) => Promise<void>;
  addOtherIncome: (appId: string, data: IOtherIncome) => Promise<void>;
  updateOtherIncome: (appId: string, data: IOtherIncome) => Promise<void>;

  sendTrailCalulation: (
    data: ITrailCalulation
  ) => Promise<ITrailCalulationResponse>;

  fetchTrailCalulation: (
    tcNo: string,
    mode: "T" | "P"
  ) => Promise<ITrailCalulationDetailsResponse | undefined>;

  resetTrailCalculationDetails: () => Promise<void>;
  saveTrailCalulation: (
    appId: string,
    cliId: string,
    data: ITrailCalulation
  ) => Promise<void>;

  fetchTrailCalulationDetailsByAppId: (
    appId: string
  ) => Promise<ITrailCalulationDetailsResponse | undefined>;

  resetTrailCalucationDetailsByAppId: () => void;

  resetTrailCalulation: () => void;

  resetAllTrailCalucationData: () => void;
}

const useCreditStore = create<ICreditState>((set) => ({
  goldLoanAppDetails: [],
  goldLoanAppDetailsLoading: false,
  goldLoanAppDetailsError: null,

  applicantRevenue: [],
  houseHoldContribution: [],
  houseHoldExpenses: [],
  bnsOrAgriExpenses: [],

  cashFlows: null,
  cashFlowsLoading: false,
  cashFlowsError: null,

  grossSalaryIncome: null,
  totBusinessIncome: null,
  totHouseholdIncome: null,
  totRevenue: null,

  totHouseholdExpense: null,
  totBusinessExpense: null,
  totExpense: null,

  annualHouseIncome: null,
  annualDisposableIncome: null,

  netMonthlyDisposable: null,

  product: null,
  productLoading: false,
  productError: null,

  productDefinition: null,
  productDefinitionLoading: false,
  productDefinitionError: null,

  maxDebtBurden: null,
  maxLoanValue: null,
  taxableAmount: null,

  annualDisposable: null,
  annualHousehold: null,
  annualRevenue: null,

  isAlegibleFroLoan: false,

  businessIncome: [],
  businessIncomeLoading: false,
  businessIncomeError: null,

  agricultureIncome: [],
  agricultureIncomeLoading: false,
  agricultureIncomeError: null,

  salaryIncome: [],
  salaryIncomeLoading: false,
  salaryIncomeError: null,

  ownerships: [],

  businessIncomeList: [],

  liveStockIncome: [],
  liveStockIncomeLoading: false,
  liveStockIncomeError: null,

  otherIncome: [],
  otherIncomeLoading: false,
  otherIncomeError: null,

  trailCalulation: null,
  trailCalulationLoading: false,
  trailCalulationError: null,

  trailCalulationDetails: null,
  trailCalulationDetailsLoading: false,
  trailCalulationDetailsError: null,

  trailCalulationDetailsByAppId: null,
  trailCalulationDetailsByAppIdLoading: false,
  trailCalulationDetailsByAppIdError: null,

  fetachGoldLoanAppDetails: async (appId: string) => {
    set({ goldLoanAppDetailsLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/gold-loan/${appId}/appraisalId`
      );
      set({
        goldLoanAppDetails: [response.data],
        goldLoanAppDetailsLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        goldLoanAppDetailsError: error.message,
        goldLoanAppDetailsLoading: false,
      });
    }
  },

  addGoldLoanAppDetails: async (data: IGoldLoanAppDetails) => {
    set({ goldLoanAppDetailsLoading: true });
    try {
      APIAuth.post("/mobixCamsCredit/v1/gold-loan", data);
      set(() => ({
        goldLoanAppDetailsLoading: false,
      }));
      notification.success({
        message: "Gold Facility Application Details Added Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        goldLoanAppDetailsError: error.message,
        goldLoanAppDetailsLoading: false,
      });
    }
  },

  updateGoldLoanAppDetails: async (
    goldId: string,
    data: IGoldLoanAppDetails
  ) => {
    set({ goldLoanAppDetailsLoading: true });
    try {
      await APIAuth.put(`/mobixCamsCredit/v1/gold-loan/${goldId}`, data);
      set(() => ({
        goldLoanAppDetailsLoading: false,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        goldLoanAppDetailsError: error.message,
        goldLoanAppDetailsLoading: false,
      });
    }
  },

  addCashFlows: async (appId: string, data: ICashFlowData) => {
    set({ cashFlowsLoading: true });
    try {
      await APIAuth.post(
        `/mobixCamsCredit/v1/credit/income-expense/${appId}`,
        data
      );
      set(() => ({
        cashFlowsLoading: false,
      }));
      notification.success({
        message: "Cash Flow Added Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        cashFlowsError: error.message,
        cashFlowsLoading: false,
      });
    }
  },

  fetchCashFlows: async (appId: string) => {
    set({ cashFlowsLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credit/income-expense/${appId}`
      );
      set({
        cashFlows: response.data,
        cashFlowsLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        cashFlowsError: error.message,
        cashFlowsLoading: false,
      });
    }
  },

  addApplicantRevenue: async (data: IFinancialEntry | IFinancialEntry[]) => {
    if (Array.isArray(data)) {
      set(() => ({
        applicantRevenue: data,
      }));
    } else {
      set((state) => ({
        applicantRevenue: [...state.applicantRevenue, data],
      }));
      notification.success({
        message: "Applicant Revenue Added Successfully",
      });
    }
  },

  updateApplicantRevenue: async (key: string, data: IFinancialEntry) => {
    set((state) => ({
      applicantRevenue: state.applicantRevenue.map((item) =>
        item.key === key ? { ...item, ...data } : item
      ),
    }));
    notification.success({
      message: "Applicant Revenue Updated Successfully",
    });
  },

  fetchApplicantRevenue: async () => {
    set((state) => ({
      applicantRevenue: state.applicantRevenue,
    }));
  },

  removeApplicantRevenue: async (key: string) => {
    set((state) => ({
      applicantRevenue: state.applicantRevenue.filter(
        (item) => item.key !== key
      ),
    }));
    notification.success({
      message: "Applicant Revenue Removed Successfully",
    });
  },

  addHouseHoldContribution: async (
    data: IFinancialEntry | IFinancialEntry[]
  ) => {
    if (Array.isArray(data)) {
      set(() => ({
        houseHoldContribution: data,
      }));
    } else {
      set((state) => ({
        houseHoldContribution: [...state.houseHoldContribution, data],
      }));
      notification.success({
        message: "Household Contribution Added Successfully",
      });
    }
  },

  updateHouseHoldContribution: async (key: string, data: IFinancialEntry) => {
    set((state) => ({
      houseHoldContribution: state.houseHoldContribution.map((item) =>
        item.key === key ? { ...item, ...data } : item
      ),
    }));
    notification.success({
      message: "Household Contribution Updated Successfully",
    });
  },

  fetchHouseHoldContribution: async () => {
    set((state) => ({
      houseHoldContribution: state.houseHoldContribution,
    }));
  },

  removeHouseHoldContribution: async (key: string) => {
    set((state) => ({
      houseHoldContribution: state.houseHoldContribution.filter(
        (item) => item.key !== key
      ),
    }));
    notification.success({
      message: "Household Contribution Removed Successfully",
    });
  },

  addHouseHoldExpenses: async (data: IFinancialEntry | IFinancialEntry[]) => {
    if (Array.isArray(data)) {
      set(() => ({
        houseHoldExpenses: data,
      }));
    } else {
      set((state) => ({
        houseHoldExpenses: [...state.houseHoldExpenses, data],
      }));
      notification.success({
        message: "Household Expenses Added Successfully",
      });
    }
  },

  updateHouseHoldExpenses: async (key: string, data: IFinancialEntry) => {
    set((state) => ({
      houseHoldExpenses: state.houseHoldExpenses.map((item) =>
        item.key === key ? { ...item, ...data } : item
      ),
    }));
    notification.success({
      message: "Household Expenses Updated Successfully",
    });
  },

  fetchHouseHoldExpenses: async () => {
    set((state) => ({
      houseHoldExpenses: state.houseHoldExpenses,
    }));
  },

  removeHouseHoldExpenses: async (key: string) => {
    set((state) => ({
      houseHoldExpenses: state.houseHoldExpenses.filter(
        (item) => item.key !== key
      ),
    }));
    notification.success({
      message: "Household Expenses Removed Successfully",
    });
  },

  addBnsOrAgriExpenses: async (data: IFinancialEntry | IFinancialEntry[]) => {
    if (Array.isArray(data)) {
      set(() => ({
        bnsOrAgriExpenses: data,
      }));
    } else {
      set((state) => ({
        bnsOrAgriExpenses: [...state.bnsOrAgriExpenses, data],
      }));
      notification.success({
        message: "Business or Agriculture Expenses Added Successfully",
      });
    }
  },

  updateBnsOrAgriExpenses: async (key: string, data: IFinancialEntry) => {
    set((state) => ({
      bnsOrAgriExpenses: state.bnsOrAgriExpenses.map((item) =>
        item.key === key ? { ...item, ...data } : item
      ),
    }));
    notification.success({
      message: "Business or Agriculture Expenses Updated Successfully",
    });
  },

  fetchBnsOrAgriExpenses: async () => {
    set((state) => ({
      bnsOrAgriExpenses: state.bnsOrAgriExpenses,
    }));
  },

  removeBnsOrAgriExpenses: async (key: string) => {
    set((state) => ({
      bnsOrAgriExpenses: state.bnsOrAgriExpenses.filter(
        (item) => item.key !== key
      ),
    }));
    notification.success({
      message: "Business or Agriculture Expenses Removed Successfully",
    });
  },

  getMonthValueBasedOnKey: (key: string) => {
    if (!key) return 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredItem: any = useCreditStore
      .getState()
      .applicantRevenue.find((item) => item.key === key);

    return filteredItem ? Number(filteredItem.monthly) : 0;
  },

  calculateTotalHouseRevenue: () => {
    set((state) => ({
      totHouseholdIncome: state.houseHoldContribution.reduce((acc, item) => {
        return acc + Number(item.monthly ?? 0);
      }, 0),
    }));
  },

  calculateTotalRevenue: () => {
    set((state) => ({
      totRevenue: state.applicantRevenue.reduce((acc, item) => {
        return (
          acc + Number(item.monthly ?? 0) + Number(state.totHouseholdIncome)
        );
      }, 0),
    }));
  },

  calulateGrossSalary: () => {
    set((state) => ({
      grossSalaryIncome:
        state.getMonthValueBasedOnKey("Salary") +
        state.getMonthValueBasedOnKey("Pension"),
    }));
  },

  getTotalBusinessRevenue: () => {
    set((state) => ({
      totBusinessIncome:
        state.getMonthValueBasedOnKey("Business 1") +
        state.getMonthValueBasedOnKey("Business 2"),
    }));
  },

  getMonthValueBasedOnKeyExpenses: (key: string) => {
    if (!key) return 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredItem: any = useCreditStore
      .getState()
      .houseHoldExpenses.find((item) => item.key === key);

    return filteredItem ? Number(filteredItem.monthly) : 0;
  },

  calculateTotalHouseholdExpense: () => {
    set((state) => ({
      totHouseholdExpense: state.houseHoldExpenses.reduce((acc, item) => {
        return acc + Number(item.monthly ?? 0);
      }, 0),
    }));
  },

  calculateTotalBusinessExpense: () => {
    set((state) => ({
      totBusinessExpense: state.bnsOrAgriExpenses.reduce((acc, item) => {
        return acc + Number(item.monthly ?? 0);
      }, 0),
    }));
  },

  calculateTotalExpense: () => {
    set((state) => ({
      totExpense:
        state.houseHoldExpenses.reduce((acc, item) => {
          return acc + Number(item.monthly ?? 0);
        }, 0) +
        state.bnsOrAgriExpenses.reduce((acc, item) => {
          return acc + Number(item.monthly ?? 0);
        }, 0),
    }));
  },

  calculateNetMonthlyDisposable: () => {
    set((state) => ({
      netMonthlyDisposable:
        state.applicantRevenue.reduce((acc, item) => {
          return (
            acc + Number(item.monthly ?? 0) + Number(state.totHouseholdIncome)
          );
        }, 0) -
        (state.houseHoldExpenses.reduce((acc, item) => {
          return acc + Number(item.monthly ?? 0);
        }, 0) +
          state.bnsOrAgriExpenses.reduce((acc, item) => {
            return acc + Number(item.monthly ?? 0);
          }, 0)),
    }));
  },

  fetchProduct: async (appId: string) => {
    set({ productLoading: true });
    try {
      const response = await API.get(`/mobixCamsCredit/v1/credit/tc/${appId}`);
      set({
        product: response.data,
        productLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        productError: error.message,
        productLoading: false,
      });
    }
  },

  fetchProductDefinition: async (prodCode: string) => {
    set({ productDefinitionLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credit/product/definition/${prodCode}`
      );
      set({
        productDefinition: response.data,
        productDefinitionLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        productDefinitionError: error.message,
        productDefinitionLoading: false,
      });
    }
  },

  calculateMaxDebtBurden: () => {
    set((state) => ({
      maxDebtBurden:
        (Number(state.netMonthlyDisposable ?? 0) *
          Number(state.productDefinition?.dscr ?? 0)) /
        100,
    }));
  },

  calucalteMaxLoanValue: () => {
    const goldLoanType = ["EG", "GL", "GN", "MG"];
    const requestedLoanType = useCreditStore.getState().product?.pTrhdLType;

    if (goldLoanType.includes(requestedLoanType ?? "")) {
      set((state) => ({
        maxLoanValue:
          ((Number(state.netMonthlyDisposable ?? 0) *
            Number(state.productDefinition?.dscr ?? 0)) /
            100) *
          12,
      }));
    } else {
      set((state) => ({
        maxLoanValue:
          ((Number(state.netMonthlyDisposable ?? 0) *
            Number(state.productDefinition?.dscr ?? 0)) /
            100) *
          Number(state.product?.pTrhdTerm ?? 0),
      }));
    }
  },

  calculateAnnualDisposable: () => {
    set((state) => ({
      annualDisposable: Number(state.netMonthlyDisposable) * 12,
    }));
  },

  calculateAnnualHousehold: () => {
    set((state) => ({
      annualHousehold: Number(state.totHouseholdIncome) * 12,
    }));
  },

  calculateAnnualRevenue: () => {
    set((state) => ({
      annualRevenue: Number(state.totRevenue) * 12,
    }));
  },

  calculateTaxableAmount: () => {
    set((state) => ({
      taxableAmount:
        Number(state.annualRevenue ?? 0) *
        (Number(state.productDefinition?.taxRate ?? 0) / 100),
    }));
  },

  checkAlegibleFroLoan: () => {
    const loanAmount = useCreditStore.getState().product?.pTrhdLocCost ?? 0;
    const maxLoanValue = useCreditStore.getState().maxLoanValue ?? 0;
    if (maxLoanValue === 0) {
      set({ isAlegibleFroLoan: false });
    } else if (loanAmount > maxLoanValue) {
      set({ isAlegibleFroLoan: false });
    } else if (loanAmount <= maxLoanValue) {
      set({ isAlegibleFroLoan: true });
    }
  },

  fetchBusinessIncome: async (appId: string) => {
    set({ businessIncomeLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credit/loan/app/bns/${appId}`
      );
      set({
        businessIncome: response.data,
        businessIncomeLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        businessIncomeError: error.message,
        businessIncomeLoading: false,
      });
    }
  },

  addBusinessIncome: async (data: IBusinessIncome) => {
    set((state) => ({
      businessIncomeList: [...state.businessIncomeList, data],
    }));
    notification.success({
      message: "Business Income Added Successfully",
    });
  },

  removeBusinessIncome: async (index: number) => {
    set((state) => ({
      businessIncomeList: state.businessIncomeList.filter(
        (_, _index) => _index !== index
      ),
    }));
    notification.success({
      message: "Business Income Removed Successfully",
    });
  },

  updateBusinessIncomeList: async (_idx: string, data: IBusinessIncome) => {
    set((state) => ({
      businessIncomeList: state.businessIncomeList.map((item) =>
        item._idx === _idx ? { ...item, ...data } : item
      ),
    }));
    notification.success({
      message: "Business Income Updated Successfully",
    });
  },

  loadBusinessIncomeList: async () => {
    set((state) => ({
      businessIncomeList: state.businessIncomeList,
    }));
  },

  resetBusinessIncomeList: async () => {
    set(() => ({
      businessIncomeList: [],
    }));
  },

  saveBusinessIncome: async (appId: string, data: IBusinessIncome) => {
    set({ businessIncomeLoading: true });
    try {
      await APIAuth.post(
        `/mobixCamsCredit/v1/credit/loan/app/bns/${appId}`,
        data
      );
      set(() => ({
        businessIncomeLoading: false,
      }));
      notification.success({
        message: "Business Income Added Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        businessIncomeError: error.message,
        businessIncomeLoading: false,
      });
    }
  },

  updateBusinessIncome: async (appId: string, data: IBusinessIncome) => {
    set({ businessIncomeLoading: true });
    try {
      await APIAuth.put(
        `/mobixCamsCredit/v1/credit/loan/app/bns/${appId}`,
        data
      );
      set(() => ({
        businessIncomeLoading: false,
      }));
      notification.success({
        message: "Business Income Updated Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        businessIncomeError: error.message,
        businessIncomeLoading: false,
      });
    }
  },

  fetchAgricultureIncome: async (appId: string) => {
    set({ agricultureIncomeLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credit/loan/app/cult/${appId}`
      );
      set({
        agricultureIncome: response.data,
        agricultureIncomeLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        agricultureIncomeError: error.message,
        agricultureIncomeLoading: false,
      });
    }
  },

  addAgricultureIncome: async (appId: string, data: IAgricultureIncome) => {
    set({ agricultureIncomeLoading: true });
    try {
      await APIAuth.post(
        `/mobixCamsCredit/v1/credit/loan/app/cult/${appId}`,
        data
      );
      set(() => ({
        agricultureIncomeLoading: false,
      }));
      notification.success({
        message: "Agriculture Income Added Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        agricultureIncomeError: error.message,
        agricultureIncomeLoading: false,
      });
    }
  },

  updateAgricultureIncome: async (appId: string, data: IAgricultureIncome) => {
    set({ agricultureIncomeLoading: true });
    try {
      await APIAuth.put(
        `/mobixCamsCredit/v1/credit/loan/app/cult/${appId}`,
        data
      );
      set(() => ({
        agricultureIncomeLoading: false,
      }));
      notification.success({
        message: "Agriculture Income Updated Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        agricultureIncomeError: error.message,
        agricultureIncomeLoading: false,
      });
    }
  },

  fetchSalaryIncome: async (appId: string) => {
    // fetch salary income
    set({ salaryIncomeLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credit/loan/app/sal/${appId}`
      );
      set({
        salaryIncome: [response.data],
        salaryIncomeLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        salaryIncomeError: error.message,
        salaryIncomeLoading: false,
      });
    }
  },
  addSalaryIncome: async (appId: string, data: ISalaryIncome) => {
    set({ salaryIncomeLoading: true });
    try {
      await APIAuth.post(
        `/mobixCamsCredit/v1/credit/loan/app/sal/${appId}`,
        data
      );
      set(() => ({
        salaryIncomeLoading: false,
      }));
      notification.success({
        message: "Salary Income Added Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        salaryIncomeError: error.message,
        salaryIncomeLoading: false,
      });
    }
  },

  updateSalaryIncome: async (appId: string, data: ISalaryIncome) => {
    set({ salaryIncomeLoading: true });
    try {
      await APIAuth.put(
        `/mobixCamsCredit/v1/credit/loan/app/sal/${appId}`,
        data
      );
      set(() => ({
        salaryIncomeLoading: false,
      }));
      notification.success({
        message: "Salary Income Updated Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        salaryIncomeError: error.message,
        salaryIncomeLoading: false,
      });
    }
  },

  addOwnerships: async (data: IOwnerships) => {
    set((state) => ({
      ownerships: [...state.ownerships, data],
    }));
    notification.success({
      message: "Ownership Added Successfully",
    });
  },
  updateOwnerships: async (key: string, data: IOwnerships) => {
    set((state) => ({
      ownerships: state.ownerships.map((item) =>
        item.ownership === key ? { ...item, ...data } : item
      ),
    }));
    notification.success({
      message: "Ownership Updated Successfully",
    });
  },

  addOwnershipsList: async (data: IOwnerships[]) => {
    set(() => ({
      ownerships: data,
    }));
  },

  fetchOwnerships: async () => {
    set((state) => ({
      ownerships: state.ownerships,
    }));
  },

  removeOwnerships: async (key: string) => {
    set((state) => ({
      ownerships: state.ownerships.filter((item) => item.ownership !== key),
    }));
    notification.success({
      message: "Ownership Removed Successfully",
    });
  },

  resetOwnerships: async () => {
    set(() => ({
      ownerships: [],
    }));
  },

  // live stock
  addLiveStockIncome: async (appId: string, data: ILiveStockIncome) => {
    set({ liveStockIncomeLoading: true });
    try {
      await APIAuth.post(
        `/mobixCamsCredit/v1/credit/loan/app/stk/${appId}`,
        data
      );
      set(() => ({
        liveStockIncomeLoading: false,
      }));
      notification.success({
        message: "Live Stock Income Added Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        liveStockIncomeError: error.message,
        liveStockIncomeLoading: false,
      });
    }
  },

  updateLiveStockIncome: async (appId: string, data: ILiveStockIncome) => {
    set({ liveStockIncomeLoading: true });
    try {
      await APIAuth.put(
        `/mobixCamsCredit/v1/credit/loan/app/stk/${appId}`,
        data
      );
      set(() => ({
        liveStockIncomeLoading: false,
      }));
      notification.success({
        message: "Live Stock Income Updated Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        liveStockIncomeError: error.message,
        liveStockIncomeLoading: false,
      });
    }
  },

  fetchLiveStockIncome: async (appId: string) => {
    set({ liveStockIncomeLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credit/loan/app/stk/${appId}`
      );
      set({
        liveStockIncome: [response.data],
        liveStockIncomeLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        liveStockIncomeError: error.message,
        liveStockIncomeLoading: false,
      });
    }
  },

  fetchOtherIncome: async (appId: string) => {
    set({ otherIncomeLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/credit/loan/app/oth/${appId}`
      );
      set({
        otherIncome: response.data,
        otherIncomeLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        otherIncomeError: error.message,
        otherIncomeLoading: false,
      });
    }
  },

  addOtherIncome: async (appId: string, data: IOtherIncome) => {
    set({ otherIncomeLoading: true });
    try {
      const response = await APIAuth.post(
        `/mobixCamsCredit/v1/credit/loan/app/oth/${appId}`,
        data
      );
      set((state) => ({
        otherIncome: [...state.otherIncome, response.data],
        otherIncomeLoading: false,
      }));
      notification.success({
        message: "Other Income Added Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        otherIncomeError: error.message,
        otherIncomeLoading: false,
      });
    }
  },

  updateOtherIncome: async (appId: string, data: IOtherIncome) => {
    set({ otherIncomeLoading: true });
    try {
      await APIAuth.put(
        `/mobixCamsCredit/v1/credit/loan/app/oth/${appId}`,
        data
      );
      set(() => ({
        otherIncomeLoading: false,
      }));
      notification.success({
        message: "Other Income Updated Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        otherIncomeError: error.message,
        otherIncomeLoading: false,
      });
    }
  },

  // /mobixCamsCredit/v1/credit/tc/cal
  sendTrailCalulation: async (data: ITrailCalulation) => {
    set({ trailCalulationLoading: true });
    try {
      const response = await APIAuth.post(
        `/mobixCamsCredit/v1/credit/tc/cal`,
        data
      );

      set({
        trailCalulation: response.data,
        trailCalulationLoading: false,
      });

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        trailCalulationError: error.message,
        trailCalulationLoading: false,
      });
    }
  },

  // /mobixCamsCredit/v1/credit/tc/getTCDetails
  fetchTrailCalulation: async (
    tcNo: string,
    mode: "T" | "P"
  ): Promise<ITrailCalulationDetailsResponse | undefined> => {
    set({ trailCalulationDetailsLoading: true });
    try {
      const response = await APIAuth.post(
        `/mobixCamsCredit/v1/credit/tc/getTCDetails`,
        { tcNo, mode }
      );
      set({
        trailCalulationDetails: response.data,
        trailCalulationDetailsLoading: false,
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        trailCalulationDetailsError: error.message,
        trailCalulationDetailsLoading: false,
      });
    }
  },

  resetTrailCalculationDetails: async () =>
    set(() => ({ trailCalulationDetails: null })),

  // mobixCamsCredit/v1/credit/tc/{leadId}/cliIdx/{cliIdx}
  saveTrailCalulation: async (
    appId: string,
    cliId: string,
    data: ITrailCalulation
  ) => {
    set({ trailCalulationLoading: true });
    try {
      await APIAuth.post(
        `/mobixCamsCredit/v1/credit/tc/${appId}/cliIdx/${cliId}`,
        data
      );
      set(() => ({
        trailCalulationLoading: false,
      }));
      notification.success({
        message: "Trial Calculation Saved Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        trailCalulationError: error.message,
        trailCalulationLoading: false,
      });
    }
  },

  // /mobixCamsCredit/v1/credit/tc/{appId}
  fetchTrailCalulationDetailsByAppId: async (
    appId: string
  ): Promise<ITrailCalulationDetailsResponse | undefined> => {
    set({ trailCalulationDetailsByAppIdLoading: true });
    try {
      const response = await API.get(`/mobixCamsCredit/v1/credit/tc/${appId}`);
      set({
        trailCalulationDetailsByAppId: response.data,
        trailCalulationDetailsByAppIdLoading: false,
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        trailCalulationDetailsByAppIdError: error.message,
        trailCalulationDetailsByAppIdLoading: false,
      });
    }
  },

  resetTrailCalucationDetailsByAppId: () =>
    set(() => ({ trailCalulationDetailsByAppId: null })),

  resetTrailCalulation: () =>
    set(() => ({
      trailCalulation: null,
      trailCalulationLoading: false,
      trailCalulationError: null,
    })),

  resetAllTrailCalucationData: () =>
    set(() => ({
      trailCalucationData: null,
      trailCalucationDataLoading: false,
      trailCalucationDataError: null,
      trailCalulationDetails: null,
      trailCalulationDetailsLoading: false,
      trailCalulationDetailsError: null,
      trailCalulation: null,
      trailCalulationLoading: false,
      trailCalulationError: null,
    })),
}));

export default useCreditStore;
