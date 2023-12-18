# Link Component

## Usage

```
import { Link } from "@termoi/neweb-react";

export default function Home() {
	return (
		<main>
			<p>
				This is just an{" "}
				<Link preview={{ displayMode: { mode: "image" } }} href="https://google.com">
					example
				</Link>{" "}
				showing how the link component works
			</p>
		</main>
	);
}
```

## Props

<!-- TODO -->
<!-- `preview.scroll` (default: "animated"):

-   Number between 0 and 1: a percentage of the maximum scroll position (e.g: 0.5 = 50%)
-   Percentage string (e.g: "30%"): a percentage of the maximum scroll position
-   Number greater than 1: the absolute scroll position
-   "animated": a scroll animation will play on loop
-   "smart": the [scroll algorithm]("#scroll-algorithm") will be used
    to automatically detect the best scroll position -->

`preview.displayMode.mode` (default: "image"):

-   "iframe": use an iframe to render the preview (disabled in dataHoarder and performance mode).  
    Will switch to image as a fallback if framing isn't allowed.
-   "image": take a screenshot (quality = 50 in dataHoarder mode, and quality = 70 in performance mode)
<!-- -   "text": select the text on the page you wish to display -->

`preview.showReadingTime` (default: false):

-   true: shows the estimated reading time of the page

`preview.displayMode.options.iframe.skipIframeCheck` (default: false):

-   true: Skips checking if the website to be framed allows it. Doing this check
    is the only way to avoid most iframe errors since browsers don't have an error
    event for iframes.  
    Only enable this if you know beforehand a website will allow you to frame it  
    and you're confident they won't change their frame policy.  
    Note: enabling this option will save a significant amount of loading time.

`preview.displayMode.preventFallback` (default: false, dataHoarder: true)

-   true: Prevents the component from trying to use other preview methods when the
    current one selected fails
