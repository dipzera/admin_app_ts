import React, { useEffect } from "react";
import { Button, Col, Form, Input, Row, Select, Tooltip } from "antd";
import useQuery from "../../../../utils/hooks/useQuery";
import {
  EnDbServerLocation,
  EnDbServerType,
  EnOSType,
} from "../../../../api/app/management-db/types";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";

const InstanceForm = ({ form, onFinish, dbServices, query }: any) => {
  const renderDbServicesFormItem = () => {
    if (
      query === EnDbServerLocation.PRIVATE ||
      query === EnDbServerLocation.SAAS
    ) {
      return (
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
      );
    } else {
      return null;
    }
  };
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      name="dbInstanceForm"
    >
      <div className="mt-3">
        <Row>
          <Col xs={24} sm={24} md={24} lg={16}>
            <Row gutter={ROW_GUTTER}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item label={`Name`} name="Name">
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
                {renderDbServicesFormItem()}
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Col>
        </Row>
      </div>
    </Form>
  );
};
export default InstanceForm;
