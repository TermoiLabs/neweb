import { getConfig } from ".";

class Logger {
	#name = "NEWEB";
	#package?: string;

	/** @param packageSubname The subname for the package. E.g.: React */
	constructor(packageSubname?: string) {
		this.#package = packageSubname;
	}

	#getPrefix() {
		return `[${this.#name}]${this.#package ? ` (${this.#package})` : ""}`;
	}

	async #getLogLevel() {
		const logLevel = (await getConfig(null, false)).logLevel;
		if (["none", false].includes(logLevel)) {
			return Number.POSITIVE_INFINITY;
		}
		return ["debug", "info", "warn"].findIndex((level) => level === logLevel);
	}

	async debug(message: string) {
		if (!(await getConfig(null, false)).prod && (await this.#getLogLevel()) === 0) {
			console.debug(`${this.#getPrefix()} DEBUG: ${message}`);
		}
	}

	async info(message: string) {
		if (!(await getConfig(null, false)).prod && (await this.#getLogLevel()) <= 1) {
			console.info(`${this.#getPrefix()} INFO: ${message}`);
		}
	}

	async warn(message: string) {
		if (!(await getConfig(null, false)).prod && (await this.#getLogLevel()) <= 2) {
			console.warn(`${this.#getPrefix()} WARN: ${message}`);
		}
	}
}

export default Logger;
