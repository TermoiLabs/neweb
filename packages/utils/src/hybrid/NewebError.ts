class NewebError extends Error {
	constructor(message: string, code: string) {
		super(`[NEWEB] (Code: ${code}) ${message}`);
	}
}

export default NewebError;
