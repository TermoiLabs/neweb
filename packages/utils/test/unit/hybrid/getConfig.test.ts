import test from "ava";
import getConfig from "@dist/hybrid/getConfig.js";
import sinon from "sinon";
import mock from "mock-fs";
import { NewebConfigFile } from "@dist/types/index.js";
import defaultNewebConfig from "@dist/hybrid/assets/defaultNewebConfig.js";

const sandbox = sinon.createSandbox();

test.afterEach(() => {
	sandbox.restore();
	mock.restore();
});

test.serial("Must return the contents of the JavaScript config file", async (t) => {
	t.plan(1);
	const configExample: NewebConfigFile = {
		// Default values will be used unless explicitly overriden by the user
		...defaultNewebConfig,
		logLevel: "warn",
		mode: "dataHoarder",
	};

	mock({
		"neweb.config.js": `export default ${JSON.stringify(configExample)}`,
	});

	const config = await getConfig();
	t.deepEqual(config, configExample);
});

test.serial("Must return the contents of the TypeScript config file", async (t) => {
	t.plan(1);
	const configExample: NewebConfigFile = {
		// Default values will be used unless explicitly overriden by the user
		...defaultNewebConfig,
		logLevel: "warn",
		mode: "bleedingEdge",
	};

	mock({
		"neweb.config.ts": `
const config: any = ${JSON.stringify(configExample)};
export default config`,
	});

	const config = await getConfig();
	t.deepEqual(config, configExample);
});

test.serial("Must return the contents of the JSON config file", async (t) => {
	t.plan(1);
	const configExample: NewebConfigFile = {
		// Default values will be used unless explicitly overriden by the user
		...defaultNewebConfig,
		logLevel: "debug",
		mode: "performance",
	};

	mock({
		"neweb.config.json": JSON.stringify(configExample),
	});

	const config = await getConfig();
	t.deepEqual(config, configExample);
});

test.serial("Must return the default configuration if it can't find the config file", async (t) => {
	t.plan(1);
	mock({});

	const config = await getConfig();
	t.deepEqual(config, defaultNewebConfig);
});

test.serial("Must start searching from the path parameter, when given", async (t) => {
	t.plan(1);
	const configExample: NewebConfigFile = {
		// Default values will be used unless explicitly overriden by the user
		...defaultNewebConfig,
		logLevel: false,
		mode: "bleedingEdge",
	};

	mock({
		"neweb.config.json": JSON.stringify(configExample),
		"foo/bar": {},
	});

	// process.cwd() is the path to the root of the virtual filesystem in mock-fs
	const config = await getConfig(`${process.cwd()}/foo/bar`);
	t.deepEqual(config, configExample);
});

test.serial("Must not emit any logs if the 'logging' parameter is false", async (t) => {
	t.plan(2);
	const consoleInfoSpy = sandbox.spy(globalThis.console, "info");
	mock({});

	await getConfig();
	t.true(consoleInfoSpy.called);

	consoleInfoSpy.resetHistory();

	await getConfig(null, false);
	t.false(consoleInfoSpy.called);
});
