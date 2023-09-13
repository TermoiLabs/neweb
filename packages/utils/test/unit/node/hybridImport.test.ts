import test from "ava";
import hybridImport from "@dist/node/hybridImport.js";
import mock from "mock-fs";

const testJsonResult = { this: "is", a: "test" };
const testJsResult = "testing";

test.before(() => {
	mock({
		"path/to/modules": {
			"foo.json": JSON.stringify(testJsonResult),
			"bar.js": `export default '${testJsResult}'`,
		},
	});
});

test.after(() => {
	mock.restore();
});

test("Must be able to import a JSON module using an absolute path", async (t) => {
	t.plan(1);
	const res = (await hybridImport(`${process.cwd()}/path/to/modules/foo.json`)).default;
	t.deepEqual(res, testJsonResult);
});

test("Must be able to import a JavaScript module using an absolute path", async (t) => {
	t.plan(1);
	const res = (await hybridImport(`${process.cwd()}/path/to/modules/bar.js`)).default;
	t.is(res, testJsResult);
});

test("Must be able to import a JSON module using a relative path", async (t) => {
	t.plan(1);
	const res = (await hybridImport("./path/to/modules/foo.json")).default;
	t.deepEqual(res, testJsonResult);
});

test("Must be able to import a JavaScript module using a relative path", async (t) => {
	t.plan(1);
	const res = (await hybridImport("./path/to/modules/bar.js")).default;
	t.is(res, testJsResult);
});

test("Must be able to import a JSON module using a file URI", async (t) => {
	t.plan(1);
	const res = (await hybridImport(`file:///${process.cwd()}/path/to/modules/foo.json`)).default;
	t.deepEqual(res, testJsonResult);
});

test("Must be able to import a JavaScript module using a file URI", async (t) => {
	t.plan(1);
	const res = (await hybridImport(`file:///${process.cwd()}/path/to/modules/bar.js`)).default;
	t.is(res, testJsResult);
});
