import { useSyncExternalStore } from "react";
import { useFlagster } from "../provider";

export const useFlags = <K extends string>(
	names: K[] = [],
): Record<K, boolean> | Record<string, boolean> => {
	const flagster = useFlagster();
	const emptyNames = names.length === 0;

	const flags = useSyncExternalStore(
		(triggerChange) =>
			flagster.onChange((oldFlags, newFlags) => {
				const flagsDiffers = names.some(
					(name) => oldFlags[name] !== newFlags[name],
				);

				if (emptyNames || flagsDiffers) triggerChange();
			}),
		() => flagster.getFlags(),
	);

	return emptyNames
		? flags
		: Object.fromEntries(names.map((key) => [key, !!flags[key]]));
};
