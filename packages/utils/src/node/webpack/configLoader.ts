import { minify } from "terser";
import { NewebConfig } from "../../types";

interface WebpackLoaderContext {
	getOptions: () => { resolvedConfig: NewebConfig };
	async: () => (error: Error | null, content: string) => void;
}

async function configLoader(this: WebpackLoaderContext) {
	const cb = this.async();

	const configObj = this.getOptions().resolvedConfig;
	let newGetConfigSource = `
async function getConfig() {
	return ${JSON.stringify(configObj)}
}
export default getConfig;
`;
	try {
		const minifiedGetConfig = (await minify(newGetConfigSource)).code;
		if (typeof minifiedGetConfig !== "string") {
			throw new Error("Final browser-compatible getConfig source code is not a string");
		}

		newGetConfigSource = minifiedGetConfig;
	} catch (err) {
		// @ts-expect-error Only the error is expected when an actual error is given
		cb(err);
		return;
	}

	cb(null, newGetConfigSource);
	return;
}

export default configLoader;
