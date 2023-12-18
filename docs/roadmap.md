# Planned Features and Updates for Version 1.0.0

### General

-   Full WCAG 2.1 AAA support across all components

### Configuration file

-   Support setting configuration options using the global object (window in browsers)

-   Support setting configuration options using a singleton class

-   Support using configuration files with a Rollup plugin

-   Support using configuration files with an esbuild plugin

### Docs

-   Add the size of every component in the docs and the sizes that some props add when used

### Link component

-   Let developers customize the animation of the `preview.scroll` prop.

-   Allow screenshots to be prerendered to improve loading speed when `preview.displayMode` is set to
    "image"

-   Add `preview.summaryText` option to generate a compact summary of the webpage using AI

-   Add a `skeleton` prop to use a loading skeleton, along with optional options
    to customize it

-   Add optional, lazily loaded, native integration with Sentry to better report component errors
    like dead links

-   Add optional feedback button to allow users to send feedback about the link component to neweb
    (turned off by default)

-   Add option to show gif instead of a single frame in the preview

-   Add a 'video' option to the preview so the user can see a 15-second video of the link as the preview

-   Integrate with Tailwind CSS to automatically identify when dark mode is turned on using the class method

## Features and updates in discussion

### General

-   Export [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) to use in some properties instead of string literals. [See the RFC]()

### Link component

-   Add a `"smart"` prop value to `preview.preload` which preloads the links the user is most likely
    to preview based on the most previewed links, in the future we could also use a machine learning
    model to predict this, this data would be stored in our servers. [See the RFC]()

-   Gaze control: open links when users look at them by using the device's camera

## Features and updates waiting browser support

### Link component

-   Switch to using the [portal element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/portal) instead of an iframe in supported browsers
