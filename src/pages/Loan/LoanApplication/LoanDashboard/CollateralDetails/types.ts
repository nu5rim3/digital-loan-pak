import * as yup from "yup";

export interface CollateralDetailsProps {}

export interface FormValues {
  id?: string;
  securityType: string;
  securityCategory?: string;

  // Vehicle fields
  vehicleType?: string;
  vehicleOwnership?: string;
  vehicleSupplier?: string;
  vehicleCondition?: string;
  vehicleCategory?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleEngineNo?: string;
  vehicleChassisNo?: string;
  vehicleDescription?: string;
  vehicleRegistrationNo?: string;
  vehicleMV?: string;
  vehicleFSV?: string;
  vehicleYearManufacture?: string;
  vehicleDateOfFirstReg?: Date;
  vehicleRegBookNo?: string;
  vehicleBookReceivedDate?: Date;
  vehicleCRReleasedDate?: Date;
  vehicleInsuranceCompany?: string;
  vehicleReferenceNo?: string;

  // Machinery fields
  machineryType?: string;
  machineryOwnership?: string;
  machinerySupplier?: string;
  machineryDescription?: string;
  machineryMV?: string;
  machineryFSV?: string;
  machineryModel?: string;
  machineryEngineNo?: string;
  machinerySerialNo?: string;
  machineryCondition?: string;
  machineryBondNo?: string;
  machineryBondValue?: string;
  machineryValuedBy?: string;
  machineryInsuranceCompany?: string;
  machineryReferenceNo?: string;

  // Bank Guarantee fields
  bankGuaranteeType?: string;
  bankGuaranteeOwnership?: string;
  fdNo?: string;
  fdValue?: string;
  startDate?: string;
  expiryDate?: string;
  referenceNo?: string;
  guaranteeValue?: string;
  guaranteedTo?: string;
  institutionName?: string;
  referenceNoOndemand?: string;
  valueOfGuarantee?: string;
  renewedBy?: string;
  bankInsuranceCompany?: string;
  bankReferenceNo?: string;

  // Property Mortgage fields
  mortgageSecCategory?: string;
  propertyType?: string;
  propertySubType?: string;
  propertyOwnership?: string;
  propertyBondType?: string;
  propertyPropertyType?: string;
  propertyBondNo?: string;
  propertyBondDate?: string;
  propertyDeedNo?: string;
  propertyBondValue?: string;
  propertySurveyPlanNo?: string;
  propertyPOA?: string;
  propertyPOANumber?: string;
  propertyCompany?: string;
  propertyLawyerName?: string;
  propertyTitleInsurance?: string;
  propertyInsuranceOfBuilding?: string;
  propertyInsuranceValue?: string;
  propertyMarketValue?: string;
  propertyFSV?: string;
  propertyLotNo?: string;
  propertyInsuranceCompany?: string;
  propertyReferenceNo?: string;

  // Savings fields
  savingsType?: string;
  savingsSubType?: string;
  savingsOwnership?: string;
  savingsFDNo?: string;
  savingsAmount?: string;
  savingsMaturityDate?: string;
  savingsCompany?: string;
  savingsDescription?: string;
  savingsNo?: string;
  savingsBuildUpValue?: string;

  // Land Stock fields
  landStockType?: string;
  landStockSubType?: string;
  landStockOwnership?: string;
  landStockMarketValue?: string;
  landStockFSV?: string;
  landStockBondNo?: string;
  landStockDeedTransferNo?: string;
  landStockAgreementNo?: string;
  landStockLawyerName?: string;
  landStockDescription?: string;
  landStockSecurityDate?: Date;
  landStockSecCategory?: string;
  

  // Lease fields
  leaseEquipType?: string;
  leaseCost?: string;
  leaseSupplierCode?: string;
  leaseEquipName?: string;
  leaseCondition?: string;
  leaseCategory?: string;
  leaseDepreciationCode?: string;
  leaseVehicleType?: string;
  leaseManufacturer?: string;
  leaseModel?: string;
  leaseEngineCapacityCC?: string;
  leaseEngineCapacityHP?: string;
  leaseEngineNo?: string;
  leaseChassisNo?: string;
  leaseDuplicateKey?: string;
  leaseVehicleNo?: string;
  leaseRegistrationBookNo?: string;
  leaseRegistrationDate?: Date;
  leaseRegistrationYear?: string;
  leaseMV?: string;
  leaseFSV?: string;
  leaseInsuranceCompany?: string;
  leaseReferenceNo?: string;
}

export interface LeaseProductFormValues {
  // Common fields
  id?: string;

  // Equipment Details - Required fields
  equipmentCost: string;
  equipmentType: string;
  equipmentTypeCode?: string;
  supplierCode: string;
  equipmentName: string;
  condition: string;
  category: string;
  depreciationCode: string;

  // Vehicle Details - Required fields
  vehicleType: string;
  manufacturer: string;
  model: string;
  engineCapacityCC: string;
  engineCapacityHP: string;
  insuranceCompany: string;
  referenceNo: string;

  // Optional fields
  engineNo?: string;
  chassisNo?: string;
  vehicleNo?: string;
  registrationDate?: Date;
  duplicateKey?: string;
  registrationBookNo?: string;
  registrationYear?: string;
  internalMV?: string;
  internalFSV?: string;
  securityCategory?: string;
}

export const createValidationSchema = () => {
  const VEHICLE_CODE = "VEHICLE";

  const BANK_GUARANTEE_CODE = "BANK GUARANTEE";

  const MACHINERY_CODE = "MACHINERY AND EQUIPMENT";

  const PROPERTY_MORTGAGE_CODE = "PROPERTY MORTGAGE";

  const SAVINGS_CODE = "FIXED DEPOSITS AND SAVINGS";

  const LAND_STOCKS_CODE = "LAND STOCKS";

  return yup.object().shape({
    securityType: yup.string().required("Security Type is required"),

    // Vehicle fields
    vehicleType: yup.string().when("securityType", {
      is: VEHICLE_CODE,
      then: (schema) => schema.required("Type is required"),
    }),
    vehicleOwnership: yup.string().when("securityType", {
      is: VEHICLE_CODE,
      then: (schema) => schema.required("Ownership is required"),
    }),
    vehicleSupplier: yup.string().when("securityType", {
      is: VEHICLE_CODE,
      then: (schema) => schema.required("Supplier is required"),
    }),
    vehicleCondition: yup.string().when("securityType", {
      is: VEHICLE_CODE,
      then: (schema) => schema.required("Condition is required"),
    }),
    vehicleCategory: yup.string().when("securityType", {
      is: VEHICLE_CODE,
      then: (schema) => schema.required("Category is required"),
    }),
    vehicleMake: yup.string().when("securityType", {
      is: VEHICLE_CODE,
      then: (schema) => schema.required("Make is required"),
    }),
    vehicleModel: yup.string().when("securityType", {
      is: VEHICLE_CODE,
      then: (schema) => schema.required("Model is required"),
    }),
    vehicleMV: yup.string().when("securityType", {
      is: VEHICLE_CODE,
      then: (schema) => schema.required("Market Value is required"),
    }),
    vehicleEngineNo: yup.string().when(["securityType", "vehicleCondition"], {
      is: (securityType: string, condition: string) =>
        securityType === VEHICLE_CODE && condition && condition !== "1",
      then: (schema) =>
        schema.required("Engine No is required"),
       otherwise: (schema) => schema.optional(),
    }),
    vehicleChassisNo: yup.string().when(["securityType", "vehicleCondition"], {
      is: (securityType: string, condition: string) =>
        securityType === VEHICLE_CODE && condition && condition !== "1",
      then: (schema) =>
        schema.required("Chassis No is required"),
       otherwise: (schema) => schema.optional(),
    }),
    // vehicleDateOfFirstReg: yup
    //   .date()
    //   .when(["securityType", "vehicleCondition"], {
    //     is: (securityType: string, condition: string) =>
    //       securityType === VEHICLE_CODE && condition && condition !== "NEW",
    //     then: (schema) =>
    //       schema.required(
    //         "Date of 1st Reg is required when condition"
    //       ),
    //   }),

    // Machinery fields
    machineryType: yup.string().when("securityType", {
      is: MACHINERY_CODE,
      then: (schema) => schema.required("Type is required"),
    }),
    machineryOwnership: yup.string().when("securityType", {
      is: MACHINERY_CODE,
      then: (schema) => schema.required("Ownership is required"),
    }),
    machinerySupplier: yup.string().when("securityType", {
      is: MACHINERY_CODE,
      then: (schema) => schema.required("Supplier is required"),
    }),
    machineryCondition: yup.string().when("securityType", {
      is: MACHINERY_CODE,
      then: (schema) => schema.required("Condition is required"),
    }),
    machineryDescription: yup.string(),
    machineryMV: yup.string().when("securityType", {
      is: MACHINERY_CODE,
      then: (schema) => schema.required("Market Value is required"),
    }),
    machineryFSV: yup.string().when("securityType", {
      is: MACHINERY_CODE,
      then: (schema) => schema.required("FSV is required"),
    }),
    machineryModel: yup.string(),
    machineryEngineNo: yup.string(),
    machinerySerialNo: yup.string().when("securityType", {
      is: MACHINERY_CODE,
      then: (schema) => schema.required("Serial No/Chassis No is required"),
    }),
    machineryBondNo: yup.string(),
    machineryBondValue: yup.string(),
    machineryValuedBy: yup.string(),
    machineryInsuranceCompany: yup.string(),
    machineryReferenceNo: yup.string(),

    // Bank Guarantee fields
    bankGuaranteeType: yup.string().when("securityType", {
      is: BANK_GUARANTEE_CODE,
      then: (schema) => schema.required("Type is required"),
    }),
    bankGuaranteeOwnership: yup.string().when("securityType", {
      is: BANK_GUARANTEE_CODE,
      then: (schema) => schema.required("Ownership is required"),
    }),
    // LOFIN fields validation
    fdNo: yup.string().when(["securityType", "bankGuaranteeType"], {
      is: (securityType: string, type: string) =>
        securityType === BANK_GUARANTEE_CODE && type === "2",
      then: (schema) => schema,
    }),
    fdValue: yup.string().when(["securityType", "bankGuaranteeType"], {
      is: (securityType: string, type: string) =>
        securityType === BANK_GUARANTEE_CODE && type === "2",
      then: (schema) => schema,
    }),
    startDate: yup.string().when(["securityType", "bankGuaranteeType"], {
      is: (securityType: string, type: string) =>
        securityType === BANK_GUARANTEE_CODE && type === "2",
      then: (schema) => schema,
    }),
    expiryDate: yup.string().when(["securityType", "bankGuaranteeType"], {
      is: (securityType: string, type: string) =>
        securityType === BANK_GUARANTEE_CODE && type === "2",
      then: (schema) => schema,
    }),
    referenceNo: yup.string().when(["securityType", "bankGuaranteeType"], {
      is: (securityType: string, type: string) =>
        securityType === BANK_GUARANTEE_CODE && type === "2",
      then: (schema) => schema,
    }),
    // guaranteeValue: yup.string().when(["securityType", "bankGuaranteeType"], {
    //   is: (securityType: string, type: string) =>
    //     securityType === BANK_GUARANTEE_CODE && type === "2",
    //   then: (schema) =>
    //     schema.test(
    //       "guarantee-value-validation",
    //       "Guarantee Value cannot exceed FD Value",
    //       function (value) {
    //         const { fdValue } = this.parent;
    //         if (value && fdValue) {
    //           const guaranteeValueNum = Number(value);
    //           const fdValueNum = Number(fdValue);
    //           return guaranteeValueNum <= fdValueNum;
    //         }
    //         return true;
    //       }
    //     ),
    // }),
    guaranteeValue: yup.string().when(
  ["securityType", "bankGuaranteeType"],
  {
    is: (securityType: string, type: string) =>
      securityType === BANK_GUARANTEE_CODE && type === "2",
    then: (schema) =>
      schema
        .required("Guarantee Value is required")
        .test(
          "guarantee-value-validation",
          "Guarantee Value cannot exceed FD Value",
          function (value) {
            const { fdValue } = this.parent;
            if (value && fdValue) {
              const guaranteeValueNum = Number(value);
              const fdValueNum = Number(fdValue);
              return guaranteeValueNum <= fdValueNum;
            }
            return true;
          }
        ),
    otherwise: (schema) => schema.notRequired(),
  }
),

    guaranteedTo: yup.string().when(["securityType", "bankGuaranteeType"], {
      is: (securityType: string, type: string) =>
        securityType === BANK_GUARANTEE_CODE && type === "2",
      then: (schema) => schema,
    }),
    // Ondemand fields validation
    institutionName: yup.string().when(["securityType", "bankGuaranteeType"], {
      is: (securityType: string, type: string) =>
        securityType === BANK_GUARANTEE_CODE && type === "1",
      then: (schema) => schema,
    }),
    referenceNoOndemand: yup
      .string()
      .when(["securityType", "bankGuaranteeType"], {
        is: (securityType: string, type: string) =>
          securityType === BANK_GUARANTEE_CODE && type === "1",
        then: (schema) => schema,
      }),
    valueOfGuarantee: yup.string().when(["securityType", "bankGuaranteeType"], {
      is: (securityType: string, type: string) =>
        securityType === BANK_GUARANTEE_CODE && type === "1",
      then:(schema) =>
      schema.required("Value of Guarantee is required"),
    otherwise: (schema) => schema.notRequired(),
    }),
    renewedBy: yup.string().when(["securityType", "bankGuaranteeType"], {
      is: (securityType: string, type: string) =>
        securityType === BANK_GUARANTEE_CODE && type === "1",
      then: (schema) => schema,
    }),

    // Property Mortgage fields
    propertyType: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Type is required"),
    }),
    propertySubType: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Sub Type is required"),
    }),
    propertyOwnership: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Ownership is required"),
    }),
    propertyBondType: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Bond Type is required"),
    }),
    propertyPropertyType: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Property Type is required"),
    }),
    propertyBondNo: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Bond No is required"),
    }),
    propertyBondDate: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Bond Date is required"),
    }),
    propertyDeedNo: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) =>
        schema.required("Deed No/Grant No/Title Certificate No is required"),
    }),
    propertyBondValue: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Bond Value is required"),
    }),
    propertySurveyPlanNo: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Survey Plan No is required"),
    }),
    propertyPOA: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("POA is required"),
    }),
    propertyPOANumber: yup.string().when(["securityType", "propertyPOA"], {
      is: (securityType: string, propertyPOA: string) =>
        securityType === PROPERTY_MORTGAGE_CODE && propertyPOA === "yes",
      then: (schema) => schema.required("POA Number is required"),
    }),
    propertyCompany: yup.string().when(["securityType", "propertyPOA"], {
      is: (securityType: string, propertyPOA: string) =>
        securityType === PROPERTY_MORTGAGE_CODE && propertyPOA === "yes",
      then: (schema) => schema.required("Company is required"),
    }),
    propertyLawyerName: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Lawyer Name is required"),
    }),
    propertyTitleInsurance: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Title Insurance is required"),
    }),
    propertyInsuranceOfBuilding: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Insurance of Building is required"),
    }),
    propertyInsuranceValue: yup
      .string()
      .when(["securityType", "propertyInsuranceOfBuilding"], {
        is: (securityType: string, propertyInsuranceOfBuilding: string) =>
          securityType === PROPERTY_MORTGAGE_CODE &&
          propertyInsuranceOfBuilding === "yes",
        then: (schema) => schema.required("Insurance Value is required"),
      }),
    propertyMarketValue: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("Market Value is required"),
    }),
    propertyFSV: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("FSV is required"),
    }),
    propertyLotNo: yup.string().when("securityType", {
      is: PROPERTY_MORTGAGE_CODE,
      then: (schema) => schema.required("LOT No is required"),
    }),

    // Savings fields
    savingsType: yup.string().when("securityType", {
      is: SAVINGS_CODE,
      then: (schema) => schema.required("Type is required"),
    }),
    savingsSubType: yup.string().when("securityType", {
      is: SAVINGS_CODE,
      then: (schema) => schema,
    }),
    savingsOwnership: yup.string().when("securityType", {
      is: SAVINGS_CODE,
      then: (schema) => schema.required("Ownership is required"),
    }),
    savingsFDNo: yup.string().when("securityType", {
      is: SAVINGS_CODE,
      then: (schema) => schema,
    }),
    savingsAmount: yup.string().when("securityType", {
      is: SAVINGS_CODE,
      then: (schema) => schema.required("Amount is required"),
    }),
    savingsMaturityDate: yup.string().when("securityType", {
      is: SAVINGS_CODE,
      then: (schema) => schema,
    }),
    savingsCompany: yup.string().when("securityType", {
      is: SAVINGS_CODE,
      then: (schema) => schema,
    }),
    savingsDescription: yup.string().when("securityType", {
      is: SAVINGS_CODE,
      then: (schema) => schema,
    }),
    savingsNo: yup.string().when("securityType", {
      is: SAVINGS_CODE,
      then: (schema) => schema,
    }),
    savingsBuildUpValue: yup.string().when("securityType", {
      is: SAVINGS_CODE,
      then: (schema) => schema,
    }),

    // Land Stock fields validation
    landStockType: yup.string().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema.required("Type is required"),
    }),
    landStockSubType: yup.string().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema,
    }),
    landStockOwnership: yup.string().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema.required("Ownership is required"),
    }),
    landStockMarketValue: yup.string().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema.required("Market Value is required"),
    }),
    landStockFSV: yup.string().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema.required("FSV is required"),
    }),
    landStockBondNo: yup.string().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema,
    }),
    landStockDeedTransferNo: yup.string().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema,
    }),
    landStockAgreementNo: yup.string().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema,
    }),
    landStockLawyerName: yup.string().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema,
    }),
    landStockDescription: yup.string().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema,
    }),
    landStockSecurityDate: yup.date().when("securityType", {
      is: LAND_STOCKS_CODE,
      then: (schema) => schema.required("Security Date is required"),
    }),
  });
};

// Keep the old validation schema for backward compatibility
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
  vehicleEngineNo: yup.string().when(["securityType", "vehicleCondition"], {
    is: (securityType: string, condition: string) =>
      securityType === "VEHICLE" && condition && condition !== "1",
    then: (schema) =>
      schema.required("Engine No is required"),
     otherwise: (schema) => schema.optional(),
  }),
  vehicleChassisNo: yup.string().when(["securityType", "vehicleCondition"], {
    is: (securityType: string, condition: string) =>
      securityType === "VEHICLE" && condition && condition !== "1",
    then: (schema) =>
      schema.required("Chassis No is required"),
     otherwise: (schema) => schema.optional(),
  }),
  // vehicleDateOfFirstReg: yup.date().when(["securityType", "vehicleCondition"], {
  //   is: (securityType: string, condition: string) =>
  //     securityType === "VEHICLE" && condition && condition !== "NEW",
  //   then: (schema) =>
  //     schema.required("Date of 1st Reg is required"),
  // }),

  // Machinery fields
  machineryType: yup.string().when("securityType", {
    is: "MACHINERY AND EQUIPMENT",
    then: (schema) => schema.required("Type is required"),
  }),
  machineryOwnership: yup.string().when("securityType", {
    is: "MACHINERY AND EQUIPMENT",
    then: (schema) => schema.required("Ownership is required"),
  }),
  machinerySupplier: yup.string().when("securityType", {
    is: "MACHINERY AND EQUIPMENT",
    then: (schema) => schema.required("Supplier is required"),
  }),
  machineryCondition: yup.string().when("securityType", {
    is: "MACHINERY AND EQUIPMENT",
    then: (schema) => schema.required("Condition is required"),
  }),
  machineryDescription: yup.string(),
  machineryMV: yup.string().when("securityType", {
    is: "MACHINERY AND EQUIPMENT",
    then: (schema) => schema.required("Market Value is required"),
  }),
  machineryFSV: yup.string().when("securityType", {
    is: "MACHINERY AND EQUIPMENT",
    then: (schema) => schema.required("FSV is required"),
  }),
  machineryModel: yup.string(),
  machineryEngineNo: yup.string(),
  machinerySerialNo: yup.string().when("securityType", {
    is: "MACHINERY AND EQUIPMENT",
    then: (schema) => schema.required("Serial No/Chassis No is required"),
  }),
  machineryBondNo: yup.string(),
  machineryBondValue: yup.string(),
  machineryValuedBy: yup.string(),
  machineryInsuranceCompany: yup.string(),
  machineryReferenceNo: yup.string(),

  // Bank Guarantee fields
  bankGuaranteeType: yup.string().when("securityType", {
    is: "BANK GUARANTEE",
    then: (schema) => schema.required("Type is required"),
  }),
  bankGuaranteeOwnership: yup.string().when("securityType", {
    is: "BANK GUARANTEE",
    then: (schema) => schema.required("Ownership is required"),
  }),
  // LOFIN fields validation
  fdNo: yup.string().when(["securityType", "bankGuaranteeType"], {
    is: (securityType: string, type: string) =>
      securityType === "BANK GUARANTEE" && type === "2",
    then: (schema) => schema,
  }),
  fdValue: yup.string().when(["securityType", "bankGuaranteeType"], {
    is: (securityType: string, type: string) =>
      securityType === "BANK GUARANTEE" && type === "2",
    then: (schema) => schema,
  }),
  startDate: yup.string().when(["securityType", "bankGuaranteeType"], {
    is: (securityType: string, type: string) =>
      securityType === "BANK GUARANTEE" && type === "2",
    then: (schema) => schema,
  }),
  expiryDate: yup.string().when(["securityType", "bankGuaranteeType"], {
    is: (securityType: string, type: string) =>
      securityType === "BANK GUARANTEE" && type === "2",
    then: (schema) => schema,
  }),
  referenceNo: yup.string().when(["securityType", "bankGuaranteeType"], {
    is: (securityType: string, type: string) =>
      securityType === "BANK GUARANTEE" && type === "2",
    then: (schema) => schema,
  }),
  guaranteeValue: yup.string().when(
  ["securityType", "bankGuaranteeType"],
  {
    is: (securityType: string, type: string) =>
      securityType === "BANK GUARANTEE" && type === "2",
    then: (schema) =>
      schema
        .required("Guarantee Value is required")
        .test(
          "guarantee-value-validation",
          "Guarantee Value cannot exceed FD Value",
          function (value) {
            const { fdValue } = this.parent;
            if (value && fdValue) {
              const guaranteeValueNum = Number(value);
              const fdValueNum = Number(fdValue);
              return guaranteeValueNum <= fdValueNum;
            }
            return true;
          }
        ),
    otherwise: (schema) => schema.notRequired(),
  }
),

  // guaranteeValue: yup.string().when(["securityType", "bankGuaranteeType"], {
  //   is: (securityType: string, type: string) =>
  //     securityType === "BANK GUARANTEE" && type === "2",
  //   then: (schema) =>
  //     schema.test(
  //       "guarantee-value-validation",
  //       "Guarantee Value cannot exceed FD Value",
  //       function (value) {
  //         const { fdValue } = this.parent;
  //         if (value && fdValue) {
  //           const guaranteeValueNum = Number(value);
  //           const fdValueNum = Number(fdValue);
  //           return guaranteeValueNum <= fdValueNum;
  //         }
  //         return true;
  //       }
  //     ),
  // }),
  guaranteedTo: yup.string().when(["securityType", "bankGuaranteeType"], {
    is: (securityType: string, type: string) =>
      securityType === "BANK GUARANTEE" && type === "2",
    then: (schema) => schema,
  }),
  // Ondemand fields validation
  institutionName: yup.string().when(["securityType", "bankGuaranteeType"], {
    is: (securityType: string, type: string) =>
      securityType === "BANK GUARANTEE" && type === "1",
    then: (schema) => schema,
  }),
  referenceNoOndemand: yup
    .string()
    .when(["securityType", "bankGuaranteeType"], {
      is: (securityType: string, type: string) =>
        securityType === "BANK GUARANTEE" && type === "1",
      then: (schema) => schema,
    }),
  valueOfGuarantee: yup.string().when(["securityType", "bankGuaranteeType"], {
    is: (securityType: string, type: string) =>
      securityType === "BANK GUARANTEE" && type === "1",
    then: (schema) => schema,
  }),
  renewedBy: yup.string().when(["securityType", "bankGuaranteeType"], {
    is: (securityType: string, type: string) =>
      securityType === "BANK GUARANTEE" && type === "1",
    then: (schema) => schema,
  }),

  // Property Mortgage fields
  propertyType: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Type is required"),
  }),
  propertySubType: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Sub Type is required"),
  }),
  propertyOwnership: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Ownership is required"),
  }),
  propertyBondType: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Bond Type is required"),
  }),
  propertyPropertyType: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Property Type is required"),
  }),
  propertyBondNo: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Bond No is required"),
  }),
  propertyBondDate: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Bond Date is required"),
  }),
  propertyDeedNo: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) =>
      schema.required("Deed No/Grant No/Title Certificate No is required"),
  }),
  propertyBondValue: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Bond Value is required"),
  }),
  propertySurveyPlanNo: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Survey Plan No is required"),
  }),
  propertyPOA: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("POA is required"),
  }),
  propertyPOANumber: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("POA Number is required"),
  }),
  propertyCompany: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Company is required"),
  }),
  propertyLawyerName: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Lawyer Name is required"),
  }),
  propertyTitleInsurance: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Title Insurance is required"),
  }),
  propertyInsuranceOfBuilding: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Insurance of Building is required"),
  }),
  propertyInsuranceValue: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Insurance Value is required"),
  }),
  propertyMarketValue: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("Market Value is required"),
  }),
  propertyFSV: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("FSV is required"),
  }),
  propertyLotNo: yup.string().when("securityType", {
    is: "PROPERTY MORTGAGE",
    then: (schema) => schema.required("LOT No is required"),
  }),

  // Savings fields
  savingsType: yup.string().when("securityType", {
    is: "FIXED DEPOSITS AND SAVINGS",
    then: (schema) => schema.required("Type is required"),
  }),
  savingsSubType: yup.string().when("securityType", {
    is: "FIXED DEPOSITS AND SAVINGS",
    then: (schema) => schema,
  }),
  savingsOwnership: yup.string().when("securityType", {
    is: "FIXED DEPOSITS AND SAVINGS",
    then: (schema) => schema.required("Ownership is required"),
  }),
  savingsFDNo: yup.string().when("securityType", {
    is: "FIXED DEPOSITS AND SAVINGS",
    then: (schema) => schema,
  }),
  savingsAmount: yup.string().when("securityType", {
    is: "FIXED DEPOSITS AND SAVINGS",
    then: (schema) => schema.required("Amount is required"),
  }),
  savingsMaturityDate: yup.string().when("securityType", {
    is: "FIXED DEPOSITS AND SAVINGS",
    then: (schema) => schema,
  }),
  savingsCompany: yup.string().when("securityType", {
    is: "FIXED DEPOSITS AND SAVINGS",
    then: (schema) => schema,
  }),
  savingsDescription: yup.string().when("securityType", {
    is: "FIXED DEPOSITS AND SAVINGS",
    then: (schema) => schema,
  }),
  savingsNo: yup.string().when("securityType", {
    is: "FIXED DEPOSITS AND SAVINGS",
    then: (schema) => schema,
  }),
  savingsBuildUpValue: yup.string().when("securityType", {
    is: "FIXED DEPOSITS AND SAVINGS",
    then: (schema) => schema,
  }),

  // Land Stock fields
  landStockType: yup.string().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema.required("Type is required"),
  }),
  landStockSubType: yup.string().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema,
  }),
  landStockOwnership: yup.string().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema.required("Ownership is required"),
  }),
  landStockMarketValue: yup.string().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema.required("Market Value is required"),
  }),
  landStockFSV: yup.string().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema.required("FSV is required"),
  }),
  landStockBondNo: yup.string().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema,
  }),
  landStockDeedTransferNo: yup.string().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema,
  }),
  landStockAgreementNo: yup.string().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema,
  }),
  landStockLawyerName: yup.string().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema,
  }),
  landStockDescription: yup.string().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema,
  }),
  landStockSecurityDate: yup.date().when("securityType", {
    is: "LAND STOCKS",
    then: (schema) => schema.required("Security Date is required"),
  }),
});

export const leaseProductValidationSchema = yup.object().shape({
  // Equipment Details - Required fields
  equipmentCost: yup.string().required("Equipment Cost is required"),
  equipmentType: yup.string().required("Equipment Type is required"),
  supplierCode: yup.string().required("Supplier Code is required"),
  equipmentName: yup.string().required("Equipment Name is required"),
  condition: yup.string().required("Condition is required"),
  category: yup.string().required("Category is required"),
  depreciationCode: yup.string().required("Depreciation Code is required"),

  // Vehicle Details - Required fields
  vehicleType: yup.string().required("Vehicle Type is required"),
  manufacturer: yup.string().required("Manufacturer is required"),
  model: yup.string().required("Model is required"),
  engineCapacityCC: yup.string().required("Engine Capacity CC is required"),
  engineCapacityHP: yup.string().required("Engine Capacity HP is required"),
  insuranceCompany: yup.string().required("Insurance Company is required"),
  referenceNo: yup.string().required("Reference No is required"),

  // Conditional fields based on condition
  engineNo: yup.string().when("condition", {
    is: (val: string) => val && val !== "1",
    then: (schema) =>
      schema.required("Engine No is required"),
    otherwise: (schema) => schema.optional(),
  }),
  chassisNo: yup.string().when("condition", {
    is: (val: string) => val && val !== "1",
    then: (schema) =>
      schema.required("Chassis No is required"),
    otherwise: (schema) => schema.optional(),
  }),
  vehicleNo: yup.string().when("condition", {
    is: (val: string) => val && val !== "1",
    then: (schema) =>
      schema.required("Vehicle No is required"),
    otherwise: (schema) => schema.optional(),
  }),
  registrationDate: yup.date().when("condition", {
    is: (val: string) => val && val !== "1",
    then: (schema) =>
      schema.required(
        "Registration Date is required"
      ),
    otherwise: (schema) => schema.optional(),
  }),

  // Optional fields
  duplicateKey: yup.string().max(20, "Cannot exceed 20 characters").optional(),
  registrationBookNo: yup.string().optional(),
  registrationYear: yup.string().optional(),
  internalMV: yup.string().optional(),
  internalFSV: yup.string().optional(),
});
