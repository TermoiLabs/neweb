import { NewebConfigFile } from "@dist/types/index.js";
import getModuleDir from "@dist/node/getModuleDir.js";
import test from "ava";
import webpack from "webpack";
import NewebWebpackPlugin from "@dist/node/webpack/NewebWebpackPlugin.js";
import sinon from "sinon";
import fs from "fs";
import getConfig from "./assets/getConfig.js";
import newebConfigJson from "./assets/neweb.config.js";
import { promisify } from "util";

function testMethodCalled(spyArgs: any[][], marker = "_$_TEST_FUNC_MARKER_$_") {
	for (let i = 0; i < spyArgs.length; i++) {
		const args: any[] = spyArgs[i];
		if (Array.isArray(args)) {
			if (args[args.length - 1] === marker) {
				return true;
			}
		}
	}

	return false;
}

declare global {
	var neweb: NewebConfigFile | undefined;
}

const sandbox = sinon.createSandbox();
test.afterEach(() => {
	sandbox.restore();
});

test("Must transform the getConfig function into the result of calling itself", async (t) => {
	t.plan(6);

	const readFileSyncSpy = sandbox.spy(fs, "readFileSync");
	t.true(readFileSyncSpy.notCalled);
	t.false("neweb" in globalThis);

	const currentDir = getModuleDir(import.meta.url);
	const webpackOutputFilename = "testOutput.js";
	const compiler = webpack({
		entry: {
			index: `${currentDir}/assets/index.js`,
		},
		output: {
			filename: webpackOutputFilename,
			path: currentDir,
		},

		plugins: [new NewebWebpackPlugin("@neweb/foo-bar", getConfig)],
	});

	const compileRun = promisify(compiler.run.bind(compiler));
	try {
		const result = (await compileRun())?.toString();
		console.log(result);
	} catch (err) {
		throw err;
	}

	const newebConfig = JSON.parse(newebConfigJson);

	t.true(testMethodCalled(readFileSyncSpy.args));
	t.deepEqual(globalThis.neweb, newebConfig);

	// Reset state
	readFileSyncSpy.resetHistory();
	delete globalThis.neweb;

	// Calling the output of the webpack compilation (IIFE) triggers getConfig again
	// but this time it's been transformed by our plugin
	await import(`${currentDir}/${webpackOutputFilename}`);

	// This means getConfig is now a result of itself being called at compile this,
	// thus it won't trigger I/O or any other type of operation
	t.false(testMethodCalled(readFileSyncSpy.args));
	t.deepEqual(globalThis.neweb, newebConfig);
});
