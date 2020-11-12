import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form, Input, message, Modal, Row, Switch } from "antd";
import axios from "axios";
import { API_IS_APP_SERVICE } from "../../../constants/ApiConstant";
import Utils from "../../../utils";
import { DONE, EXPIRE_TIME } from "../../../constants/Messages";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import { getMarketApps } from "../../../redux/actions/Applications";
import TextEditor from "./single-app-page/TextEditor";
const EditAppForm = ({ apps, visible, close, signOut }) => {
    const [form] = Form.useForm();

    const [termsOfUse, setTermsOfUse] = useState("");
    const [longDesc, setLongDesc] = useState("");
    const handleTermsOfUse = (content) => {
        setTermsOfUse(content);
    };
    const handleLongDesc = (content) => {
        setLongDesc(content);
    };
    /*  Destroy initialValues of form after Modal is closed */
    useEffect(() => {
        if (!visible) return;
        form.resetFields();
    }, [visible, form]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const Token = useSelector((state) => state["auth"].token);
    const dispatch = useDispatch();
    const onFinish = (values) => {
        const Status = values.Status ? 1 : 0;

        setIsLoading(true);
        setTimeout(() => {
            console.log({
                App: {
                    ...apps,
                    ...values,
                    Status,
                    LongDescription: longDesc,
                    TermsOfUse: termsOfUse,
                },
                Token,
            });
            setIsLoading(false);
            axios
                .post(`${API_IS_APP_SERVICE}/UpdateMarketApp`, {
                    App: {
                        ...apps,
                        ...values,
                        Status,
                        LongDescription: longDesc,
                        TermsOfUse: termsOfUse,
                    },
                    Token,
                })
                .then((res) => {
                    console.log(res.data);

                    if (res.data.ErrorCode === 0) {
                        message
                            .success(DONE, 1.5)
                            .then(() => dispatch(getMarketApps(Token)));
                    } else if (res.data.ErrorCode === 118) {
                        message.loading(EXPIRE_TIME, 1.5).then(() => signOut());
                    }
                });
        }, 1000);
    };

    const onFinishFailed = () => {};

    const onOk = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            form.validateFields()
                .then((values) => {
                    close();
                    onFinish(values);
                })
                .catch((info) => {
                    console.log("Validate Failed:", info);
                });
        }, 1000);
    };
    return (
        <div></div>
        // <Modal
        //     destroyOnClose
        //     title={"Edit app"}
        //     visible={visible}
        //     onCancel={close}
        //     confirmLoading={isLoading}
        //     onOk={onOk}
        // >
        //     <Form
        //         form={form}
        //         name="basicInformation"
        //         layout="vertical"
        //         initialValues={apps}
        //     >
        //         <Row gutter={ROW_GUTTER}>
        //             <Col xs={24} sm={24} md={24}>
        //                 <Form.Item
        //                     label={"App Name"}
        //                     name="Name"
        //                     rules={[
        //                         {
        //                             required: true,
        //                             message: "Please input app name!",
        //                         },
        //                     ]}
        //                 >
        //                     <Input />
        //                 </Form.Item>
        //             </Col>
        //             <Col xs={24} sm={24} md={24}>
        //                 <Form.Item
        //                     label={"Short description"}
        //                     name="ShortDescription"
        //                     rules={[
        //                         {
        //                             required: true,
        //                             message: "Please input short description!",
        //                         },
        //                     ]}
        //                 >
        //                     <Input.TextArea
        //                         style={{ resize: "none" }}
        //                         maxLength={80}
        //                     />
        //                 </Form.Item>
        //             </Col>
        //             <Col xs={24} sm={24} md={24}>
        //                 <Form.Item label={"Long Description"}>
        //                     <TextEditor
        //                         apps={apps.LongDescription}
        //                         handleEditorChange={handleLongDesc}
        //                     />
        //                 </Form.Item>
        //             </Col>
        //             <Col xs={24} sm={24} md={24}>
        //                 <Form.Item label={"Terms of use"}>
        //                     <TextEditor
        //                         apps={apps.TermsOfUse}
        //                         handleEditorChange={handleTermsOfUse}
        //                     />
        //                 </Form.Item>
        //             </Col>
        //             <Col xs={24} sm={24} md={12}>
        //                 <Form.Item
        //                     label={"Activate app"}
        //                     name="Status"
        //                     valuePropName={"checked"}
        //                 >
        //                     <Switch />
        //                 </Form.Item>
        //             </Col>
        //         </Row>
        //     </Form>
        // </Modal>
    );
};
export default EditAppForm;
