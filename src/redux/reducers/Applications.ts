import { SET_APPS } from "../constants/Applications";
/* Maybe delete this reducer in the future */
const initialState = [
    {
        ID: "",
        IsActive: false,
        LongDescription: "",
        Name: "",
        Packages: [],
        Photo: "",
        ShortDescription: "",
    },
];
const applications = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_APPS:
            return [...action.payload];
        default:
            return state;
    }
};
export default applications;
