import React from "react";
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Button,
  Tooltip,
  PageHeader,
} from "antd";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import useQuery from "../../../../utils/hooks/useQuery";
import { RouteComponentProps } from "react-router-dom";

const InstanceEdit = (props: any) => {
  const onFinish = () => {};
  const query = useQuery();
  return (
    <div>
      <Form name="databaseForm" layout="vertical" onFinish={onFinish}>
        <PageHeader
          title={`Edit ${query.get("instance")} instance`}
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
                    <Form.Item label="Type" name="Type">
                      <Select defaultValue={0}>
                        <Select.Option value={0}>PG</Select.Option>
                        <Select.Option value={1}>MSSQL</Select.Option>
                        <Select.Option value={2}>Realm</Select.Option>
                        <Select.Option value={3}>Mongo</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="OS Type" name="OSType">
                      <Select defaultValue={0}>
                        <Select.Option value={0}>Linux/Unix</Select.Option>
                        <Select.Option value={1}>Windows</Select.Option>
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
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Col>
            </Row>
          </div>
        </PageHeader>
      </Form>
    </div>
  );
};

export default InstanceEdit;
