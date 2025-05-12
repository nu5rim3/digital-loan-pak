import * as yup from "yup";

export interface CollateralDetailsProps {
  productCategory?: "LOAN" | "LEASE";
}

export interface FormValues {
  productCategory?: "LOAN" | "LEASE";
  // Lease Product fields
  equipmentType?: string;
  cost?: number;
  supplierCode?: string;
  equipmentName?: string;
  condition?: string;
  category?: string;
  vehicleType?: string;
  manufacturer?: string;
  model?: string;
  engineCapacityCC?: number;
  engineCapacityHP?: number;
  engineNo?: string;
  chasisNo?: string;
  vehicleNo?: string;
  province?: string;
  registrationBookNo?: string;
  registrationDate?: Date;
  duplicateKey?: boolean;
  onlyWorkingKeyAvailable?: boolean;
  onlyInternalValuesMV?: string;
  onlyInternalValuesFSV?: string;

  // Loan Product fields
  securityType?: string;
  type?: string;
  ownership?: string;
  supplier?: string;
  vehicleCategory?: string;
  make?: string;
  serialOrChasisNo?: string;
  description?: string;
  mv?: string;
  registrationNo?: string;
  yearOfManufacture?: string;
  bookReceivedDate?: Date;
  crReleasedDate?: Date;
  valuedBy?: string;
  bondNo?: string;
  bondValue?: string;
  dateOfFirstReg?: Date;
  savingsNo?: string;
  savingsBuildUpValue?: string;
  amount?: string;
  matchingOne?: string;
  company?: string;
  startDate?: Date;
  expiryDate?: Date;
  referenceNoInstitution?: string;
  referenceNoIndividual?: string;
  valueOfGuarantee?: string;
  guaranteedTo?: string;
  guaranteeValue?: string;
  institutionName?: string;
  dateOfExpiry?: Date;
  renewedBy?: string;
  deedTransferNo?: string;
  agreementNo?: string;
  lessorName?: string;
  securityDate?: Date;
  marketValue?: string;
  fsv?: string;
  subType?: string;
  bondType?: string;
  propertyType?: string;
  propertyAddress?: string;
  loanAgreementNo?: string;
  loanReferenceNo?: string;
  propertyValue?: string;
  crNumber?: string;
  salePrice?: string;
  municipality?: string;
  dateOfReg?: Date;
}

export const schema = yup.object().shape({
  // Lease Product fields
  equipmentType: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Equipment Type is required"),
  }),
  cost: yup.number().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Cost is required"),
  }),
  supplierCode: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Supplier Code is required"),
  }),
  equipmentName: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Equipment Name is required"),
  }),
  condition: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Condition is required"),
  }),
  category: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Category is required"),
  }),
  vehicleType: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Vehicle Type is required"),
  }),
  manufacturer: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Manufacturer is required"),
  }),
  model: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Model is required"),
  }),
  engineCapacityCC: yup.number().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Engine Capacity CC is required"),
  }),
  engineCapacityHP: yup.number().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Engine Capacity HP is required"),
  }),
  engineNo: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Engine No is required"),
  }),
  chasisNo: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Chasis No is required"),
  }),
  vehicleNo: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Vehicle No is required"),
  }),
  province: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Province is required"),
  }),
  registrationBookNo: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Registration Book No is required"),
  }),
  registrationDate: yup.date().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Registration Date is required"),
  }),
  onlyInternalValuesMV: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Only Internal Values MV is required"),
  }),
  onlyInternalValuesFSV: yup.string().when("productCategory", {
    is: "LEASE",
    then: (schema) => schema.required("Only Internal Values FSV is required"),
  }),

  // Loan Product fields
  securityType: yup.string().when("productCategory", {
    is: "LOAN",
    then: (schema) => schema.required("Security Type is required"),
  }),
}); 