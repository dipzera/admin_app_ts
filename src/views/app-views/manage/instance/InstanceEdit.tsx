import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  PageHeader,
  Row,
  Select,
  Spin,
  Tooltip,
} from "antd";
import useQuery from "../../../../utils/hooks/useQuery";
import { ManagementDb } from "../../../../api/app/management-db";
import { useForm } from "antd/lib/form/Form";
import {
  EnDbServerLocation,
  EnDbServerType,
  EnOSType,
} from "../../../../api/app/management-db/types";
import TranslateText from "../../../../utils/translate";
import { DONE } from "../../../../constants/Messages";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import InstanceForm from "./InstanceForm";

const InstanceEdit = (props: any) => {
  const managementInstance = new ManagementDb();
  const query = useQuery();
  const [form] = useForm();
  const [dbServices, setDbServices] = useState<any>();
  const [loading, setLoading] = useState(true);

  const getDbInstance = async () => {
    return await managementInstance.GetDbInstance().then(async (data) => {
      setLoading(false);
      if (data && data.ErrorCode === 0) {
        // If it's public or saas cloud we get dbservices in order to connect the database to a dbservice
        if (
          +query.get("cloud")! === EnDbServerLocation.PRIVATE ||
          +query.get("cloud")! === EnDbServerLocation.SAAS
        ) {
          await getDbServices();
        }
        const currentDbInstance = data.DBInstances.find(
          (inst) => +inst.ID === +query.get("id")!
        );
        form.setFieldsValue(currentDbInstance);
      }
    });
  };
  const getDbServices = async () => {
    return await managementInstance.GetDbServiceInstance().then((data) => {
      if (data && data.ErrorCode === 0) setDbServices(data.DBServices);
    });
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    return await managementInstance
      .UpdateDatabaseInstance({
        ...values,
        ID: query.get("id"),
        Location: query.get("cloud"),
      })
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === 0) {
          message.success(TranslateText(DONE));
        }
      });
  };
  useEffect(() => {
    getDbInstance();
  }, []);
  return (
    <Spin spinning={loading}>
      <PageHeader
        title={`Edit database instance`}
        onBack={() => props.history.goBack()}
      >
        <InstanceForm
          form={form}
          onFinish={onFinish}
          dbServices={dbServices}
          query={+query.get("cloud")!}
        />
      </PageHeader>
    </Spin>
  );
};

export default InstanceEdit;
