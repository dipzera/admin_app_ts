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

const VIEW_LIST = "LIST";
const VIEW_GRID = "GRID";

const ItemAction = ({ data, id, removeId, showEditAppModal }) => (
    <EllipsisDropdown
        menu={
            <Menu>
                <Menu.Item key="1">
                    <Link
                        to={{
                            pathname: `${APP_PREFIX_PATH}/applications/${data.ID}`,
                            props: {
                                ...data,
                            },
                        }}
                    >
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

const ItemInfo = ({ IsActive, ID }) => (
    <Flex alignItems="center">
        <div className="mr-3">
            <Tooltip title="Application ID">
                <span className="ml-1 text-muted">{ID}</span>
            </Tooltip>
        </div>
        <div className="mr-3">
            <Tooltip title="">
                <span className="ml-1 text-muted">/</span>
            </Tooltip>
        </div>
        <div>
            <Tag className="text-capitalize" color={IsActive ? "cyan" : "red"}>
                {IsActive ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                <span className="ml-2 font-weight-semibold">
                    {IsActive ? "Active" : "Not Active"}
                </span>
            </Tag>
        </div>
    </Flex>
);

const ListItem = ({ data, removeId, showEditAppModal }) => (
    <div className="bg-white rounded p-3 mb-3 border">
        <Row align="middle">
            <Col xs={24} sm={24} md={8}>
                <ItemHeader
                    avatar={data.Photo}
                    name={data.Name}
                    shortDescription={data.ShortDescription}
                />
            </Col>
            <Col xs={24} sm={24} md={6}>
                <ItemInfo ID={data.ID} IsActive={data.IsActive} />
            </Col>
            <Col xs={24} sm={24} md={2}>
                <div className="text-right">
                    <ItemAction
                        data={data}
                        showEditAppModal={showEditAppModal}
                        id={data.ID}
                        removeId={removeId}
                    />
                </div>
            </Col>
        </Row>
    </div>
);

const GridItem = ({ data, removeId, showEditAppModal }) => (
    <Card>
        <Flex alignItems="center" justifyContent="between">
            <ItemHeader
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
            <ItemInfo ID={data.ID} IsActive={data.IsActive} />
        </div>
    </Card>
);

const ItemHeader = ({ name, avatar, shortDescription }) => (
    <>
        <div className="mr-3 mb-2">
            <Avatar src={avatar} icon={<ExperimentOutlined />} />
        </div>
        <div>
            <h4 className="mb-0">{name}</h4>
            <span className="text-muted">{shortDescription}</span>
        </div>
    </>
);

const AppList = ({ apps, setApps, signOut }) => {
    const [view, setView] = useState(VIEW_GRID);
    const [selectedApp, setSelectedApp] = useState();
    const [editAppModalVisible, setEditAppModalVisible] = useState(false);
    const onChangeProjectView = (e) => {
        setView(e.target.value);
    };

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
                        <div>
                            <Radio.Group
                                defaultValue={VIEW_GRID}
                                onChange={(e) => onChangeProjectView(e)}
                            >
                                <Radio.Button value={VIEW_GRID}>
                                    <AppstoreOutlined />
                                </Radio.Button>
                                <Radio.Button value={VIEW_LIST}>
                                    <UnorderedListOutlined />
                                </Radio.Button>
                            </Radio.Group>
                            <Button type="primary" className="ml-2">
                                <PlusOutlined />
                                <span>New</span>
                            </Button>
                        </div>
                    </Flex>
                </div>
            </PageHeaderAlt>
            <div
                className={`my-4 ${
                    view === VIEW_LIST ? "container" : "container-fluid"
                }`}
            >
                {view === VIEW_LIST ? (
                    apps.map((elm) => (
                        <ListItem
                            showEditAppModal={showEditAppModal}
                            data={elm}
                            removeId={(ID) => deleteItem(ID)}
                            key={elm["ID"]}
                        />
                    ))
                ) : (
                    <Row gutter={16}>
                        {apps.map((elm) => (
                            <Col
                                xs={24}
                                sm={24}
                                lg={8}
                                xl={8}
                                xxl={6}
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
                )}
            </div>
        </>
    );
};

export default AppList;
