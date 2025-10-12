import { Table } from "@chakra-ui/react";
import { loadHook } from "@/utils/lattice-design";
import { TfiReceipt } from "react-icons/tfi";
import {
    formatHoyTitle,
    formatFechaDMY,
} from "@/utils/main";
import { Badge } from "@chakra-ui/react";
import { useRouter as useNextNav } from "next/navigation";

export default function CitaRow({ cita }) {
    const [, setLoading] = loadHook("useLoader");
    const NextNav = useNextNav();

    return (
        <Table.Row
            _hover={{
                color: "pink.600",
                textDecor: "underline",
                cursor: "pointer",
            }}
            onClick={() => {
                setLoading(true);
                NextNav.push(`/citas/${cita.id}`);
            }}
            transition={"all ease 0.3s"}
        >
            <Table.Cell>
                <TfiReceipt size={"1.7rem"} />
            </Table.Cell>
            <Table.Cell>{cita.servicio}</Table.Cell>
            <Table.Cell>
                {formatHoyTitle(formatFechaDMY(cita.fecha))}
            </Table.Cell>
            <Table.Cell>{cita.hora}</Table.Cell>
            <Table.Cell>{cita.lashista}</Table.Cell>
            <Table.Cell>
                <Badge
                    shadow={"sm"}
                    fontWeight={600}
                    colorPalette={
                        cita.status === 0
                            ? "red"
                            : cita.status === 1
                            ? "yellow"
                            : cita.status === 2
                            ? "green"
                            : ""
                    }
                >
                    {cita.status === 0
                        ? "Cancelada"
                        : cita.status === 1
                        ? "Pendiente"
                        : cita.status === 2
                        ? "Confirmada"
                        : ""}
                </Badge>
            </Table.Cell>
            <Table.Cell>
                <Badge
                    shadow={"sm"}
                    fontWeight={600}
                    colorPalette={
                        cita.pagado == 1
                            ? "green"
                            : "yellow"
                    }
                >
                    {cita.pagado == 1
                        ? "Pagada"
                        : "Pendiente"}
                </Badge>
            </Table.Cell>
        </Table.Row>
    );
}
