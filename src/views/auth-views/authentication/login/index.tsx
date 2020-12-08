import React from "react";
import { Col, Row, Modal, Card } from "antd";
import { NavLink } from "react-router-dom";
import LoginForm from "../../components/LoginForm";
import { IListOption } from "../../../../components/layout-components/ThemeConfigurator";
import NavLanguage from "../../../../components/layout-components/NavLanguage";
import IntlMessage from "../../../../components/util-components/IntlMessage";
const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/img/others/img-17.jpg)`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
};
// Use LoginOne if it's Admin Portal App

const LoginOne = (props: any) => {
    return (
        <div className="h-100" style={backgroundStyle}>
            <div className="container d-flex flex-column justify-content-center h-100">
                <Row justify="center">
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <Card>
                            <div className="my-4">
                                <div className="text-center">
                                    <img
                                        className="img-fluid"
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/img/is-logo-dark.png"
                                        }
                                        alt=""
                                    />
                                </div>
                                <Row justify="center">
                                    <Col xs={24} sm={24} md={20} lg={20}>
                                        <LoginForm {...props} />
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default LoginOne;
