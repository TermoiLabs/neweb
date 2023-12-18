import { useEffect, useState } from "react";

function useMediaQuery(query: string) {
	const [mediaQuery, setMediaQuery] = useState(
		typeof matchMedia !== "undefined" ? matchMedia(query).matches : false
	);

	useEffect(() => {
		function updateResult(e: MediaQueryListEvent) {
			setMediaQuery(e.matches);
		}

		const matchMediaQuery = matchMedia(query);
		matchMediaQuery.addEventListener("change", updateResult);

		return () => matchMediaQuery.removeEventListener("change", updateResult);
	}, [query]);

	return mediaQuery;
}

export default useMediaQuery;
