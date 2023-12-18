import React, { forwardRef, useRef } from "react";

const LinkUnderline = forwardRef<SVGPathElement>((_, ref) => {
	return (
		<span className="flex">
			<svg className="w-0 flex-grow" height="3">
				<path
					ref={ref}
					d="M1.5 1.5H180"
					className="stroke-blue-500"
					strokeWidth="2"
					strokeLinecap="round"
					strokeDasharray={4}
					strokeDashoffset={0}
				/>
			</svg>
		</span>
	);
});

export default LinkUnderline;
