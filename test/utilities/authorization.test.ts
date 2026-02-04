import { describe, expect, it } from "vitest";
import { assertOrganizationAdmin } from "~/src/utilities/authorization";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";

describe("assertOrganizationAdmin", () => {
	it("should allow system administrators", () => {
		expect(() => {
			assertOrganizationAdmin(
				{ role: "administrator" },
				{ role: "regular" },
				"Only admins can do this.",
			);
		}).not.toThrow();
	});

	it("should allow organization administrators via membership", () => {
		expect(() => {
			assertOrganizationAdmin(
				{ role: "regular" },
				{ role: "administrator" },
				"Only admins can do this.",
			);
		}).not.toThrow();
	});

	it("should throw unauthorized_action when neither current user nor membership is admin", () => {
		const errorMessage = "Only admins can do this.";

		try {
			assertOrganizationAdmin(
				{ role: "regular" },
				{ role: "regular" },
				errorMessage,
			);
			expect.fail("Expected TalawaGraphQLError to be thrown");
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(TalawaGraphQLError);
			expect((error as TalawaGraphQLError).extensions.code).toBe(
				"unauthorized_action",
			);
			expect((error as TalawaGraphQLError).extensions.message).toBe(
				errorMessage,
			);
		}
	});

	it("should throw unauthorized_action when current user and membership are undefined", () => {
		expect(() => {
			assertOrganizationAdmin(undefined, undefined, "Not allowed");
		}).toThrow(TalawaGraphQLError);
	});

	it("should throw unauthorized_action when roles are null/undefined", () => {
		expect(() => {
			assertOrganizationAdmin({ role: null }, { role: undefined }, "Not allowed");
		}).toThrow(TalawaGraphQLError);
	});
});

