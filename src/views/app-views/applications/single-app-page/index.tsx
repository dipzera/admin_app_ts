import { Button, Form, message, Modal, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { ExperimentOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Flex from "../../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import PageHeaderAlt from "../../../../components/layout-components/PageHeaderAlt";
import EditPackageForm from "../EditPackageForm";
import { hideLoading, showLoading } from "../../../../redux/actions/Auth";
import {
  deleteMarketAppPackage,
  updateMarketApp,
} from "../../../../redux/actions/Applications";
import AddPackageForm from "../AddPackageForm";
import moment from "moment";
import {
  DELETE_PACKAGE_MSG,
  DONE,
  ERROR,
  LOADING,
} from "../../../../constants/Messages";
import Packages from "./Packages";
import TermsOfUse from "./TermsOfUse";
import General from "./general";
import { IState } from "../../../../redux/reducers";
import Utils from "../../../../utils";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import WithStringTranslate from "../../../../utils/translate";
import { APP_NAME } from "../../../../configs/AppConfig";
import { RouteComponentProps } from "react-router-dom";
import {
  ILocale,
  IMarketAppList,
  IPackages,
} from "../../../../api/types.response";
import { UploadChangeParam } from "antd/lib/upload";

interface ISingleAppPage extends RouteComponentProps<{ appID: string }> {}

const SingleAppPage = ({ match }: ISingleAppPage) => {
  const { appID } = match.params;
  const { confirm } = Modal;
  const app = useSelector((state: IState) =>
    state["apps"]!.find((data) => data.ID === +appID)
  );
  const dispatch = useDispatch();
  const [edit, setEdit] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<IPackages>({
    ValidDate: "",
    Range: "",
    ID: 0,
    MaxValue: 0,
    MinValue: 0,
    Name: "",
    Price: 0,
    SortIndex: 0,
    Status: 0,
    ValidFrom: "",
    ValidTo: "",
  });
  const [editPackageModalVisible, setEditPackageModalVisbile] = useState<
    boolean
  >(false);
  const [addPackageModalVisible, setAddPackageModalVisible] = useState<boolean>(
    false
  );
  const showEditPackageModal = (selected: IPackages) => {
    setSelectedPackage({
      ...selected,
    });
    setEditPackageModalVisbile(true);
  };
  const closeEditPackageModal = () => {
    setEditPackageModalVisbile(false);
  };

  const showAddPackageModal = () => {
    setAddPackageModalVisible(true);
  };
  const closeAddPackageModal = () => {
    setAddPackageModalVisible(false);
  };

  const deletePackage = (ID: number) => {
    confirm({
      title: DELETE_PACKAGE_MSG(ID),
      onOk: () => {
        dispatch(deleteMarketAppPackage(ID));
      },
    });
  };
  const [uploadLoading, setUploadLoading] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImg, setImage] = useState<string>();
  const [shortDesc, setShortDesc] = useState<Partial<ILocale>>({});
  const [longDesc, setLongDesc] = useState<Partial<ILocale>>({});
  useEffect(() => {
    try {
      setShortDesc(JSON.parse(window.atob(app!.ShortDescription.toString())));
    } catch {
      setShortDesc({ en: "", ru: "", ro: "" });
    }
  }, []);
  useEffect(() => {
    try {
      setLongDesc(JSON.parse(window.atob(app!.LongDescription.toString())));
    } catch {
      setLongDesc({ en: "", ru: "", ro: "" });
    }
  }, []);
  useEffect(() => {
    setImage(app!.Photo);
    if (edit) {
      form.setFieldsValue(app);
    }
  }, [edit, setEdit]);

  useEffect(() => {
    if (app) {
      document.title = `${APP_NAME} - ${app.Name}`;
    }
  }, [appID]);

  const handleUploadChange = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === "done") {
      Utils.getBase64(info.file.originFileObj, (Photo: string) => {
        const {
          Name,
          ShortDescription,
          TermsOfUse,
          LongDescription,
        } = app as IMarketAppList;
        dispatch(
          updateMarketApp({
            ID: +appID,
            LongDescription,
            ShortDescription,
            TermsOfUse,
            Name,
            Photo,
          })
        );
        setImage(Photo);
      });
    }
  };

  const onFinish = (values: IMarketAppList) => {
    message
      .loading({
        content: WithStringTranslate(LOADING),
        key: "updatable",
        duration: 1.5,
      })
      .then(() => {
        dispatch(
          updateMarketApp({
            ID: +appID,
            TermsOfUse: app!.TermsOfUse,
            Status: app!.Status,
            Name: values.Name,
            ShortDescription: Buffer.from(JSON.stringify(shortDesc)).toString(
              "base64"
            ),
            LongDescription: Buffer.from(JSON.stringify(longDesc)).toString(
              "base64"
            ),
            Photo: uploadedImg ? uploadedImg : app!.Photo,
          })
        );
        setEdit(false);
      });
  };

  if (!app) {
    return <div>No app found</div>;
  }

  return (
    <>
      <AddPackageForm
        packages={app.Packages ?? []}
        appID={+appID}
        close={closeAddPackageModal}
        visible={addPackageModalVisible}
      />
      <EditPackageForm
        close={closeEditPackageModal}
        packages={selectedPackage}
        visible={editPackageModalVisible}
      />
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
                    src={app.Photo}
                    icon={<ExperimentOutlined />}
                    shape={"square"}
                    size={64}
                  />
                </div>
                <h2 className="mb-1">{app.Name}</h2>
              </Flex>
              {edit && (
                <div className="mb-3">
                  <Button className="mr-2" onClick={() => setEdit(false)}>
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
            onChange={() => setEdit(false)}
          >
            <Tabs.TabPane
              tab={WithStringTranslate("applications.General")}
              key="1"
            >
              <General
                app={app}
                status={app.Status}
                setLongDesc={setLongDesc}
                edit={edit}
                setShortDesc={setShortDesc}
                shortDesc={shortDesc}
                setEdit={setEdit}
                uploadedImg={uploadedImg}
                uploadLoading={uploadLoading}
                handleUploadChange={handleUploadChange}
                longDesc={longDesc}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={WithStringTranslate("applications.Packages")}
              key="2"
            >
              <Packages
                packages={app.Packages ?? []}
                showEditPackageModal={showEditPackageModal}
                deletePackage={deletePackage}
                showAddPackageModal={showAddPackageModal}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={WithStringTranslate("applications.TermsOfUse")}
              key="3"
            >
              <TermsOfUse app={app} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Form>
    </>
  );
};
export default SingleAppPage;
