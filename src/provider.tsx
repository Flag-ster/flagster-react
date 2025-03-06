import { Config, Flagster } from "flagster";
import { createContext, FC, PropsWithChildren, useContext } from "react";

const FlagsterContext = createContext<Flagster | null>(null);

export const FlagsterProvider: FC<
	PropsWithChildren<{
		flagster: Flagster;
		config: Config;
	}>
> = ({ flagster, config, children }) => {
	flagster.init(config);

	return (
		<FlagsterContext.Provider value={flagster}>
			{children}
		</FlagsterContext.Provider>
	);
};

export const useFlagster = () => {
	const flagster = useContext(FlagsterContext);

	if (!flagster) {
		throw new Error("FlagsterProvider not found");
	}

	return flagster;
};
