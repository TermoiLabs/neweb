import { NewebConfig } from "../../types/index";

const config: NewebConfig = {
	mode: "bleedingEdge",
	prod: !["development", "dev", "testing", "test"].includes(process.env.NODE_ENV || ""),
	logLevel: "info",
};

export default config;
