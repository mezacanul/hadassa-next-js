import { Heading, Text, VStack } from "@chakra-ui/react";
import { es } from 'date-fns/locale';
import { format, parse } from 'date-fns';
import { useEffect, useState } from "react";
import { capitalizeFirst, getDateObject } from "@/utils/main";

export default function FechaLogo({ selectedDate }) {
    const [dateObj, setDateObj] = useState(null)

    useEffect(() => {
        if (selectedDate) {
            const dateObj = getDateObject(selectedDate)
            console.log(dateObj);
            setDateObj(dateObj)
        }
    }, [selectedDate])
    return (
        <VStack alignItems={"start"} gap={0}>
            <Heading
                fontWeight={300}
                size={"3xl"}
                fontStyle={"italic"}
            >
                {dateObj && dateObj.dayName}
            </Heading>
            <Text color={"pink.600"}>{dateObj && dateObj.monthYearFormat}</Text>
        </VStack>
    )
}
