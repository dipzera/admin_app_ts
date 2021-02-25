import React, { useEffect, useState } from "react";
import { Row, Col, Tag, Avatar, Card, Empty, Button, Spin } from "antd";
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Flex from "../../../components/shared-components/Flex";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import { useSelector } from "react-redux";
import Loading from "../../../components/shared-components/Loading";
import { IState } from "../../../redux/reducers";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { ILocale, IMarketAppList } from "../../../api/app/types";
import { AppService } from "../../../api/app";
import "./applications.scss";
import ToggleAppButton from "./ToggleAppButton";
import Utils from "../../../utils";

export enum EnApp {
  ACTIVATED = 1,
  DISABLED = 0,
}
const GridItem = ({
  MarketAppList,
  getApplications,
  setSpinLoading,
}: {
  MarketAppList: IMarketAppList;
  getApplications: () => void;
  setSpinLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [shortDescription, setShortDescription] = useState<Partial<ILocale>>(
    {}
  );
  const locale: "en" | "ro" | "ru" =
    useSelector((state: IState) => state["theme"].locale) ?? "en";
  useEffect(() => {
    try {
      setShortDescription(
        JSON.parse(window.atob(MarketAppList.ShortDescription.toString()))
      );
    } catch {
      setShortDescription({ en: "", ru: "", ro: "" });
    }
  }, []);
  return (
    <Card>
      <Flex className="mb-3 " justifyContent="between">
        <Link to={`${APP_PREFIX_PATH}/id/${MarketAppList.ID}`}>
          <div className="app-avatar cursor-pointer">
            <Avatar
              src={MarketAppList.Photo}
              icon={<ExperimentOutlined />}
              shape="square"
              size={60}
            />
          </div>
        </Link>
        {MarketAppList.Status === 0 ? (
          <Tag className="text-capitalize cursor-pointer" color="volcano">
            <ClockCircleOutlined />
            <span className="ml-2 font-weight-semibold">
              <IntlMessage id="applications.status.NotActive" />
            </span>
          </Tag>
        ) : (
          <Tag className="text-capitalize" color="cyan">
            <CheckCircleOutlined />
            <span className="ml-2 font-weight-semibold">
              <IntlMessage id="applications.status.Active" />
            </span>
          </Tag>
        )}
      </Flex>
      <div>
        <Link to={`${APP_PREFIX_PATH}/id/${MarketAppList.ID}`}>
          <h3 className="app-link mb-0 cursor-pointer">{MarketAppList.Name}</h3>
        </Link>
        <p className="text-muted">By IntelectSoft</p>
        <div style={{ minHeight: "70px" }}>
          {shortDescription ? shortDescription[locale] : null}
        </div>
      </div>
      <div className="text-right">
        <ToggleAppButton
          getApplications={getApplications}
          appStatus={MarketAppList.Status ?? 0}
          appID={MarketAppList.ID}
          setSpinLoading={setSpinLoading}
        />
      </div>
    </Card>
  );
};

const AppList = () => {
  const instance = new AppService();
  const [loading, setLoading] = useState<boolean>(true);
  const [spinLoading, setSpinLoading] = useState<boolean>(false);
  const [apps, setApps] = useState<IMarketAppList[]>([]);
  const getApplications = async () => {
    return await instance.GetMarketAppList().then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        setSpinLoading(false);
        setApps(Utils.sortData(data.MarketAppList, "ID"));
      }
    });
  };
  useEffect(() => {
    getApplications();
    return () => instance._source.cancel();
  }, []);

  if (loading) {
    return <Loading cover="content" />;
  }
  if (!apps) {
    return <Empty />;
  }
  return (
    <Spin spinning={spinLoading}>
      <div
        className={`my-4 
                    container-fluid`}
      >
        <Row gutter={16}>
          {apps &&
            apps.map((elm) => (
              <Col xs={24} sm={24} lg={12} xl={8} xxl={6} key={elm.ID}>
                <GridItem
                  MarketAppList={elm}
                  key={elm["ID"]}
                  getApplications={getApplications}
                  setSpinLoading={setSpinLoading}
                />
              </Col>
            ))}
        </Row>
      </div>
    </Spin>
  );
};

export default AppList;
