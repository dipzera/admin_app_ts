import { SET_APPS } from "../constants/Applications";
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
];
const applications = (state = initialState, action) => {
    switch (action.type) {
        case SET_APPS:
            return [...action.payload];
        default:
            return state;
    }
};
export default applications;
