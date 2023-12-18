import { useEffect, useState } from "react";

function useWindowSize(waitUntilResizeEvent?: boolean) {
	const [windowSize, setWindowSize] = useState<{
		width: number;
		height: number;
	} | null>(null);

	useEffect(() => {
		if (!waitUntilResizeEvent)
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });

		const windowResizeListener = () =>
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });

		window.addEventListener("resize", windowResizeListener);

		return () => window.removeEventListener("resize", windowResizeListener);
	}, []);

	return windowSize;
}

export default useWindowSize;
