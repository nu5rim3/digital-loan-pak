export const getValueOfClientele = (key: string) => {
    switch (key) {
        case "C": return "Customer";
        case "G": return "Guarantor";
        case "W": return "Witness";
        default: return "Value Not Found";
    }
};

export const intoCurrency = (num: number | string ) => {
    console.log('num', num);
    let convertedNum = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(convertedNum)) return "-";
    return convertedNum?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
  };

export  const getProdName = (code: string) => {
    const map: Record<string, string> = {
      IE: 'PAKOMAN SALARY LOAN INDV.',
      FQ: 'FORI QARZA',
      IF: 'MICRO INDV. LOAN-NEW',
      IG: 'MICRO INDV. LOAN-LSL-NEW',
      IH: 'MICRO INDV. LOAN-BKB-NEW',
      II: 'MICRO INDV. LOAN-BKB-LSL-NEW',
      IJ: 'BULLET ZARAI KARZA-INDIVIDUAL',
      KQ: 'HUNERMAND KHATOON QARZA',
      ZA: 'ZARAI SECURED TERM LOAN',
      ZB: 'ZARAI SECURED DFLOAN',
      ZC: 'ZARAI UNSECURED TERM LOAN',
      GN: 'GOLD LOAN ZERO INTEREST',
      MG: 'MSME GOLD LOAN',
      EG: 'ENTERPRISE GOLD LOAN',
      GL: 'GOLD LOAN'
    };
    return map[code] || code;
  };

export const getFacilityTypeName = (code: string) => {
   const map: Record<string, string> = {
    RO: "Roll Over",
    NL: "New Loan",
    TL: "Top up Loan",
    RT: "Repeat Loan"
  };

  return map[code] || code;
  }

export const getValueByList = (arr:any, key:any) => {
  if (!arr || !key) return null
  const value = arr.find((item:any) => item.code == key)
  return value ? value.description : "Value Not Found"
}

export const getValueAddressType = (key:any) => {
    switch (key) {
        case "TEMPORARY": return "Residential Address";
        case "PERMANANT": return "Permanent Address";
        case "BUSINESS": return "Business Address";
        default: return "Value Not Found";
    }
};

export const getValueNatureOfBorrowe = (key:any) => {
    switch (key) {
        case "OWNER": return "Owner";
        case "TENANTCROPPER": return "Tenant/Shared Cropper";
        case "OWNERTENANT": return "Owner cum Tenant";
        default: return "Value Not Found";
    }
};

export const getValueOwnershipOfLand = (key:any) => {
    switch (key) {
        case "OWNED": return "Owned";
        case "RENTED": return "Rented";
        case "FAMILY": return "Family";
        case "LEASED": return "Leased";
        default: return "Value Not Found";
    }
};

 

