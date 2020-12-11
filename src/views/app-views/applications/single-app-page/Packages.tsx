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
import Utils from "../../../../utils";
import IntlMessage from "../../../../components/util-components/IntlMessage";

const ItemHeader = ({ packages }: any) => (
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
                    {packages.Status === 1 ? (
                        <IntlMessage id="applications.Packages.Active" />
                    ) : (
                        <IntlMessage id="applications.Packages.NotActive" />
                    )}
                </span>
            </Tag>
        </Flex>
    </>
);

const ItemFooter = ({ packages }: any) => (
    <div>
        <h5>
            <IntlMessage id="applications.Packages.Pricing" />
        </h5>
        <Flex justifyContent="center">
            <Card className="mt-3">
                <div>
                    <IntlMessage id="applications.Packages.From" />{" "}
                    {packages.MinValue}{" "}
                    <IntlMessage id="applications.Packages.to" />{" "}
                    {packages.MaxValue}{" "}
                    <IntlMessage id="applications.Packages.for" />{" "}
                    {packages.Price} MDL
                </div>
            </Card>
        </Flex>
    </div>
);

const ItemAction = ({ packages, showEditPackageModal, deletePackage }: any) => (
    <EllipsisDropdown
        menu={
            <Menu>
                <Menu.Item
                    key={1}
                    onClick={() => showEditPackageModal(packages)}
                >
                    <EditOutlined />
                    <span>
                        <IntlMessage id="applications.Packages.Edit" />
                    </span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key={2} onClick={() => deletePackage(packages.ID)}>
                    <DeleteOutlined />
                    <span>
                        <IntlMessage id="applications.Packages.Delete" />
                    </span>
                </Menu.Item>
            </Menu>
        }
    />
);
const CardItem = ({ packages, showEditPackageModal, deletePackage }: any) => {
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
}: any) => {
    const [sortedPackages, setSortedPackages] = useState<any>(packages);
    useEffect(() => {
        setSortedPackages(Utils.sortData(packages, "SortIndex"));
    }, [packages]);
    return (
        <>
            <Flex justifyContent="between" alignItems="center" className="py-2">
                <h2>
                    <IntlMessage id="applications.Packages" />
                </h2>
                <div>
                    <Button
                        type="primary"
                        className="ml-2 "
                        onClick={() => showAddPackageModal()}
                    >
                        <PlusOutlined />{" "}
                        <span>
                            <IntlMessage id="applications.New" />
                        </span>
                    </Button>
                </div>
            </Flex>
            <div className="my-4 container-fluid">
                <Row gutter={16}>
                    {sortedPackages.length > 0 ? (
                        sortedPackages.map((elm: any) => (
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
