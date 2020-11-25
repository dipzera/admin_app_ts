import React, { useEffect, useState } from "react";
import { Row, Col, Tag, Avatar, Card } from "antd";
import {
    ExperimentOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import Flex from "../../../components/shared-components/Flex";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import { connect, useDispatch, useSelector } from "react-redux";
import { getMarketApps } from "../../../redux/actions/Applications";
import { hideLoading, signOut } from "../../../redux/actions/Auth";
import Loading from "../../../components/shared-components/Loading";

const GridItem = ({ data }) => {
    const [shortDescription, setShortDescription] = useState<any>();
    const locale = useSelector((state) => state["theme"].locale);
    useEffect(() => {
        try {
            setShortDescription(JSON.parse(window.atob(data.ShortDescription)));
        } catch {
            setShortDescription({ en: "", ru: "", ro: "" });
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
                    {shortDescription ? shortDescription[locale] : null}
                </div>
            </div>
        </Card>
    );
};

const AppList = ({ getMarketApps, loading, apps }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        getMarketApps();
        dispatch(hideLoading());
    }, []);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
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
                                    <GridItem data={elm} key={elm["ID"]} />
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
