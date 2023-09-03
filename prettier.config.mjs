/** @type {import("prettier").Options} */
const config = {
	trailingComma: "es5",
	tabWidth: 4,
	semi: true,
	singleQuote: false,
	useTabs: true,
	printWidth: 105,
	plugins: [
		"prettier-plugin-jsdoc",
		// THIS ALWAYS HAS TO BE THE LAST PLUGIN LOADED
		"prettier-plugin-tailwindcss",
	],
	endOfLine: "lf",
};

export default config;
