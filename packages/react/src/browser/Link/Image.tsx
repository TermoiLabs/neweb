import { BaseComponentProps } from "@termoi/neweb-local-utils/types";
import { ElementTreeReact } from "../../types";
import { FunctionComponent } from "react";

interface ImageProps extends BaseComponentProps<ElementTreeReact> {}

const Image: FunctionComponent<ImageProps> = (originalProps) => {
	return <img></img>;
};
