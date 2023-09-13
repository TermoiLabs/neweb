import test from "ava";
import findFileBottomUp from "@dist/node/findFileBottomUp.js";
import mock from "mock-fs";
import { readFileSync } from "fs";

const currentDirectoryTestContent = "This is a test";
const oneLevelDeepTestContent = "Get out of here! Another one?";
const twoLevelsDeepTestContent = "O M G! Three tests? Wombo combo!";

test.before(() => {
	mock({
		"test.txt": currentDirectoryTestContent,
		foo: {
			"test.txt": oneLevelDeepTestContent,
			bar: {
				"test.txt": twoLevelsDeepTestContent,
			},
		},
	});
});

test.after(() => {
	mock.restore();
});

test("Must return the first file path found from searching bottom to top", (t) => {
	t.plan(1);

	const filePath = findFileBottomUp("test.txt", false);
	t.is(readFileSync(filePath!, "utf-8"), currentDirectoryTestContent);
});

test("Must start searching from the given path when provided", (t) => {
	t.plan(1);

	const filePath = findFileBottomUp("test.txt", false, "./foo");
	t.is(readFileSync(filePath!, "utf-8"), oneLevelDeepTestContent);
});

test("Must continue searching and return all files found if the findAll argument is true", (t) => {
	t.plan(3);

	const filePaths = findFileBottomUp("test.txt", true, "./foo/bar");
	t.is(readFileSync(filePaths![0], "utf-8"), twoLevelsDeepTestContent);
	t.is(readFileSync(filePaths![1], "utf-8"), oneLevelDeepTestContent);
	t.is(readFileSync(filePaths![2], "utf-8"), currentDirectoryTestContent);
});

test("Must return null if the file isn't found", (t) => {
	t.plan(1);

	const filePath = findFileBottomUp("wrongTest.txt", false);
	t.is(filePath, null);
});
