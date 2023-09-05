import { sep } from "path";
/** Root of the project determined by finding the first node_modules */
const rootDir = process.argv[1].split(sep + "node_modules")[0] || null;
export default rootDir;
