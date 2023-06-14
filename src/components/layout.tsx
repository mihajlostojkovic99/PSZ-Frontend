import { inter } from "@/lib/utils/fonts"
import Navbar from "./navbar"

interface LayoutProps {
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className={`min-h-screen ${inter.className}`}>
			<Navbar />
			<main>{children}</main>
		</div>
	)
}

export default Layout
