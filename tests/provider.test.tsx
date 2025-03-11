import { render } from "@testing-library/react";
import { FlagsterTester } from "./flagster.tester";
import { PropsWithChildren } from "react";
import { FlagsterProvider } from "../src";

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

	test("set state when serverState is passed", () => {
		const tester = new FlagsterTester();

		render("", {
			wrapper: ({ children }: PropsWithChildren) => (
				<FlagsterProvider
					flagster={tester.flagster}
					serverState={{
						config: {
							environment: "test",
						},
						flags: { flag: true },
					}}
				>
					{children}
				</FlagsterProvider>
			),
		});

		expect(tester.flagster.getState()).toEqual({
			config: {
				environment: "test",
			},
			flags: { flag: true },
		});
	});
});
