import { Button, Card, Col, Menu, Row, Tag } from "antd";
import React, { useEffect } from "react";
import {
    PlusOutlined,
    ExperimentOutlined,
    EyeOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import Flex from "../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import PageHeaderAlt from "../../../components/layout-components/PageHeaderAlt";

const ItemAction = ({ packages }) => (
    <EllipsisDropdown
        menu={
            <Menu>
                <Menu.Item>
                    <EyeOutlined />
                    <span>View</span>
                </Menu.Item>
                <Menu.Item>
                    <EditOutlined />
                    <span>Edit</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item>
                    <DeleteOutlined />
                    <span>Delete</span>
                </Menu.Item>
            </Menu>
        }
    />
);
const ItemHeader = ({ packages }) => (
    <>
        <div>
            <h4 className="mb-0">{packages.Name}</h4>
        </div>
    </>
);

const ItemFooter = ({ packages }) => (
    <div>
        <h5>Pricing</h5>
        <Flex alignItems="center" justifyContent="between">
            <Card>
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                >
                    <div>
                        From {packages.MinValue} to {packages.MaxValue} for{" "}
                        {packages.Price}
                    </div>
                </Flex>
            </Card>
        </Flex>
    </div>
);

const CardItem = ({ packages }) => {
    return (
        <Card>
            <Flex alignItems="center" justifyContent="between">
                <ItemHeader packages={packages} />
                <ItemAction packages={packages} />
            </Flex>
            <div className="mt-2">
                <ItemFooter packages={packages} />
            </div>
        </Card>
    );
};

const AboutItem = ({ appData }) => {
    const {
        Photo,
        IsActive,
        Name,
        ShortDescription,
        LongDescription,
    } = appData;
    return (
        <Card className="mb-5">
            <Flex>
                <div className="mr-3">
                    <Avatar
                        src={Photo}
                        icon={<ExperimentOutlined />}
                        shape="square"
                        size={80}
                    />
                </div>
                <Flex flexDirection="column">
                    <Flex flexDirection="row">
                        <h2 className="mr-3">{Name} </h2>
                        <Tag
                            className="text-capitalize"
                            color={IsActive ? "cyan" : "red"}
                        >
                            {IsActive ? (
                                <CheckCircleOutlined />
                            ) : (
                                <ClockCircleOutlined />
                            )}
                            <span className="ml-2 font-weight-semibold">
                                {IsActive ? "Active" : "Not Active"}
                            </span>
                        </Tag>
                    </Flex>
                    <div>
                        <span className="text-muted ">{ShortDescription}</span>
                        <p className="mt-4">{LongDescription}</p>
                    </div>
                </Flex>
            </Flex>
        </Card>
    );
};

const SingleAppPage = ({ match }) => {
    const { appID } = match.params;

    const app = useSelector((state) =>
        state["apps"].find((data) => data.ID == appID)
    );
    if (!app) {
        return <div>No app found</div>;
    }

    return (
        <>
            <AboutItem appData={app} />
            <PageHeaderAlt className="bg-white border-bottom">
                <div className="container-fluid">
                    <Flex
                        justifyContent="between"
                        alignItems="center"
                        className="py-4 "
                    >
                        <h2>Packages</h2>
                        <div>
                            <Button type="primary" className="ml-2">
                                <PlusOutlined />
                                <span>New</span>
                            </Button>
                        </div>
                    </Flex>
                </div>
            </PageHeaderAlt>
            <div className="my-4 container-fluid">
                <Row gutter={16}>
                    {app.Packages.map((elm) => (
                        <Col
                            xs={24}
                            sm={24}
                            lg={8}
                            xl={8}
                            xxl={6}
                            key={elm["ID"]}
                        >
                            <CardItem packages={elm} />
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
};
export default SingleAppPage;
