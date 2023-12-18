import { NewebConfig } from "../types";
import { WebsiteAnalyzer } from "@termoi/neweb-api-types";
import getBrowserQueryParams from "./getBrowserQueryParams";

async function getWebsiteSummary(
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
): Promise<WebsiteAnalyzer.SummaryApiResponse> {
	const result = await fetch(
		"https://dev.api.newebjs.com/v1/website/summary?" + (await getBrowserQueryParams(url, options)),
		{
			headers: {
				"X-Api-Key": "1FGKLJ%63042$#09zz864384r4JFDSMLZxkozxc3OR43#45%29@8xcv0xzz95043433JKL2",
			},
		}
	);
	if (!result.ok) throw "Something went wrong";
	return result.json();
}

export default getWebsiteSummary;
