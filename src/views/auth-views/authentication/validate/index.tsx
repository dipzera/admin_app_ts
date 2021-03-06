import React, { useState, useLayoutEffect } from "react";
import ErrorOne from "../../errors/error-page-1/index";
import Success from "../success/index";
import { AuthService } from "../../../../api/auth";
import { RouteComponentProps } from "react-router-dom";

const Validate = ({ history }: RouteComponentProps) => {
  const [isValidated, setIsValidated] = useState(true);
  useLayoutEffect(() => {
    new AuthService()
      .ActivateUser(history.location.pathname.replace("/auth/validate/", ""))
      .then((data) => {
        if (data.ErrorCode === 0) setIsValidated(true);
        else setIsValidated(false);
      });
  }, [history]);

  return <>{isValidated ? <Success /> : <ErrorOne />}</>;
};

export default Validate;
