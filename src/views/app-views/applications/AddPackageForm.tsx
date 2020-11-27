import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form, Input, Modal, Row, Switch, DatePicker, Slider } from "antd";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import moment from "moment";
import {
    createMarketAppPackage,
    getMarketApps,
} from "../../../redux/actions/Applications";
import { AdminApi } from "../../../api";
interface IAddPackageForm {
    appID: number;
    visible: boolean;
    close: () => any;
}
const AddPackageForm = ({ appID, visible, close }: IAddPackageForm) => {
    const [form] = Form.useForm();

    /*  Destroy initialValues of form after Modal is closed */
    useEffect(() => {
        if (!visible) return;
        form.resetFields();
    }, [visible, form]);

    const loading = useSelector((state) => state["auth"].loading);
    const dispatch = useDispatch();
    const onFinish = (values) => {
        const Status = values.Status ? 1 : 0;
        const { ValidDate, Range } = values;
        const ValidFrom = moment(ValidDate[0]["_d"]).format("[/Date(]xZZ[))/]");
        const ValidTo = moment(ValidDate[1]["_d"]).format("[/Date(]xZZ[))/]");
        delete values.ValidDate;
        delete values.Range;
        dispatch(
            createMarketAppPackage(
                {
                    ...values,
                    ValidFrom,
                    ValidTo,
                    // MinValue: Range[0],
                    // MaxValue: Range[1],
                    Status,
                },
                appID
            )
        );
    };

    const onOk = () => {
        form.validateFields()
            .then((values) => {
                close();
                onFinish(values);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };
    return (
        <Modal
            destroyOnClose
            title={"Add package"}
            visible={visible}
            onCancel={close}
            confirmLoading={loading}
            onOk={onOk}
        >
            <Form
                form={form}
                name="basicInformation"
                layout="vertical"
                initialValues={{ Range: [69, 420] }}
            >
                <Row gutter={ROW_GUTTER}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={"Package Name"}
                            name="Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please insert package name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label="Price"
                            name="Price"
                            rules={[
                                {
                                    required: true,
                                    message: "Please insert the price!",
                                },
                                {
                                    pattern: /[0-9]/,
                                    message: "Digits only allowed!",
                                },
                            ]}
                        >
                            <Input prefix={"MDL"} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label="Min value"
                            name="MinValue"
                            rules={[
                                {
                                    required: true,
                                    message: "Please insert minimum value!",
                                },
                                {
                                    pattern: /[0-9]/,
                                    message: "Digits only allowed!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label="Max value"
                            name="MaxValue"
                            rules={[
                                {
                                    required: true,
                                    message: "Please insert maximum value!",
                                },
                                {
                                    pattern: /[0-9]/,
                                    message: "Digits only allowed!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    {/* Slider to get MinValue and MaxValue of package */}
                    {/* <Col xs={24} sm={24} md={24}>
                        <Form.Item label="Range" name="Range">
                            <Slider range max={500} />
                        </Form.Item>
                    </Col> */}
                    <Col xs={24} sm={24} md={24}>
                        <Form.Item
                            label="Valid date"
                            name="ValidDate"
                            rules={[
                                {
                                    required: true,
                                    message: "Please insert the date",
                                },
                            ]}
                        >
                            <DatePicker.RangePicker format={"DD/MM/YYYY"} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={"Activate package"}
                            name="Status"
                            valuePropName={"checked"}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
export default AddPackageForm;
