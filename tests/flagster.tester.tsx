import {
	FlagsStorage,
	Flagster,
	IApi,
	IdentityGenerator,
	IdentityStorage,
} from "flagster";
import { act, ReactNode, StrictMode } from "react";
import { FlagsterProvider } from "../src/provider";

class EmptyFlagsStorage implements FlagsStorage {
	get() {
		return {};
	}

	async save() {}
}

class EmptyApi implements IApi {
	async getFlags() {
		return {};
	}
}

class DummyIdentityGenerator implements IdentityGenerator {
	generate() {
		return "dummy";
	}
}

class EmptyIdentityStorage implements IdentityStorage {
	get() {
		return undefined;
	}

	async save() {}
}

export class FlagsterTester {
	private isStrictMode = false;
	private instance: Flagster | null = null;

	private api: IApi = new EmptyApi();
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

	get flagster() {
		if (!this.instance)
			this.instance = new Flagster(
				this.api,
				new EmptyFlagsStorage(),
				new DummyIdentityGenerator(),
				new EmptyIdentityStorage(),
			);

		return this.instance;
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
