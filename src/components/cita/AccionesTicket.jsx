import { useCita } from "@/pages/citas/[citaID]";
import {
    Button,
    Grid,
    Heading,
    HStack,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const buttonStyles = {
    fontWeight: 700,
    shadow: "sm",
    variant: "subtle",
};

export default function AccionesTicket({cita, setCita}) {
    // const [cita, setCita] = useCita();
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    function confirmarCita() {
        setLoadingUpdate(true);
        axios
            .patch(`/api/citas/${cita.cita_ID}`, { column: "status", value: 2 })
            .then((updateResp) => {
                console.log(updateResp);
                const resp = updateResp.data;
                if (resp.success && resp.affectedRows == 1) {
                    setCita({ ...cita, status: 2 });
                } else {
                    alert("Error");
                }
                setLoadingUpdate(false);
            });
    }

    function cancelarCita() {
        setLoadingUpdate(true);
        axios
            .patch(`/api/citas/${cita.cita_ID}`, { column: "status", value: 0 })
            .then((updateResp) => {
                console.log(updateResp);
                const resp = updateResp.data;
                if (resp.success && resp.affectedRows == 1) {
                    setCita({ ...cita, status: 0 });
                } else {
                    alert("Error");
                }
                setLoadingUpdate(false);
            });
    }

    function marcarComoPagada() {
        setLoadingUpdate(true);
        axios
            .patch(`/api/citas/${cita.cita_ID}`, { column: "pagado", value: 1 })
            .then((updateResp) => {
                console.log(updateResp);
                const resp = updateResp.data;
                if (resp.success && resp.affectedRows == 1) {
                    setCita({ ...cita, pagado: 1 });
                } else {
                    alert("Error");
                }
                setLoadingUpdate(false);
            });
    }

    return (
        <VStack w={"100%"} gap={"1rem"} align={"center"}>
            {loadingUpdate && (
                <Spinner borderWidth={"3px"} size={"xl"} color={"pink.500"} />
            )}
            {!loadingUpdate && (
                <>
                    <Grid
                        gap={"1rem"}
                        gridTemplateColumns={"1fr 1fr"}
                        w={"100%"}
                    >
                        {cita.status != 0 && (
                            <Button
                                onClick={cancelarCita}
                                {...buttonStyles}
                                colorPalette={"orange"}
                            >
                                Cancelar
                            </Button>
                        )}
                        {cita.status != 2 && cita.status != 0 && (
                            <Button
                                onClick={confirmarCita}
                                {...buttonStyles}
                                colorPalette={"blue"}
                            >
                                Confirmar
                            </Button>
                        )}
                    </Grid>

                    {cita.pagado != 1 && cita.status != 0 && (
                        <Button
                            onClick={marcarComoPagada}
                            {...buttonStyles}
                            colorPalette={"green"}
                            w={"100%"}
                        >
                            Marcar como Pagada
                        </Button>
                    )}
                </>
            )}
        </VStack>
    );
}
