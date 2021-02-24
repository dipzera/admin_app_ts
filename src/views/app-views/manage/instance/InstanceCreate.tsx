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
import TranslateText from "../../../../utils/translate";
import { DONE } from "../../../../constants/Messages";
import {
  EnDbServerLocation,
  EnDbServerType,
  EnOSType,
} from "../../../../api/app/management-db/types";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import InstanceForm from "./InstanceForm";

const InstanceCreate = (props: any) => {
  const managementInstance = new ManagementDb();
  const query = useQuery();
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [dbServices, setDbServices] = useState<any>([]);
  const getDbServices = async () => {
    setLoading(true);
    return await managementInstance.GetDbServiceInstance().then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === 0) setDbServices(data.DBServices);
    });
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    return await managementInstance
      .UpdateDatabaseInstance({
        ...values,
        Location: query.get("cloud"),
      })
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === 0) {
          message.success(TranslateText(DONE));
          form.resetFields();
        }
      });
  };
  useEffect(() => {
    // If it's public or saas cloud we get dbservices in order to connect
    // the database to a dbservice
    if (
      +query.get("cloud")! === EnDbServerLocation.PRIVATE ||
      +query.get("cloud")! === EnDbServerLocation.SAAS
    ) {
      getDbServices();
    }
    return () => managementInstance._source.cancel();
  }, []);
  return (
    <Spin spinning={loading}>
      <PageHeader
        title={`Create database instance`}
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

export default InstanceCreate;
