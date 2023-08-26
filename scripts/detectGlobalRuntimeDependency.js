import { readFileSync } from "node:fs";

(() => {
	const file = readFileSync("package.json", "utf-8");

	if (file.search(/"dependencies":\s*{(\s*.+)*}/) !== -1) {
		throw new Error("Global dependency detected");
	}
})();
