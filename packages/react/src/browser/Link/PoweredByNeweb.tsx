import React from "react";

const PoweredByNeweb = () => {
	return (
		<span className="absolute bottom-0.5 right-2 flex items-center gap-1 text-[0.4rem] text-slate-500 lg:bottom-0.5 lg:text-[0.45rem]">
			<span>
				Powered by{" "}
				<a className="text-blue-500 underline" href="https://github.com/LorenzoBloedow/neweb">
					neweb
				</a>
			</span>
		</span>
	);
};

export default PoweredByNeweb;
