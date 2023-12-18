function isWebsiteFramable(url: string) {
	return fetch(
		`https://dev.api.newebjs.com/v1/website/frame-policy?sourceUrl=${window.location.href}&targetUrl=${url}`,
		{
			headers: {
				"X-Api-Key": "1FGKLJ%63042$#09zz864384r4JFDSMLZxkozxc3OR43#45%29@8xcv0xzz95043433JKL2",
			},
		}
	);
}

export default isWebsiteFramable;
