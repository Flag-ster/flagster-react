import { useSyncExternalStore } from "react";
import { useFlagster } from "../provider";

export const useFlag = (name: string) => {
	const flagster = useFlagster();

	const flags = useSyncExternalStore(
		(triggerChange) =>
			flagster.onChange((oldFlags, newFlags) => {
				if (oldFlags[name] !== newFlags[name]) {
					triggerChange();
				}
			}),
		() => flagster.getFlags(),
	);

	return !!flags[name];
};
