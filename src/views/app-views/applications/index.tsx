import React, { useEffect, useState } from "react";
import { Row, Col, Tag, Avatar, Card, Empty } from "antd";
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
import { ILocale, IMarketAppList } from "../../../api/types.response";
import { AppService } from "../../../api";
import "./applications.scss";

const GridItem = ({ MarketAppList }: { MarketAppList: IMarketAppList }) => {
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
    </Card>
  );
};

const AppList = () => {
  const instance = new AppService();
  const [loading, setLoading] = useState<boolean>(true);
  const [apps, setApps] = useState<IMarketAppList[]>([]);
  const getApplications = () =>
    instance.GetMarketAppList().then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        setApps(data.MarketAppList);
      }
    });
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
    <>
      <div
        className={`my-4 
                    container-fluid`}
      >
        <Row gutter={16}>
          {apps &&
            apps.map((elm) => (
              <Col xs={24} sm={24} lg={12} xl={8} xxl={6} key={elm.ID}>
                <GridItem MarketAppList={elm} key={elm["ID"]} />
              </Col>
            ))}
        </Row>
      </div>
    </>
  );
};

export default AppList;
