import React, { useState, useEffect, useRef } from "react";
import { Button, App, Row, Col, message, Spin, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { FormValues, validationSchema } from "./types";
import DetailsCard from "./components/DetailsCard";
import CollateralFormModal from "./components/CollateralFormModal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 } from "uuid";
import { useParams } from "react-router-dom";
import useCollateralStore from "../../../../../store/collateralStore";
import useCommonStore from "../../../../../store/commonStore";

interface CollateralDetailsComponentProps { }

const mapCollateralToFormValues = (collateral: any): FormValues => {
  const formValues: FormValues = {
    id: collateral.id,
    securityType: "",
  };

  // Map the security type based on the collateral type
  switch (collateral.type) {
    case "bank-guarantee":
      formValues.securityType = "BANK GUARANTEE";
      formValues.bankGuaranteeType = collateral.type;
      formValues.bankGuaranteeOwnership = collateral.ownership;
      formValues.fdNo = collateral.fdNo;
      formValues.fdValue = collateral.fdValue;
      formValues.startDate = collateral.startDate
        ? new Date(collateral.startDate).toISOString().split("T")[0]
        : undefined;
      formValues.expiryDate = collateral.expiryDate
        ? new Date(collateral.expiryDate).toISOString().split("T")[0]
        : undefined;
      formValues.referenceNo = collateral.referenceNo;
      formValues.guaranteeValue = collateral.guaranteeValue;
      formValues.guaranteedTo = collateral.guaranteeTo;
      formValues.institutionName = collateral.institutionName;
      formValues.referenceNoOndemand = collateral.referenceNo;
      formValues.valueOfGuarantee = collateral.valueOfGuarantee;
      formValues.renewedBy = collateral.renewedBy;
      formValues.bankInsuranceCompany = collateral.insuCompany;
      formValues.bankReferenceNo = collateral.insuRefNo;
      break;
    case "vehicle":
      formValues.securityType = "VEHICLE";
      // Map vehicle specific fields - using the renamed fields from our transform
      formValues.vehicleType = collateral.vehicleType || collateral.type;
      formValues.vehicleOwnership =
        collateral.vehicleOwnership || collateral.ownership;
      formValues.vehicleSupplier =
        collateral.vehicleSupplier || collateral.supplier;
      formValues.vehicleCondition =
        collateral.vehicleCondition || collateral.condition;
      formValues.vehicleCategory =
        collateral.vehicleCategory || collateral.category;
      formValues.vehicleMake = collateral.vehicleMake || collateral.make;
      formValues.vehicleModel = collateral.vehicleModel || collateral.model;
      formValues.vehicleEngineNo =
        collateral.vehicleEngineNo || collateral.engineNo;
      formValues.vehicleChassisNo =
        collateral.vehicleChassisNo || collateral.chassisNo;
      formValues.vehicleDescription =
        collateral.vehicleDescription || collateral.description;
      formValues.vehicleRegistrationNo =
        collateral.vehicleRegistrationNo || collateral.registrationNo;
      formValues.vehicleMV =
        collateral.vehicleMV?.toString() || collateral.mv?.toString();
      formValues.vehicleFSV =
        collateral.vehicleFSV?.toString() || collateral.fsv?.toString();
      formValues.vehicleYearManufacture =
        collateral.vehicleYearManufacture || collateral.yearManufacture;
      formValues.vehicleDateOfFirstReg = collateral.dateOfFirstReg
        ? new Date(collateral.dateOfFirstReg)
        : undefined;
      formValues.vehicleRegBookNo =
        collateral.vehicleRegBookNo || collateral.regBookNo;
      formValues.vehicleBookReceivedDate = collateral.bookReceivedDate
        ? new Date(collateral.bookReceivedDate)
        : undefined;
      formValues.vehicleCRReleasedDate = collateral.crReleasedDate
        ? new Date(collateral.crReleasedDate)
        : undefined;
      formValues.vehicleInsuranceCompany =
        collateral.vehicleInsuranceCompany || collateral.insuCompany;
      formValues.vehicleReferenceNo =
        collateral.vehicleReferenceNo || collateral.refNo;
      break;
    case "machinery":
      formValues.securityType = "MACHINERY AND EQUIPMENT";
      // Map machinery specific fields
      formValues.machineryType = collateral.machineryType;
      formValues.machineryOwnership = collateral.machineryOwnership;
      formValues.machinerySupplier = collateral.machinerySupplier;
      formValues.machineryDescription = collateral.machineryDescription;
      formValues.machineryMV = collateral.machineryMV?.toString();
      formValues.machineryFSV = collateral.machineryFSV?.toString();
      formValues.machineryModel = collateral.machineryModel;
      formValues.machineryEngineNo = collateral.machineryEngineNo;
      formValues.machinerySerialNo = collateral.machinerySerialNo;
      formValues.machineryCondition = collateral.machineryCondition;
      formValues.machineryBondNo = collateral.machineryBondNo;
      formValues.machineryBondValue = collateral.machineryBondValue;
      formValues.machineryValuedBy = collateral.machineryValuedBy;
      formValues.machineryInsuranceCompany =
        collateral.machineryInsuranceCompany;
      formValues.machineryReferenceNo = collateral.machineryReferenceNo;
      break;
    case "property-mortgage":
      formValues.securityType = "PROPERTY MORTGAGE";
      // Map property mortgage specific fields
      formValues.propertyType = collateral.propertyType;
      formValues.propertySubType = collateral.propertySubType;
      formValues.propertyOwnership = collateral.propertyOwnership;
      formValues.propertyBondType = collateral.propertyBondType;
      formValues.propertyPropertyType = collateral.propertyPropertyType;
      formValues.propertyBondNo = collateral.propertyBondNo;
      formValues.propertyBondDate = collateral.propertyBondDate
        ? new Date(collateral.propertyBondDate).toISOString().split("T")[0]
        : undefined;
      formValues.propertyDeedNo = collateral.propertyDeedNo;
      formValues.propertyBondValue = collateral.propertyBondValue?.toString();
      formValues.propertySurveyPlanNo = collateral.propertySurveyPlanNo;
      formValues.propertyPOA = collateral.propertyPOA;
      formValues.propertyPOANumber = collateral.propertyPOANumber;
      formValues.propertyCompany = collateral.propertyCompany;
      formValues.propertyLawyerName = collateral.propertyLawyerName;
      formValues.propertyTitleInsurance = collateral.propertyTitleInsurance;
      formValues.propertyInsuranceOfBuilding =
        collateral.propertyInsuranceOfBuilding;
      formValues.propertyInsuranceValue =
        collateral.propertyInsuranceValue?.toString();
      formValues.propertyMarketValue =
        collateral.propertyMarketValue?.toString();
      formValues.propertyFSV = collateral.propertyFSV?.toString();
      formValues.propertyLotNo = collateral.propertyLotNo;
      formValues.propertyInsuranceCompany = collateral.propertyInsuranceCompany;
      formValues.propertyReferenceNo = collateral.propertyReferenceNo;
      break;
    case "land-stock":
      formValues.securityType = "LAND STOCKS";
      // Map land stock specific fields
      formValues.landStockType = collateral.landStockType;
      formValues.landStockSubType = collateral.landStockSubType;
      formValues.landStockOwnership = collateral.landStockOwnership;
      formValues.landStockMarketValue =
        collateral.landStockMarketValue?.toString();
      formValues.landStockFSV = collateral.landStockFsv?.toString();
      formValues.landStockBondNo = collateral.landStockBondNo;
      formValues.landStockDeedTransferNo = collateral.landStockDeedTransferNo;
      formValues.landStockAgreementNo = collateral.landStockAgreementNo;
      formValues.landStockLawyerName = collateral.landStockLawyerName;
      formValues.landStockDescription = collateral.landStockDescription;
      formValues.landStockCategory = collateral.landStockCategory;
      formValues.landStockSecurityDate = collateral.landStockSecDate
        ? new Date(collateral.landStockSecDate.split(" ")[0])
        : undefined;
      formValues.landStockSecurityType = collateral.landStockSecType;
      break;
    case "savings":
      formValues.securityType = "FIXED DEPOSITS AND SAVINGS";
      // Map savings specific fields
      formValues.savingsType = collateral.savingsType;
      formValues.savingsSubType = collateral.savingsSubType;
      formValues.savingsOwnership = collateral.savingsOwnership;
      formValues.savingsFDNo = collateral.savingsFDNo;
      formValues.savingsAmount = collateral.savingsAmount?.toString();
      formValues.savingsMaturityDate = collateral.savingsMaturityDate
        ? new Date(collateral.savingsMaturityDate).toISOString().split("T")[0]
        : undefined;
      formValues.savingsCompany = collateral.savingsCompany;
      formValues.savingsDescription = collateral.savingsDescription;
      formValues.savingsNo = collateral.savingsNo;
      formValues.savingsBuildUpValue = collateral.savingsBuildUpValue;
      break;
    case "lease":
      formValues.securityType = "LEASE";
      // Map lease specific fields
      formValues.leaseEquipType = collateral.leaseEquipType;
      formValues.leaseCost = collateral.leaseCost?.toString();
      formValues.leaseSupplierCode = collateral.leaseSupplierCode;
      formValues.leaseEquipName = collateral.leaseEquipName;
      formValues.leaseCondition = collateral.leaseCondition;
      formValues.leaseCategory = collateral.leaseCategory;
      formValues.leaseDepreciationCode = collateral.leaseDepreciationCode;
      formValues.leaseVehicleType = collateral.leaseVehiType;
      formValues.leaseManufacturer = collateral.leaseManufacture;
      formValues.leaseModel = collateral.leaseVehiModel;
      formValues.leaseEngineCapacityCC = collateral.leaseEnginCapacityCC;
      formValues.leaseEngineCapacityHP = collateral.leaseEnginCapacityHP;
      formValues.leaseEngineNo = collateral.enginNo;
      formValues.leaseChassisNo = collateral.chasisNo;
      formValues.leaseDuplicateKey = collateral.duplicateKey;
      formValues.leaseVehicleNo = collateral.leaseVehiNo;
      formValues.leaseRegistrationBookNo = collateral.leaseRegBookNo;
      formValues.leaseRegistrationDate = collateral.leaseRegDate
        ? new Date(collateral.leaseRegDate)
        : undefined;
      formValues.leaseRegistrationYear = collateral.leaseRegYear;
      formValues.leaseMV = collateral.marketValue?.toString();
      formValues.leaseFSV = collateral.foreSaleValue?.toString();
      formValues.leaseProvince = collateral.leaseProvince;
      formValues.leaseInsuranceCompany = collateral.insuCompany;
      formValues.leaseReferenceNo = collateral.refNo;
      break;
    // Add more cases for other collateral types as needed
    default:
      console.warn(`Unknown collateral type: ${collateral.type}`);
  }

  return formValues;
};

const CollateralDetails: React.FC<CollateralDetailsComponentProps> = () => {
  const { appId } = useParams();
  const initialFetchDone = useRef(false);
  const { trialCalculationData } = useCommonStore();

  const appraisalId = appId;

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormValues[]>([]);
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [shouldCloseModal, setShouldCloseModal] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<FormValues | null>(
    null
  );

  const {
    fetchCollaterals,
    collaterals,
    fetchingCollaterals,
    fetchCollateralsError,
    deleteCollateral,
    deletingCollateral,
    getBankGuarantee,
    fetchingBankGuarantee,
    fetchingLandStock,
    fetchingMachinery,
    fetchingPropertyMortgage,
    fetchingSavings,
    fetchingVehicle,
    fetchingLease,
  } = useCollateralStore();

  useEffect(() => {
    const loadCollaterals = async () => {
      if (appraisalId && !initialFetchDone.current) {
        initialFetchDone.current = true;
        try {
          await fetchCollaterals(appraisalId);
        } catch (error) {
          console.error("Failed to fetch collaterals:", error);
          message.error("Failed to load collateral details");
        }
      }
    };

    loadCollaterals();
  }, [appraisalId, fetchCollaterals]);

  useEffect(() => {
    if (collaterals && collaterals.length > 0) {
      const mappedData = collaterals.map(mapCollateralToFormValues);
      
      // Filter based on product category
      let filteredData = mappedData;
      if (trialCalculationData?.productCategory === "A") {
        // Show only lease collaterals for Lease product
        filteredData = mappedData.filter(collateral => 
          collateral.securityType === "LEASE"
        );
      } else if (trialCalculationData?.productCategory === "C") {
        // Show all collateral types except lease for Loan product
        filteredData = mappedData.filter(collateral => 
          collateral.securityType !== "LEASE"
        );
      }
      
      setFormData(filteredData);
    } else {
      setFormData([]);
    }
  }, [collaterals, trialCalculationData?.productCategory]);

  const formMethods = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      securityType: "",
    },
  });

  useEffect(() => {
    if (shouldCloseModal) {
      closeModal();
      setShouldCloseModal(false);
    }
  }, [formData, shouldCloseModal]);

  const openModal = async (mode: "save" | "update", data?: FormValues) => {
    setIsEditing(mode === "update");

    // If in update mode and it's a vehicle, fetch the detailed data
    if (
      mode === "update" &&
      data &&
      data.securityType === "VEHICLE" &&
      data.id
    ) {
      try {
        setFetchingDetail(true);
        const detailedData = await useCollateralStore
          .getState()
          .getVehicle(data.id);

        if (detailedData) {
          // Map the detailed API data to form values
          const formattedData: FormValues = {
            ...data,
            securityCategory: "MAIN_SECURITY",
            // Map API response fields to form fields
            id: detailedData.vehIdx || data.id,
            vehicleType: detailedData.vehicleType,
            vehicleOwnership: detailedData.ownership,
            vehicleSupplier: detailedData.supplier,
            vehicleCondition: detailedData.condition,
            vehicleCategory: detailedData.category,
            vehicleMake: detailedData.make,
            vehicleModel: detailedData.model,
            vehicleEngineNo: detailedData.enginNo,
            vehicleChassisNo: detailedData.chasisNo,
            vehicleRegistrationNo: detailedData.regNo,
            vehicleDescription: detailedData.desc,
            vehicleMV: detailedData.marketValue?.toString(),
            vehicleFSV: detailedData.foreSaleValue?.toString(),
            vehicleYearManufacture: detailedData.yearOfManufacture,
            vehicleDateOfFirstReg: detailedData.dateOfFirstReg
              ? new Date(detailedData.dateOfFirstReg)
              : undefined,
            vehicleRegBookNo: detailedData.regBookNo,
            vehicleBookReceivedDate: detailedData.bookReceivedDate
              ? new Date(detailedData.bookReceivedDate)
              : undefined,
            vehicleCRReleasedDate: detailedData.crReleasedDate
              ? new Date(detailedData.crReleasedDate)
              : undefined,
            vehicleInsuranceCompany: detailedData.insuCompany,
            vehicleReferenceNo: detailedData.refNo,
          };

          setEditingId(detailedData.vehIdx || data.id);
          setCurrentFormData(formattedData);
          formMethods.reset(formattedData);
        } else {
          message.error("Failed to fetch vehicle details");
          setEditingId(data.id || null);
          setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
          formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
        }
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
        message.error("Failed to fetch vehicle details");
        setEditingId(data.id || null);
        setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
        formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
      } finally {
        setFetchingDetail(false);
      }
    }
    // If in update mode and it's a bank guarantee, fetch the detailed data
    else if (
      mode === "update" &&
      data &&
      data.securityType === "BANK GUARANTEE" &&
      data.id
    ) {
      try {
        setFetchingDetail(true);
        const detailedData = await getBankGuarantee(data.id);

        if (detailedData) {
          // Map the detailed API data to form values
          const formattedData: FormValues = {
            ...data,
            securityCategory: "MAIN_SECURITY",
            // Map API response fields to form fields
            id: detailedData.bankGuaranteeIdx || data.id,
            bankGuaranteeType: detailedData.type,
            bankGuaranteeOwnership: detailedData.ownership,
            fdNo: detailedData.fdNo || undefined,
            fdValue: detailedData.fdValue || undefined,
            startDate: detailedData.startDate
              ? new Date(detailedData.startDate).toISOString().split("T")[0]
              : undefined,
            expiryDate: detailedData.expiryDate
              ? new Date(detailedData.expiryDate).toISOString().split("T")[0]
              : undefined,
            referenceNo: detailedData.referenceNo || undefined,
            guaranteeValue: detailedData.guaranteeValue || undefined,
            guaranteedTo: detailedData.guaranteeTo || undefined,
            institutionName: detailedData.institutionName || undefined,
            referenceNoOndemand: detailedData.referenceNo || undefined,
            valueOfGuarantee: detailedData.valueOfGuarantee || undefined,
            renewedBy: detailedData.renewedBy || undefined,
            bankInsuranceCompany: detailedData.insuCompany || undefined,
            bankReferenceNo: detailedData.insuRefNo || undefined,
          };

          setEditingId(detailedData.bankGuaranteeIdx || data.id);
          setCurrentFormData(formattedData);
          formMethods.reset(formattedData);
        } else {
          message.error("Failed to fetch bank guarantee details");
          setEditingId(data.id || null);
          setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
          formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
        }
      } catch (error) {
        console.error("Error fetching bank guarantee details:", error);
        message.error("Failed to fetch bank guarantee details");
        setEditingId(data.id || null);
        setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
        formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
      } finally {
        setFetchingDetail(false);
      }
    }
    // If in update mode and it's a land stock, fetch the detailed data
    else if (
      mode === "update" &&
      data &&
      data.securityType === "LAND STOCKS" &&
      data.id
    ) {
      try {
        setFetchingDetail(true);
        const detailedData = await useCollateralStore
          .getState()
          .getLandStock(data.id);

        if (detailedData) {
          // Map the detailed API data to form values
          const formattedData: FormValues = {
            ...data,
            securityCategory: "MAIN_SECURITY",
            // Map API response fields to form fields
            id: detailedData.landStockIdx || data.id,
            landStockType: detailedData.landStockType,
            landStockSubType: detailedData.landStockSubType,
            landStockOwnership: detailedData.landStockOwnership,
            landStockMarketValue: detailedData.landStockMarketValue?.toString(),
            landStockFSV: detailedData.landStockFsv?.toString(),
            landStockBondNo: detailedData.landStockBondNo,
            landStockDeedTransferNo: detailedData.landStockDeedTransferNo,
            landStockAgreementNo: detailedData.landStockAgreementNo,
            landStockLawyerName: detailedData.landStockLawyerName,
            landStockDescription: detailedData.landStockDescription,
            landStockCategory: detailedData.landStockCategory,
            landStockSecurityDate: detailedData.landStockSecDate
              ? detailedData.landStockSecDate.split(" ")[0]
              : undefined,
            landStockSecurityType: detailedData.landStockSecType,
          };

          setEditingId(detailedData.landStockIdx || data.id);
          setCurrentFormData(formattedData);
          formMethods.reset(formattedData);
        } else {
          message.error("Failed to fetch land stock details");
          setEditingId(data.id || null);
          setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
          formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
        }
      } catch (error) {
        console.error("Error fetching land stock details:", error);
        message.error("Failed to fetch land stock details");
        setEditingId(data.id || null);
        setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
        formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
      } finally {
        setFetchingDetail(false);
      }
    }
    // If in update mode and it's machinery equipment, fetch the detailed data
    else if (
      mode === "update" &&
      data &&
      data.securityType === "MACHINERY AND EQUIPMENT" &&
      data.id
    ) {
      try {
        setFetchingDetail(true);
        const detailedData = await useCollateralStore
          .getState()
          .getMachinery(data.id);

        if (detailedData) {
          // Map the detailed API data to form values
          const formattedData: FormValues = {
            ...data,
            securityCategory: "MAIN_SECURITY",
            // Map API response fields to form fields
            id: detailedData.machineryEquipIdx || data.id,
            machineryType: detailedData.type,
            machineryOwnership: detailedData.ownership,
            machinerySupplier: detailedData.supplier,
            machineryCondition: detailedData.condition,
            machineryDescription: detailedData.description,
            machineryMV: detailedData.marketValue?.toString(),
            machineryFSV: detailedData.fsv?.toString(),
            machineryModel: detailedData.model,
            machineryEngineNo: detailedData.engineNo,
            machinerySerialNo: detailedData.serialChasisNo,
            machineryBondNo: detailedData.bondNo,
            machineryBondValue: detailedData.bondValue,
            machineryValuedBy: detailedData.valuedBy,
            machineryInsuranceCompany: detailedData.insuCompany,
            machineryReferenceNo: detailedData.refNo,
          };

          setEditingId(detailedData.machineryEquipIdx || data.id);
          setCurrentFormData(formattedData);
          formMethods.reset(formattedData);
        } else {
          message.error("Failed to fetch machinery equipment details");
          setEditingId(data.id || null);
          setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
          formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
        }
      } catch (error) {
        console.error("Error fetching machinery equipment details:", error);
        message.error("Failed to fetch machinery equipment details");
        setEditingId(data.id || null);
        setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
        formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
      } finally {
        setFetchingDetail(false);
      }
    }
    // If in update mode and it's property mortgage, fetch the detailed data
    else if (
      mode === "update" &&
      data &&
      data.securityType === "PROPERTY MORTGAGE" &&
      data.id
    ) {
      try {
        setFetchingDetail(true);
        const detailedData = await useCollateralStore
          .getState()
          .getPropertyMortgage(data.id);

        if (detailedData) {
          // Map the detailed API data to form values
          const formattedData: FormValues = {
            ...data,
            securityCategory: "MAIN_SECURITY",
            // Map API response fields to form fields
            id: detailedData.mortgageIdx || data.id,
            propertyType: detailedData.mortgageType,
            propertySubType: detailedData.mortgageSubType,
            propertyOwnership: detailedData.mortgageOwnership,
            propertyBondType: detailedData.mortgageBondType,
            propertyPropertyType: detailedData.mortgagePropertyType,
            propertyBondNo: detailedData.mortgageBondNo,
            propertyBondDate: detailedData.mortgageBondDate
              ? new Date(detailedData.mortgageBondDate)
                .toISOString()
                .split("T")[0]
              : undefined,
            propertyDeedNo: detailedData.mortgageDeedNo,
            propertyBondValue: detailedData.mortgageBondValue?.toString(),
            propertySurveyPlanNo: detailedData.mortgageSurveyPlanNo,
            propertyPOA: detailedData.mortgagePoa,
            propertyPOANumber: detailedData.mortgagePoaNo,
            propertyCompany: detailedData.mortgageCompany,
            propertyLawyerName: detailedData.mortgageLawyerName,
            propertyTitleInsurance: detailedData.mortgageTitleInsurance,
            propertyInsuranceOfBuilding: detailedData.mortgageInsOfBuilding,
            propertyInsuranceValue:
              detailedData.mortgageInsuranceValue?.toString(),
            propertyMarketValue: detailedData.mortgageMarketValue?.toString(),
            propertyFSV: detailedData.mortgageFsv?.toString(),
            propertyLotNo: detailedData.mortgageLotNo,
            propertyInsuranceCompany: detailedData.mortgageInsuranceCompany,
            propertyReferenceNo: detailedData.mortgageReferenceNo,
          };

          setEditingId(detailedData.mortgageIdx || data.id);
          setCurrentFormData(formattedData);
          formMethods.reset(formattedData);
        } else {
          message.error("Failed to fetch property mortgage details");
          setEditingId(data.id || null);
          setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
          formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
        }
      } catch (error) {
        console.error("Error fetching property mortgage details:", error);
        message.error("Failed to fetch property mortgage details");
        setEditingId(data.id || null);
        setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
        formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
      } finally {
        setFetchingDetail(false);
      }
    }
    // If in update mode and it's savings, fetch the detailed data
    else if (
      mode === "update" &&
      data &&
      data.securityType === "FIXED DEPOSITS AND SAVINGS" &&
      data.id
    ) {
      try {
        setFetchingDetail(true);
        const detailedData = await useCollateralStore
          .getState()
          .getSavings(data.id);

        if (detailedData) {
          // Map the detailed API data to form values
          const formattedData: FormValues = {
            ...data,
            securityCategory: "MAIN_SECURITY",
            // Map API response fields to form fields
            id: detailedData.savingsIdx || data.id,
            savingsType: detailedData.type,
            savingsSubType: detailedData.subType,
            savingsOwnership: detailedData.ownership,
            savingsNo: detailedData.savingsNo,
            savingsFDNo: detailedData.fdNo,
            savingsAmount: detailedData.amount?.toString(),
            savingsMaturityDate: detailedData.maturityDate
              ? new Date(detailedData.maturityDate).toISOString().split("T")[0]
              : undefined,
            savingsCompany: detailedData.company,
            savingsDescription: detailedData.description,
            savingsBuildUpValue: detailedData.savingsBuildValue,
          };

          setEditingId(detailedData.savingsIdx || data.id);
          setCurrentFormData(formattedData);
          formMethods.reset(formattedData);
        } else {
          message.error("Failed to fetch savings details");
          setEditingId(data.id || null);
          setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
          formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
        }
      } catch (error) {
        console.error("Error fetching savings details:", error);
        message.error("Failed to fetch savings details");
        setEditingId(data.id || null);
        setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
        formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
      } finally {
        setFetchingDetail(false);
      }
    }
    // If in update mode and it's a lease, fetch the detailed data
    else if (
      mode === "update" &&
      data &&
      data.securityType === "LEASE" &&
      data.id
    ) {
      try {
        setFetchingDetail(true);
        const detailedData = await useCollateralStore
          .getState()
          .getLease(data.id);

        if (detailedData) {
          // Map the detailed API data to form values
          const formattedData: FormValues = {
            ...data,
            securityCategory: "MAIN_SECURITY",
            // Map API response fields to form fields
            id: detailedData.leaseIdx || data.id,
            leaseEquipType: detailedData.leaseEquipType,
            leaseCost: detailedData.leaseCost?.toString(),
            leaseSupplierCode: detailedData.leaseSupplierCode,
            leaseEquipName: detailedData.leaseEquipName,
            leaseCondition: detailedData.leaseCondition,
            leaseCategory: detailedData.leaseCategory,
            leaseDepreciationCode: detailedData.leaseDepreciationCode,
            leaseVehicleType: detailedData.leaseVehiType,
            leaseManufacturer: detailedData.leaseManufacture,
            leaseModel: detailedData.leaseVehiModel,
            leaseEngineCapacityCC: detailedData.leaseEnginCapacityCC,
            leaseEngineCapacityHP: detailedData.leaseEnginCapacityHP,
            leaseEngineNo: detailedData.enginNo,
            leaseChassisNo: detailedData.chasisNo,
            leaseDuplicateKey: detailedData.duplicateKey,
            leaseVehicleNo: detailedData.leaseVehiNo,
            leaseRegistrationBookNo: detailedData.leaseRegBookNo,
            leaseRegistrationDate: detailedData.leaseRegDate
              ? new Date(detailedData.leaseRegDate)
              : undefined,
            leaseRegistrationYear: detailedData.leaseRegYear,
            leaseMV: detailedData.marketValue?.toString(),
            leaseFSV: detailedData.foreSaleValue?.toString(),
            leaseProvince: detailedData.leaseProvince,
            leaseInsuranceCompany: detailedData.insuCompany,
            leaseReferenceNo: detailedData.refNo,
          };

          setEditingId(detailedData.leaseIdx || data.id);
          setCurrentFormData(formattedData);
          formMethods.reset(formattedData);
        } else {
          message.error("Failed to fetch lease details");
          setEditingId(data.id || null);
          setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
          formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
        }
      } catch (error) {
        console.error("Error fetching lease details:", error);
        message.error("Failed to fetch lease details");
        setEditingId(data.id || null);
        setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
        formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
      } finally {
        setFetchingDetail(false);
      }
    } else if (data) {
      // For other types or new items
      setEditingId(data.id || null);
      setCurrentFormData({ ...data, securityCategory: "MAIN_SECURITY" });
      formMethods.reset({ ...data, securityCategory: "MAIN_SECURITY" });
    } else {
      setEditingId(null);
      setCurrentFormData(null);
      formMethods.reset({ securityType: "" });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    formMethods.reset({ securityType: "" });
    setEditingId(null);
    setCurrentFormData(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      if (isEditing && editingId) {
        const updatedFormData = formData.map((item) =>
          item.id === editingId ? { ...data, id: editingId } : item
        );
        setFormData(updatedFormData);
      } else {
        const newData = { ...data, id: v4() };
        const updatedData = [...formData, newData];
        setFormData(updatedData);
      }
      closeModal();

      if (appraisalId) {
        fetchCollaterals(appraisalId);
      }
    } catch (error) {
      console.error("Failed to save collateral details:", error);
      message.error("Failed to save collateral details");
    }
  };

  const handleUpdate = (index: number) => {
    const dataToEdit = formData[index];
    openModal("update", dataToEdit);
  };

  const handleDelete = (index: number) => {
    const collateralToDelete = formData[index];

    if (
      !collateralToDelete ||
      !collateralToDelete.id ||
      !collateralToDelete.securityType
    ) {
      message.error("Cannot delete: Invalid collateral data");
      return;
    }

    // Show confirmation dialog
    Modal.confirm({
      title: "Delete Collateral",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this collateral? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          let success = false;

          // For vehicle, use the specialized deactivate function
          if (
            collateralToDelete.securityType === "VEHICLE" &&
            collateralToDelete.id
          ) {
            const result = await useCollateralStore
              .getState()
              .deactivateVehicle(collateralToDelete.id, appraisalId);
            success = !!result;
            if (success) {
              message.success("Vehicle deactivated successfully");
            } else {
              message.error("Failed to deactivate vehicle");
            }
          }
          // For bank guarantees, use the specialized deactivate function
          else if (
            collateralToDelete.securityType === "BANK GUARANTEE" &&
            collateralToDelete.id
          ) {
            const result = await useCollateralStore
              .getState()
              .deactivateBankGuarantee(collateralToDelete.id, appraisalId);
            success = !!result;
            if (success) {
              message.success("Bank guarantee deactivated successfully");
            } else {
              message.error("Failed to deactivate bank guarantee");
            }
          }
          // For land stocks, use the specialized deactivate function
          else if (
            collateralToDelete.securityType === "LAND STOCKS" &&
            collateralToDelete.id
          ) {
            const result = await useCollateralStore
              .getState()
              .deactivateLandStock(collateralToDelete.id, appraisalId);
            success = !!result;
            if (success) {
              message.success("Land stock deactivated successfully");
            } else {
              message.error("Failed to deactivate land stock");
            }
          }
          // For machinery equipment, use the specialized deactivate function
          else if (
            collateralToDelete.securityType === "MACHINERY AND EQUIPMENT" &&
            collateralToDelete.id
          ) {
            const result = await useCollateralStore
              .getState()
              .deactivateMachinery(collateralToDelete.id, appraisalId);
            success = !!result;
            if (success) {
              message.success("Machinery equipment deactivated successfully");
            } else {
              message.error("Failed to deactivate machinery equipment");
            }
          }
          // For property mortgage, use the specialized deactivate function
          else if (
            collateralToDelete.securityType === "PROPERTY MORTGAGE" &&
            collateralToDelete.id
          ) {
            const result = await useCollateralStore
              .getState()
              .deactivatePropertyMortgage(collateralToDelete.id, appraisalId);
            success = !!result;
            if (success) {
              message.success("Property mortgage deactivated successfully");
            } else {
              message.error("Failed to deactivate property mortgage");
            }
          }
          // For savings, use the specialized deactivate function
          else if (
            collateralToDelete.securityType === "FIXED DEPOSITS AND SAVINGS" &&
            collateralToDelete.id
          ) {
            const result = await useCollateralStore
              .getState()
              .deactivateSavings(collateralToDelete.id, appraisalId);
            success = !!result;
            if (success) {
              message.success("Savings deactivated successfully");
            } else {
              message.error("Failed to deactivate savings");
            }
          }
          // For lease, use the specialized deactivate function
          else if (
            collateralToDelete.securityType === "LEASE" &&
            collateralToDelete.id
          ) {
            const result = await useCollateralStore
              .getState()
              .deactivateLease(collateralToDelete.id, appraisalId);
            success = !!result;
            if (success) {
              message.success("Lease deactivated successfully");
            } else {
              message.error("Failed to deactivate lease");
            }
          } else {
            // For other collateral types, use the general delete function
            success = await deleteCollateral(
              collateralToDelete.id!,
              collateralToDelete.securityType,
              appraisalId
            );

            if (success) {
              message.success("Collateral deleted successfully");
            } else {
              message.error("Failed to delete collateral");
            }
          }

          // Update local state (this should be redundant with the API refresh, but good for instant feedback)
          if (success) {
            const newData = formData.filter((_, i) => i !== index);
            setFormData(newData);
          }
        } catch (error) {
          console.error("Error deleting collateral:", error);
          message.error("Failed to delete collateral");
        } finally {
        }
      },
      onCancel: () => { },
    });
  };

  const refreshCollaterals = () => {
    if (appraisalId) {
      fetchCollaterals(appraisalId);
    }
  };

  if (fetchingCollaterals && !formData.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading collateral details..." />
      </div>
    );
  }

  if (fetchCollateralsError && !formData.length) {
    return (
      <div className="flex flex-col items-center p-6">
        <p className="text-red-500 mb-4">
          Error loading collateral details. Please try again.
        </p>
        <Button type="primary" onClick={refreshCollaterals}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <App>
      <div>
        <div className="flex justify-end mb-6">
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => openModal("save")}
            disabled={!appraisalId || deletingCollateral}
          >
            Add Collateral
          </Button>
        </div>

        {formData.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {trialCalculationData?.productCategory === "A" 
                ? "No lease collateral details found. Click 'Add Collateral' to add lease collateral."
                : trialCalculationData?.productCategory === "C"
                ? "No loan collateral details found. Click 'Add Collateral' to add loan collateral."
                : "No collateral details found. Click 'Add Collateral' to add one."
              }
            </p>
            {collaterals && collaterals.length > 0 && (
              <p className="text-blue-500 text-sm mt-2">
                {trialCalculationData?.productCategory === "A" 
                  ? "Note: Only lease collaterals are shown for Lease products."
                  : trialCalculationData?.productCategory === "C"
                  ? "Note: Only non-lease collaterals are shown for Loan products."
                  : ""
                }
              </p>
            )}
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {formData.map((data, index) => (
              <Col xs={24} sm={12} md={8} key={data.id || index}>
                <DetailsCard
                  data={data}
                  securityType={data.securityType || ""}
                  onUpdate={() => handleUpdate(index)}
                  onDelete={() => handleDelete(index)}
                />
              </Col>
            ))}
          </Row>
        )}

        <CollateralFormModal
          open={isModalOpen}
          onClose={closeModal}
          onSave={handleSubmit}
          isEdit={isEditing}
          initialData={currentFormData}
          productCategory={
            trialCalculationData?.productCategory === "A"
              ? "Lease"
              : trialCalculationData?.productCategory === "C"
                ? "Loan"
                : null
          }
          appraisalId={appraisalId}
          isLoading={
            fetchingDetail ||
            fetchingBankGuarantee ||
            fetchingLandStock ||
            fetchingMachinery ||
            fetchingPropertyMortgage ||
            fetchingSavings ||
            fetchingVehicle ||
            fetchingLease
          }
        />
      </div>
    </App>
  );
};

export default CollateralDetails;
