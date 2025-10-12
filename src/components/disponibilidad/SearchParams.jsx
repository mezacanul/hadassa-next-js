import { HStack, useToken, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Form } from "react-bootstrap";

export default function SearchParams({
    selected,
    setSelected,
    options,
    setDaysSemana,
    onVerDisponibilidad,
    openParams,
}) {
    const pink = useToken("colors", "pink.600");
    const selectStyles = getSelectStyles(pink);
    return (
        <VStack
            w={"100%"}
            justify={"start"}
            my={"1rem"}
            mb={openParams ? "2rem" : "0rem"}
            transition={"all ease 0.5s"}
            transform={openParams ? "scale(1)" : "scale(0)"}
            h={openParams ? "10rem" : "0rem"}
        >
            <Form.Control
                type="date"
                style={selectStyles}
                value={selected.fecha}
                onChange={(e) => {
                    setSelected({
                        ...selected,
                        fecha: e.target.value,
                    });
                    console.log(e.target.value);
                }}
            />
            <MySelect
                value={selected.servicio}
                label={"servicio"}
                options={options.servicios}
                onChange={(e) => {
                    setSelected({
                        ...selected,
                        servicio: e.target.value,
                    });
                }}
            />

            <MySelect
                value={selected.lashista}
                label={"nombre"}
                options={options.lashistas}
                onChange={(e) => {
                    setSelected({
                        ...selected,
                        lashista: e.target.value,
                    });
                }}
            />
            <Button
                bg={"pink.500"}
                _hover={{ ...hoverStyles }}
                size={"sm"}
                // maxW={"300px"}
                w={"200px"}
                shadow={"sm"}
                onClick={onVerDisponibilidad}
            >
                {"Ver Disponibilidad"}
            </Button>
        </VStack>
    );
}

function MySelect({ value, label, options, onChange }) {
    const pink = useToken("colors", "pink.600");
    const selectStyles = getSelectStyles(pink);
    return (
        <Form.Select
            style={selectStyles}
            value={value}
            onChange={onChange}
        >
            {options.map((option) => (
                <option
                    key={option.id}
                    value={option.id}
                >
                    {option[label]}
                </option>
            ))}
        </Form.Select>
    );
}

const getSelectStyles = (pink) => {
    return {
        width: "100%",
        maxWidth: "200px",
        paddingTop: "0.3rem",
        paddingBottom: "0.3rem",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        borderRadius: "0.3rem",
        border: `1.2px solid ${pink}`,
        backgroundColor: "white",
        color: "black",
        fontSize: "1rem",
        // boxShadow: "1px 2px 5px 2px rgba(0, 0, 0, 0.05)",
    };
};

const hoverStyles = {
    cursor: "pointer",
    transform: "scale(1.03)",
};
