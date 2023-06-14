import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

interface NavbarProps {
	// children: React.ReactNode
}

const Navbar: React.FC<NavbarProps> = ({}) => {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<Link href="/" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>

				{/* <NavigationMenuItem>
					<Link href="/two" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>Zadatak 2</NavigationMenuLink>
					</Link>
				</NavigationMenuItem> */}
			</NavigationMenuList>
		</NavigationMenu>
	)
}

export default Navbar
