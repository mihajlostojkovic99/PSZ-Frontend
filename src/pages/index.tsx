import { inter } from "@/lib/utils/fonts"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import Head from "next/head"

export default function Home() {
	const [loading, setLoading] = useState(false)
	return (
		<main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
			<Head>
				<title>Pronalaženje skrivenog znanja - Analiza nekretnina u Srbiji</title>
				<meta property="og:title" content="Pronalaženje skrivenog znanja - Analiza nekretnina u Srbiji" key="title" />
			</Head>
			<div>
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
					Pronalaženje skrivenog znanja - Analiza nekretnina u Srbiji
				</h1>
				<p className="leading-7 [&:not(:first-child)]:mt-6">
					U ovom projektu će biti predstavljena analiza prikupljenih podataka, vizuelizacija istih kao i implementacija
					regresije i klasifikacije.
				</p>
				<h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
					Stranice sa zadacima
				</h2>
				<div className="flex mt-10 gap-4">
					<Link
						href="/two"
						className={`${buttonVariants({ variant: "outline" })} w-40 border-gray-400`}
						onClick={() => setLoading(true)}
					>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Zadatak 2
					</Link>
				</div>
			</div>
		</main>
	)
}
