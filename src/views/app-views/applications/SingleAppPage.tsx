import { Button, Card, Col, Menu, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import {
    PlusOutlined,
    ExperimentOutlined,
    EyeOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { connect, useSelector } from "react-redux";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import Flex from "../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import PageHeaderAlt from "../../../components/layout-components/PageHeaderAlt";
import EditPackageForm from "./EditPackageForm";
import { signOut } from "../../../redux/actions/Auth";
import AddPackageForm from "./AddPackageForm";
import moment from "moment";

const ItemAction = ({ packages, showEditPackageModal }) => (
    <EllipsisDropdown
        menu={
            <Menu>
                <Menu.Item
                    key={1}
                    onClick={() => showEditPackageModal(packages)}
                >
                    <EditOutlined />
                    <span>Edit</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key={2}>
                    <DeleteOutlined />
                    <span>Delete</span>
                </Menu.Item>
            </Menu>
        }
    />
);
const ItemHeader = ({ packages }) => (
    <>
        <Flex>
            <h4 className="mb-0">{packages.Name}</h4>
            <Tag
                className="text-capitalize ml-2"
                color={packages.IsActive ? "cyan" : "red"}
            >
                {packages.IsActive ? (
                    <CheckCircleOutlined />
                ) : (
                    <ClockCircleOutlined />
                )}
                <span className="ml-2 font-weight-semibold">
                    {packages.IsActive ? "Active" : "Not Active"}
                </span>
            </Tag>
        </Flex>
    </>
);

const ItemFooter = ({ packages }) => (
    <div>
        <h5>Pricing</h5>
        <Flex justifyContent="center">
            <Card className="mt-3">
                <div>
                    From {packages.MinValue} to {packages.MaxValue} for{" "}
                    {packages.Price} MDL
                </div>
            </Card>
        </Flex>
    </div>
);

const CardItem = ({ packages, showEditPackageModal }) => {
    return (
        <Card>
            <Flex alignItems="center" justifyContent="between">
                <ItemHeader packages={packages} />
                <ItemAction
                    packages={packages}
                    showEditPackageModal={showEditPackageModal}
                />
            </Flex>
            <div className="mt-2">
                <ItemFooter packages={packages} />
            </div>
        </Card>
    );
};

const AboutItem = ({ appData }) => {
    const { Photo, Status, Name, ShortDescription, LongDescription } = appData;
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
                            color={Status === 1 ? "cyan" : "red"}
                        >
                            {Status === 1 ? (
                                <CheckCircleOutlined />
                            ) : (
                                <ClockCircleOutlined />
                            )}
                            <span className="ml-2 font-weight-semibold">
                                {Status === 1 ? "Active" : "Not Active"}
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
    const [selectedPackage, setSelectedPackage] = useState<{
        [key: string]: any;
    }>();
    const [editPackageModalVisible, setEditPackageModalVisbile] = useState<
        boolean
    >(false);
    const [addPackageModalVisible, setAddPackageModalVisible] = useState<
        boolean
    >(false);
    const showEditPackageModal = (selected) => {
        setSelectedPackage({
            ...selected,
            Range: [selected.MinValue, selected.MaxValue],
            ValidDate: [moment(selected.ValidFrom), moment(selected.ValidTo)],
        });
        setEditPackageModalVisbile(true);
    };
    const closeEditPackageModal = () => {
        setEditPackageModalVisbile(false);
    };

    const showAddPackageModal = () => {
        setAddPackageModalVisible(true);
    };
    const closeAddPackageModal = () => {
        setAddPackageModalVisible(false);
    };
    if (!app) {
        return <div>No app found</div>;
    }

    return (
        <>
            <AddPackageForm
                appID={appID}
                close={closeAddPackageModal}
                signOut={signOut}
                visible={addPackageModalVisible}
            />
            <EditPackageForm
                close={closeEditPackageModal}
                signOut={signOut}
                packages={selectedPackage}
                visible={editPackageModalVisible}
            />
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
                            <Button
                                type="primary"
                                className="ml-2"
                                onClick={() => setAddPackageModalVisible(true)}
                            >
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
                            <CardItem
                                packages={elm}
                                showEditPackageModal={showEditPackageModal}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
};
export default connect(null, { signOut })(SingleAppPage);
