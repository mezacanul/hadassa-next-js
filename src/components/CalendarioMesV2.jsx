import dayjs from "dayjs";
import { Box, Text } from "@chakra-ui/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState } from "react";
import 'dayjs/locale/es';

dayjs.locale('es');


export default function CalendarioMesV2() {
    const [value, setValue] = useState(dayjs("2025-10-23"));
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
                    onChange={(newValue) =>
                        setValue(newValue)
                    }
                />
            </LocalizationProvider>
        </Box>
    );
}
