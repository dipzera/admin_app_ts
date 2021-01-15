import React, { useEffect, useState } from "react";
import { Button, Card, Col, Empty, Menu, Row, Tag } from "antd";
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
import { IPackages } from "../../../../api/types.response";
// @ts-ignore

const ItemHeader = ({ packages }: { packages: IPackages }) => (
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

const ItemFooter = ({ packages }: { packages: IPackages }) => (
  <div>
    <h5>
      <IntlMessage id="applications.Packages.Pricing" />
    </h5>
    <Flex justifyContent="center">
      <Card className="mt-3">
        <div>
          <IntlMessage id="applications.Packages.From" /> {packages.MinValue}{" "}
          <IntlMessage id="applications.Packages.to" /> {packages.MaxValue}{" "}
          <IntlMessage id="applications.Packages.for" /> {packages.Price} MDL
        </div>
      </Card>
    </Flex>
  </div>
);

const ItemAction = ({
  packages,
  showEditPackageModal,
  deletePackage,
}: {
  packages: IPackages;
  showEditPackageModal: (packages: IPackages) => void;
  deletePackage: (ID: number) => void;
}) => (
  <EllipsisDropdown
    menu={
      <Menu>
        <Menu.Item key={1} onClick={() => showEditPackageModal(packages)}>
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
const CardItem = ({
  packages,
  showEditPackageModal,
  deletePackage,
  index,
}: {
  packages: IPackages;
  showEditPackageModal: (packages: IPackages) => void;
  deletePackage: (ID: number) => void;
  index: number;
}) => {
  useEffect(() => {
    var dragged: any;
    var dropZone: any;
    document.addEventListener("drag", function (event) {}, false);
    document.addEventListener(
      "dragstart",
      function (event) {
        dragged = event.target;
        // @ts-ignore
        dropZone = event.target.parentNode;
        // @ts-ignore
        dragged.style.opacity = 0.1;
      },
      false
    );

    document.addEventListener(
      "dragend",
      function (event) {
        // @ts-ignore
        event.target.style.opacity = "";
      },
      false
    );

    document.addEventListener(
      "dragover",
      function (event) {
        event.preventDefault();
      },
      false
    );

    document.addEventListener("dragenter", function (event) {}, false);

    document.addEventListener("dragleave", function (event) {}, false);

    document.addEventListener("drop", function (event) {
      event.preventDefault();
      const current = event.target;
      // @ts-ignore
      if (current.className == "dropzone") {
        // @ts-ignore
        dropZone.appendChild(current.querySelectorAll(".draggable")[0]);
        // @ts-ignore
        current.appendChild(dragged);
      }
    });
  }, []);
  return (
    <div
      className="dropzone"
      data-index={(index + 1).toString()}
      style={{
        background: "transparent",
        padding: "30px",
        border: "1px dashed #ccc",
        borderRadius: "5px",
      }}
    >
      <div
        className="draggable"
        draggable="true"
        data-index={packages.SortIndex.toString()}
        onDragStart={(event) => event.dataTransfer.setData("text/plain", "")}
        style={{ cursor: "grab" }}
      >
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
      </div>
    </div>
  );
};

const Packages = ({
  packages,
  showEditPackageModal,
  deletePackage,
  showAddPackageModal,
}: {
  packages: IPackages[];
  showEditPackageModal: (packages: IPackages) => void;
  deletePackage: (ID: number) => void;
  showAddPackageModal: () => void;
}) => {
  const [sortedPackages, setSortedPackages] = useState<IPackages[]>(packages);
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
            sortedPackages.map((elm, index) => (
              <Col xs={24} sm={24} lg={8} xl={8} xxl={6} key={elm["ID"]}>
                <CardItem
                  index={index}
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
