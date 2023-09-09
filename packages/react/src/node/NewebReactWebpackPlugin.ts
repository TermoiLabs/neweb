import { NewebWebpackPlugin } from "neweb-local-utils/node";
import { WebpackPluginUserConfig } from "neweb-local-utils/types";

class NewebReactWebpackPlugin extends NewebWebpackPlugin {
	constructor(userConfig?: WebpackPluginUserConfig) {
		super("@neweb/react", userConfig);
	}
}

export default NewebReactWebpackPlugin;
