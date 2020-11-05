import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Col,
    Form,
    Input,
    message,
    Modal,
    Row,
    Switch,
    DatePicker,
    Slider,
} from "antd";
import axios from "axios";
import { API_IS_APP_SERVICE } from "../../../constants/ApiConstant";
import Utils from "../../../utils";
import { DONE, EXPIRE_TIME } from "../../../constants/Messages";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import moment from "moment";
import { getMarketApps } from "../../../redux/actions/Applications";
interface IAddPackageForm {
    appID: number;
    visible: boolean;
    close: () => any;
    signOut: () => any;
}
const AddPackageForm = ({
    appID,
    visible,
    close,
    signOut,
}: IAddPackageForm) => {
    const [form] = Form.useForm();

    /*  Destroy initialValues of form after Modal is closed */
    useEffect(() => {
        if (!visible) return;
        form.resetFields();
    }, [visible, form]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const Token = useSelector((state) => state["auth"].token);
    const dispatch = useDispatch();
    const onFinish = (values) => {
        // console.log(values);
        const { ValidDate, Range } = values;
        const ValidFrom = moment(ValidDate[0]["_d"]).format("[/Date(]xZZ[))/]");
        const ValidTo = moment(ValidDate[1]["_d"]).format("[/Date(]xZZ[))/]");
        delete values.ValidDate;
        delete values.Range;
        setIsLoading(true);
        setTimeout(() => {
            console.log({
                AppPackage: {
                    ...values,
                    ValidFrom,
                    ValidTo,
                    MinValue: Range[0],
                    MaxValue: Range[1],
                },
                MarketAppID: appID,
                Token,
            });
            setIsLoading(false);
            axios
                .post(`${API_IS_APP_SERVICE}/CreateMarketAppPackage`, {
                    AppPackage: {
                        ...values,
                        ValidFrom,
                        ValidTo,
                        MinValue: Range[0],
                        MaxValue: Range[1],
                    },
                    MarketAppID: appID,
                    Token,
                })
                .then((res) => {
                    console.log(res.data);

                    if (res.data.ErrorCode === 0) {
                        message.success(DONE, 1.5);
                        dispatch(getMarketApps(Token));
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
        <Modal
            destroyOnClose
            title={"Add package"}
            visible={visible}
            onCancel={close}
            confirmLoading={isLoading}
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
                    <Col xs={24} sm={24} md={24}>
                        <Form.Item label="Range" name="Range">
                            <Slider range max={500} />
                        </Form.Item>
                    </Col>
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
                            name="IsActive"
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
