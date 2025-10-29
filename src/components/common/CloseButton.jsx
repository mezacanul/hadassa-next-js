import { Text } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

export default function CloseButton({
    onClick,
    size = "sm",
    position = { top: "0.5rem", right: "0.5rem" },
}) {
    return (
        <Text
            position={"absolute"}
            top={position.top}
            right={position.right}
            cursor={"pointer"}
            onClick={onClick}
            color={"black"}
            opacity={0.5}
            fontSize={size}
        >
            <FaTimes />
        </Text>
    );
}
