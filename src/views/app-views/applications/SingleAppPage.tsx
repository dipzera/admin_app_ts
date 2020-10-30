import React, { useEffect } from "react";

const SingleAppPage = ({ match, location }) => {
    const { appId } = match.params;
    const appData = location.props;

    useEffect(() => {
        console.log(appData);
        console.log(appId);
    }, []);
    return <div>You have selected App with the ID</div>;
};
export default SingleAppPage;
