import dayjs from "dayjs";
import { Box, Text } from "@chakra-ui/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState, useEffect } from "react";
import { loadHook } from "@/utils/lattice-design";
import "dayjs/locale/es";

dayjs.locale("es");

export default function CalendarioMesV2() {
    const [value, setValue] = useState(dayjs());
    const [selectedDate, setSelectedDate] = loadHook(
        "useSelectedDate"
    );

    useEffect(() => {
        if (selectedDate) {
            setValue(dayjs(selectedDate));
        }
    }, []);

    function handleChange(newValue) {
        const formattedDate = newValue.format("YYYY-MM-DD");
        console.log("formattedDate", formattedDate);

        setSelectedDate(formattedDate);
        setValue(newValue);
    }

    return (
        <Box
            bg="white"
            w={"100%"}
        >
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="es"
            >
                <DateCalendar
                    value={value}
                    onChange={handleChange}
                />
            </LocalizationProvider>
        </Box>
    );
}
