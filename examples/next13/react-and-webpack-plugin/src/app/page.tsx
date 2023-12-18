import { Link } from "@termoi/neweb-react";

export default function Home() {
	return (
		<main className="flex h-screen w-screen items-center justify-center p-6 text-white">
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
