import { renderHook, waitFor } from "@testing-library/react";
import { useFlags } from "../../src/hooks/use-flags";
import { FlagsterTester } from "../flagster.tester";

describe("useFlags", () => {
	test("retrieve all flags", async () => {
		const tester = new FlagsterTester();

		const hook = renderHook(() => useFlags(), {
			wrapper: tester.wrapper,
		});

		await waitFor(() => {
			expect(hook.result.current).toEqual({
				flag1: true,
				flag2: false,
			});
		});
	});

	test("retrieve selected flags", async () => {
		const tester = new FlagsterTester();

		const hook = renderHook(() => useFlags(["flag1"]), {
			wrapper: tester.wrapper,
		});

		await waitFor(() => {
			expect(hook.result.current).toEqual({
				flag1: true,
			});
		});
	});

	test("rerender when flags change", async () => {
		const tester = new FlagsterTester().withApi({
			getFlags: async () => {
				return {
					flag1: true,
					flag2: true,
				};
			},
		});

		const hook = renderHook(() => useFlags(), {
			wrapper: tester.wrapper,
		});

		await tester.waitForInit();

		expect(hook.result.current).toEqual({
			flag1: true,
			flag2: true,
		});
	});

	test.each`
		selectedFlags         | apiFlags                                      | expectedRenderCount
		${["flag1"]}          | ${{ flag1: false, flag2: false }}             | ${2}
		${["flag2"]}          | ${{ flag1: true, flag2: true }}               | ${2}
		${["flag1", "flag2"]} | ${{ flag1: true, flag2: true }}               | ${2}
		${["flag1", "flag2"]} | ${{ flag1: true, flag2: false, flag3: true }} | ${1}
	`(
		"rerender only when some selected flags has changed $selectedFlags $expectedRenderCount ",
		async ({ selectedFlags, apiFlags, expectedRenderCount }) => {
			let renderCount = 0;

			const tester = new FlagsterTester();
			tester.withApi({
				getFlags: async () => {
					return apiFlags;
				},
			});

			renderHook(
				() => {
					renderCount++;
					return useFlags(selectedFlags);
				},
				{
					wrapper: tester.wrapper,
				},
			);

			await tester.waitForInit();

			expect(renderCount).toBe(expectedRenderCount);
		},
	);

	test("false is returned when flag does not exist", async () => {
		const tester = new FlagsterTester();

		const hook = renderHook(() => useFlags(["flag3"]), {
			wrapper: tester.wrapper,
		});

		await waitFor(() => {
			expect(hook.result.current).toEqual({
				flag3: false,
			});
		});
	});
});
