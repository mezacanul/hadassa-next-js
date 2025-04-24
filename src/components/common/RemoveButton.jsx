import { Text } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa6";

export default function RemoveButton({onClick}) {
    return (
        <Text
            opacity={"0.35"}
            color={"white"}
            fontSize={"xl"}
            position={"absolute"}
            right={"1rem"}
            top={"1rem"}
            transition={"all ease 0.3s"}
            onClick={onClick}
            _hover={{
                opacity: 1,
                cursor: "pointer",
                transform: "scale(1.05)",
            }}
        >
            <FaTrash />
        </Text>
    );
}
