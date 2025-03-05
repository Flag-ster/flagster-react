import { FC, PropsWithChildren } from "react";
import { useFlag } from "../hooks/use-flag";

type Props = {
	name: string;
};

export const FeatureEnabled: FC<PropsWithChildren<Props>> = ({
	name,
	children,
}) => {
	return useFlag(name) ? children : null;
};
