type NewebMode = "performance" | "dataHoarder" | "bleedingEdge";

export interface NewebConfig {
	mode: NewebMode;
	prod: boolean;
	logLevel: "debug" | "info" | "warn" | "none" | false;
	turnOnElementTreeMarkersByDefault: boolean;
}

export type NewebConfigFile = Partial<NewebConfig>;

export type WebpackPluginUserConfig = {
	/**
	 * Use this if neweb can't find the config file. This must be an absolute path since, if you're using
	 * this option, neweb already can't find the root of your project, so it wouldn't know how to figure
	 * out the relative path
	 */
	configPath?: string;
};

export type LooseObject = { [key: string | number | symbol]: any };

export type NewebElement<StyleFormat> = {
	id?: string;
	className?: string;
	styles?: string | StyleFormat;
	mergeStyles?: boolean;
	tabindex?: number;
};

export type ElementTree<StyleFormat> = {
	[key: string]: NewebElement<StyleFormat>;
};

export interface BaseComponentProps<ET> {
	id?: string;
	elementTree?: {
		elements?: ET;
		markers?: boolean;
	};
}
