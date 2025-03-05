import { FC, PropsWithChildren } from "react";
import { useFlag } from "../hooks/use-flag";

type Props = {
	name: string;
};

export const FeatureDisabled: FC<PropsWithChildren<Props>> = ({
	name,
	children,
}) => {
	return useFlag(name) ? null : children;
};
