import React, { useEffect } from "react";
import { useSelector } from "react-redux";
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
import { IState } from "../../../redux/reducers";
import TranslateText from "../../../utils/translate";
import { IPackages } from "../../../api/types.response";
import { AppService } from "../../../api";

interface IAddPackageForm {
  appID: number;
  visible: boolean;
  close: () => void;
  packages: IPackages[];
  getApp: () => void;
}
const AddPackageForm = ({
  appID,
  visible,
  close,
  packages,
  getApp,
}: IAddPackageForm) => {
  const [form] = Form.useForm();

  /*  Destroy initialValues of form after Modal is closed */
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [visible, form]);

  const loading = useSelector((state: IState) => state["auth"].loading);

  const onFinish = async (values: IPackages) => {
    const Status = values.Status ? 1 : 0;
    const ValidFrom = moment(values.ValidDate![0]["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    const ValidTo = moment(values.ValidDate![1]["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    delete values.ValidDate;
    return await new AppService()
      .CreateMarketAppPackage({
        AppPackage: {
          ...values,
          ValidFrom,
          ValidTo,
          Status,
        },
        MarketAppID: appID,
      })
      .then((data) => {
        if (data && data.ErrorCode === 0) {
          window.location.reload();
        }
      });
  };

  const onOk = () => {
    form
      .validateFields()
      .then((values: any) => {
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
      title={TranslateText("applications.Packages.Add")}
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
          SortIndex: packages.length + 1,
        }}
      >
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={TranslateText("applications.Packages.Name")}
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
              label={TranslateText("applications.Packages.Price")}
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
              label={TranslateText("applications.Packages.MinValue")}
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
              label={TranslateText("applications.Packages.MaxValue")}
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
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={TranslateText("applications.Packages.ValidDate")}
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
              label={TranslateText("applications.Packages.SortIndex")}
              name="SortIndex"
            >
              <InputNumber />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={TranslateText("applications.Packages.Activate")}
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
