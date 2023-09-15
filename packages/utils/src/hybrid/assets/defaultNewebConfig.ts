import { NewebConfig } from "../../types/index";

const config: NewebConfig = {
	mode: "bleedingEdge",
	prod: !["development", "dev", "testing", "test"].includes(process.env.NODE_ENV || ""),
	logLevel: "info",
	turnOnElementTreeMarkersByDefault: false,
};

export default config;
