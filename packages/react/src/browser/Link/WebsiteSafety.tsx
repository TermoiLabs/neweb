import React, { FunctionComponent } from "react";
import Score from "./Score";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { WebsiteSafetyType } from "./Link";
import { MdErrorOutline } from "react-icons/md";

interface WebsiteSafetyProps {
	websiteSafety: WebsiteSafetyType;
}

const WebsiteSafety: FunctionComponent<WebsiteSafetyProps> = ({ websiteSafety }) => {
	return (
		<span className="mt-2 flex w-24 items-center justify-start">
			<>
				{
					<span className="flex flex-col items-center justify-center">
						<span className="flex w-12 flex-col items-center justify-start">
							{websiteSafety.status === "success" &&
								typeof websiteSafety.data.score === "number" && (
									// abs and min,max are a fail-safe in case the API goes crazy
									<Score
										score={Math.abs(
											Math.max(
												0,
												Math.min(100, Math.floor(websiteSafety.data.score * 100))
											)
										)}
										checkStatus={websiteSafety.data.checkStatus}
									/>
								)}
							{websiteSafety.status === "loading" && (
								<AiOutlineLoading3Quarters className="mb-1 h-6 w-6 animate-spin" />
							)}
							{websiteSafety.status === "error" && (
								<MdErrorOutline className="h-6 w-6 text-red-500" />
							)}
						</span>
						Safety Score
						{websiteSafety.status === "error" && (
							<span className="-mt-1.5 text-[0.5rem] text-red-500">(Failed to load)</span>
						)}
					</span>
				}
				{/* {typeof websiteSafety.data.domainCreationDate === "string" && (
						<span>
							{Date.now() -
								new Date(websiteSafety.data.domainCreationDate).getTime() /
									1000 /
									60 /
									24 <
								365 && <></>}
						</span>
					)} */}
			</>
		</span>
	);
};

export default WebsiteSafety;
