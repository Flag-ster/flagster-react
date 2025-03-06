import { Flagster, IApi } from "flagster";
import { act, ReactNode, StrictMode } from "react";
import { FlagsterProvider } from "../src/provider";

export class FlagsterTester {
	private isStrictMode = false;

	private api: IApi = {
		getFlags: async () => {
			return {};
		},
	};

	private defaultFlags: Record<string, boolean> = {
		flag1: true,
		flag2: false,
	};

	withApi(api: IApi) {
		this.api = api;
		return this;
	}

	withDefaultFlags(defaultFlags: Record<string, boolean>) {
		this.defaultFlags = defaultFlags;
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
			const Provider = () => (
				<FlagsterProvider
					flagster={this.flagster}
					config={{
						environment: "test",
						defaultFlags: this.defaultFlags,
					}}
				>
					{props.children}
				</FlagsterProvider>
			);

			if (this.isStrictMode) {
				return (
					<StrictMode>
						<Provider />
					</StrictMode>
				);
			}

			return <Provider />;
		};
	}

	strictMode() {
		this.isStrictMode = true;
		return this;
	}
}
