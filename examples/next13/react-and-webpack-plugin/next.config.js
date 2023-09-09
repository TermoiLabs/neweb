import { NewebReactWebpackPlugin } from "@neweb/react/node";
import { fileURLToPath } from "url";

/** @type {import("next").NextConfig} */
const config = {
	/** @param {import("webpack").Configuration} config */
	webpack: (config) => {
		config.plugins?.push(
			new NewebReactWebpackPlugin({
				configPath: fileURLToPath(`${import.meta.url}/../neweb.config.ts`),
			})
		);
		return config;
	},
};

export default config;
