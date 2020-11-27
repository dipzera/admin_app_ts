import { Button, Card, Col, Empty, Menu, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import Flex from "../../../../components/shared-components/Flex";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";

const ItemHeader = ({ packages }) => (
    <>
        <Flex>
            <h4 className="mb-0">{packages.Name}</h4>
            <Tag
                className="text-capitalize ml-2"
                color={packages.Status === 1 ? "cyan" : "red"}
            >
                {packages.Status === 1 ? (
                    <CheckCircleOutlined />
                ) : (
                    <ClockCircleOutlined />
                )}
                <span className="ml-2 font-weight-semibold">
                    {packages.Status === 1 ? "Active" : "Not Active"}
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

const ItemAction = ({ packages, showEditPackageModal, deletePackage }) => (
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
                <Menu.Item key={2} onClick={() => deletePackage(packages.ID)}>
                    <DeleteOutlined />
                    <span>Delete</span>
                </Menu.Item>
            </Menu>
        }
    />
);
const CardItem = ({ packages, showEditPackageModal, deletePackage }) => {
    return (
        <Card>
            <Flex alignItems="center" justifyContent="between">
                <ItemHeader packages={packages} />
                <ItemAction
                    deletePackage={deletePackage}
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

const Packages = ({
    packages,
    showEditPackageModal,
    deletePackage,
    showAddPackageModal,
}) => {
    const [sortedPackages, setSortedPackages] = useState<any>(packages);
    const sortData = (arr) => {
        return arr.slice().sort((a, b) => a.ID - b.ID);
    };
    useEffect(() => {
        setSortedPackages(sortData(packages));
    }, [packages]);
    return (
        <>
            <Flex justifyContent="between" alignItems="center" className="py-2">
                <h2>Packages</h2>
                <div>
                    <Button
                        type="primary"
                        className="ml-2 "
                        onClick={() => showAddPackageModal()}
                    >
                        <PlusOutlined /> <span>New</span>
                    </Button>
                </div>
            </Flex>
            <div className="my-4 container-fluid">
                <Row gutter={16}>
                    {sortedPackages.length > 0 ? (
                        sortedPackages.map((elm) => (
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
                                    deletePackage={deletePackage}
                                />
                            </Col>
                        ))
                    ) : (
                        <Flex className="w-100" justifyContent="center">
                            <Empty />
                        </Flex>
                    )}
                </Row>
            </div>
        </>
    );
};
export default Packages;
