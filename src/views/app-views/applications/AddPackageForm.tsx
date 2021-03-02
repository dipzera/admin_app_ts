import React, { useContext, useEffect, useState } from "react";
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
import { IAppPackage } from "../../../api/app/types";
import { AppService } from "../../../api/app";
import { AppContext } from "./single-app-page/AppContext";

export interface IAppPackageValues extends IAppPackage {
  ValidDate?: any;
  Range?: any;
}
const AddPackageForm = () => {
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  /*  Destroy initialValues of form after Modal is closed */
  useEffect(() => {
    if (!state.isAddPackageVisible) return;
    form.resetFields();
  }, [state.isAddPackageVisible, form]);

  const onFinish = async (values: IAppPackageValues) => {
    const Status = values.Status ? 1 : 0;
    const ValidFrom = moment(values.ValidDate![0]["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    const ValidTo = moment(values.ValidDate![1]["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    delete values.ValidDate;
    await new AppService()
      .CreateMarketAppPackage({
        AppPackage: {
          ...values,
          ValidFrom,
          ValidTo,
          Status,
        },
        MarketAppID: +state.selectedApp.ID,
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
        dispatch({ type: "HIDE_ADD_MODAL" });
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
      visible={state.isAddPackageVisible}
      onCancel={() => dispatch({ type: "HIDE_ADD_MODAL" })}
      confirmLoading={loading}
      onOk={onOk}
    >
      <Form
        form={form}
        name="basicInformation"
        layout="vertical"
        initialValues={{
          SortIndex: state.selectedApp.Packages.length + 1,
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
