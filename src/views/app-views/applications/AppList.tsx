import React, { lazy, useState } from "react";
import PageHeaderAlt from "../../../components/layout-components/PageHeaderAlt";
import {
    Radio,
    Button,
    Row,
    Col,
    Tooltip,
    Tag,
    Progress,
    Avatar,
    Menu,
    Card,
} from "antd";
import {
    AppstoreOutlined,
    UnorderedListOutlined,
    ExperimentOutlined,
    PlusOutlined,
    PaperClipOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import utils from "../../../utils";
import { COLORS } from "../../../constants/ChartConstant";
import Flex from "../../../components/shared-components/Flex";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import EditAppForm from "./EditAppForm";
import { Link, NavLink, Route } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";

const ItemAction = ({ data, id, removeId, showEditAppModal }) => (
    <EllipsisDropdown
        menu={
            <Menu>
                <Menu.Item key="1">
                    <Link to={`${APP_PREFIX_PATH}/applications/${data.ID}`}>
                        <EyeOutlined />
                        <span> View</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => showEditAppModal(data)}>
                    <EditOutlined />
                    <span>Edit</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">
                    <DeleteOutlined />
                    <span>Delete</span>
                </Menu.Item>
            </Menu>
        }
    />
);

const ItemInfo = ({ IsActive, ID, packages }) => (
    <>
        {/* <h3>Packages</h3>
        <Row gutter={16}>
            {packages.map((pckg) => (
                <Col key={pckg.ID} xl={12} xxl={12} md={12} lg={12}>
                    <Card hoverable>
                        <h4>{pckg.Name}</h4>
                        <div>
                            From {pckg.MinValue} to {pckg.MaxValue} for{" "}
                            {pckg.Price}
                        </div>
                        <div className="text-center">
                            <Tag
                                className="text-capitalize mt-3"
                                color={pckg.IsActive ? "cyan" : "red"}
                            >
                                {pckg.IsActive ? (
                                    <CheckCircleOutlined />
                                ) : (
                                    <ClockCircleOutlined />
                                )}
                                <span className="ml-2 font-weight-semibold">
                                    {pckg.IsActive ? "Active" : "Not Active"}
                                </span>
                            </Tag>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row> */}
    </>
);

const GridItem = ({ data, removeId, showEditAppModal }) => (
    <Card>
        <Flex alignItems="center" justifyContent="between">
            <ItemHeader
                IsActive={data.IsActive}
                avatar={data.Photo}
                name={data.Name}
                shortDescription={
                    data.ShortDescription
                        ? data.ShortDescription
                        : "Here could be your description. Here could be your description .Here could be your description."
                }
            />
            <ItemAction
                data={data}
                id={data.ID}
                removeId={removeId}
                showEditAppModal={showEditAppModal}
            />
        </Flex>
        <div className="mt-2">
            <ItemInfo
                ID={data.ID}
                IsActive={data.IsActive}
                packages={data.Packages}
            />
        </div>
    </Card>
);

const ItemHeader = ({ name, avatar, shortDescription, IsActive }) => (
    <>
        <Flex>
            <div className="mr-3">
                <Avatar
                    src={avatar}
                    icon={<ExperimentOutlined />}
                    shape="square"
                    size={80}
                />
            </div>
            <Flex flexDirection="column">
                <Flex flexDirection="row">
                    <h2 className="mr-3">{name} </h2>
                    <Tag
                        className="text-capitalize"
                        color={IsActive ? "cyan" : "red"}
                    >
                        {IsActive ? (
                            <CheckCircleOutlined />
                        ) : (
                            <ClockCircleOutlined />
                        )}
                        <span className="ml-2 font-weight-semibold">
                            {IsActive ? "Active" : "Not Active"}
                        </span>
                    </Tag>
                </Flex>
                <div>
                    <span className="text-muted ">{shortDescription}</span>
                </div>
            </Flex>
        </Flex>
    </>
);

const AppList = ({ apps, setApps, signOut }) => {
    const [selectedApp, setSelectedApp] = useState();
    const [editAppModalVisible, setEditAppModalVisible] = useState(false);

    const showEditAppModal = (selected) => {
        setSelectedApp(selected);
        setEditAppModalVisible(true);
    };

    const closeEditAppModal = () => {
        setEditAppModalVisible(false);
    };

    const deleteItem = (id) => {
        const data = apps.filter((elm) => elm["ID"] !== id);
        setApps(data);
    };

    return (
        <>
            <EditAppForm
                apps={selectedApp}
                visible={editAppModalVisible}
                close={closeEditAppModal}
                signOut={signOut}
            />
            <PageHeaderAlt className="bg-white border-bottom">
                <div className="container-fluid">
                    <Flex
                        justifyContent="between"
                        alignItems="center"
                        className="py-4"
                    >
                        <h2>Applications</h2>
                    </Flex>
                </div>
            </PageHeaderAlt>
            <div
                className={`my-4 
                    container-fluid`}
            >
                <Row gutter={16}>
                    {apps.map((elm) => (
                        <Col
                            xs={24}
                            sm={24}
                            lg={12}
                            xl={8}
                            xxl={8}
                            key={elm["ID"]}
                        >
                            <GridItem
                                showEditAppModal={showEditAppModal}
                                data={elm}
                                removeId={(ID) => deleteItem(ID)}
                                key={elm["ID"]}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
};

export default AppList;
