import * as React from "react";
import { Card } from "antd";
import Flex from "../../../../components/shared-components/Flex";
import { Link } from "react-router-dom";

const SelectCard = ({ link, img, title }: any) => {
  return (
    <Link to={link}>
      <Card>
        <Flex flexDirection="column" className="text-center w-75 m-auto">
          <div>
            <img src={img} alt={"Template type"} width={100} />
          </div>
          <h3 className="mt-3">{title}</h3>
          <div>Use the drag & drop editor to build your own template.</div>
        </Flex>
      </Card>
    </Link>
  );
};
export default SelectCard;
