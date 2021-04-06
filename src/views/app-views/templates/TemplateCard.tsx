import * as React from "react";
import { Card } from "antd";
import { TemplatesType } from "../../../api/mail/types";

const TemplateCard = (props: TemplatesType) => {
  const { Name } = props;
  return (
    <Card>
      <div className="text-center">
        <div>
          <img src={`${process.env.PUBLIC_URL}/img/project.svg`} width={70} />
        </div>
        <div className="mt-2">{Name ?? "Unknown name"}</div>
      </div>
    </Card>
  );
};
export default TemplateCard;
