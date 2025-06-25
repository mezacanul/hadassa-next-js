import { CDN } from "@/config/cdn";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Heading, HStack, Image, Spinner } from "@chakra-ui/react";
import { FotosDialog } from "./FotosDialog";

export default function FotosCejas({ clientaID }) {
    const [fotosCejas, setFotosCejas] = useState(null);
    const [fotoCeja, setFotoCeja] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (clientaID) {
            if (!loading) {
                setFotosCejas(null);
                setLoading(true);
            }
            axios
                .get(`/api/fotos_cejas?clientaID=${clientaID}`)
                .then((fcResp) => {
                    setFotosCejas(fcResp.data);
                    setLoading(false);
                    console.log(fcResp.data);
                });
        }
    }, [clientaID]);

    return (
        <Box>

            <HStack gap={"1rem"} mb={"1.5rem"}>
                {loading && (
                    <Spinner borderWidth={"3px"} size={"xl"} color={"blue.500"} />
                )}
                {fotosCejas &&
                    !loading &&
                    fotosCejas.map((fotoCeja, idx) => {
                        return (
                            <Image
                                onClick={() => {
                                    setFotoCeja(fotoCeja.foto);
                                    setOpen(true);
                                }}
                                key={idx}
                                transition={hoverStyles.transition}
                                _hover={{ ...hoverStyles.onHover }}
                                objectFit={"cover"}
                                shadow={"sm"}
                                rounded={"md"}
                                w={"5rem"}
                                h={"5rem"}
                                src={`${CDN}/img/cejas/${fotoCeja.foto}`}
                            />
                        );
                    })}
                {!loading && (
                    <AddButton
                        onClick={() => {
                            setFotoCeja(null);
                            setOpen(true);
                        }}
                    />
                )}
            </HStack>
            
            <FotosDialog
                open={open} 
                setOpen={setOpen} 
                clientaID={clientaID} 
                fotosCejas={fotosCejas}
                setFotosCejas={setFotosCejas}
                fotoCeja={fotoCeja}
                setFotoCeja={setFotoCeja}
            />
        </Box>
    );
}

function AddButton({ onClick }) {
    return (
        <HStack
            onClick={onClick}
            h={"5rem"}
            w={"5rem"}
            rounded={"md"}
            border={"2px solid gray"}
            justifyContent={"center"}
            alignItems={"center"}
            transition={hoverStyles.transition}
            _hover={{ ...hoverStyles.onHover }}
        >
            <Heading color={"gray"} size={"3xl"}>
                +
            </Heading>
        </HStack>
    );
}

const hoverStyles = {
    transition: "all ease 0.3s",
    onHover: { cursor: "pointer", transform: "scale(1.1)" },
};
