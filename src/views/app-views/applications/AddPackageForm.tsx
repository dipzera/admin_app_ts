import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Col,
    Form,
    InputNumber,
    Input,
    Modal,
    Row,
    Switch,
    DatePicker,
} from "antd";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import moment from "moment";
import { createMarketAppPackage } from "../../../redux/actions/Applications";
import { IState } from "../../../redux/reducers";
import WithStringTranslate from "../../../utils/translate";
interface IAddPackageForm {
    appID: number;
    visible: boolean;
    close: () => any;
    packages: any;
}
const AddPackageForm = ({
    appID,
    visible,
    close,
    packages,
}: IAddPackageForm) => {
    const [form] = Form.useForm();

    /*  Destroy initialValues of form after Modal is closed */
    useEffect(() => {
        if (!visible) return;
        form.resetFields();
    }, [visible, form]);

    const loading = useSelector((state: IState) => state["auth"].loading);
    const dispatch = useDispatch();
    const onFinish = (values: any) => {
        const Status = values.Status ? 1 : 0;
        const { ValidDate, Range } = values;
        const ValidFrom = moment(ValidDate[0]["_d"]).format("[/Date(]xZZ[))/]");
        const ValidTo = moment(ValidDate[1]["_d"]).format("[/Date(]xZZ[))/]");
        delete values.ValidDate;
        delete values.Range;
        console.log({ ...values, ValidFrom, ValidTo });
        dispatch(
            createMarketAppPackage({
                AppPackage: {
                    ...values,
                    ValidFrom,
                    ValidTo,
                    Status,
                },
                MarketAppID: appID,
            })
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
            title={WithStringTranslate("applications.Packages.Add")}
            visible={visible}
            onCancel={close}
            confirmLoading={loading}
            onOk={onOk}
        >
            <Form
                form={form}
                name="basicInformation"
                layout="vertical"
                initialValues={{
                    Range: [69, 420],
                    SortIndex: packages.length + 1,
                }}
            >
                <Row gutter={ROW_GUTTER}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={WithStringTranslate(
                                "applications.Packages.Name"
                            )}
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
                            label={WithStringTranslate(
                                "applications.Packages.Price"
                            )}
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
                            label={WithStringTranslate(
                                "applications.Packages.MinValue"
                            )}
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
                            label={WithStringTranslate(
                                "applications.Packages.MaxValue"
                            )}
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
                            label={WithStringTranslate(
                                "applications.Packages.ValidDate"
                            )}
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
                            label={WithStringTranslate(
                                "applications.Packages.SortIndex"
                            )}
                            name="SortIndex"
                        >
                            <InputNumber />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={WithStringTranslate(
                                "applications.Packages.Activate"
                            )}
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
