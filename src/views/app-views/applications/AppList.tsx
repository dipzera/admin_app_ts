import React, { lazy, useEffect, useState } from "react";
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
import { connect, useDispatch, useSelector } from "react-redux";
import { getMarketApps } from "../../../redux/actions/Applications";
import { signOut } from "../../../redux/actions/Auth";
import Loading from "../../../components/shared-components/Loading";

const GridItem = ({ showEditAppModal, data }) => {
    const [shortDescription, setShortDescription] = useState<any>();
    const locale = useSelector((state) => state["theme"].locale);
    useEffect(() => {
        try {
            setShortDescription(JSON.parse(window.atob(data.ShortDescription)));
        } catch {
            setShortDescription({ en: {}, ru: {}, ro: {} });
        }
    }, []);
    return (
        <Card>
            <Flex className="mb-3 " justifyContent="between">
                <Link to={`${APP_PREFIX_PATH}/applications/${data.ID}`}>
                    <div className="cursor-pointer">
                        <Avatar
                            src={data.Photo}
                            icon={<ExperimentOutlined />}
                            shape="square"
                            size={60}
                        />
                    </div>
                </Link>
                {data.Status === 0 ? (
                    <Tag
                        className="text-capitalize cursor-pointer"
                        color="volcano"
                    >
                        <ClockCircleOutlined />
                        <span className="ml-2 font-weight-semibold">
                            Not Active
                        </span>
                    </Tag>
                ) : (
                    <Tag className="text-capitalize" color="cyan">
                        <CheckCircleOutlined />
                        <span className="ml-2 font-weight-semibold">
                            Active
                        </span>
                    </Tag>
                )}
            </Flex>
            <div>
                <Link to={`${APP_PREFIX_PATH}/applications/${data.ID}`}>
                    <h3 className="mb-0 cursor-pointer ">{data.Name}</h3>
                </Link>
                <p className="text-muted">By IntelectSoft</p>
                <div style={{ minHeight: "70px" }}>
                    {shortDescription ? shortDescription[locale].text : null}
                </div>
            </div>
            {/* <div>
                <Link
                    to={`${APP_PREFIX_PATH}/applications/${data.ID}`}
                    className="mr-3"
                >
                    View
                </Link>
                <Link
                    to={`${APP_PREFIX_PATH}/applications/${data.ID}/edit`} 
                >
                    Edit
                </Link>
            </div> */}
        </Card>
    );
};
const ItemHeader = ({ name, avatar, shortDescription, Status }) => (
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
                <div>{shortDescription}</div>
            </Flex>
        </Flex>
    </>
);

const AppList = ({ getMarketApps, signOut, token: Token, loading, apps }) => {
    const [selectedApp, setSelectedApp] = useState();
    const [editAppModalVisible, setEditAppModalVisible] = useState(false);

    useEffect(() => {
        getMarketApps(Token);
    }, []);

    const showEditAppModal = (selected) => {
        setSelectedApp(selected);
        setEditAppModalVisible(true);
    };

    const closeEditAppModal = () => {
        setEditAppModalVisible(false);
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <EditAppForm
                        apps={selectedApp}
                        visible={editAppModalVisible}
                        close={closeEditAppModal}
                        signOut={signOut}
                    />
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
                                    xl={6}
                                    xxl={6}
                                    key={elm["ID"]}
                                >
                                    <GridItem
                                        showEditAppModal={showEditAppModal}
                                        data={elm}
                                        key={elm["ID"]}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                </>
            )}
        </>
    );
};

const mapStateToProps = ({ apps, auth }) => {
    const { loading, token } = auth;
    return { apps, loading, token };
};

export default connect(mapStateToProps, { getMarketApps, signOut })(AppList);
