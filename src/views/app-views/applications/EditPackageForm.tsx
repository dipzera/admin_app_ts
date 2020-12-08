import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Col,
    InputNumber,
    Form,
    Input,
    Modal,
    Row,
    Switch,
    DatePicker,
} from "antd";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import moment from "moment";
import { updateMarketAppPackage } from "../../../redux/actions/Applications";
import { IState } from "../../../redux/reducers";
interface IEditPackageForm {
    packages: any;
    visible: boolean;
    close: () => any;
}
const EditPackageForm = ({ packages, visible, close }: IEditPackageForm) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (!visible) return;

        form.resetFields();
    }, [visible, form]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const Token = useSelector((state: IState) => state["auth"].token);
    const dispatch = useDispatch();
    const onFinish = (values: any) => {
        const { ValidDate, Range } = values;
        const Status = values.Status ? 1 : 0;
        const ValidFrom = moment(ValidDate[0]["_d"]).format("[/Date(]xZZ[))/]");
        const ValidTo = moment(ValidDate[1]["_d"]).format("[/Date(]xZZ[))/]");
        delete packages.Range;
        delete packages.ValidDate;
        delete values.Range;
        delete values.ValidDate;
        const AppPackage = {
            ...packages,
            ValidFrom,
            ValidTo,
            // MinValue: Range[0],
            // MaxValue: Range[1],
            ...values,
            Status,
        };
        dispatch(updateMarketAppPackage(AppPackage));
    };

    const onFinishFailed = () => {};

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
            title={"Edit package"}
            visible={visible}
            onCancel={close}
            confirmLoading={isLoading}
            onOk={onOk}
        >
            <Form
                form={form}
                name="basicInformation"
                layout="vertical"
                initialValues={packages}
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
                            label="Sort index"
                            name="SortIndex"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <InputNumber />
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
export default EditPackageForm;
