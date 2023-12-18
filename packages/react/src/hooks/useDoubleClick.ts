import { RefObject, useEffect, useRef } from "react";

interface Params {
	ref: RefObject<HTMLElement | SVGElement>;
	delay?: number;
	onSingleClick: (e: Event) => void;
	onDoubleClick: (e: Event) => void;
}

/** Detect double clicks on desktop and mobile */
function useDoubleClick({
	ref,
	delay = 700,
	onSingleClick = () => void 0,
	onDoubleClick = () => void 0,
}: Params) {
	const clickCount = useRef(0);

	useEffect(() => {
		const node = ref.current;
		if (node === null) return;

		let timeout: NodeJS.Timeout;
		function eventHandler(e: Event) {
			clickCount.current++;
			if (clickCount.current === 1) onSingleClick(e);
			else if (clickCount.current === 2) onDoubleClick(e);
			clearTimeout(timeout);
			timeout = setTimeout(() => (clickCount.current = 0), delay);
		}

		node.addEventListener("pointerup", eventHandler);
		return () => {
			node.removeEventListener("pointerup", eventHandler);
		};
	});
}

export default useDoubleClick;
