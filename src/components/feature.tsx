import { FC } from "react";
import { useFlag } from "../hooks/use-flag";

type Props = {
	name: string;
	children: (isEnabled: boolean) => React.ReactNode;
};

export const Feature: FC<Props> = ({ name, children }) => {
	return children(useFlag(name));
};
