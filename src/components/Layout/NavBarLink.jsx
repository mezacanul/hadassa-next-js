import { loadHook } from "@/utils/lattice-design";
import { Link } from "@chakra-ui/react";
import { useRouter as useNextNav } from "next/navigation";

export default function NavBarLink({ title, pathname }) {
    const [_, setLoading] = loadHook("useLoader");
    const NextNav = useNextNav();
    return (
        <Link
            fontSize={"sm"}
            onClick={() => {
                setLoading(true);
                NextNav.push(pathname);
            }}
            color={"#ec4899"}
        >
            {title}
        </Link>
    );
}
