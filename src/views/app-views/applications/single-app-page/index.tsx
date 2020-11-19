import {
    Button,
    Card,
    Col,
    Form,
    Menu,
    message,
    Modal,
    Row,
    Tabs,
    Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import {
    PlusOutlined,
    ExperimentOutlined,
    EyeOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { connect, useDispatch, useSelector } from "react-redux";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import Flex from "../../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import PageHeaderAlt from "../../../../components/layout-components/PageHeaderAlt";
import EditPackageForm from "../EditPackageForm";
import {
    hideLoading,
    refreshToken,
    showLoading,
    signOut,
} from "../../../../redux/actions/Auth";
import {
    deleteMarketAppPackage,
    getMarketApps,
    updateMarketApp,
} from "../../../../redux/actions/Applications";
import AddPackageForm from "../AddPackageForm";
import moment from "moment";
import Axios from "axios";
import { API_APP_URL, APP_PREFIX_PATH } from "../../../../configs/AppConfig";
import {
    DELETE_PACKAGE_MSG,
    DONE,
    ERROR,
    EXPIRE_TIME,
    LOADING,
} from "../../../../constants/Messages";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Packages from "./Packages";
import Description from "./Description";
import TermsOfUse from "./TermsOfUse";
import InnerAppLayout from "../../../../layouts/inner-app-layout";
import EditAppForm from "../EditAppForm";
import { API_IS_APP_SERVICE } from "../../../../constants/ApiConstant";
import EditApp from "./EditApp";
import General from "./general";

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
};

const SingleAppPage = ({ match, location, deleteMarketAppPackage }) => {
    const { appID } = match.params;
    const { confirm } = Modal;
    const app = useSelector((state) =>
        state["apps"].find((data) => data.ID == appID)
    );
    const Token = useSelector((state) => state["auth"].token);
    const loading = useSelector((state) => state["auth"].loading);
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<{
        [key: string]: any;
    }>();
    const [editPackageModalVisible, setEditPackageModalVisbile] = useState<
        boolean
    >(false);
    const [addPackageModalVisible, setAddPackageModalVisible] = useState<
        boolean
    >(false);
    const [isEditAppVisible, setIsEditAppVisible] = useState(false);
    const showEditPackageModal = (selected) => {
        setSelectedPackage({
            ...selected,
            Range: [selected.MinValue, selected.MaxValue],
            ValidDate: [moment(selected.ValidFrom), moment(selected.ValidTo)],
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
    const showEditAppModal = () => {
        setIsEditAppVisible(true);
    };

    const closeEditAppModal = () => {
        setIsEditAppVisible(false);
    };

    const deletePackage = (ID) => {
        confirm({
            title: DELETE_PACKAGE_MSG(ID),
            onOk: () => {
                deleteMarketAppPackage(ID, Token);
            },
        });
    };
    const [uploadLoading, setUploadLoading] = useState(false);
    const [form] = Form.useForm();
    const [uploadedImg, setImage] = useState();
    const [shortDesc, setShortDesc] = useState<any>();
    const [longDesc, setLongDesc] = useState<any>();
    const [status, setStatus] = useState<number>(app.Status);
    const [submitLoading, setSubmitLoading] = useState(false);
    useEffect(() => {
        try {
            setShortDesc(JSON.parse(window.atob(app.ShortDescription)));
        } catch {
            setShortDesc({ en: "", ru: "", ro: "" });
        }
    }, []);
    useEffect(() => {
        try {
            setLongDesc(JSON.parse(window.atob(app.LongDescription)));
        } catch {
            setLongDesc({ en: "", ru: "", ro: "" });
        }
    }, []);
    useEffect(() => {
        setImage(app.Photo);
        if (edit) {
            form.setFieldsValue(app);
        }
    }, [edit, setEdit]);

    const handleUploadChange = (info) => {
        if (info.file.status === "uploading") {
            setUploadLoading(true);
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj, (Photo) => {
                const {
                    Name,
                    ShortDescription,
                    TermsOfUse,
                    LongDescription,
                } = app;
                Axios.post(`${API_IS_APP_SERVICE}/UpdateMarketApp`, {
                    App: {
                        ID: appID,
                        LongDescription,
                        ShortDescription,
                        TermsOfUse,
                        Name,
                        Photo,
                    },
                    Token,
                }).then((res) => {
                    if (res.data.ErrorCode === 0) {
                        dispatch(getMarketApps(Token));
                    } else if (res.data.ErrorCode === 118) {
                        dispatch(refreshToken(Token));
                    }
                });
                setImage(Photo);
                // setUploadLoading(false);
                message.success(DONE, 1.5);
            });
        }
        if (info.file.status === "failed") {
            message.error(ERROR, 1.5);
        }
    };
    const changeMarketAppStatus = (Status) => {
        dispatch(showLoading());
        setTimeout(() => {
            dispatch(hideLoading());
            Axios.get(`${API_IS_APP_SERVICE}/ChangeMarketAppStatus`, {
                params: { Token, ID: appID, Status },
            }).then((res) => {
                console.log(res.data);
                if (res.data.ErrorCode === 0) {
                    message.success(DONE, 1);
                } else if (res.data.ErrorCode === 118) {
                    dispatch(refreshToken(Token));
                }
            });
        }, 1000);
    };

    const onFinish = (values) => {
        const App = {
            ID: appID,
            TermsOfUse: app.TermsOfUse,
            Status: app.Status,
            Name: values.Name,
            ShortDescription: Buffer.from(JSON.stringify(shortDesc)).toString(
                "base64"
            ),
            LongDescription: Buffer.from(JSON.stringify(longDesc)).toString(
                "base64"
            ),
            Photo: uploadedImg ? uploadedImg : app.Photo,
        };
        console.log(App);
        message
            .loading(LOADING, 1.5)
            .then(() => {
                dispatch(updateMarketApp(App, Token));
                setEdit(false);
            })
            .then(() => message.success(DONE, 1.5));
    };

    if (!app) {
        return <div>No app found</div>;
    }

    return (
        <>
            <AddPackageForm
                appID={appID}
                close={closeAddPackageModal}
                signOut={signOut}
                visible={addPackageModalVisible}
            />
            <EditPackageForm
                close={closeEditPackageModal}
                signOut={signOut}
                packages={selectedPackage}
                visible={editPackageModalVisible}
            />
            <EditAppForm
                apps={app}
                visible={isEditAppVisible}
                close={closeEditAppModal}
                signOut={signOut}
            />
            {/* App Content Card */}
            {/* <AboutItem appData={app} showEditAppModal={showEditAppModal} /> */}
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
                                    <Button
                                        className="mr-2"
                                        onClick={() => setEdit(false)}
                                    >
                                        Discard
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Save
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
                        <Tabs.TabPane tab="General" key="1">
                            <General
                                changeMarketAppStatus={changeMarketAppStatus}
                                app={app}
                                status={status}
                                setStatus={setStatus}
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
                        <Tabs.TabPane tab="Packages" key="2">
                            <Packages
                                packages={app.Packages}
                                showEditPackageModal={showEditPackageModal}
                                deletePackage={deletePackage}
                                showAddPackageModal={showAddPackageModal}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Terms of Use" key="3">
                            <TermsOfUse app={app} />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </Form>
            {/* <InnerAppLayout
                sideContent={<AppOption location={location} match={match} />}
                mainContent={
                    <AppRoute
                        location={location}
                        match={match}
                        packages={app.Packages}
                        app={app}
                        showEditPackageModal={showEditPackageModal}
                        deletePackage={deletePackage}
                        showAddPackageModal={showAddPackageModal}
                    />
                }
            /> */}
        </>
    );
};
export default connect(null, {
    signOut,
    deleteMarketAppPackage,
})(SingleAppPage);
