import React, { useState } from "react";
import { PageHeader, Spin } from "antd";
import useQuery from "../../../../utils/hooks/useQuery";
import DatabaseEdit from "./form/DatabaseEdit";

const InstanceEdit = (props: any) => {
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(true);
  return (
    <Spin spinning={loading}>
      <PageHeader
        title={`Edit database instance`}
        onBack={() => props.history.goBack()}
      >
        <DatabaseEdit setLoading={setLoading} />
      </PageHeader>
    </Spin>
  );
};

export default InstanceEdit;
