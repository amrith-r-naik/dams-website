import React from "react";
import Layout from "../layout";

const AdoptionApplicationsPage = () => {
	return <div>AdoptionApplicationsPage</div>;
};

export default AdoptionApplicationsPage;

AdoptionApplicationsPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
