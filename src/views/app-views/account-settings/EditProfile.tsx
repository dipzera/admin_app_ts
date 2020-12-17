import * as React from "react";
import { Component } from "react";
import { Form, Avatar, Button, Input, Row, Col, message, Upload } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import Flex from "../../../components/shared-components/Flex";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { setProfileInfo } from "../../../redux/actions/Account";
import { connect } from "react-redux";
import { ERROR, UPLOADING } from "../../../constants/Messages";
import Utils from "../../../utils";
import { IState } from "../../../redux/reducers";
import { IAccount } from "../../../redux/reducers/Account";
import Localization from "../../../utils/Localization";
import { UploadChangeParam } from "antd/lib/upload";
interface IEditProfile {
    setProfileInfo: (accountInfo: IAccount) => void;
    account: IAccount;
}
class EditProfile extends Component<IEditProfile> {
    render() {
        let { account, setProfileInfo } = this.props;

        const onFinish = (values: IAccount) => {
            const key = "updatable";
            message.loading({
                content: <Localization msg={"message.Updating"} />,
                key,
            });
            setTimeout(async () => {
                this.props.setProfileInfo({
                    ...account,
                    ...values,
                });
            }, 1000);
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log("Failed:", errorInfo);
        };

        const onUploadAavater = (info: UploadChangeParam) => {
            const key = "updatable";
            if (info.file.status === "uploading") {
                message.loading({
                    content: UPLOADING,
                    key,
                    duration: 2,
                });
                return;
            }
            if (info.file.status === "done") {
                Utils.getBase64(info.file.originFileObj, (imageUrl: string) => {
                    setProfileInfo({
                        ...account,
                        Photo: imageUrl,
                    });
                });
            } else {
                message.error({
                    content: ERROR,
                    key,
                    duration: 2.5,
                });
            }
        };

        const onRemoveAvater = () => {
            setProfileInfo({
                ...account,
                Photo: "",
            });
        };

        return (
            <>
                <Flex
                    alignItems="center"
                    mobileFlex={false}
                    className="text-center text-md-left"
                >
                    <Avatar
                        size={90}
                        src={account.Photo}
                        icon={<UserOutlined />}
                    />
                    <div className="ml-md-3 mt-md-0 mt-3">
                        <Upload
                            customRequest={Utils.dummyRequest}
                            onChange={onUploadAavater}
                            showUploadList={false}
                            beforeUpload={(info) => Utils.beforeUpload(info)}
                        >
                            <Button type="primary">
                                <IntlMessage
                                    id={"account.EditProfile.ChangeAvatar"}
                                />
                            </Button>
                        </Upload>
                        <Button className="ml-2" onClick={onRemoveAvater}>
                            <IntlMessage id={"account.EditProfile.Remove"} />
                        </Button>
                    </div>
                </Flex>
                <div className="mt-4">
                    <Form
                        name="basicInformation"
                        layout="vertical"
                        initialValues={account}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={16}>
                                <Row gutter={ROW_GUTTER}>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            label={
                                                <IntlMessage
                                                    id={
                                                        "account.EditProfile.FirstName"
                                                    }
                                                />
                                            }
                                            name="FirstName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your first name!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            label={
                                                <IntlMessage
                                                    id={
                                                        "account.EditProfile.LastName"
                                                    }
                                                />
                                            }
                                            name="LastName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your last name!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            label={
                                                <IntlMessage
                                                    id={
                                                        "account.EditProfile.Email"
                                                    }
                                                />
                                            }
                                            name="Email"
                                            rules={[
                                                {
                                                    required: true,
                                                    type: "email",
                                                    message:
                                                        "Please enter a valid email!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            label={
                                                <IntlMessage
                                                    id={
                                                        "account.EditProfile.PhoneNumber"
                                                    }
                                                />
                                            }
                                            name="PhoneNumber"
                                            rules={[
                                                {
                                                    pattern: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
                                                    message: "Incorrect format",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Button type="primary" htmlType="submit">
                                    <IntlMessage
                                        id={"account.EditProfile.SaveChange"}
                                    />
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </>
        );
    }
}

const mapDispatchToProps = {
    setProfileInfo,
};

const mapStateToProps = ({ account }: IState) => {
    return {
        account,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
