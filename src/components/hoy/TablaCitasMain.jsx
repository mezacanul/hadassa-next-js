import BadgeCustom from "../common/BadgeCustom";
import {
    Box,
    Text,
    HStack,
    Spinner,
} from "@chakra-ui/react";
import "@/config/agGridSetup";
import { AgGridReact } from "ag-grid-react";

export default function TablaCitasMain({
    citas,
    primaryColor,
    goToServicio,
}) {
    return (
        <Box
            my={"1rem"}
            h={
                citas && citas.length > 0
                    ? "50vh"
                    : "initial"
            }
            id={"AG-Table"}
            w={"100%"}
        >
            {!citas && (
                <HStack
                    w={"100%"}
                    justifyContent={"center"}
                    py={"2rem"}
                >
                    <Spinner
                        color={"pink.500"}
                        size={"md"}
                    />
                </HStack>
            )}
            {citas && citas.length > 0 && (
                <AgGridReact
                    rowData={citas}
                    columnDefs={getColumnDefinitions(
                        primaryColor,
                        goToServicio
                    )}
                    rowHeight={60}
                    // autoSizeStrategy={{
                    //     type: "fitCellContents",
                    // }}
                    defaultColDef={{
                        resizable: true,
                        flex: 2,
                        cellStyle: {
                            display: "flex",
                            // justifyContent: "center",
                            alignItems: "center",
                        },
                    }}
                    // quickFilterText={searchTerm}
                />
            )}
            {citas && citas.length == 0 && (
                <Text
                    textAlign={"center"}
                    my={"2rem"}
                >
                    No hay citas en este día
                </Text>
            )}
        </Box>
    );
}

function getColumnDefinitions(primaryColor, goToServicio) {
    return [
        {
            headerName: "Hora",
            field: "hora",
            cellStyle: {
                fontWeight: "bold",
                // fontSize: "1rem",
                color: primaryColor,
                justifyContent: "center",
            },
        },
        {
            headerName: "Servicio",
            field: "servicio",
            flex: 3,
            cellStyle: {
                // fontWeight: "bold",
                // textDecoration: "underline",
            },
            cellClass: "hover-link",
            onCellClicked: (params) => {
                goToServicio(params.data.cita_ID);
            },
        },
        {
            headerName: "Nombre",
            // field: "lashista",
            valueGetter: (params) =>
                `${params.data.nombres} ${params.data.apellidos}`,
            // cellRenderer: renderResourceLabel,
            flex: 3,
        },
        {
            headerName: "Lashista",
            field: "lashista",
            flex: 2,
            // minWidth: 100,
        },
        // {
        //     headerName: "Fecha",
        //     field: "fecha",
        //     valueGetter: (params) =>
        //         formatFechaDMY(params.data.fecha),
        // },
        {
            headerName: "Pagado",
            // field: "pagado",
            cellRenderer: ({ data }) => (
                <BadgeCustom
                    type="pagado"
                    status={data.pagado}
                />
            ),
        },
        {
            headerName: "Status",
            // field: "status",
            cellRenderer: ({ data }) => (
                <BadgeCustom
                    type="status"
                    status={data.status}
                />
            ),
        },
        // {
        //     headerName: "Acciones",
        //     field: "acciones",
        // },
    ];
}
