import { getConfig } from "@termoi/neweb-local-utils";
import { NewebConfig } from "@termoi/neweb-local-utils/types";
import { useEffect, useState } from "react";

function useConfig() {
	const [config, setConfig] = useState<NewebConfig | null>(null);
	useEffect(() => {
		getConfig().then((config) => setConfig(config));
	}, []);

	return config;
}

export default useConfig;
