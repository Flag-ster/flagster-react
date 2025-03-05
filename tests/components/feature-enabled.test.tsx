import { render } from "@testing-library/react";
import { FlagsterTester } from "../flagster.tester";
import { FeatureEnabled } from "../../src/components/feature-enabled";

describe("FeatureEnabled", () => {
	test("render children when flag is enabled", async () => {
		const tester = new FlagsterTester().withDefaultFlags({
			flag1: true,
		});

		const component = render(
			<FeatureEnabled name="flag1">Hello World</FeatureEnabled>,
			{
				wrapper: tester.wrapper,
			},
		);

		await tester.waitForInit();

		expect(component.queryByText("Hello World")).toBeTruthy();
	});

	test("do not render children when flag is disabled", async () => {
		const tester = new FlagsterTester().withDefaultFlags({
			flag1: false,
		});

		const component = render(
			<FeatureEnabled name="flag1">Hello World</FeatureEnabled>,
			{
				wrapper: tester.wrapper,
			},
		);

		expect(component.queryByText("Hello World")).toBeFalsy();
	});

	test("rerender when flag change", async () => {
		const tester = new FlagsterTester()
			.withDefaultFlags({
				flag1: false,
			})
			.withApi({
				getFlags: async () => {
					return {
						flag1: true,
					};
				},
			});

		const component = render(
			<FeatureEnabled name="flag1">Hello World</FeatureEnabled>,
			{
				wrapper: tester.wrapper,
			},
		);

		await tester.waitForInit();

		expect(component.queryByText("Hello World")).toBeTruthy();
	});
});
