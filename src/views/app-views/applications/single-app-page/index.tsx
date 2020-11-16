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
import { connect, useSelector } from "react-redux";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import Flex from "../../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import PageHeaderAlt from "../../../../components/layout-components/PageHeaderAlt";
import EditPackageForm from "../EditPackageForm";
import { signOut } from "../../../../redux/actions/Auth";
import { deleteMarketAppPackage } from "../../../../redux/actions/Applications";
import AddPackageForm from "../AddPackageForm";
import moment from "moment";
import Axios from "axios";
import { API_APP_URL, APP_PREFIX_PATH } from "../../../../configs/AppConfig";
import {
    DELETE_PACKAGE_MSG,
    DONE,
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
import General from "./General";

const ItemAction = ({ data, showEditAppModal }) => (
    <EllipsisDropdown
        menu={
            <Menu>
                <Menu.Item key="2" onClick={() => showEditAppModal(data)}>
                    <EditOutlined />
                    <span>Edit</span>
                </Menu.Item>
            </Menu>
        }
    />
);

const AppOption = ({ match, location }) => {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={[`${match.url}/:appId/`]}
            selectedKeys={[location.pathname]}
        >
            {/* <Menu.Item key={`${match.url}/description`}>
                <span>Description</span>
                <Link to={"description"} />
            </Menu.Item> */}
            <Menu.Item key={`${match.url}/packages`}>
                <span>Packages</span>
                <Link to={"packages"} />
            </Menu.Item>
            <Menu.Item key={`${match.url}/terms-of-use`}>
                <span>Terms of Use</span>
                <Link to={"terms-of-use"} />
            </Menu.Item>
            <Menu.Item key={`${match.url}/edit`}>
                <span>Edit</span>
                <Link to={"edit"} />
            </Menu.Item>
        </Menu>
    );
};

const AppOption2 = ({ match, location }) => {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={[`${match.url}/:appId/`]}
            selectedKeys={[location.pathname]}
        >
            {/* <Menu.Item key={`${match.url}/description`}>
                <span>Description</span>
                <Link to={"description"} />
            </Menu.Item> */}
            <Menu.Item key={`${match.url}/general`}>
                <span>General</span>
                <Link to={"general"} />
            </Menu.Item>
            <Menu.Item key={`${match.url}/packages`}>
                <span>Packages</span>
                <Link to={"packages"} />
            </Menu.Item>
            <Menu.Item key={`${match.url}/terms-of-use`}>
                <span>Terms of Use</span>
                <Link to={"terms-of-use"} />
            </Menu.Item>
        </Menu>
    );
};
const AppRoute = ({
    match,
    location,
    packages,
    showEditPackageModal,
    showAddPackageModal,
    deletePackage,
    app,
}) => {
    return (
        <Switch>
            <Redirect
                exact
                from={`${match.url}`}
                to={`${match.url}/packages`}
            />
            {/* <Route path={`${match.url}/description`} component={Description} /> */}
            <Route
                path={`${match.url}/packages`}
                render={(props) => (
                    <Packages
                        {...props}
                        packages={packages}
                        showEditPackageModal={showEditPackageModal}
                        deletePackage={deletePackage}
                        showAddPackageModal={showAddPackageModal}
                    />
                )}
            />
            <Route
                path={`${match.url}/terms-of-use`}
                render={(props) => <TermsOfUse {...props} app={app} />}
            />
            <Route
                path={`${match.url}/edit`}
                render={(props) => <EditApp {...props} app={app} />}
            />
        </Switch>
    );
};
const AppRoute2 = ({
    match,
    location,
    app,
    showEditPackageModal,
    showAddPackageModal,
    deletePackage,
}) => {};
const AboutItem = ({ appData, showEditAppModal }) => {
    const { Photo, Status, Name, ShortDescription, LongDescription } = appData;
    return (
        <Card className="mb-5">
            <Flex justifyContent="between" alignItems="center">
                <Flex>
                    <div className="mr-3">
                        <Avatar
                            src={Photo}
                            icon={<ExperimentOutlined />}
                            shape="square"
                            size={80}
                        />
                    </div>
                    <Flex flexDirection="column">
                        <Flex flexDirection="row">
                            <h2 className="mr-3">{Name} </h2>
                            <Tag
                                className="text-capitalize"
                                color={Status === 1 ? "cyan" : "red"}
                            >
                                {Status === 1 ? (
                                    <CheckCircleOutlined />
                                ) : (
                                    <ClockCircleOutlined />
                                )}
                                <span className="ml-2 font-weight-semibold">
                                    {Status === 1 ? "Active" : "Not Active"}
                                </span>
                            </Tag>
                        </Flex>
                        <div>
                            <span className="text-muted ">
                                {ShortDescription}
                            </span>
                            <p
                                className="mt-2"
                                dangerouslySetInnerHTML={{
                                    __html: LongDescription,
                                }}
                            ></p>
                        </div>
                    </Flex>
                </Flex>
                {/* <ItemAction
                    data={appData}
                    showEditAppModal={showEditAppModal}
                /> */}
            </Flex>
        </Card>
    );
};

const SingleAppPage = ({ match, location, deleteMarketAppPackage }) => {
    const { appID } = match.params;
    const { confirm } = Modal;
    const app = useSelector((state) =>
        state["apps"].find((data) => data.ID == appID)
    );
    const [form] = Form.useForm();
    const Token = useSelector((state) => state["auth"].token);
    const loading = useSelector((state) => state["auth"].loading);
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
            <PageHeaderAlt className="bg-white border-bottom" overlap>
                <Flex
                    className="py-5"
                    mobileFlex={false}
                    justifyContent="between"
                    alignItems="center"
                >
                    <Flex alignItems="center">
                        <div className="mr-3">
                            <Avatar
                                src={app.Logo}
                                icon={<ExperimentOutlined />}
                                shape={"square"}
                                size={64}
                            />
                        </div>
                        <h2 className="mb-3">{app.Name}</h2>
                    </Flex>
                    <div className="mb-3">
                        <Button className="mr-2">Discard</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Save
                        </Button>
                    </div>
                </Flex>
            </PageHeaderAlt>

            {/* Tabs of App Preview */}
            <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
                <Tabs.TabPane tab="General" key="1">
                    <General app={app} />
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
