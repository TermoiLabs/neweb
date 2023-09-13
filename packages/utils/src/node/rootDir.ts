import { sep } from "path";
/** Root of the project determined by finding the first node_modules */
/* c8 ignore next */
const rootDir = process.argv[1].split(sep + "node_modules")[0] || null;
export default rootDir;
