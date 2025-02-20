interface Province {
    code: string;
    name: string;
}

interface District {
    code: string;
    name: string;
    province_code: string;
}

interface Ward {
    code: string;
    name: string;
    district_code: string;
}

export const getProvinces = async (): Promise<Province[]> => {
    const response = await fetch('https://provinces.open-api.vn/api/p/');
    return response.json();
};

export const getDistricts = async (provinceCode: string): Promise<District[]> => {
    const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    const data = await response.json();
    return data.districts;
};

export const getWards = async (districtCode: string): Promise<Ward[]> => {
    const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const data = await response.json();
    return data.wards;
}; 