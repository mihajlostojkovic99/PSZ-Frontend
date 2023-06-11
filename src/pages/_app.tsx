import { inter } from "@/lib/utils/fonts"
import "@/styles/globals.css"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<div className={`min-h-screen ${inter.className}`}>
			<Component {...pageProps} />
		</div>
	)
}
