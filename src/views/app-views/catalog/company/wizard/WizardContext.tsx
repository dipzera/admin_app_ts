import React, { Dispatch, SetStateAction } from "react";
import { ICompanyData } from "../../../../../api/types.response";
import { IAccount } from "../../../../../redux/reducers/Account";
export interface IWizard {
    current: number;
    setCurrent: Dispatch<SetStateAction<number>>;
    apiSuccess: boolean;
    setApiSuccess: Dispatch<SetStateAction<boolean>>;
    wizardData: Partial<{ CompanyData: ICompanyData; UserData: IAccount }>;
    setWizardData: Dispatch<
        SetStateAction<
            Partial<{ CompanyData: ICompanyData; UserData: IAccount }>
        >
    >;
    companyID: number;
    setCompanyID: Dispatch<SetStateAction<number>>;
}

export const WizardContext = React.createContext<Partial<IWizard>>({});
