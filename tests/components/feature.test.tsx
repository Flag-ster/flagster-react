import { render } from "@testing-library/react";
import { FlagsterTester } from "../flagster.tester";
import { Feature } from "../../src/components/feature";

describe("Feature", () => {
	test("render children with isEnabled true when flag is enabled", async () => {
		const tester = new FlagsterTester().withDefaultFlags({
			flag1: true,
		});

		const component = render(
			<Feature name="flag1">
				{(isEnabled) => {
					return isEnabled ? "enabled" : "disabled";
				}}
			</Feature>,
			{
				wrapper: tester.wrapper,
			},
		);

		expect(component.queryByText("enabled")).toBeTruthy();
	});

	test("render children with isEnabled false when flag is disabled", async () => {
		const tester = new FlagsterTester().withDefaultFlags({
			flag1: false,
		});

		const component = render(
			<Feature name="flag1">
				{(isEnabled) => {
					return isEnabled ? "enabled" : "disabled";
				}}
			</Feature>,
			{
				wrapper: tester.wrapper,
			},
		);

		expect(component.queryByText("disabled")).toBeTruthy();
	});

	test("rerender when flag change", async () => {
		const tester = new FlagsterTester()
			.withDefaultFlags({
				flag1: true,
			})
			.withApi({
				getFlags: async () => {
					return {
						flag1: false,
					};
				},
			});

		const component = render(
			<Feature name="flag1">
				{(isEnabled) => {
					return isEnabled ? "enabled" : "disabled";
				}}
			</Feature>,
			{
				wrapper: tester.wrapper,
			},
		);

		await tester.waitForInit();

		expect(component.queryByText("disabled")).toBeTruthy();
	});
});
