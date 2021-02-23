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
import Tooltip from "antd/es/tooltip";

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
    // If it's public or saas cloud we get dbservices in order to connect the database to a dbservice
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
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          name="createDatabase"
        >
          <div className="mt-3">
            <Row>
              <Col xs={24} sm={24} md={24} lg={16}>
                <Row gutter={ROW_GUTTER}>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={
                        <Tooltip title="Current database server name">
                          <span>Name</span>
                        </Tooltip>
                      }
                      name="Name"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item label="IP" name="IP">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Port" name="Port">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Type" name="Type">
                      <Select>
                        <Select.Option value={EnDbServerType.POSTGRESQL}>
                          PostgreSQL
                        </Select.Option>
                        <Select.Option value={EnDbServerType.MICROSOFTSQL}>
                          MSSQL
                        </Select.Option>
                        <Select.Option value={EnDbServerType.ORACLE}>
                          Oracle
                        </Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="OS Type" name="OSType">
                      <Select>
                        <Select.Option value={EnOSType.LINUX}>
                          Linux/Unix
                        </Select.Option>
                        <Select.Option value={EnOSType.WINDOWS}>
                          Windows
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item label="Backup user" name="BackupUser">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Backup password" name="BackupPassword">
                      <Input />
                    </Form.Item>
                    {+query.get("cloud")! === EnDbServerLocation.PRIVATE ||
                      (+query.get("cloud")! === EnDbServerLocation.SAAS && (
                        <Form.Item label="Database services" name="DBServiceID">
                          <Select>
                            {dbServices &&
                              dbServices.map((service: any) => (
                                <Select.Option value={service.ID}>
                                  {service.ServerName}
                                </Select.Option>
                              ))}
                          </Select>
                        </Form.Item>
                      ))}
                  </Col>
                </Row>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </PageHeader>
    </Spin>
  );
};

export default InstanceCreate;
