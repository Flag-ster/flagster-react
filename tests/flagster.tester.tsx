import { Flagster } from "flagster-js/dist/src/flagster";
import { act, ReactNode } from "react";
import { FlagsterProvider } from "../src/provider";
import { IApi } from "flagster-js/dist/src/api/api";

export class FlagsterTester {
	private api: IApi = {
		getFlags: async () => {
			return {};
		},
	};

	withApi(api: IApi) {
		this.api = api;
		return this;
	}

	async waitForInit() {
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
	}

	private get flagster() {
		return new Flagster(this.api, {
			save() {},
			get() {
				return {};
			},
		});
	}

	get wrapper() {
		return (props: { children: ReactNode }) => {
			return (
				<FlagsterProvider
					flagster={this.flagster}
					config={{
						environment: "test",
						defaultFlags: {
							flag1: true,
							flag2: false,
						},
					}}
				>
					{props.children}
				</FlagsterProvider>
			);
		};
	}
}
