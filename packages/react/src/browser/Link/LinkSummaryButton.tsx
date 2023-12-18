import React, { FunctionComponent } from "react";
import { IoBookOutline, IoBookSharp } from "react-icons/io5";

interface LinkSummaryButtonProps {
	toggled: boolean;
}

const LinkSummaryButton: FunctionComponent<LinkSummaryButtonProps> = ({ toggled }) => {
	return (
		<button className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-1 rounded-md bg-slate-200 p-0.5 text-slate-600">
			{toggled ? <IoBookSharp className="text-3xl" /> : <IoBookOutline className="text-3xl" />}
			<span className="hidden text-[0.4rem] font-bold">Summary</span>
		</button>
	);
};

export default LinkSummaryButton;
