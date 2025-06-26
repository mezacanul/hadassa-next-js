import { CDN } from "@/config/cdn";
import { useCita } from "@/pages/citas/[citaID]";
import { loadHook } from "@/utils/lattice-design";
import { formatCamaID } from "@/utils/main";
import { Button, Heading, HStack, Image, Spinner, Text, VStack } from "@chakra-ui/react";
import { useRouter as useNextNav } from "next/navigation";
import { useEffect, useState } from "react";
import SelectCama from "./SelectCama";
import axios from "axios";

export default function ImagenesTicket({ cita }) {
    const [loading, setLoading] = loadHook("useLoader")
    const NextNav = useNextNav();
    // const [cita] = useCita();

    useEffect(() => {
        console.log(cita);
    }, [])

    return (
        <VStack w={"100%"} gap={"2rem"} align={"start"}>
            <HStack alignItems={"start"} w={"100%"} gap={"2rem"} justifyContent={"space-between"}>
                {/* <VStack alignItems={"start"} gap={"2rem"} w={"100%"}> */}
                    <Image
                        shadow={"sm"}
                        rounded={"md"}
                        w={"10rem"}
                        src={`${CDN}/img/servicios/${cita.servicio_foto}`}
                    />
                {/* </VStack> */}
                <Lashista
                    lashistaID={cita.lashista_id}
                    nombre={cita.lashista}
                    foto={cita.lashista_foto}
                    camaID={cita.cama_id}
                    citaID={cita.cita_ID}
                />
            </HStack>
            <Heading
                onClick={() => {
                    setLoading(true)
                    NextNav.push(`/servicios/${cita.servicio_id}`)
                }}
                _hover={{
                    textDecor: "underline",
                    cursor: "pointer"
                }}
                color={"pink.700"}
                // borderWidth={"0 0 2px"}
                borderColor={"pink.700"}
                size={"2xl"}
            >
                {cita.servicio}
            </Heading>
        </VStack>
    );
}

function Lashista({ lashistaID, foto, nombre, camaID, citaID }) {
    const [enabled, setEnabled] = useState(false)
    const [cama, setCama] = useState([])
    const [status, setStatus] = useState("iddle")

    function actualizarCama() {
        console.log(citaID, cama[0]);
        const send = {
            column: "cama_id",
            value: cama[0]
        }
        setStatus("updating")

        axios.patch((`/api/citas/${citaID}`), send)
            .then((axiosResp) => {
                console.log(axiosResp);
                const resp = axiosResp.data
                if (resp.success && resp.affectedRows == 1) {
                    setEnabled(false)
                    setStatus("success")
                } else {
                    // setEnabled(true)
                    setStatus("error")
                }
            })

        // axios.patch(`/api/camas?lashista=${lashistaID}`)
        //     .then((axiosResp) => {
        //         console.log(axiosResp);
        //     })
    }

    return (
        <VStack h={"100%"} justifyContent={"start"} w={"100%"} alignItems={"end"} gap={"0.5rem"}>
            <Image
                shadow={"sm"}
                rounded={"full"}
                w={"3rem"}
                src={`${CDN}/img/lashistas/${foto}`}
            />
            <VStack w={"80%"} align={"end"} ms={"1rem"}>
                <Heading
                    size={"lg"}
                    fontWeight={700}
                >
                    {nombre}
                </Heading>
                <SelectCama
                    lashistaID={lashistaID}
                    camaID={camaID}
                    setEnabled={setEnabled}
                    cama={cama}
                    setCama={setCama}
                    status={status}
                    setStatus={setStatus}
                />
                {status != "updating" && (
                    <Button
                        disabled={!enabled}
                        bg={"pink.500"}
                        w={"100%"}
                        size={"sm"}
                        onClick={actualizarCama}
                    >
                        Actualizar
                    </Button>
                )}
            </VStack>
            {status == "updating" && <Spinner size={"md"} color={"pink.500"} />}
            {status == "success" && <Text color={"green"}>¡Actualizado!</Text>}
            {status == "error" && <Text color={"red"}>Error</Text>}
        </VStack>
    );
}