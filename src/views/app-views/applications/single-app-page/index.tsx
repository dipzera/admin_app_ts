import { Button, Card, Col, Menu, message, Modal, Row, Tag } from "antd";
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
import { getMarketApps } from "../../../../redux/actions/Applications";
import AddPackageForm from "../AddPackageForm";
import moment from "moment";
import Axios from "axios";
import { API_APP_URL, APP_PREFIX_PATH } from "../../../../configs/AppConfig";
import { DONE, EXPIRE_TIME, LOADING } from "../../../../constants/Messages";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Packages from "./Packages";
import Description from "./Description";
import TermsOfUse from "./TermsOfUse";
import InnerAppLayout from "../../../../layouts/inner-app-layout";
import EditAppForm from "../EditAppForm";
import { API_IS_APP_SERVICE } from "../../../../constants/ApiConstant";

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
            <Menu.Item key={`${match.url}/description`}>
                <span>Description</span>
                <Link to={"description"} />
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
}) => {
    return (
        <Switch>
            <Redirect
                exact
                from={`${match.url}`}
                to={`${match.url}/description`}
            />
            <Route path={`${match.url}/description`} component={Description} />
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
            <Route path={`${match.url}/terms-of-use`} component={TermsOfUse} />
        </Switch>
    );
};
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
                            <p className="mt-4">{LongDescription}</p>
                        </div>
                    </Flex>
                </Flex>
                <ItemAction
                    data={appData}
                    showEditAppModal={showEditAppModal}
                />
            </Flex>
        </Card>
    );
};

const SingleAppPage = ({ match, location, getMarketApps }) => {
    const { appID } = match.params;
    const { confirm } = Modal;
    const app = useSelector((state) =>
        state["apps"].find((data) => data.ID == appID)
    );
    const Token = useSelector((state) => state["auth"].token);
    const [selectedPackage, setSelectedPackage] = useState<{
        [key: string]: any;
    }>();
    const [editPackageModalVisible, setEditPackageModalVisbile] = useState<
        boolean
    >(false);
    const [addPackageModalVisible, setAddPackageModalVisible] = useState<
        boolean
    >(false);
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
    const [isEditAppVisible, setIsEditAppVisible] = useState(false);
    const showEditAppModal = () => {
        setIsEditAppVisible(true);
    };

    const closeEditAppModal = () => {
        setIsEditAppVisible(false);
    };

    const deletePackage = (ID) => {
        confirm({
            title: `Are you sure you want to delete package with ID: ${ID}`,
            onOk: () => {
                message.loading(LOADING, 1.5).then(() => {
                    Axios.post(`${API_IS_APP_SERVICE}/DeleteMarketAppPackage`, {
                        ID,
                        Token,
                    }).then((res) => {
                        console.log(res.data);
                        if (res.data.ErrorCode === 0) {
                            getMarketApps(Token);
                            message.success(
                                `Deleted package with ID: ${ID}`,
                                2
                            );
                        } else if (res.data.ErrorCode === 118) {
                            message
                                .loading(EXPIRE_TIME, 1.5)
                                .then(() => signOut());
                        }
                    });
                });
            },
            onCancel: () => {},
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
            <AboutItem appData={app} showEditAppModal={showEditAppModal} />
            <InnerAppLayout
                sideContent={<AppOption location={location} match={match} />}
                mainContent={
                    <AppRoute
                        location={location}
                        match={match}
                        packages={app.Packages}
                        showEditPackageModal={showEditPackageModal}
                        deletePackage={deletePackage}
                        showAddPackageModal={showAddPackageModal}
                    />
                }
            />
        </>
    );
};
export default connect(null, { signOut, getMarketApps })(SingleAppPage);
