import { render } from "@testing-library/react";
import { FlagsterTester } from "./flagster.tester";

describe("Provider", () => {
	test("init is call only once in strict mode", () => {
		let callCount = 0;

		const tester = new FlagsterTester().strictMode().withApi({
			getFlags: async () => {
				callCount++;
				return {};
			},
		});

		render("", { wrapper: tester.wrapper });

		expect(callCount).toBe(1);
	});
});
