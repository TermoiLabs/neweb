import test from "ava";
import rootDir from "@dist/node/rootDir.js";

test("Must return the path to the highest directory containing a node_modules folder", (t) => {
	t.plan(1);
	t.false(rootDir?.includes("node_modules"));
});
