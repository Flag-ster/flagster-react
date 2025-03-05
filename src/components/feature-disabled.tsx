import { FC, PropsWithChildren } from "react";
import { useFlags } from "../hooks/use-flags";

type Props = {
	name: string;
};

export const FeatureDisabled: FC<PropsWithChildren<Props>> = ({
	name,
	children,
}) => {
	return useFlags([name])[name] ? null : children;
};
