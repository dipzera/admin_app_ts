import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Col, Menu, Row, Tag, Tooltip } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
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
import { IMarketAppList, IAppPackage } from "../../../../api/app/types";
// @ts-ignore
import { MuuriComponent } from "muuri-react";
import Utils from "../../../../utils";
import { AppService } from "../../../../api/app";
import { AppContext } from "./AppContext";

const ItemHeader = ({ packages }: { packages: IAppPackage }) => (
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

const ItemFooter = ({ packages }: { packages: IAppPackage }) => (
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
  deletePackage,
}: {
  packages: IAppPackage;
  deletePackage: (ID: number) => void;
}) => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <EllipsisDropdown
      menu={
        <Menu>
          <Menu.Item
            key={1}
            onClick={() => {
              dispatch({
                type: "SHOW_EDIT_MODAL",
                payload: packages,
              });
            }}
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
};
const CardItem = ({
  packages,
  deletePackage,
}: {
  packages: IAppPackage;
  deletePackage: (ID: number) => void;
}) => {
  return (
    <Card
      style={{
        cursor: "grab",
        height: "220px",
        width: "350px",
      }}
    >
      <Flex alignItems="center" justifyContent="between">
        <ItemHeader packages={packages} />
        <ItemAction deletePackage={deletePackage} packages={packages} />
      </Flex>
      <div className="mt-2">
        <ItemFooter packages={packages} />
      </div>
    </Card>
  );
};

const Packages = ({
  deletePackage,
}: {
  deletePackage: (ID: number) => void;
}) => {
  const { state, dispatch } = useContext(AppContext);
  const [pckgs, setPckgs] = useState<any>(
    Utils.sortData(state.selectedApp.Packages, "SortIndex")
  );
  const [swappable, setSwappable] = useState<boolean>(false);

  const children = pckgs.map(
    // @ts-ignore
    (elm: any, index) => (
      <Col
        xs={24}
        sm={24}
        lg={8}
        xl={8}
        xxl={6}
        style={{ margin: "15px" }}
        key={elm.SortIndex}
        id={index + 1}
      >
        <CardItem packages={elm} deletePackage={deletePackage} />
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
          <Tooltip title="Discard">
            <Button
              className={swappable ? "mr-3" : "d-none"}
              onClick={() => setSwappable(false)}
              danger
            >
              <CloseOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Confirm">
            <Button
              type="ghost"
              className={swappable ? "" : "d-none"}
              onClick={() =>
                new AppService().UpdateMarketAppPackage(pckgs).then((data) => {
                  if (data) window.location.reload();
                })
              }
            >
              <CheckOutlined />
            </Button>
          </Tooltip>
          <Button
            type="primary"
            className="ml-3"
            onClick={() => dispatch({ type: "SHOW_ADD_MODAL" })}
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
          dragSortPredicate={{ action: "swap" }}
          onDragEnd={(item) => {
            if (pckgs.length > 1) {
              setSwappable(true);
              const grid = item.getGrid();
              const items = grid.getItems();
              const keys = items.map((item) => item.getKey());
              for (let i = 0; i < pckgs.length; i++) {
                // @ts-ignore
                pckgs[i].SortIndex = keys[i];
              }
            }
          }}
        >
          {children}
        </MuuriComponent>
      </div>
    </>
  );
};
export default Packages;
