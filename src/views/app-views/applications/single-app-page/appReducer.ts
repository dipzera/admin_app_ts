export const appState = {
  isEditPackageVisible: false,
  isAddPackageVisible: false,
  isEdit: false,
  selectedPackage: null,
  selectedApp: null,
  uploadLoading: false,
  image: "",
};

export const appReducer = (state: any, action: any) => {
  switch (action.type) {
    case "TOGGLE_EDIT":
      return { ...state, isEdit: !state.isEdit };
    case "HIDE_EDIT":
      return { ...state, isEdit: false };
    case "SHOW_EDIT":
      return { ...state, isEdit: true };
    case "SHOW_EDIT_MODAL":
      return {
        ...state,
        isEditPackageVisible: true,
        selectedPackage: action.payload,
      };
    case "HIDE_EDIT_MODAL":
      return { ...state, isEditPackageVisible: false, selectedPackage: null };
    case "SHOW_ADD_MODAL":
      return { ...state, isAddPackageVisible: true };
    case "HIDE_ADD_MODAL":
      return { ...state, isAddPackageVisible: false };
    case "SET_APP_PACKAGE":
      return { ...state, selectedPackage: action.payload };
    case "SET_APP":
      return { ...state, selectedApp: action.payload };
    case "SET_IMAGE":
      return { ...state, image: action.payload };
    case "SHOW_LOADING":
      return { ...state, uploadLoading: true };
    case "HIDE_LOADING":
      return { ...state, uploadLoading: false };
    default:
      return state;
  }
};
