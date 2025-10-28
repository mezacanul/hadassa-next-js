import { Text } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

export default function CloseButton({ onClick }) {
    return (
        <Text
            position={"absolute"}
            top={"0.5rem"}
            right={"0.5rem"}
            cursor={"pointer"}
            onClick={onClick}
            color={"black"}
            opacity={0.5}
            fontSize={"sm"}
        >
            <FaTimes />
        </Text>
    );
}
