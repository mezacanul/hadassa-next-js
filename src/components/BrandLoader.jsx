import { Skeleton } from "@chakra-ui/react";

export default function BrandLoader() {
    return (
        <Skeleton
            h={"100%"}
            w={"100%"}
            variant={"shine"}
        />
    );
}
