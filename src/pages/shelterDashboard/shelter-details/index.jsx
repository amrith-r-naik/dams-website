import React from "react";
import Layout from "../layout";

const ShelterDetailsPage = () => {
	return <div>ShelterDetailsPage</div>;
};

export default ShelterDetailsPage;

ShelterDetailsPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
