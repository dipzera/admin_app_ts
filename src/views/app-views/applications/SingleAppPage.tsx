import React, { useEffect } from "react";
import { connect } from "react-redux";

const SingleAppPage = ({ match, apps }) => {
    const { appId } = match.params;
    const app = apps.find((application) => application.ID === appId);
    useEffect(() => {
        console.log(app);
    }, []);
    return <div>You have selected App with the ID</div>;
};
const mapStateToProps = ({ apps }) => apps;
export default connect(mapStateToProps, null)(SingleAppPage);
