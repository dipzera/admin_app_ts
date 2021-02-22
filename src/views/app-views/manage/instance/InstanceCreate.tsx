import React, { useState, useEffect } from "react";
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  PageHeader,
  Button,
  Tooltip,
} from "antd";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { EnDbServerType, EnOSType } from ".";
import useQuery from "../../../../utils/hooks/useQuery";

const InstanceCreate = (props: any) => {
  let query = useQuery();
  const [OSType, setOsType] = useState<number>(EnOSType.LINUX);
  const [Type, setServerType] = useState<number>(EnDbServerType.POSTGRESQL);
  const onFinish = (values: any) => {
    console.log({ values, OSType, Type });
  };
  return (
    <div>
      <Form name="databaseForm" layout="vertical" onFinish={onFinish}>
        <PageHeader
          title={`Create ${query.get("instance")} instance`}
          onBack={() => props.history.goBack()}
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
                    <Form.Item label="Type">
                      <Select
                        defaultValue={Type}
                        onChange={(index) => setServerType(index)}
                      >
                        <Select.Option value={EnDbServerType.POSTGRESQL}>
                          PostgreSQL
                        </Select.Option>
                        <Select.Option value={EnDbServerType.MICROSOFTSQL}>
                          Microsoft SQL
                        </Select.Option>
                        <Select.Option value={EnDbServerType.ORACLE}>
                          Oracle
                        </Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="OS Type">
                      <Select
                        defaultValue={OSType}
                        onChange={(index) => setOsType(index)}
                      >
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
                  </Col>
                </Row>
              </Col>
            </Row>
            <Button type="primary" key="0" htmlType="submit">
              Create
            </Button>
          </div>
        </PageHeader>
      </Form>
    </div>
  );
};

export default InstanceCreate;
