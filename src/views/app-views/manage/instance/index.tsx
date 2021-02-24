import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  PageHeader,
  Row,
  Spin,
  Table,
  Tooltip,
} from "antd";
import {
  ExperimentOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { ManagementDb } from "../../../../api/app/management-db";
import { Link } from "react-router-dom";
import Loading from "../../../../components/shared-components/Loading";
import {
  EnDbServerLocation,
  IDbInstances,
  IDbServices,
} from "../../../../api/app/management-db/types";
import useQuery from "../../../../utils/hooks/useQuery";
import { APP_NAME } from "../../../../configs/AppConfig";
const InstanceCard = ({ match, instance }: any) => {
  const query = useQuery();
  return (
    <Card>
      <Flex alignItems="center">
        <div className="mr-3">
          <Avatar icon={<ExperimentOutlined />} />
        </div>
        <Flex flexDirection="column">
          <h4>{instance.Name ?? "Unknown name"}</h4>
          <div>{instance.Port ?? "Unknown port"}</div>
        </Flex>
      </Flex>
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <Tooltip title="Edit">
          <Button>
            <Link
              to={`${match.url}/instance/edit?cloud=${query.get("cloud")}&id=${
                instance.ID
              }`}
            >
              <EditOutlined />
            </Link>
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};
const Instance = ({ match, history, location }: any) => {
  const management = new ManagementDb();
  const query = useQuery();
  const [instances, setInstances] = useState<IDbInstances[]>([]);
  const [dbServices, setDbServices] = useState<IDbServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const getDbInstance = () =>
    management.GetDbInstance().then(async (data) => {
      setLoading(false);
      if (data && data.ErrorCode === 0) {
        setInstances(
          data.DBInstances.filter(
            (dbinst) => +dbinst.Location === +query.get("cloud")!
          )
        );
      }
    });
  useEffect(() => {
    document.title = `${
      +query.get("cloud")! === EnDbServerLocation.PUBLIC
        ? "Public"
        : +query.get("cloud")! === EnDbServerLocation.PRIVATE
        ? "Private"
        : "SaaS"
    } Cloud | ${APP_NAME}`;
    getDbInstance();
    return () => management._source.cancel();
  }, []);
  if (loading) return <Loading />;
  if (instances.length === 0) {
    return (
      <PageHeader
        title={`${
          +query.get("cloud")! === EnDbServerLocation.PUBLIC
            ? "Public"
            : +query.get("cloud")! === EnDbServerLocation.PRIVATE
            ? "Private"
            : "SaaS"
        } cloud`}
        onBack={() => history.goBack()}
      >
        <Empty
          image={process.env.PUBLIC_URL + "/img/icons/add.svg"}
          description={
            <span>
              No instances found!
              <br />
              <Link
                to={`${match.url}/instance/create?cloud=${query.get("cloud")}`}
              >
                Create
              </Link>{" "}
              database instance!
              <br />
            </span>
          }
        />
      </PageHeader>
    );
  }
  return (
    <PageHeader
      onBack={() => history.goBack()}
      title={`${
        +query.get("cloud")! === EnDbServerLocation.PUBLIC
          ? "Public"
          : +query.get("cloud")! === EnDbServerLocation.PRIVATE
          ? "Private"
          : "SaaS"
      } cloud`}
    >
      <Flex className="mb-3" justifyContent="between">
        <div>
          <h4 className="mt-3">Database instances</h4>
        </div>
        <Button type="primary">
          <Link to={`${match.url}/instance/create?cloud=${query.get("cloud")}`}>
            Create instance
          </Link>
        </Button>
      </Flex>
      <Row gutter={ROW_GUTTER}>
        {instances.map((element: any) => (
          <Col xs={24} sm={24} lg={8} key={element.ID}>
            <InstanceCard match={match} instance={element} />
          </Col>
        ))}
      </Row>
    </PageHeader>
  );
};

export default Instance;
