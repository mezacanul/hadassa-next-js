import { loadHook } from "@/utils/lattice-design";
import { Link, Text } from "@chakra-ui/react";
import { useRouter as useNextNav } from "next/navigation";

export default function NavbarItem({ title, pathname }) {
    const [_, setLoading] = loadHook("useLoader");
    const NextNav = useNextNav();
    return (
        <Text
            fontSize={"md"}
            // fontWeight={600}
        >
            <Link
                onClick={() => {
                    setLoading(true);
                    NextNav.push(pathname);
                }}
                color={"#ec4899"}
            >
                {title}
            </Link>
        </Text>
    );
}
