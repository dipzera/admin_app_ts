import React, { useState } from "react";
import { PageHeader, Spin } from "antd";
import useQuery from "../../../../utils/hooks/useQuery";
import DatabaseCreate from "./form/DatabaseCreate";

const InstanceCreate = (props: any) => {
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Spin spinning={loading}>
      <PageHeader
        title={`Create database instance`}
        onBack={() => props.history.goBack()}
      >
        <DatabaseCreate setLoading={setLoading} />
      </PageHeader>
    </Spin>
  );
};

export default InstanceCreate;
