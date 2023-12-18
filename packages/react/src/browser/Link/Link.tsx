"use client";
import { getConfiguredProps } from "@termoi/neweb-local-utils";
import React, {
	FunctionComponent,
	ReactElement,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import useConfig from "../../hooks/useConfig";
import logger from "../../hybrid/logger";
import { BaseComponentProps } from "@termoi/neweb-local-utils/types";
import { ElementTreeReact, NewebElementReact } from "../../types";
import useMediaQuery from "../../hooks/useMediaQuery";
import useDoubleClick from "../../hooks/useDoubleClick";
import {
	getWebsiteSafety,
	getWebsiteScreenshot,
	isWebsiteFramable,
	getWebsiteSummary,
} from "@termoi/neweb-local-utils/browser";
import merge from "deepmerge";
import { HiCursorClick } from "react-icons/hi";
import { MdTouchApp } from "react-icons/md";
import useWindowSize from "../../hooks/useWindowSize";
import LinkText from "./LinkText";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdErrorOutline } from "react-icons/md";
import WebsiteSafety from "./WebsiteSafety";
import LinkPreview from "./LinkPreview";
import ImageTime from "./ImageTime";
import PoweredByNeweb from "./PoweredByNeweb";
import LinkSummaryButton from "./LinkSummaryButton";
import Markdown from "react-markdown";
// TODO
export type DisplayMode = "iframe" | "image" | "textSummary" /** | "ogImage" */;
export type DisplayModeStatus = "idle" | "loading" | "refreshing" | "error" | "success";
export type LinkChildren = string | ReactElement<any, "a">;
export type ImagePreview = {
	image: string;
	screenshotTakenAt: number;
} | null;

interface LinkProps extends BaseComponentProps<ElementTreeReact> {
	href: string;
	children: LinkChildren;
	id?: string;
	darkMode?: boolean;
	preview?: {
		// TODO
		// scroll?: number | `${string}%` | "animated" | "smart";
		displayMode?: {
			disableFallback?: boolean;
			mode: DisplayMode;
			text?: {
				selector: string;
				lines?: number;
				preload?: boolean;
			};
			iframe?: {
				skipIframeCheck?: boolean;
			};
			image?: {
				preload?: boolean;
			};
		};
		showReadingTime?: boolean;
	};
	elementTree?: {
		markers?: boolean;
		elements?: {
			wrapper?: NewebElementReact;
			link?: NewebElementReact & { ping?: string | string[] };
			preview?: NewebElementReact;
		};
	};
}

export type WebsiteSafetyType =
	| { status: "loading" | "error" }
	| { status: "success"; data: Awaited<ReturnType<typeof getWebsiteSafety>> };

// TODO:
// - if iframe is blocked, fallback to image, if image doesn't work, fallback to text, if
// all else fails, fallback to the og image
// - allow components to be pinged on command by establishing a websockets connection,
// for every user all link components on the page will be pinged
// let paying users ping to see how many active users are in a page where their links are
// also let them ping through an API (timeout is 5 minutes)
// (the user will not ping if dataHoarder is on)
// - download image with progressive blur streaming

// CACHE:
// Local: Permanent and updated with last image always (used to immediately show an image)
// API: 5 minutes, and when the next hit after the cache is stale happens, immediately show
// the last stored image until the new one loads, if it doesn't exist just wait for the new one
const Link: FunctionComponent<LinkProps> = (originalProps) => {
	const defaultProps: Required<Pick<LinkProps, "preview">> & {
		elementTree: { markers: boolean };
	} = {
		preview: {
			displayMode: {
				mode: "image",
				image: {
					preload: true,
				},
			},
			showReadingTime: false,
		},
		elementTree: {
			markers: false,
		},
	};

	const [noHoverToggle, setNoHoverToggle] = useState(false);

	const defaultDisplayMode = useMemo(
		() => originalProps.preview?.displayMode?.mode || defaultProps.preview.displayMode!.mode,
		[]
	);
	const [displayMode, setDisplayMode] = useState<DisplayMode>(defaultDisplayMode);
	const previousDisplayMode = useRef<DisplayMode>(defaultDisplayMode);
	const [displayModeStatus, setDisplayModeStatus] = useState<DisplayModeStatus>("idle");

	const hover = useMediaQuery("(hover: hover)");
	const config = useConfig();
	const windowSize = useWindowSize(true);
	const linkRef = useRef<HTMLDivElement>(null);
	const previewRef = useRef<HTMLDivElement>(null);
	const [slideInAnimationState, setSlideInAnimationState] = useState<
		"opening" | "closing" | "finishedClosing"
	>("finishedClosing");

	useEffect(() => {
		return () => {
			previousDisplayMode.current = displayMode;
		};
	}, [displayMode]);

	useEffect(() => {
		if (previewRef.current === null) return;

		if (slideInAnimationState === "opening") {
			previewRef.current.style.pointerEvents = "auto";
			previewRef.current.animate([{ transform: "translateY(0)", opacity: 1 }], {
				duration: 150,
				fill: "forwards",
				easing: "ease-out",
			});
			// animation.onfinish = () => (previewRef.current.style.pointerEvents = "auto");
		} else {
			const animation = previewRef.current.animate(
				[{ transform: "translateY(2rem)", opacity: 0 }],
				{
					duration: 200,
					fill: "forwards",
					easing: "ease-out",
				}
			);
			animation.onfinish = () => {
				setSlideInAnimationState("finishedClosing");
				// @ts-ignore
				previewRef.current.style.pointerEvents = "none";
			};
		}
	}, [slideInAnimationState]);

	useEffect(() => {
		if (previewRef.current === null) return;

		if (noHoverToggle) {
			previewRef.current.animate([{ transform: "scale(1)", opacity: 1 }], {
				duration: 150,
				fill: "forwards",
				easing: "ease-out",
			});
		} else {
			previewRef.current.animate([{ transform: "scale(.90)", opacity: 0 }], {
				duration: 200,
				fill: "forwards",
				easing: "ease-out",
			});
		}
	}, [noHoverToggle]);

	useDoubleClick({
		ref: linkRef,
		delay: 300,
		onSingleClick: () => {
			if (hover) {
				window.open(originalProps.href, "_blank");
			} else {
				setNoHoverToggle((toggle) => !toggle);
			}
		},
		onDoubleClick: () => {
			if (!hover) {
				setNoHoverToggle(false);
				window.open(originalProps.href, "_blank");
			}
		},
	});
	let wrapperId = useId();
	let previewId = useId();

	const configurationPropsMap = {
		"mode.dataHoarder": {
			"preview.displayMode.image.preload": false,
		},
	};

	const { children, ...filteredProps } = originalProps;

	const props = config
		? merge(
				defaultProps,
				getConfiguredProps(
					filteredProps,
					configurationPropsMap,
					config,
					logger,
					"Link",
					filteredProps.id
				)
		  )
		: null;

	const modeQueue = useRef(
		["image", "iframe", "text", "ogImage"].filter(
			(mode) =>
				mode !==
				(originalProps.preview?.displayMode?.mode || defaultProps.preview.displayMode!.mode)
		)
	);

	const rotateDisplayModeFallback = useCallback(() => {
		if (props?.preview.displayMode?.disableFallback) return;

		// Updates to React state must be immutable
		const newQueue = structuredClone(modeQueue.current);
		if (newQueue.length === 0) return;

		modeQueue.current = newQueue;
		setDisplayMode(newQueue.shift() as DisplayMode);
	}, [props?.preview.displayMode?.disableFallback]);

	const [imagePreview, setImagePreview] = useState<ImagePreview>(null);

	const fetchScreenshot = useCallback(() => {
		if (!props) return;
		setDisplayModeStatus("loading");
		getWebsiteScreenshot(props.href)
			.then((res) => {
				if (!res.ok) {
					setDisplayModeStatus("error");
					rotateDisplayModeFallback();
					return;
				}
				return res.json();
			})
			.then((body) => {
				setImagePreview({ image: body.image, screenshotTakenAt: body.screenshotTakenAt });
				setDisplayModeStatus("success");
			})
			.catch(() => {
				setDisplayModeStatus("error");
				if (!props.preview.displayMode?.disableFallback) rotateDisplayModeFallback();
			});
	}, [props?.href, props?.preview.displayMode?.disableFallback]);

	useEffect(() => {
		if (
			!props?.preview.displayMode?.image?.preload ||
			displayMode !== "image" ||
			displayModeStatus !== "idle" ||
			imagePreview
		)
			return;

		fetchScreenshot();
	}, [props, displayMode]);

	useEffect(() => {
		// Sometimes when resizing the window we can get like 1000 of these events,
		// so attempt to wait for the user to stop resizing before calling the API
		const screenshotTimeout = setTimeout(() => fetchScreenshot(), 2500);

		return () => clearTimeout(screenshotTimeout);
	}, [windowSize]);

	useEffect(() => {
		if (!props || displayMode !== "iframe" || displayModeStatus !== "idle") return;

		setDisplayModeStatus("loading");
		isWebsiteFramable(props.href)
			.then((res) => res.json())
			.then((body) => {
				if (!body.isFrameAllowed) {
					setDisplayModeStatus("error");
					rotateDisplayModeFallback();
				} else {
					setDisplayModeStatus("success");
				}
			})
			.catch(() => {
				setDisplayModeStatus("error");
				rotateDisplayModeFallback();
			});
	}, [props, displayMode]);

	const [websiteSafety, setWebsiteSafety] = useState<
		| { status: "loading" | "error" }
		| { status: "success"; data: Awaited<ReturnType<typeof getWebsiteSafety>> }
	>({ status: "loading" });
	useEffect(() => {
		if (props?.href && websiteSafety.status === "loading") {
			getWebsiteSafety(props.href)
				.then((res) => {
					setWebsiteSafety({ status: "success", data: res });
				})
				.catch(() => setWebsiteSafety({ status: "error" }));
		}
	}, [props?.href]);

	const [textSummary, setTextSummary] = useState<
		| { status: "loading" | "error" }
		| { status: "success"; data: Awaited<ReturnType<typeof getWebsiteSummary>> }
	>({ status: "loading" });
	useEffect(() => {
		if (props && textSummary.status === "loading") {
			getWebsiteSummary(props.href)
				.then((res) => {
					setTextSummary({ status: "success", data: res });
				})
				.catch(() => setTextSummary({ status: "error" }));
		}
	}, [props?.href]);

	if (!props)
		return (
			<LinkText previewId={previewId} id={originalProps.id} href={originalProps.href}>
				{originalProps.children}
			</LinkText>
		);

	const elementTree = props.elementTree.elements;
	wrapperId = props.id || elementTree?.wrapper?.id || wrapperId;
	previewId = elementTree?.link?.id || previewId;

	return (
		<div
			data-neweb-link
			id={wrapperId}
			className="relative inline-block place-self-center"
			style={{
				WebkitTapHighlightColor: "transparent",
			}}
		>
			<span
				onPointerOver={() =>
					hover &&
					slideInAnimationState === "finishedClosing" &&
					setSlideInAnimationState("opening")
				}
				onPointerLeave={() => hover && setSlideInAnimationState("closing")}
			>
				<div
					className={
						"absolute bottom-[2rem] left-2/4 z-50 " +
						"h-[26rem] w-64 rounded-lg bg-slate-200 p-4 opacity-0 shadow-lg sm:w-72 md:h-[26rem] md:w-80 lg:h-96 lg:w-[45rem] " +
						"flex flex-1 flex-col items-center justify-center shadow-md shadow-black " +
						`${hover ? "pointer-events-none" : "scale-90"}`
					}
					id={previewId}
					ref={previewRef}
				>
					<rect
						className={
							"absolute right-0 top-0 z-50 h-4 w-4 cursor-pointer rounded-bl-md rounded-tr-md " +
							"bg-red-500 hover:brightness-75 active:brightness-50"
						}
						color="red"
						role="button"
						onPointerUp={() =>
							hover ? setSlideInAnimationState("closing") : setNoHoverToggle(false)
						}
					/>
					{/** This is to make the preview hitbox bigger so it doesn't glitch when hovering */}
					<div className="absolute -right-5 top-0 z-40 inline-block h-12 w-12" />
					<div
						onPointerDown={(e) => e.preventDefault()}
						onPointerUp={() =>
							setDisplayMode((mode) =>
								mode === "textSummary" ? previousDisplayMode.current : "textSummary"
							)
						}
						role="button"
						className="absolute -right-14 top-0 z-50"
					>
						<LinkSummaryButton toggled={displayMode === "textSummary"} />
					</div>

					{displayMode === "textSummary" ? (
						<div className="flex flex-col items-center justify-center overflow-auto pb-3 text-center text-slate-800">
							<h1 className="mb-4 text-3xl font-bold">Summary</h1>
							{textSummary.status === "loading" ? (
								<AiOutlineLoading3Quarters className="h-10 w-10 animate-spin text-black" />
							) : textSummary.status === "error" ? (
								<span className="flex h-full w-full flex-col items-center justify-center text-red-500">
									<MdErrorOutline className="h-10 w-10" />
									<span>Something went wrong</span>
								</span>
							) : (
								textSummary.status === "success" && (
									<div className="flex h-[80%] w-full flex-col gap-2 overflow-auto text-sm">
										<Markdown
											components={{
												h1(props) {
													const { children } = props;
													return (
														<h1 className="text-2xl font-bold">
															{children}
														</h1>
													);
												},
												h2(props) {
													const { children } = props;
													return (
														<h2 className="text-xl font-bold">{children}</h2>
													);
												},
												p(props) {
													const { children } = props;
													return <p className="text-sm">{children}</p>;
												},
												ol(props) {
													const { children } = props;
													return (
														<ol className="flex list-inside list-decimal flex-col gap-3 text-start font-semibold">
															{children}
														</ol>
													);
												},
												ul(props) {
													const { children } = props;
													return (
														<ul className="flex list-inside list-disc flex-col gap-1 text-start font-semibold">
															{children}
														</ul>
													);
												},
											}}
										>
											{textSummary.data.summary}
										</Markdown>
									</div>
								)
							)}
						</div>
					) : (
						<div className="flex h-full w-full flex-col items-center">
							<div className="flex h-full w-full flex-col items-center justify-center">
								{displayModeStatus === "loading" || displayModeStatus === "idle" ? (
									<AiOutlineLoading3Quarters className="h-10 w-10 animate-spin text-black" />
								) : displayModeStatus === "error" ? (
									<span className="flex h-full w-full flex-col items-center justify-center text-red-500">
										<MdErrorOutline className="h-10 w-10" />
										<span>Something went wrong</span>
									</span>
								) : (
									<>
										<LinkPreview
											displayMode={displayMode}
											displayModeStatus={displayModeStatus}
											imagePreview={imagePreview}
											href={props.href}
										/>
										<div className="flex w-full items-start justify-between text-xs text-slate-500">
											<WebsiteSafety websiteSafety={websiteSafety} />
											{displayMode === "iframe" &&
												displayModeStatus === "success" && (
													<span className="flex items-center gap-1.5">
														{hover ? (
															<HiCursorClick className="text-sm" />
														) : (
															<MdTouchApp className="text-sm" />
														)}
														Interactive preview
													</span>
												)}
											{displayMode === "image" &&
												displayModeStatus === "success" &&
												imagePreview !== null && (
													<ImageTime imagePreview={imagePreview} />
												)}
										</div>
									</>
								)}
							</div>
						</div>
					)}
					<a
						href={props.href}
						className={
							"mt-auto w-full rounded-full bg-blue-500 p-1 text-center text-sm font-bold text-white " +
							"hover:brightness-95 active:brightness-90"
						}
					>
						Visit Website
					</a>

					<PoweredByNeweb />
				</div>
				{slideInAnimationState !== "finishedClosing" && (
					// This is to make the preview hitbox bigger so it doesn't glitch when hovering
					<div className="absolute -right-10 bottom-4 z-40 h-16 w-16" />
				)}
				<LinkText href={props.href} previewId={previewId} ref={linkRef}>
					{children}
				</LinkText>
			</span>
		</div>
	);
};

export default Link;
