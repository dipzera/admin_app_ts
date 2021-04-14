import React, { useContext, useEffect } from "react";
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
import { IAppPackage } from "../../../api/app/types";
import { AppService } from "../../../api/app";
import { IAppPackageValues } from "./AddPackageForm";
import { AppContext } from "./single-app-page/AppContext";
const EditPackageForm = () => {
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(AppContext);
  useEffect(() => {
    if (!state.isEditPackageVisible) return;

    console.log(state.isEditPackageVisible);
    form.resetFields();
  }, [state.isEditPackageVisible, form]);

  const onFinish = (values: IAppPackageValues) => {
    const Status = values.Status ? 1 : 0;
    const ValidFrom = moment(values.ValidDate[0]["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    const ValidTo = moment(values.ValidDate[1]["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    delete values.Range;
    delete values.ValidDate;
    const AppPackage = {
      ...state.selectedPackage,
      ...values,
      Status,
      ValidFrom,
      ValidTo,
    };
    return new AppService()
      .UpdateMarketAppPackage([AppPackage])
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
        dispatch({ type: "HIDE_EDIT_MODAL" });
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
      visible={state.isEditPackageVisible}
      onCancel={() => dispatch({ type: "HIDE_EDIT_MODAL" })}
      onOk={onOk}
    >
      <Form
        form={form}
        name="basicInformation"
        layout="vertical"
        initialValues={{
          ...state.selectedPackage,
          ValidDate: [
            moment(state.selectedPackage && state.selectedPackage!.ValidFrom),
            moment(state.selectedPackage && state.selectedPackage!.ValidTo),
          ],
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
