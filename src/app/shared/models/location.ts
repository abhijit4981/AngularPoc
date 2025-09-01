export interface Location {
    locationId: number;
    dosimetryLocationId: string;
    isotracLocationId: string;
    seriesValue: string;
    locationName: string;
    locationNameForDropdown: string;
    locationNameForDropdownWithSeries: string;
    locationGroupCode: string;
    address: string;
    city: string;
    stateCode: string;
    zipCode: string;
    country: string;
    nrcFlag: boolean;
    activeFlag: boolean;
}