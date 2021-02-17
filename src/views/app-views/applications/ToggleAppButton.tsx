import React from "react";
import { Button, Modal } from "antd";
import { EnApp } from ".";
import { AppService } from "../../../api/app";
import IntlMessage from "../../../components/util-components/IntlMessage";

interface IToggleAppButton {
  appStatus: number;
  appID: number;
  getApplications: () => void;
  setSpinLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const ToggleAppButton = (props: IToggleAppButton) => {
  const { appStatus, appID, getApplications, setSpinLoading } = props;
  const toggleText =
    appStatus === EnApp.ACTIVATED ? (
      <IntlMessage id="user.disable" />
    ) : (
      <IntlMessage id="user.activate" />
    );
  const statusToSend =
    appStatus === EnApp.ACTIVATED ? EnApp.DISABLED : EnApp.ACTIVATED;
  return (
    <Button
      danger={appStatus === EnApp.ACTIVATED ? true : false}
      type="link"
      onClick={async () => {
        setSpinLoading(true);
        return await new AppService()
          .ChangeMarketAppStatus(appID, statusToSend)
          .then((data) => {
            if (data && data.ErrorCode === 0) getApplications();
          });
      }}
    >
      {toggleText}
    </Button>
  );
};

export default ToggleAppButton;
