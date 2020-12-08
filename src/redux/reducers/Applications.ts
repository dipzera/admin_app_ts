import { SET_APPS } from "../constants/Applications";
/* Maybe delete this reducer in the future */
export interface IPackages {
    ID: number;
    MaxValue: number;
    MinValue: number;
    Name: string;
    Price: number;
    Status: number;
    ValidFrom?: string;
    ValidTo?: string;
}
export interface IApps {
    ID: number;
    IsActive: boolean;
    LongDescription?: any;
    ShortDescription?: any;
    Name: string;
    Packages: IPackages[];
    Photo: string;
    TermsOfUse?: any;
    Status: number;
}
const initialState = [
    // {
    //     ID: "",
    //     IsActive: false,
    //     LongDescription: "",
    //     Name: "",
    //     Packages: [],
    //     Photo: "",
    //     ShortDescription: "",
    // },
] as IApps[];
const applications = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_APPS:
            return [...action.payload];
        default:
            return state;
    }
};
export default applications;
