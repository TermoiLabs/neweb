# Configuration File

Neweb uses Webpack magic to make it possible for a frontend library to use configuration files!  
To start using it install our Webpack plugin and create a `neweb.config.js` or `neweb.config.ts` file  
in the root of your project that exports a configuration object, here's an example of how to do it in Next.js:

`next.config.js`:

```
import { NewebReactWebpackPlugin } from "@termoi/neweb-react/node";
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
```

`neweb.config.ts`:

```
import { NewebConfigFile } from "@termoi/neweb-react/node";

const config: NewebConfigFile = {
	mode: "performance",
};

export default config;
```

## Options

### mode

-   `"performance"`: Optional features that are known to directly impact performance such as those that
    cannot be lazily loaded will be completely disabled, other performance optimizations that may not
    make sense on other modes may also be applied.

-   `"bleedingEdge"`: Every optional feature is automatically enabled (but may manually be disabled by the developer), this consequentially means features that many users may not be able to experience due to the need to have the latest software/hardware, the so called "bleeding-edge" features, will be loaded by neweb if we detect the user's device supports it. If you want full control over which features to use, this is your mode!

-   `"dataHoarder"`: Only the absolutely necessary data will be downloaded, any features that aren't
    considered essential will be completely disabled.

-   `"modest"`: (default): This is a permissive mode that leaves the decision on which features to enable
    on the developer's hand, except for cases where the features are deemed to costly to either
    performance or the amount of data downloaded, in which case they will be completely disabled.

<!-- TODO -->

<!-- `respectReducedData` (default: true): If true, neweb will automatically switch to `dataHoarder` mode
if the user has the `prefers-reduced-data` media query set to `reduced` -->

<!-- `telemetry.dev` (default: true) If true, neweb will collect completely anonymous usage data on how developers are using neweb in order to better improve developer experience

`telemetry.prod` (default: true) If true, neweb will collect semi-anonymous usage data on how users are interacting with neweb in order to better improve user experience.
All user data collected will be anonymous, the only identifier sent will be the address of the website
from which the data originated from, this is the only reason why we call it "**semi**-anonymous"

`darkMode` (default: true) If true, neweb will synchronize the themes of all components by listening
to the prefers-color-scheme media query. Alternatively, you can also manually force the theme of
some or all components by using the [global neweb class]() -->
