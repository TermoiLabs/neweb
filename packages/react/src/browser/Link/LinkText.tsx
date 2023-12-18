import React, { forwardRef, Children } from "react";
import LinkUnderline from "./LinkUnderline";
import { Logger, NewebError } from "@termoi/neweb-local-utils";
import { LinkChildren } from "./Link";

interface LinkTextProps {
	href: string;
	previewId: string;
	children: LinkChildren;
	id?: string;
}

const logger = new Logger("react");
const LinkText = forwardRef<HTMLSpanElement, LinkTextProps>(function LinkText(
	{ href, previewId, children, id = "Not found" },
	ref
) {
	const invalidChildTypeError = new NewebError(
		`Invalid or missing child for the 'Link' component, expected either a string or an anchor tag (Link id: ${id})`,
		"InvalidLinkChildType"
	);

	if (!children) throw invalidChildTypeError;

	return (
		<span className="relative top-2 inline-block" ref={ref}>
			<span
				aria-describedby={previewId}
				className={
					"inline-block w-fit cursor-pointer text-blue-500 no-underline transition-all duration-150 hover:brightness-50"
				}
			>
				{Children.map(children, (child) => {
					if (typeof child === "object") {
						if (!child || child.type !== "a") {
							throw invalidChildTypeError;
						}
						if (child.props.href !== href) {
							throw new NewebError(
								"When using an anchor tag as the child of the 'Link' component, the 'href' value must be " +
									"equal in both 'Link' and the anchor tag. \nAlternatively, you may use a string and we'll handle the rest for you " +
									`(Link id: ${id})`,
								"InvalidLinkChildElement"
							);
						}

						return child;
					}

					if (typeof child !== "string") {
						throw invalidChildTypeError;
					} else {
						if (child === "")
							logger.warn(`Empty string being used in anchor tag (Link id: ${id})`);
					}

					return (
						<a onClick={(e) => e.preventDefault()} href={href}>
							{child}
						</a>
					);
				})}
			</span>
			<LinkUnderline />
		</span>
	);
});

export default LinkText;
