import React, { useEffect, useReducer, useState } from "react";
import { Route } from "react-router-dom";
import { Button, Form, message, Modal, Tabs } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import PageHeaderAlt from "../../../../components/layout-components/PageHeaderAlt";
import EditPackageForm from "../EditPackageForm";
import AddPackageForm from "../AddPackageForm";
import { DELETE_PACKAGE_MSG, LOADING } from "../../../../constants/Messages";
import Packages from "./Packages";
import TermsOfUse from "./TermsOfUse";
import General from "./general";
import Utils from "../../../../utils";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import TranslateText from "../../../../utils/translate";
import { APP_NAME } from "../../../../configs/AppConfig";
import { RouteComponentProps } from "react-router-dom";
import {
  ILocale,
  IMarketAppList,
  IAppPackage,
} from "../../../../api/app/types";
import { UploadChangeParam } from "antd/lib/upload";
import { AppService } from "../../../../api/app";
import Loading from "../../../../components/shared-components/Loading";
import { appReducer, appState } from "./appReducer";
import { AppContext } from "./AppContext";

interface ISingleAppPage extends RouteComponentProps<{ appID: string }> {}

const SingleAppPage = ({ match }: ISingleAppPage) => {
  const instance = new AppService();
  const { appID } = match.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [state, dispatch] = useReducer(appReducer, appState);
  const getApp = async () =>
    await instance.GetMarketAppList().then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        const currentApp = data.MarketAppList.find((app) => app.ID === +appID);
        document.title = `${currentApp!.Name} | ${APP_NAME}`;
        dispatch({ type: "SET_APP", payload: currentApp });
        return currentApp;
      }
    });
  useEffect(() => {
    getApp().then((app) => {
      try {
        setShortDesc(
          JSON.parse(window.atob(app!.ShortDescription!.toString()))
        );
      } catch {}
      try {
        setLongDesc(JSON.parse(window.atob(app!.LongDescription!.toString())));
      } catch {}
    });
    return () => instance._source.cancel();
  }, []);

  const deletePackage = (ID: number) => {
    Modal.confirm({
      title: DELETE_PACKAGE_MSG(ID),
      onOk: async () => {
        return instance.DeleteMarketAppPackage(ID).then((data) => {
          if (data && data.ErrorCode === 0) {
            getApp();
          }
        });
      },
    });
  };
  const [form] = Form.useForm();
  const [shortDesc, setShortDesc] = useState<Partial<ILocale>>({});
  const [longDesc, setLongDesc] = useState<Partial<ILocale>>({});
  useEffect(() => {
    if (state.isEdit) {
      form.setFieldsValue(state.selectedApp);
    }
  }, [state.isEdit]);

  useEffect(() => {
    if (state.selectedApp) {
      dispatch({ type: "SET_IMAGE", payload: state.selectedApp.Photo });
      document.title = `${APP_NAME} - ${state.selectedApp.Name}`;
    }
  }, [appID]);

  const handleUploadChange = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
      dispatch({ type: "SHOW_LOADING" });
      return;
    }
    if (info.file.status === "done") {
      Utils.getBase64(info.file.originFileObj, (Photo: string) => {
        return instance
          .UpdateMarketApp({
            ...state.selectedApp,
            ID: +appID,
            Photo,
          })
          .then((data) => {
            dispatch({ type: "HIDE_LOADING" });
            if (data && data.ErrorCode === 0) {
              getApp();
              dispatch({ type: "SET_IMAGE" });
            }
          });
      });
    }
  };

  const onFinish = (values: IMarketAppList) => {
    message
      .loading({
        content: TranslateText(LOADING),
        key: "updatable",
        duration: 1.5,
      })
      .then(async () => {
        return await instance
          .UpdateMarketApp({
            ...state.selectedApp,
            ID: +appID,
            Name: values.Name,
            ShortDescription: Buffer.from(JSON.stringify(shortDesc)).toString(
              "base64"
            ),
            LongDescription: Buffer.from(JSON.stringify(longDesc)).toString(
              "base64"
            ),
          })
          .then((data) => {
            if (data && data.ErrorCode === 0) {
              getApp();
              dispatch({ type: "TOGGLE_EDIT" });
            }
          });
      });
  };

  if (!state.selectedApp) {
    return <Loading cover="content" />;
  }
  if (loading) {
    return <Loading cover="content" />;
  }

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        getApp,
        shortDesc,
        longDesc,
        setShortDesc,
        setLongDesc,
      }}
    >
      <AddPackageForm />
      <EditPackageForm />
      <Form
        form={form}
        layout="vertical"
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
      >
        <PageHeaderAlt className="bg-white border-bottom" overlap>
          <div className="container">
            <Flex
              className="py-1 mb-4"
              mobileFlex={false}
              justifyContent="between"
              alignItems="center"
            >
              <Flex alignItems="center">
                <div className="mr-3">
                  <Avatar
                    src={state.selectedApp.Photo}
                    icon={<ExperimentOutlined />}
                    shape={"square"}
                    size={64}
                  />
                </div>
                <h2 className="mb-1">{state.selectedApp.Name}</h2>
              </Flex>
              {state.isEdit && (
                <div className="mb-3">
                  <Button
                    className="mr-2"
                    onClick={() => dispatch({ type: "TOGGLE_EDIT" })}
                  >
                    <IntlMessage id="applications.Discard" />
                  </Button>
                  <Button type="primary" htmlType="submit">
                    <IntlMessage id="applications.Save" />
                  </Button>
                </div>
              )}
            </Flex>
          </div>
        </PageHeaderAlt>

        {/* Tabs of App Preview */}
        <div className="container">
          <Tabs
            defaultActiveKey="1"
            style={{ marginTop: 30 }}
            onChange={() => dispatch({ type: "HIDE_EDIT" })}
          >
            <Tabs.TabPane tab={TranslateText("applications.General")} key="1">
              <General handleUploadChange={handleUploadChange} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={TranslateText("applications.Packages")} key="2">
              <Packages deletePackage={deletePackage} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={TranslateText("applications.TermsOfUse")}
              key="3"
            >
              <TermsOfUse />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Form>
    </AppContext.Provider>
  );
};
export default SingleAppPage;
