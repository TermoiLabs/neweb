import React, { FunctionComponent } from "react";
import { LuClock } from "react-icons/lu";
import { Tooltip } from "react-tooltip";

interface ImageTimeProps {
	imagePreview: {
		image: string;
		screenshotTakenAt: number;
	};
}

const ImageTime: FunctionComponent<ImageTimeProps> = ({ imagePreview }) => {
	return (
		<span
			data-tooltip-id="screenshot-time"
			data-tooltip-content="Time the screenshot was taken"
			className="ml-auto flex items-center gap-1.5"
		>
			<span className="md:hidden">
				{new Date(imagePreview.screenshotTakenAt).toLocaleDateString()}
			</span>
			<span className="hidden md:block">
				{new Date(imagePreview.screenshotTakenAt).toLocaleDateString() ===
				new Date().toLocaleDateString()
					? new Date(imagePreview.screenshotTakenAt).toLocaleTimeString()
					: new Date(imagePreview.screenshotTakenAt).toLocaleString()}
			</span>

			<LuClock className="h-4 w-4" />
			<Tooltip clickable id="screenshot-time" />
		</span>
	);
};

export default ImageTime;
