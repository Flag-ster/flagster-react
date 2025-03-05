import { useSyncExternalStore } from "react";
import { useFlagster } from "../provider";

type Flags = Record<string, boolean>;

export const useFlags = <K extends keyof Flags = keyof Flags>(
	keys: K[] = [],
): Record<K, boolean> | Flags => {
	const flagster = useFlagster();

	const flags = useSyncExternalStore(
		(callback) =>
			flagster.onChange((oldFlags, newFlags) => {
				const emptyKeys = keys.length === 0;
				const someFlagsChanged = keys.some(
					(key) => oldFlags[key] !== newFlags[key],
				);

				if (emptyKeys || someFlagsChanged) {
					callback();
				}
			}),
		flagster.getflags.bind(flagster),
	);

	if (keys.length === 0) return flags;

	return keys.reduce(
		(acc, key) => {
			acc[key] = flags[key];
			return acc;
		},
		{} as Record<K, boolean>,
	);
};
