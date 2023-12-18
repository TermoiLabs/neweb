import { getWebsiteSafety } from "@termoi/neweb-local-utils/browser";
import React, { FunctionComponent, useEffect, useId, useRef } from "react";
import { FiHelpCircle } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import CheckIcon from "./CheckIcon";
import { renderToStaticMarkup } from "react-dom/server";

interface ScoreProps {
	score: number;
	checkStatus: Awaited<ReturnType<typeof getWebsiteSafety>>["checkStatus"];
}

const Score: FunctionComponent<ScoreProps> = ({ score, checkStatus }) => {
	const pathRef = useRef<SVGPathElement>(null);
	const remainingPathRef = useRef<SVGPathElement>(null);
	const safetyDetailsTooltipId = useId();

	useEffect(() => {
		if (pathRef.current && remainingPathRef.current) {
			pathRef.current.style.strokeDasharray = "650";
			pathRef.current.style.strokeDashoffset = "650";

			const options: KeyframeAnimationOptions = {
				duration: 1500,
				fill: "forwards",
				easing: "ease-out",
			};

			pathRef.current.animate(
				[
					{
						strokeDashoffset: 650 - score * 6.5,
						stroke: `hsl(${score * 1.35}deg, 88%, 57%)`,
					},
				],
				options
			);
			remainingPathRef.current.animate(
				[
					{
						strokeDashoffset: 0,
					},
				],
				options
			);
		}
	}, [score]);

	return (
		<span className="relative flex h-5 items-center justify-center">
			<FiHelpCircle
				data-tooltip-id={safetyDetailsTooltipId}
				data-tooltip-html={renderToStaticMarkup(
					<span className="flex flex-col gap-1.5">
						<span className="flex items-center gap-0.5">
							<CheckIcon status={checkStatus.webrisk} />
							Google safety scan
							{checkStatus.webrisk ? " ran successfully" : " failed to run"}
						</span>
						<span className="flex items-center gap-0.5">
							<CheckIcon status={checkStatus.abuseipdb} />
							AbuseIPDB check
							{checkStatus.abuseipdb ? " ran successfully" : " failed to run"}
						</span>
						<span className="flex items-center gap-0.5">
							<CheckIcon status={checkStatus.domainDate} />
							Domain recency test
							{checkStatus.domainDate ? " ran successfully" : " failed to run"}
						</span>
					</span>
				)}
				role="tooltip"
				className="absolute -right-3.5 -top-2 h-3 w-3 text-blue-950"
			/>
			<Tooltip clickable id={safetyDetailsTooltipId} />
			<svg
				preserveAspectRatio="xMinYMin"
				width="3rem"
				height="2rem"
				viewBox="0 0 50 350"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					ref={remainingPathRef}
					d="M21 195C108 -31 406 -42 500 195"
					stroke="#cacacc"
					strokeWidth="42"
					strokeLinecap="round"
					strokeDasharray={650}
					strokeDashoffset={650}
				/>
				<path
					ref={pathRef}
					d="M21 195C108 -31 406 -42 500 195"
					stroke="hsl(0deg, 88%, 57%)"
					strokeWidth="42"
					strokeLinecap="round"
					strokeDasharray={650}
					strokeDashoffset={650}
				/>
			</svg>
			<span className="absolute text-[0.7rem] font-bold">{score}</span>
		</span>
	);
};

export default Score;
