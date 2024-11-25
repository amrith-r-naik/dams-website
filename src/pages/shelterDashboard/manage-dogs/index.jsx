import React from "react";
import Layout from "../layout";

const ManageDogsPage = () => {
	return <div>ManageDogsPage</div>;
};

export default ManageDogsPage;

ManageDogsPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
