import { Logger } from ".";
import { NewebConfig } from "../types";
import { getProperty, setProperty, hasProperty } from "dot-prop";
import { LooseObject } from "../types";

/**
 * @param userConfig The props passed by the user
 * @param userConfigurationPropsMap Object containing dot-based strings as keys of the configuration
 *   properties (and the value as the last dot) that change one or multiple props that will also be
 *   passed as dot-based string keys in an object but with their value set to the new value determined by
 *   the configuration (a dot-based notation string may be used for nested properties)
 * @param config The neweb configuration object
 * @param logger The instance for your neweb logger
 * @param componentName The name of the current component to be used in logs
 * @param id Optional id to be used in logs
 * @returns The new props based on the configuration file
 */
function getConfiguredProps<UserProps extends LooseObject>(
	userProps: UserProps,
	userConfigurationPropsMap: { [key: string]: any },
	config: NewebConfig,
	logger: Logger,
	componentName: string,
	id?: string
) {
	// We clone the user props to avoid mutating the original reference
	// and creating unexpected behavior
	const configuredUserProps = structuredClone(userProps);

	const defaultConfigurationPropsMap = {
		"turnOnElementTreeMarkersByDefault.true": {
			"elementTree.markers": true,
		},
	};

	const configurationPropsMap = {
		...defaultConfigurationPropsMap,
		...userConfigurationPropsMap,
	};

	for (const originalConfigurationPropPath in configurationPropsMap) {
		const configurationPropPathArray = originalConfigurationPropPath.split(".");
		const configurationPropPathValue = configurationPropPathArray.pop();
		const configurationPropPath = configurationPropPathArray.join(".");

		if (!hasProperty(config, configurationPropPath)) {
			throw new Error(`${configurationPropPath} configuration prop doesn't exist`);
		}

		if (`${getProperty(config, configurationPropPath)}` === configurationPropPathValue) {
			const propChanges =
				configurationPropsMap[
					originalConfigurationPropPath as keyof typeof configurationPropsMap
				];
			if (typeof propChanges !== "object") {
				throw new Error(
					"Value of all properties in the first level of the 'configurationPropsMap' " +
						"object must be objects mapping the changes to the props" +
						`${id ? ` (id: ${id})` : ""}`
				);
			}

			for (const propChangePath in propChanges) {
				const userProp = getProperty(userProps, propChangePath);
				const propChange = propChanges[propChangePath as keyof typeof propChanges];

				if (typeof userProp !== "undefined") {
					if (userProp === propChange) {
						logger.info(
							`You don't need to explicitly set the '${propChangePath}' prop in the ` +
								`'${componentName}' component to '${userProp}'. ` +
								`It's already been automatically set to the same value ` +
								`because '${configurationPropPath}' is set to ` +
								`'${configurationPropPathValue}' in the global neweb configuration` +
								`${id ? ` (id: ${id})` : ""}`
						);
					} else {
						logger.warn(
							`Ignoring '${propChangePath}' prop set by the user in the ` +
								`${componentName} component to ${userProp} because when the ` +
								`${configurationPropPath} prop in the global neweb configuration ` +
								`is set to ${configurationPropPathValue} it forces ${propChangePath} ` +
								`to automatically become ${propChange}` +
								`${id ? ` (id: ${id})` : ""}`
						);
					}
				}

				setProperty(configuredUserProps, propChangePath, propChange);
			}
		}
	}

	return configuredUserProps;
}

export default getConfiguredProps;
