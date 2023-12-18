import { detect } from "detect-browser";
import { NewebConfig } from "../types";
import { WebsiteAnalyzer } from "@termoi/neweb-api-types";

function isWebpSupported() {
	return new Promise((resolve) => {
		var image = new Image();

		image.onload = image.onerror = function () {
			resolve(image.width === 2);
		};

		image.src =
			"data:image/webp;base64,UklGRkAAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAAAFZQOCAYAAAAMAEAnQEqAQABAAIANCWkAANwAP77/VAA";
	});
}

function isAvifSupported() {
	return new Promise((resolve) => {
		var image = new Image();

		image.onload = image.onerror = function () {
			resolve(image.width === 2);
		};
		image.src =
			"data:image/avif;base64,AAAAHGZ0eXBtaWYxAAAAAG1pZjFhdmlmbWlhZgAAAPFtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAHmlsb2MAAAAABEAAAQABAAAAAAEVAAEAAAAeAAAAKGlpbmYAAAAAAAEAAAAaaW5mZQIAAAAAAQAAYXYwMUltYWdlAAAAAHBpcHJwAAAAUWlwY28AAAAUaXNwZQAAAAAAAAABAAAAAQAAABBwYXNwAAAAAQAAAAEAAAAVYXYxQ4EgAAAKBzgABpAQ0AIAAAAQcGl4aQAAAAADCAgIAAAAF2lwbWEAAAAAAAAAAQABBAECg4QAAAAmbWRhdAoHOAAGkBDQAjITFkAAAEgAAAB5TNHFcJNkjMsTkg==";
	});
}

async function getBrowserQueryParams(
	url: string,
	options: {
		newebMode?: NewebConfig["mode"];
		screenshotMode?: WebsiteAnalyzer.ScreenshotApiParams["mode"];
		browser?: WebsiteAnalyzer.ScreenshotApiParams["browser"];
		pixelRatio?: WebsiteAnalyzer.ScreenshotApiParams["pixelRatio"];
		format?: WebsiteAnalyzer.ScreenshotApiParams["format"];
		width?: WebsiteAnalyzer.ScreenshotApiParams["width"];
		height?: WebsiteAnalyzer.ScreenshotApiParams["height"];
		locale?: WebsiteAnalyzer.ScreenshotApiParams["locale"];
		darkMode?: WebsiteAnalyzer.ScreenshotApiParams["darkMode"];
		reducedMotion?: WebsiteAnalyzer.ScreenshotApiParams["reducedMotion"];
		userAgent?: WebsiteAnalyzer.ScreenshotApiParams["userAgent"];
	} = {}
) {
	const {
		newebMode,
		screenshotMode,
		pixelRatio,
		format,
		width,
		height,
		locale,
		darkMode,
		reducedMotion,
		userAgent,
	} = options;
	let browser = options.browser;

	if (!browser) {
		const detectedBrowser = detect()?.name || "chrome";
		browser = ["chrome", "chromium-webview"].includes(detectedBrowser)
			? "chrome"
			: ["edge", "edge-ios", "edge-chromium"].includes(detectedBrowser)
			? "edge"
			: ["opera", "opera-mini"].includes(detectedBrowser)
			? "opera"
			: ["firefox", "fxios"].includes(detectedBrowser)
			? "firefox"
			: "chrome";
	}

	return (
		`url=${url}&` +
		`mode=${screenshotMode || newebMode === "dataHoarder" ? "standard" : "performance"}&` +
		`browser=${browser}&` +
		`pixelRatio=${pixelRatio || window.devicePixelRatio}&` +
		`format=${
			format || (await isAvifSupported()) ? "avif" : (await isWebpSupported()) ? "webp" : "png"
		}&` +
		`width=${width || window.innerWidth}&` +
		`height=${height || window.innerHeight}&` +
		`locale=${locale || navigator.language}&` +
		`darkMode=${
			typeof darkMode === "boolean"
				? darkMode
				: window.matchMedia("(prefers-color-scheme: dark)").matches
		}&` +
		`reducedMotion=${
			typeof reducedMotion === "boolean"
				? reducedMotion
				: window.matchMedia("(prefers-reduced-motion: reduce)").matches
		}&` +
		`userAgent=${userAgent || navigator.userAgent}`.replaceAll(
			new RegExp(";", "g"),
			encodeURIComponent(";")
		)
	);
}

export default getBrowserQueryParams;
