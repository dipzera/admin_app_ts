import * as React from "react";
import { Col, PageHeader, Row } from "antd";
import { Switch } from "react-router-dom";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import SelectCard from "./SelectCard";
import { Route } from "react-router-dom";
import Builder from "../builder";

export const templateInstances = [
  {
    link: "builder",
    img: `${process.env.PUBLIC_URL}/img/project.svg`,
    title: "Builder",
    component: Builder,
  },
];
const TemplateSelect = (props: any) => {
  return (
    <Switch>
      <Route path={props.match.url}>
        <PageHeader
          title="New template"
          onBack={() => props.history.goBack()}
        />
        <Row gutter={ROW_GUTTER}>
          {templateInstances.map((inst) => (
            <Col xs={24} md={8} lg={8} xl={6}>
              <SelectCard {...inst} />
            </Col>
          ))}
        </Row>
      </Route>
    </Switch>
  );
};
export default TemplateSelect;
