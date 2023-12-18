import { Inter } from "next/font/google";
import "@/app/styles/globals.css";
import { ReactNode } from "react";
import "@termoi/neweb-react/styles";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
