import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
const admin = async () => {
	const session = await getServerSession(authOptions);
	console.log(session);
	if (session?.user) {
		return <h1>welcome to admin page {session?.user?.username}</h1>;
	}
	return <div>please login</div>;
};

export default admin;
