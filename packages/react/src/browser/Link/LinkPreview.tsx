import React, { FunctionComponent } from "react";
import { DisplayMode, DisplayModeStatus, ImagePreview } from "./Link";

interface LinkPreviewProps {
	displayMode: DisplayMode;
	displayModeStatus: DisplayModeStatus;
	imagePreview: ImagePreview;
	href: string;
}

const LinkPreview: FunctionComponent<LinkPreviewProps> = ({
	displayMode,
	displayModeStatus,
	imagePreview,
	href,
}) => {
	return (
		<span className="m-1 mb-3 h-64 w-full overflow-clip rounded-md">
			{displayMode === "iframe" ? (
				<iframe className="h-full w-full overflow-clip" src={href} />
			) : (
				displayMode === "image" &&
				displayModeStatus === "success" &&
				imagePreview !== null && <img className="h-full w-full" src={imagePreview.image} />
			)}
		</span>
	);
};

export default LinkPreview;
