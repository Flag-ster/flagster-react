import { Config, Flagster, FlagsterState } from "flagster";
import { createContext, FC, PropsWithChildren, useContext } from "react";

const FlagsterContext = createContext<Flagster | null>(null);

type PropsBase = {
	flagster: Flagster;
};

type WithConfig = PropsBase & {
	config: Config;
	serverState?: never;
};

type WithServerState = PropsBase & {
	serverState: FlagsterState;
	config?: never;
};

type Props = WithConfig | WithServerState;

export const FlagsterProvider: FC<PropsWithChildren<Props>> = ({
	flagster,
	config,
	serverState,
	children,
}) => {
	if (flagster.canInit() && config) {
		flagster.init(config);
	}

	if (serverState) {
		flagster.setState(serverState);
	}

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
