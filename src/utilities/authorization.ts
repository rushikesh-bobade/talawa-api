import { TalawaGraphQLError } from "./TalawaGraphQLError";

interface HasRole {
	role?: string | null;
}

export const assertOrganizationAdmin = (
	currentUser: HasRole | undefined,
	membership: HasRole | undefined,
	errorMessage: string,
): void => {
	const isCurrentUserAdmin = currentUser?.role === "administrator";
	const isMembershipAdmin = membership?.role === "administrator";

	// Allow access if either current user or membership has administrator role
	if (!isCurrentUserAdmin && !isMembershipAdmin) {
		throw new TalawaGraphQLError({
			extensions: {
				code: "unauthorized_action",
				message: errorMessage,
			},
		});
	}
};
