import Loader from "@/components/ui/loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const withRoleProtection = (WrappedComponent, allowedRoles) => {
	const WithRoleProtection = (props) => {
		const { data: session, status } = useSession();
		const router = useRouter();

		if (status === "loading") {
			return (
				<div>
					<Loader />
				</div>
			); // or a loading spinner
		}

		if (!session || !allowedRoles.includes(session.user.role)) {
			// Redirect user to the login page or a "Not Authorized" page
			router.push("/not-authorized");
			return null;
		}

		return <WrappedComponent {...props} />;
	};

	// Set the display name for easier debugging
	WithRoleProtection.displayName = `WithRoleProtection(${
		WrappedComponent.displayName || WrappedComponent.name || "Component"
	})`;

	return WithRoleProtection;
};

export default withRoleProtection;
