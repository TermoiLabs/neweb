import { NewebConfigFile } from "@dist/types/index.js";
import Logger from "@dist/hybrid/Logger.js";
import test from "ava";
import sinon from "sinon";
import mock from "mock-fs";

const sandbox = sinon.createSandbox();

test.afterEach(() => {
	sandbox.restore();
	mock.restore();
});

test.serial("Must emit all types of logs if logLevel is set to 'debug'", async (t) => {
	t.plan(6);

	const configExample: NewebConfigFile = {
		logLevel: "debug",
	};

	mock({
		"neweb.config.json": JSON.stringify(configExample),
	});

	const consoleDebugSpy = sandbox.spy(globalThis.console, "debug");
	const consoleInfoSpy = sandbox.spy(globalThis.console, "info");
	const consoleWarnSpy = sandbox.spy(globalThis.console, "warn");

	const logger = new Logger();

	t.true(consoleDebugSpy.notCalled);
	t.true(consoleInfoSpy.notCalled);
	t.true(consoleWarnSpy.notCalled);

	const debugPromise = logger.debug("testing");
	const infoPromise = logger.info("foo");
	const warnPromise = logger.warn("bar");
	await Promise.all([debugPromise, infoPromise, warnPromise]);

	t.true(consoleDebugSpy.calledOnce);
	t.true(consoleInfoSpy.calledOnce);
	t.true(consoleWarnSpy.calledOnce);
});

test.serial("Must emit 'info' and 'warn' logs if logLevel is set to 'info'", async (t) => {
	t.plan(6);

	const configExample: NewebConfigFile = {
		logLevel: "info",
	};

	mock({
		"neweb.config.json": JSON.stringify(configExample),
	});

	const consoleDebugSpy = sandbox.spy(globalThis.console, "debug");
	const consoleInfoSpy = sandbox.spy(globalThis.console, "info");
	const consoleWarnSpy = sandbox.spy(globalThis.console, "warn");

	const logger = new Logger();

	t.true(consoleDebugSpy.notCalled);
	t.true(consoleInfoSpy.notCalled);
	t.true(consoleWarnSpy.notCalled);

	const debugPromise = logger.debug("testing");
	const infoPromise = logger.info("foo");
	const warnPromise = logger.warn("bar");
	await Promise.all([debugPromise, infoPromise, warnPromise]);

	t.true(consoleDebugSpy.notCalled);
	t.true(consoleInfoSpy.calledOnce);
	t.true(consoleWarnSpy.calledOnce);
});

test.serial("Must emit only 'warn' logs if logLevel is set to 'warn'", async (t) => {
	t.plan(6);

	const configExample: NewebConfigFile = {
		logLevel: "warn",
	};

	mock({
		"neweb.config.json": JSON.stringify(configExample),
	});

	const consoleDebugSpy = sandbox.spy(globalThis.console, "debug");
	const consoleInfoSpy = sandbox.spy(globalThis.console, "info");
	const consoleWarnSpy = sandbox.spy(globalThis.console, "warn");

	const logger = new Logger();

	t.true(consoleDebugSpy.notCalled);
	t.true(consoleInfoSpy.notCalled);
	t.true(consoleWarnSpy.notCalled);

	const debugPromise = logger.debug("testing");
	const infoPromise = logger.info("foo");
	const warnPromise = logger.warn("bar");
	await Promise.all([debugPromise, infoPromise, warnPromise]);

	t.true(consoleDebugSpy.notCalled);
	t.true(consoleInfoSpy.notCalled);
	t.true(consoleWarnSpy.calledOnce);
});

test.serial("Must prefix the log with the package name when given", async (t) => {
	t.plan(4);

	const configExample: NewebConfigFile = {
		logLevel: "debug",
	};

	mock({
		"neweb.config.json": JSON.stringify(configExample),
	});

	const defaultLogger = new Logger();
	const logPrefix = "@foo/bar";
	const prefixLogger = new Logger(logPrefix);

	const consoleDebugSpy = sandbox.spy(globalThis.console, "debug");
	const debugMessage = "test debug message";

	await defaultLogger.debug(debugMessage);
	t.true(consoleDebugSpy.calledOnce);
	t.deepEqual(consoleDebugSpy.args[0], [`[NEWEB] DEBUG: ${debugMessage}`]);

	consoleDebugSpy.resetHistory();

	await prefixLogger.debug(debugMessage);
	t.true(consoleDebugSpy.calledOnce);
	t.deepEqual(consoleDebugSpy.args[0], [`[NEWEB] (${logPrefix}) DEBUG: ${debugMessage}`]);
});

test.serial("Must not emit any logs if production mode is detected", async (t) => {
	t.plan(2);

	const configExample: NewebConfigFile = {
		logLevel: "debug",
		prod: false,
	};

	mock({
		"neweb.config.json": JSON.stringify(configExample),
	});

	const logger = new Logger();
	const consoleDebugSpy = sandbox.spy(globalThis.console, "debug");

	await logger.debug("test debug message");
	t.true(consoleDebugSpy.calledOnce);

	consoleDebugSpy.resetHistory();

	configExample.prod = true;
	mock({
		"neweb.config.json": JSON.stringify(configExample),
	});

	await logger.debug("test debug message");
	t.true(consoleDebugSpy.notCalled);
});
