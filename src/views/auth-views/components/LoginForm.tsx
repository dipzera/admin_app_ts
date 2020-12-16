import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Form, Input, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import {
    showLoading,
    showAuthMessage,
    hideAuthMessage,
    authenticated,
    authorizeUser,
} from "../../../redux/actions/Auth";
import { updateSettings, getProfileInfo } from "../../../redux/actions/Account";
import { motion } from "framer-motion";
import { NavLink, useHistory } from "react-router-dom";
import { hideLoading } from "../../../redux/actions/Auth";
import Utils from "../../../utils";
import { API_PUBLIC_KEY } from "../../../constants/ApiConstant";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { IState } from "../../../redux/reducers";
const LoginForm = ({
    authorizeUser,
    showForgetPassword,
    hideAuthMessage,
    onForgetPasswordClick,
    showLoading,
    hideLoading,
    extra,
    loading,
    showMessage,
    message,
    token,
    redirect,
}: any) => {
    const history = useHistory();
    const onLogin = ({ email, password }: { [key: string]: string }) => {
        showLoading();
        setTimeout(() => {
            authorizeUser({
                Email: email,
                Password: Utils.encryptInput(password, API_PUBLIC_KEY),
            });
        }, 1000);
    };

    useEffect(() => {
        if (token !== null) {
            history.push(redirect);
        }
        if (showMessage) {
            setTimeout(() => {
                hideAuthMessage();
            }, 3000);
        }
    }, [token, showMessage]);

    useEffect(() => {
        hideLoading();
    }, []);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, marginBottom: 0 }}
                animate={{
                    opacity: showMessage ? 1 : 0,
                    marginBottom: showMessage ? 20 : 0,
                }}
            >
                <Alert
                    type="error"
                    showIcon
                    message={message}
                    className="mt-2"
                />
            </motion.div>
            <Form layout="vertical" name="login-form" onFinish={onLogin}>
                <Form.Item
                    name="email"
                    label={<IntlMessage id={"auth.Email"} />}
                    rules={[
                        {
                            required: true,
                            message: (
                                <IntlMessage id={"auth.MessageInsertEmail"} />
                            ),
                        },
                        {
                            type: "email",
                            message: (
                                <IntlMessage
                                    id={"auth.MessageInsertValidEmail"}
                                />
                            ),
                        },
                    ]}
                >
                    <Input prefix={<MailOutlined className="text-primary" />} />
                </Form.Item>
                <Form.Item
                    name="password"
                    label={
                        <div
                            className={`${
                                showForgetPassword
                                    ? "d-flex justify-content-between w-100 align-items-center"
                                    : ""
                            }`}
                        >
                            <span>
                                <IntlMessage id={"auth.Password"} />
                            </span>
                            {showForgetPassword && (
                                <span
                                    onClick={() => onForgetPasswordClick}
                                    className="cursor-pointer font-size-sm font-weight-normal text-muted"
                                >
                                    Forget Password?
                                </span>
                            )}
                        </div>
                    }
                    rules={[
                        {
                            required: true,
                            message: (
                                <IntlMessage
                                    id={"auth.MessageInsertPassword"}
                                />
                            ),
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="text-primary" />}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                    >
                        {" "}
                        <IntlMessage id={"auth.SignIn"} />
                    </Button>
                </Form.Item>
                <NavLink to={"/auth/forgot-password"} className={"text-right"}>
                    <IntlMessage id={"auth.ForgotPassword"} />
                </NavLink>
                {extra}
            </Form>
        </>
    );
};

LoginForm.propTypes = {
    otherSignIn: PropTypes.bool,
    showForgetPassword: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

LoginForm.defaultProps = {
    otherSignIn: true,
    showForgetPassword: false,
};

const mapStateToProps = ({ auth }: IState) => {
    const { loading, message, showMessage, token, redirect } = auth;
    return {
        loading,
        message,
        showMessage,
        token,
        redirect,
    };
};

const mapDispatchToProps = {
    showAuthMessage,
    showLoading,
    hideAuthMessage,
    authenticated,
    updateSettings,
    authorizeUser,
    hideLoading,
    getProfileInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
