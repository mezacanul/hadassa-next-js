import FotoServicioInput from "@/components/servicio/FotoServicioInput";
import ServicioForm from "@/components/servicio/ServicioForm";
import { loadHook } from "@/utils/lattice-design";
import { Heading, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Servicio() {
    const router = useRouter();
    const { servicioID } = router.query;
    const [loading, setLoading] = loadHook("useLoader")
    const [servicio, setServicio] = useState(null)
    const [title, setTitle] = useState("")

    useEffect(()=>{
        if(router.isReady){
            axios
                .get(`/api/servicios/${servicioID}`)
                .then((servResp)=>{
                    console.log(servResp.data);
                    setServicio(servResp.data)
                    setTitle(servResp.data.servicio)
                    setLoading(false)
                })
        }
    }, [router.isReady])

    return (
        <VStack w={"100%"} alignItems={"start"} mb={"4rem"}>
            <Heading 
                color={"pink.600"} 
                size={"3xl"}
                mb={"1rem"}
            >
                {title}
            </Heading>
            
            {servicio && <FotoServicioInput servicio={servicio}/>}
            {servicio && <ServicioForm servicio={servicio} setTitle={setTitle}/>}
        </VStack>
    );
}
