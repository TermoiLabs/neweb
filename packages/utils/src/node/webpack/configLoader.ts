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
		// We have this check because of TS but it's still unclear how it
		// could ever be anything other than a string in our case
		/* c8 ignore next 3 */
		if (typeof minifiedGetConfig !== "string") {
			throw new Error("Final browser-compatible getConfig source code is not a string");
		}

		newGetConfigSource = minifiedGetConfig;
		// We ignore this branch in coverage because it's just passing the error down
		/* c8 ignore start */
	} catch (err) {
		// @ts-expect-error Only the error is expected when an actual error is given
		cb(err);
		return;
	}
	/* c8 ignore end */

	cb(null, newGetConfigSource);
	return;
}

export default configLoader;
