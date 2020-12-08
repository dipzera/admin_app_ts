import { Button, Col, Form, Input, message, Row, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Flex from "../../../../components/shared-components/Flex";
import { DONE, LOADING } from "../../../../constants/Messages";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { updateMarketApp } from "../../../../redux/actions/Applications";
import { IState } from "../../../../redux/reducers";
import { IApps } from "../../../../redux/reducers/Applications";
import TextEditor from "./TextEditor";

const EditApp = ({ app }: { [key: string]: IApps }) => {
    const [form] = Form.useForm();
    const Token = useSelector((state: IState) => state["auth"].token);
    const dispatch = useDispatch();
    const [TermsOfUse, setTermsOfUse] = useState(app.TermsOfUse);
    const [LongDescription, setLongDescription] = useState(app.LongDescription);
    const handleTermsOfUse = (content: any) => {
        setTermsOfUse(content);
    };
    const handleLongDescription = (content: any) => {
        setLongDescription(content);
    };
    const onFinish = (values: any) => {
        const Status = values.Status ? 1 : 0;
        const App = {
            ...app,
            ...values,
            Status,
            LongDescription,
            TermsOfUse,
        };
        message
            .loading(LOADING, 1.5)
            .then(() => {
                dispatch(updateMarketApp(App));
            })
            .then(() => message.success(DONE, 1.5));
    };
    return (
        <>
            <Form
                form={form}
                name="editApp"
                layout="vertical"
                initialValues={app}
                onFinish={onFinish}
            >
                <Flex justifyContent="between" alignItems="center">
                    <h2 className="mb-4">Edit application</h2>
                    <Form.Item
                        label={"Activate app"}
                        name="Status"
                        valuePropName={"checked"}
                    >
                        <Switch />
                    </Form.Item>
                </Flex>
                <Row gutter={ROW_GUTTER}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={"App Name"}
                            name="Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input app name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={"Short description"}
                            name="ShortDescription"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input short description!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                        <Form.Item label={"Long Description"}>
                            <TextEditor
                                apps={app.LongDescription}
                                handleEditorChange={handleLongDescription}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                        <Form.Item label={"Terms of use"}>
                            <TextEditor
                                apps={app.TermsOfUse}
                                handleEditorChange={handleTermsOfUse}
                            />
                        </Form.Item>
                    </Col>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Submit
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
        </>
    );
};
export default EditApp;
