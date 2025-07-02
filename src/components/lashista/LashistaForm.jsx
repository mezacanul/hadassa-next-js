import {
    Box,
    Button,
    Grid,
    HStack,
    Input,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LashistaForm({ lashista }) {
    const [actualizarStatus, setActualizarStatus] =
        useState("iddle");
    const [lashistaForm, setLashistaForm] = useState({
        nombre: "",
        email: "",
        password: "",
        horarioLV: null,
        horarioSBD: null,
    });

    useEffect(() => {
        setLashistaForm({
            nombre: lashista.nombre,
            email: lashista.email,
            password: lashista.password,
            // Array of [ "HH:mm - HH:mm", ... ]
            horarioLV: JSON.parse(lashista.horarioLV),
            // Array - [ "HH:mm", "HH:mm" ]
            horarioSBD: lashista.horarioSBD
                .split("-")
                .map((hora) => hora.replace(" ", "")),
        });
    }, []);

    useEffect(() => {
        console.log(lashistaForm);
    }, [lashistaForm]);

    function actualizarServicio() {
        setActualizarStatus("updating");
        const send = {
            ...lashistaForm,
            horarioLV: JSON.stringify(
                lashistaForm.horarioLV
            ),
            horarioSBD: `${lashistaForm.horarioSBD[0]} - ${lashistaForm.horarioSBD[1]}`,
        };
        console.log("lashista", lashista);
        console.log("send", send);
        axios
            .patch(`/api/lashistas/${lashista.id}`, {
                type: "batch",
                payload: send,
            })
            .then((axiosResp) => {
                console.log(axiosResp);
                setActualizarStatus("success");
            });
    }

    // const horariosLV = JSON.parse(lashista.horarioLV)
    // const horarioSBD = lashista.horarioSBD.split("-").map((hora) => (hora.replace(" ", "")))

    return (
        <VStack
            alignItems={"start"}
            w={"100%"}
            gap={"1.5rem"}
            mb={"5rem"}
        >
            <Grid
                w={"100%"}
                gridTemplateColumns={"1fr 1fr"}
                gap={"1rem"}
            >
                <InputGroup
                    label={"Nombre"}
                    value={lashistaForm.nombre}
                    onChange={(e) => {
                        setLashistaForm({
                            ...lashistaForm,
                            nombre: e.target.value,
                        });
                    }}
                />
                <InputGroup
                    label={"Correo"}
                    value={lashistaForm.email}
                    onChange={(e) => {
                        setLashistaForm({
                            ...lashistaForm,
                            email: e.target.value,
                        });
                    }}
                />
                <InputGroup
                    label={"Contraseña"}
                    value={lashistaForm.password}
                    onChange={(e) => {
                        setLashistaForm({
                            ...lashistaForm,
                            password: e.target.value,
                        });
                    }}
                />
                {/* <InputGroup label={"Rol"} value={lashista.rol} /> */}
            </Grid>

            {/* Horario LV Selector  */}
            <VStack
                alignItems={"start"}
                w={"100%"}
            >
                <Text
                    mb={"0.5rem"}
                    fontWeight={600}
                    fontSize={"0.8rem"}
                >
                    {"Horario de Lunes a Viernes"}
                </Text>
                <VStack
                    w={"100%"}
                    gap={"1.5rem"}
                >
                    {lashistaForm.horarioLV &&
                        lashistaForm.horarioLV.map(
                            (horarios, i) => (
                                <TimeSelector
                                    label={
                                        "Seleccionar hora"
                                    }
                                    key={i}
                                    index={i}
                                    horarios={horarios}
                                    lashistaForm={
                                        lashistaForm
                                    }
                                    setLashistaForm={
                                        setLashistaForm
                                    }
                                />
                            )
                        )}
                </VStack>
            </VStack>

            {/* Horario SBD Selector  */}
            <VStack
                alignItems={"start"}
                w={"100%"}
            >
                <Text
                    mb={"0.5rem"}
                    fontWeight={600}
                    fontSize={"0.8rem"}
                >
                    {"Horario Sábado"}
                </Text>
                <HStack w={"100%"}>
                    {lashistaForm.horarioSBD &&
                        lashistaForm.horarioSBD.map(
                            (hora, i) => (
                                <TimePickMUI
                                    key={i}
                                    label={
                                        "Seleccionar hora"
                                    }
                                    value={hora}
                                    loc={{
                                        i,
                                        period: "SBD",
                                    }}
                                    lashistaForm={
                                        lashistaForm
                                    }
                                    onChange={(
                                        newValue
                                    ) => {
                                        const newHorario =
                                            lashistaForm.horarioSBD;
                                        newHorario[i] =
                                            newValue.format(
                                                "HH:mm"
                                            );
                                        setLashistaForm({
                                            ...lashistaForm,
                                            horarioSBD:
                                                newHorario,
                                        });
                                    }}
                                />
                            )
                        )}
                </HStack>
            </VStack>

            <HStack
                gap={"1rem"}
                w={"100%"}
            >
                {actualizarStatus != "updating" && (
                    <Button
                        onClick={actualizarServicio}
                        fontWeight={800}
                        shadow={"md"}
                        variant={"outline"}
                        colorPalette={"blue"}
                    >
                        Actualizar Datos
                    </Button>
                )}
                {actualizarStatus == "success" && (
                    <Text color={"green"}>
                        ¡Servicio Actualizado Exitosamente!
                    </Text>
                )}
                {actualizarStatus == "error" && (
                    <Text color={"red"}>
                        Error al actualizar
                    </Text>
                )}
            </HStack>
            {actualizarStatus == "updating" && (
                <Spinner
                    size={"lg"}
                    borderWidth={"3px"}
                    color={"blue.600"}
                />
            )}
        </VStack>
    );
}

function TimeSelector({
    label,
    horarios,
    lashistaForm,
    setLashistaForm,
    index,
}) {
    //Array of [ "HH:mm", ... ]
    const [horariosArr, setHorariosArr] = useState(
        horarios
            .split("-")
            .map((hora) => hora.replace(" ", ""))
    );

    function handleChange(newValue, index, i) {
        // console.log(newValue.format("HH:mm"), index, i);

        let newHorarioLV = horariosArr;
        newHorarioLV[i] = newValue.format("HH:mm");

        let newSlotsLV = lashistaForm.horarioLV;
        newSlotsLV[
            index
        ] = `${newHorarioLV[0]} - ${newHorarioLV[1]}`;

        // console.log(newSlotsLV);
        // console.log(lashistaForm.horarioLV);

        setHorariosArr(newHorarioLV);
        setLashistaForm({
            ...lashistaForm,
            horarioLV: newSlotsLV,
        });
    }

    useEffect(() => {
        // console.log(horariosArr);
    }, []);

    return (
        <HStack w={"100%"}>
            {horariosArr.map((hora, i) => {
                return (
                    <TimePickMUI
                        key={i}
                        value={hora}
                        label={label}
                        loc={{ index, i, period: "LV" }}
                        lashistaForm={lashistaForm}
                        onChange={(newValue) => {
                            handleChange(
                                newValue,
                                index,
                                i
                            );
                        }}
                    />
                );
            })}
        </HStack>
    );
}

function TimePickMUI({
    label,
    value,
    onChange,
    loc,
    lashistaForm,
}) {
    // const formattedValue = dayjs(`2025-01-01T${value}`)
    const [valueMUI, setValueMUI] = useState(
        formatHourMUI(value)
    );

    useEffect(() => {
        if (lashistaForm) {
            // console.log(lashistaForm.horarioLV);

            if (loc.period == "LV") {
                const decodedHorarioLV =
                    lashistaForm.horarioLV.map(
                        (horario) => {
                            return horario
                                .split("-")
                                .map((hora) =>
                                    hora.replace(" ", "")
                                );
                        }
                    );
                const newVal = formatHourMUI(
                    decodedHorarioLV[loc.index][loc.i]
                );
                setValueMUI(newVal);
                // console.log(newVal);
            }

            if (loc.period == "SBD") {
                const newVal = formatHourMUI(
                    lashistaForm.horarioSBD[loc.i]
                );
                // console.log(lashistaForm.horarioSBD[loc.i]);
                setValueMUI(newVal);
                // console.log(lashistaForm.horarioSBD[loc.i]);
            }
        }
    }, [lashistaForm]);

    return (
        <Box
            {...inputStyles}
            w={"100%"}
        >
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
            >
                <TimePicker
                    sx={{
                        width: "100%",
                        backgroundColor: "white",
                    }}
                    label={label}
                    value={valueMUI}
                    onChange={onChange}
                    timeSteps={{ minutes: 30 }}
                />
            </LocalizationProvider>
        </Box>
    );
}

function formatHourMUI(value) {
    return dayjs(`2025-01-01T${value}`);
}

function InputGroup({ label, value, onChange }) {
    return (
        <VStack
            alignItems={"start"}
            w={"100%"}
        >
            <Text
                w={"100%"}
                fontWeight={600}
                fontSize={"0.8rem"}
            >
                {label}
            </Text>
            <Input
                w={"100%"}
                {...inputStyles}
                value={value}
                placeholder={label}
                onChange={onChange}
            />
        </VStack>
    );
}
const inputStyles = {
    fontSize: "md",
    shadow: "sm",
    bg: "white",
};
