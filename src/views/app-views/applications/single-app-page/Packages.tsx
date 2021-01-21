import React, { useCallback } from "react";
// @ts-ignore
import { Button, Card, Col, Menu, Row, Tag } from "antd";
import Flex from "../../../../components/shared-components/Flex";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IPackages } from "../../../../api/types.response";
// @ts-ignore
import { MuuriComponent } from "muuri-react";

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
}: {
  packages: IPackages;
  showEditPackageModal: (packages: IPackages) => void;
  deletePackage: (ID: number) => void;
}) => {
  return (
    <Card style={{ cursor: "grab" }}>
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
  getMarketApps,
}: {
  packages: IPackages[];
  showEditPackageModal: (packages: IPackages) => void;
  deletePackage: (ID: number) => void;
  showAddPackageModal: () => void;
  getMarketApps: () => void;
}) => {
  const children = packages.map(
    // @ts-ignore
    (elm: any, index) => (
      <Col
        xs={24}
        sm={24}
        lg={8}
        xl={8}
        xxl={6}
        className="mb-3 mr-5"
        style={{ maxWidth: "250px", maxHeight: "250px" }}
        key={elm["ID"]}
        // @ts-ignore
        id={elm["SortIndex"]}
      >
        <CardItem
          packages={elm}
          showEditPackageModal={showEditPackageModal}
          deletePackage={deletePackage}
        />
      </Col>
    )
  );
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
      <div className="container-fluid">
        <MuuriComponent
          dragEnabled
          sort={useCallback((a, b) => {
            return a.id - b.id;
          }, [])}
          dragSortPredicate={{
            action: "swap",
          }}
          onDragEnd={(item) => {
            const grid = item.getGrid();
            const items = grid.getItems();
            const keys = items.map((item) => item.getKey());
            for (let i = 0; i < packages.length; i++) {
              // @ts-ignore
              packages[i].SortIndex = keys[i];
            }
            console.log({ packages, keys });
            //return new AppService().UpdateMarketAppPackage(newArr);
          }}
        >
          {children}
        </MuuriComponent>
      </div>
    </>
  );
};
export default Packages;
