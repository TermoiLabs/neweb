import { NewebConfig } from "../types/index";

const config: NewebConfig = {
	mode: "bleedingEdge",
	prod: !["development", "dev"].includes(process.env.NODE_ENV || ""),
	logLevel: "info",
};

export default config;
