import { renderHook } from "@testing-library/react";
import { FlagsterTester } from "../flagster.tester";
import { useFlag } from "../../src/hooks/use-flag";

describe("useFlag", () => {
	test.each([true, false])("retrieve flag isEnabled when %s", (isEnabled) => {
		const tester = new FlagsterTester().withDefaultFlags({
			flag1: isEnabled,
		});

		const hook = renderHook(() => useFlag("flag1"), {
			wrapper: tester.wrapper,
		});

		expect(hook.result.current).toBe(isEnabled);
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

		const hook = renderHook(() => useFlag("flag1"), {
			wrapper: tester.wrapper,
		});

		await tester.waitForInit();

		expect(hook.result.current).toBe(true);
	});

	test("do not rerender when other flag change", async () => {
		let renderCount = 0;
		const tester = new FlagsterTester()
			.withDefaultFlags({
				flag1: false,
			})
			.withApi({
				getFlags: async () => {
					return {
						flag2: true,
					};
				},
			});

		renderHook(
			() => {
				renderCount++;
				return useFlag("flag1");
			},
			{
				wrapper: tester.wrapper,
			},
		);

		await tester.waitForInit();

		expect(renderCount).toBe(1);
	});
});
