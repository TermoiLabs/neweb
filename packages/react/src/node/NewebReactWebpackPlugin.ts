import { getConfig } from "neweb-local-utils";
import { NewebWebpackPlugin } from "neweb-local-utils/node";
import { WebpackPluginUserConfig } from "neweb-local-utils/types";

class NewebReactWebpackPlugin extends NewebWebpackPlugin {
	constructor(userConfig?: WebpackPluginUserConfig) {
		super("@neweb/react", getConfig, userConfig);
	}
}

export default NewebReactWebpackPlugin;
