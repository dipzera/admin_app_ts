import * as React from "react";
import { Button } from "antd";
import { Link, Route, RouteComponentProps, Switch } from "react-router-dom";
import TemplateList from "./TemplateList";
import TemplateSelect, { templateInstances } from "./select";

const Templates = (props: RouteComponentProps) => {
  const { match, history, location } = props;
  return (
    <Switch>
      <Route exact path={match.url}>
        <Link to={match.url + "/select"}>
          <Button type="primary">Add a template</Button>
        </Link>
        <TemplateList {...props} />
      </Route>
      <Route path={`${match.url}/select`}>
        <TemplateSelect {...props} />
      </Route>
      {templateInstances.map(({ link, component: Component }) => (
        <Route
          path={props.match.url + "/" + link}
          render={(props) => <Component {...props} />}
        />
      ))}
    </Switch>
  );
};
export default Templates;
