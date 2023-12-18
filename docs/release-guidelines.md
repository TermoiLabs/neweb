# Release guidelines

## Semantic versioning

All code under this repository follows the [semver 2.0.0 specification](https://semver.org/).

## Breaking changes

We consider any change that modifies a public interface in any way whatsoever to be a breaking change.
In components, the public interface is usually considered the props users can pass to a component.

If, for some reason, your code relies in directly accessing the private interface (e.g.: the internal code of a component, also called its implementation) it will likely break (without any warnings) after any patch, minor, major, or any other type of version as specified by semver 2.0.0.

Therefore, similar to the practices most libraries implictly follow, we recommend you only write production code using the public interface.
