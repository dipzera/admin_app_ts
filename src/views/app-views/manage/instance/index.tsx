import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Col, Divider, Empty, Input, Row } from "antd";
import {
  ExperimentOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { ManagementDb } from "../../../../api/app/ManagementDb";
import { Link } from "react-router-dom";
export enum EnOSType {
  LINUX = 0,
  WINDOWS = 1,
}
export enum EnServiceType {
  INDEFINITE = 0,
  EXPORT_SERVICE = 1,
  ECOMMERCE_SERVICE = 2,
  DATA_TERMINAL = 3,
  BILLS_WORKER_SERVICE = 4,
  AGENT_SERVICE = 5,
  RETAIL_EXCHANGE_SERVICE = 6,
  DB_SERVICE = 100,
}
export enum EnServiceState {
  NOT_ACTIVATED = 0,
  ACTIVATED = 1,
  BLOCKED = 2,
  DISABLED = 3,
}
export enum EnDbServerLocation {
  CLOUD = 0,
  SAAS = 1,
  PRIVATE = 2,
}
export enum EnDbServerType {
  POSTGRESQL = 0,
  MICROSOFTSQL = 1,
  ORACLE = 2,
}
export enum EnDbServerState {
  NOT_ACTIVATED = 0,
  ACTIVATED = 1,
  BLOCKED = 2,
  DISABLED = 3,
}
const InstanceCard = ({ instanceType, match, instance }: any) => {
  return (
    <Card>
      <Flex alignItems="center">
        <div className="mr-3">
          <Avatar icon={<ExperimentOutlined />} />
        </div>
        <Flex flexDirection="column">
          <h4>My instance</h4>
          <div>Instance 1</div>
        </Flex>
      </Flex>
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <Button>
          <Link
            to={`${match.url}/edit?instance=${instanceType}&id=${instance.ID}`}
          >
            <EditOutlined />
          </Link>
        </Button>
      </div>
    </Card>
  );
};
const Instance = ({ match }: any) => {
  const DATABASE = "database";
  const SERVICE = "service";
  const management = new ManagementDb();
  const [instances, setInstances] = useState<any>([]);
  const [instanceType, setInstanceType] = useState(DATABASE);
  const getDbInstance = () =>
    management.GetDbInstance().then((data: any) => {
      if (data && data.ErrorCode === 0) {
        setInstances(data.DBInstances);
      }
    });
  useEffect(() => {
    getDbInstance();
    return () => management._source.cancel();
  }, []);
  if (instances.length === 0) {
    return (
      <Empty
        image={process.env.PUBLIC_URL + "/img/icons/add.svg"}
        description={
          <span>
            No instances found!
            <br />
            <Link to={`${match.url}/create?instance=${DATABASE}`}>
              Create
            </Link>{" "}
            database instance!
            <br />
          </span>
        }
      />
    );
  }
  return (
    <div className="container">
      <div className="mb-3">
        <Button type="primary">
          <Link to={`${match.url}/create?instance=${DATABASE}`}>
            Create database instance
          </Link>
        </Button>
        <h4 className="mt-3">Database instances</h4>
      </div>
      <Row gutter={ROW_GUTTER}>
        {instances.map((element: any) => (
          <Col xs={24} sm={24} lg={8}>
            <InstanceCard
              instanceType={instanceType}
              match={match}
              instance={element}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Instance;
