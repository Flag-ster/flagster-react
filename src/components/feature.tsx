import { FC } from "react";
import { useFlags } from "../hooks/use-flags";

type Props = {
	name: string;
	children: (isEnabled: boolean) => React.ReactNode;
};

export const Feature: FC<Props> = ({ name, children }) => {
	const flags = useFlags([name]);
	return children(flags[name]);
};
