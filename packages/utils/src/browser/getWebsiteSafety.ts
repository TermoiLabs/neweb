import { WebsiteAnalyzer } from "@termoi/neweb-api-types";

const getWebsiteSafety = async (url: string): Promise<WebsiteAnalyzer.WebsiteSafetyResponse> => {
	const res = await fetch(`https://dev.api.newebjs.com/v1/website/safety?url=${url}`, {
		headers: {
			"X-Api-Key": "1FGKLJ%63042$#09zz864384r4JFDSMLZxkozxc3OR43#45%29@8xcv0xzz95043433JKL2",
		},
	});
	if (!res.ok) throw "Something went wrong";
	return res.json();
};

export default getWebsiteSafety;
