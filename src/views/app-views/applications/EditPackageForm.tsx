import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
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
import TranslateText from "../../../utils/translate";
import { IPackages } from "../../../api/types.response";
import { AppService } from "../../../api";
interface IEditPackageForm {
  packages: Partial<IPackages>;
  visible: boolean;
  close: () => void;
  getApp: () => void;
}
const EditPackageForm = ({
  packages,
  visible,
  close,
  getApp,
}: IEditPackageForm) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (!visible) return;

    form.resetFields();
  }, [visible, form]);

  const dispatch = useDispatch();
  const onFinish = (values: IPackages) => {
    const Status = values.Status ? 1 : 0;
    const ValidFrom = moment(values.ValidDate[0]["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    const ValidTo = moment(values.ValidDate[1]["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    delete packages.Range;
    delete packages.ValidDate;
    delete values.Range;
    delete values.ValidDate;
    const AppPackage = {
      ...packages,
      ...values,
      Status,
      ValidFrom,
      ValidTo,
    };
    return new AppService()
      .UpdateMarketAppPackage([AppPackage])
      .then((data) => {
        if (data && data.ErrorCode === 0) {
          getApp();
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
      title={TranslateText("applications.Packages.Edit")}
      visible={visible}
      onCancel={close}
      onOk={onOk}
    >
      <Form
        form={form}
        name="basicInformation"
        layout="vertical"
        initialValues={{
          ...packages,
          ValidDate: [moment(packages.ValidFrom), moment(packages.ValidTo)],
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
export default EditPackageForm;
