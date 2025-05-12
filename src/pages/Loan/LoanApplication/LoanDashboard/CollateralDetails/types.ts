import * as yup from "yup";

export interface CollateralDetailsProps {}

export interface FormValues {
  id?: string;
  securityType: string;

  // Vehicle fields
  vehicleType?: string;
  vehicleOwnership?: string;
  vehicleSupplier?: string;
  vehicleCondition?: string;
  vehicleCategory?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleEngineNo?: string;
  vehicleSerialNo?: string;
  vehicleDescription?: string;
  vehicleMV?: string;
  vehicleBondNo?: string;
  vehicleBondValue?: string;
  vehicleValuedBy?: string;
  vehicleDateOfFirstReg?: Date;

  // Machinery fields
  machineryType?: string;
  machineryOwnership?: string;
  machinerySupplier?: string;
  machineryCondition?: string;
  machineryCategory?: string;
  machineryMake?: string;
  machineryModel?: string;
  machineryEngineNo?: string;
  machinerySerialNo?: string;
  machineryDescription?: string;
  machineryMV?: string;
  machineryBondNo?: string;
  machineryBondValue?: string;
  machineryValuedBy?: string;
  machineryDateOfFirstReg?: Date;

  // Bank Guarantee fields
  bankGuaranteeType?: string;
  bankGuaranteeOwnership?: string;
  startDate?: Date;
  expiryDate?: Date;
  referenceNoInstitution?: string;
  referenceNoIndividual?: string;
  valueOfGuarantee?: string;
  guaranteedTo?: string;
  guaranteeValue?: string;
  institutionName?: string;

  // Property Mortgage fields
  propertyType?: string;
  propertyOwnership?: string;
  propertyLocation?: string;
  propertyArea?: string;
  propertyMarketValue?: string;
  propertyFSV?: string;
  propertyDescription?: string;
  propertyAddress?: string;
  municipality?: string;
  propertyValue?: string;

  // Savings fields
  savingsType?: string;
  savingsOwnership?: string;
  savingsNo?: string;
  savingsBuildUpValue?: string;
  savingsAmount?: string;
  savingsMatchingOne?: string;
  savingsCompany?: string;

  // Land Stock fields
  landStockType?: string;
  landStockOwnership?: string;
  landStockDeedTransferNo?: string;
  landStockAgreementNo?: string;
  landStockLessorName?: string;
  landStockSecurityDate?: Date;
  landStockSecurityType?: string;
  landStockDescription?: string;
  landStockBondNo?: string;
  landStockMarketValue?: string;
  landStockFSV?: string;
}

export const validationSchema = yup.object().shape({
  securityType: yup.string().required("Security Type is required"),

  // Vehicle fields
  vehicleType: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Type is required"),
  }),
  vehicleOwnership: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Ownership is required"),
  }),
  vehicleSupplier: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Supplier is required"),
  }),
  vehicleCondition: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Condition is required"),
  }),
  vehicleCategory: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Category is required"),
  }),
  vehicleMake: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Make is required"),
  }),
  vehicleModel: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Model is required"),
  }),
  vehicleEngineNo: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Engine No is required"),
  }),
  vehicleSerialNo: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Serial No is required"),
  }),
  vehicleDescription: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Description is required"),
  }),
  vehicleMV: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("MV is required"),
  }),
  vehicleBondNo: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Bond No is required"),
  }),
  vehicleBondValue: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Bond Value is required"),
  }),
  vehicleValuedBy: yup.string().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Valued By is required"),
  }),
  vehicleDateOfFirstReg: yup.date().when("securityType", {
    is: "VEHICLE",
    then: (schema) => schema.required("Date of First Registration is required"),
  }),

  // Machinery fields
  machineryType: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Type is required"),
  }),
  machineryOwnership: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Ownership is required"),
  }),
  machinerySupplier: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Supplier is required"),
  }),
  machineryCondition: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Condition is required"),
  }),
  machineryCategory: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Category is required"),
  }),
  machineryMake: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Make is required"),
  }),
  machineryModel: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Model is required"),
  }),
  machineryEngineNo: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Engine No is required"),
  }),
  machinerySerialNo: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Serial No is required"),
  }),
  machineryDescription: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Description is required"),
  }),
  machineryMV: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("MV is required"),
  }),
  machineryBondNo: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Bond No is required"),
  }),
  machineryBondValue: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Bond Value is required"),
  }),
  machineryValuedBy: yup.string().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Valued By is required"),
  }),
  machineryDateOfFirstReg: yup.date().when("securityType", {
    is: "MACHINERY",
    then: (schema) => schema.required("Date of First Registration is required"),
  }),

  // Bank Guarantee fields
  bankGuaranteeType: yup.string().when("securityType", {
    is: "BANK_GUARANTEE",
    then: (schema) => schema.required("Type is required"),
  }),
  bankGuaranteeOwnership: yup.string().when("securityType", {
    is: "BANK_GUARANTEE",
    then: (schema) => schema.required("Ownership is required"),
  }),
  startDate: yup.date().when("securityType", {
    is: "BANK_GUARANTEE",
    then: (schema) => schema.required("Start Date is required"),
  }),
  expiryDate: yup.date().when("securityType", {
    is: "BANK_GUARANTEE",
    then: (schema) => schema.required("Expiry Date is required"),
  }),
  referenceNoInstitution: yup.string().when("securityType", {
    is: "BANK_GUARANTEE",
    then: (schema) => schema.required("Reference No (Institution) is required"),
  }),
  referenceNoIndividual: yup.string().when("securityType", {
    is: "BANK_GUARANTEE",
    then: (schema) => schema.required("Reference No (Individual) is required"),
  }),
  valueOfGuarantee: yup.string().when("securityType", {
    is: "BANK_GUARANTEE",
    then: (schema) => schema.required("Value of Guarantee is required"),
  }),
  guaranteedTo: yup.string().when("securityType", {
    is: "BANK_GUARANTEE",
    then: (schema) => schema.required("Guaranteed To is required"),
  }),
  guaranteeValue: yup.string().when("securityType", {
    is: "BANK_GUARANTEE",
    then: (schema) => schema.required("Guarantee Value is required"),
  }),
  institutionName: yup.string().when("securityType", {
    is: "BANK_GUARANTEE",
    then: (schema) => schema.required("Institution Name is required"),
  }),

  // Property Mortgage fields
  propertyType: yup.string().when("securityType", {
    is: "PROPERTY_MORTGAGE",
    then: (schema) => schema.required("Type is required"),
  }),
  propertyOwnership: yup.string().when("securityType", {
    is: "PROPERTY_MORTGAGE",
    then: (schema) => schema.required("Ownership is required"),
  }),
  propertyLocation: yup.string().when("securityType", {
    is: "PROPERTY_MORTGAGE",
    then: (schema) => schema.required("Location is required"),
  }),
  propertyArea: yup.string().when("securityType", {
    is: "PROPERTY_MORTGAGE",
    then: (schema) => schema.required("Area is required"),
  }),
  propertyMarketValue: yup.string().when("securityType", {
    is: "PROPERTY_MORTGAGE",
    then: (schema) => schema.required("Market Value is required"),
  }),
  propertyFSV: yup.string().when("securityType", {
    is: "PROPERTY_MORTGAGE",
    then: (schema) => schema.required("FSV is required"),
  }),
  propertyDescription: yup.string().when("securityType", {
    is: "PROPERTY_MORTGAGE",
    then: (schema) => schema.required("Description is required"),
  }),
  propertyAddress: yup.string().when("securityType", {
    is: "PROPERTY_MORTGAGE",
    then: (schema) => schema.required("Property Address is required"),
  }),
  municipality: yup.string().when("securityType", {
    is: "PROPERTY_MORTGAGE",
    then: (schema) => schema.required("Municipality is required"),
  }),
  propertyValue: yup.string().when("securityType", {
    is: "PROPERTY_MORTGAGE",
    then: (schema) => schema.required("Property Value is required"),
  }),

  // Savings fields
  savingsType: yup.string().when("securityType", {
    is: "SAVINGS",
    then: (schema) => schema.required("Type is required"),
  }),
  savingsOwnership: yup.string().when("securityType", {
    is: "SAVINGS",
    then: (schema) => schema.required("Ownership is required"),
  }),
  savingsNo: yup.string().when("securityType", {
    is: "SAVINGS",
    then: (schema) => schema.required("Savings No is required"),
  }),
  savingsBuildUpValue: yup.string().when("securityType", {
    is: "SAVINGS",
    then: (schema) => schema.required("Build Up Value is required"),
  }),
  savingsAmount: yup.string().when("securityType", {
    is: "SAVINGS",
    then: (schema) => schema.required("Amount is required"),
  }),
  savingsMatchingOne: yup.string().when("securityType", {
    is: "SAVINGS",
    then: (schema) => schema.required("Matching One is required"),
  }),
  savingsCompany: yup.string().when("securityType", {
    is: "SAVINGS",
    then: (schema) => schema.required("Company is required"),
  }),

  // Land Stock fields
  landStockType: yup.string().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("Type is required"),
  }),
  landStockOwnership: yup.string().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("Ownership is required"),
  }),
  landStockDeedTransferNo: yup.string().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("Deed Transfer No is required"),
  }),
  landStockAgreementNo: yup.string().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("Agreement No is required"),
  }),
  landStockLessorName: yup.string().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("Lessor Name is required"),
  }),
  landStockSecurityDate: yup.date().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("Security Date is required"),
  }),
  landStockSecurityType: yup.string().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("Security Type is required"),
  }),
  landStockDescription: yup.string().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("Description is required"),
  }),
  landStockBondNo: yup.string().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("Bond No is required"),
  }),
  landStockMarketValue: yup.string().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("Market Value is required"),
  }),
  landStockFSV: yup.string().when("securityType", {
    is: "LAND_STOCK",
    then: (schema) => schema.required("FSV is required"),
  }),
}); 