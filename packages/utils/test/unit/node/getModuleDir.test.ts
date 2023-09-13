import test from "ava";
import getModuleDir from "@dist/node/getModuleDir.js";

test("Must return the directory of the file URI", (t) => {
	t.plan(1);

	t.is(getModuleDir("file:///path/to/foo/bar.ts"), "/path/to/foo");
});
