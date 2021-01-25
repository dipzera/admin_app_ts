import { Button, Card, Tooltip, List, Empty, Select } from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import * as React from "react";
import Flex from "../../../components/shared-components/Flex";
import { AppService } from "../../../api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import IntlMessage from "../../../components/util-components/IntlMessage";
import CreateNews from "./CreateNews";
import EditNews from "./EditNews";
import Loading from "../../../components/shared-components/Loading";
import { IMarketAppList, INewsList } from "../../../api/types.response";
interface IArticleItem {
  newsData: INewsList;
  setSelected: Dispatch<SetStateAction<Partial<INewsList>>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
}
const ArticleItem = ({ newsData, setSelected, setEdit }: IArticleItem) => {
  return (
    <Card style={{ padding: 30 }}>
      <Flex justifyContent="between" alignItems="start" className="mt-3">
        <div style={{ maxWidth: 500 }}>
          <Flex flexDirection="column">
            <div
              dangerouslySetInnerHTML={{
                __html: newsData.Header ?? "",
              }}
            />
            <div
              className="mt-3"
              dangerouslySetInnerHTML={{
                __html: newsData.Content ?? "",
              }}
            />
          </Flex>
          <div style={{ position: "absolute", bottom: 15 }}>
            <Flex alignItems="center">
              <span style={{ color: "black" }}>
                {newsData.CreateDate &&
                  moment
                    .unix(newsData.CreateDate.slice(6, 16))
                    .format("DD-MM-YYYY")}
              </span>
            </Flex>
          </div>
        </div>
        <div className="ml-5" style={{ maxWidth: 300 }}>
          {newsData.Photo && (
            <img
              src={newsData.Photo}
              alt="Article"
              style={{
                maxWidth: "100%",
              }}
            />
          )}
        </div>
      </Flex>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <Tooltip title="Edit">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelected(newsData);
              setEdit(true);
            }}
          />
        </Tooltip>
      </div>
    </Card>
  );
};
const News = () => {
  const instance = new AppService();
  const [news, setNews] = useState<INewsList[]>([]);
  const [isCreateVisible, setCreateVisible] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [selected, setSelected] = useState<Partial<INewsList>>({});
  const [AppType, setAppType] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [apps, setApps] = useState<IMarketAppList[]>([]);
  const getApps = async () =>
    await instance.GetMarketAppList().then((data) => {
      if (data && data.ErrorCode === 0) setApps(data.MarketAppList);
    });
  const getNews = async (ProductType = 0) => {
    return instance.GetNews(ProductType).then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === 0) setNews(data.NewsList);
    });
  };
  useEffect(() => {
    getNews();
    return () => instance._source.cancel();
  }, []);
  useEffect(() => {
    getApps();
    return () => instance._source.cancel();
  }, []);
  const onSelect = (AppType: number) => {
    setAppType(AppType);
    setLoading(true);
    if (AppType !== 0) {
      getNews(AppType);
    } else {
      getNews();
    }
  };
  return (
    <>
      <CreateNews
        visible={isCreateVisible}
        close={() => setCreateVisible(false)}
        getNews={getNews}
        AppType={AppType}
      />
      <EditNews
        visible={edit}
        close={() => setEdit(false)}
        news={selected}
        getNews={getNews}
      />
      <Flex justifyContent="between" className="mb-4">
        <Select defaultValue={0} style={{ width: "150px" }} onChange={onSelect}>
          <Select.Option value={0} key={0}>
            <b>General</b>
          </Select.Option>
          {apps &&
            apps.map((app) => (
              <Select.Option value={app.AppType ?? 0} key={app.AppType}>
                {app.Name}
              </Select.Option>
            ))}
        </Select>
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={() => setCreateVisible(true)}
        >
          {" "}
          <IntlMessage id="news.AddButton" />
        </Button>
      </Flex>
      {loading ? (
        <Loading cover="content" />
      ) : (
        <List style={{ maxWidth: 1000, margin: "0 auto" }}>
          {news && news.length > 0 ? (
            news
              .sort((a, b) => a.ID - b.ID)
              .reverse()
              .map((elm) => (
                <ArticleItem
                  newsData={elm}
                  key={elm.ID}
                  setSelected={setSelected}
                  setEdit={setEdit}
                />
              ))
          ) : (
            <Flex className="w-100" justifyContent="center">
              <Empty />
            </Flex>
          )}
        </List>
      )}
    </>
  );
};
export default News;
