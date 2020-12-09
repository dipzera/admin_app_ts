import { Row, Col, Input, Modal, Form, message, Select, Empty } from "antd";
import React, { useEffect, useState } from "react";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { AdminApi, AuthApi } from "../../../../api";
import { DONE } from "../../../../constants/Messages";
import Localization from "../../../../utils/Localization";

export const UserModalAdd = ({ onCancel, visible, getUsersInfo }: any) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState<any>([]);
    const [showOptions, setShowOptions] = useState(false);
    useEffect(() => {
        if (visible) {
            new AdminApi().GetBasicCompanyList().then((data: any) => {
                const { CompanyList, ErrorCode } = data;
                if (ErrorCode === 0) {
                    setCompanies(CompanyList);
                }
            });
        }
    }, [visible]);
    const onSearch = (value: any) => {
        if (value.length > 1) {
            setShowOptions(true);
        } else {
            setShowOptions(false);
        }
    };
    const onFinish = (values: any) => {
        form.resetFields();
        new AuthApi()
            .RegisterUser({ ...values, UiLanguage: 0 })
            .then((data: any) => {
                if (data) {
                    const { ErrorCode, ErrorMessage } = data;
                    if (ErrorCode === 0) {
                        message.success({
                            content: <Localization msg={DONE} />,
                            key: "updatable",
                        });
                        getUsersInfo();
                    }
                }
            });
    };

    const { Option } = Select;
    return (
        <Modal
            title={"Invite user"}
            visible={visible}
            okText={
                <>
                    {" "}
                    <IntlMessage id={"auth.Send"} />
                </>
            }
            onCancel={onCancel}
            confirmLoading={loading}
            onOk={() => {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    form.validateFields()
                        .then((values) => {
                            onCancel();
                            onFinish(values);
                        })
                        .catch((info) => {
                            console.log("Validate Failed:", info);
                        });
                }, 1000);
            }}
        >
            <Form form={form} name="basicInformation" layout="vertical">
                <Row gutter={ROW_GUTTER}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage
                                    id={"account.EditProfile.FirstName"}
                                />
                            }
                            name="FirstName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your first name!",
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
                                    id={"account.EditProfile.LastName"}
                                />
                            }
                            name="LastName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your last name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                        <Form.Item
                            label={
                                <IntlMessage id={"account.EditProfile.Email"} />
                            }
                            name="Email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Please enter a valid email!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                        <Form.Item
                            label={"Company"}
                            name="CompanyID"
                            rules={[
                                {
                                    required: true,
                                    message: "Please choose your company!",
                                },
                            ]}
                        >
                            <Select
                                onSearch={onSearch}
                                allowClear
                                placeholder="Start typing..."
                                showSearch
                                notFoundContent={
                                    !companies && (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    )
                                }
                                filterOption={(input, option) =>
                                    option!.title
                                        .toUpperCase()
                                        .indexOf(input.toUpperCase()) !== -1
                                }
                            >
                                {showOptions
                                    ? companies.map((company: any) => (
                                          <Option
                                              value={company.ID}
                                              key={company.ID}
                                              title={company.Name}
                                          >
                                              {company.Name}
                                          </Option>
                                      ))
                                    : "Start typing..."}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
