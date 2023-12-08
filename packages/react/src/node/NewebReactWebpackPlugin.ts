import { getConfig } from "@termoi/neweb-local-utils";
import { NewebWebpackPlugin } from "@termoi/neweb-local-utils/node";
import { WebpackPluginUserConfig } from "@termoi/neweb-local-utils/types";

class NewebReactWebpackPlugin extends NewebWebpackPlugin {
	constructor(userConfig?: WebpackPluginUserConfig) {
		super("@termoi/neweb-react", getConfig, userConfig);
	}
}

export default NewebReactWebpackPlugin;
