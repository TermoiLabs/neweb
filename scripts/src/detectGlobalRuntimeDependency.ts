import { readFileSync } from "node:fs";



(() => {
	const file = readFileSync("package.json", "utf-8");

	const packageJson = JSON.parse(file);

	if (typeof packageJson?.dependencies === "object" && Object.keys(packageJson.dependencies).length) {
		throw new Error("Global dependency detected");
	}
})();
