function formatHoyTitle (date) {
    if(date == null) return date
    // console.log("hoy title", date);
    // const gmtString = date.date.marker.toGMTString(); // e.g., "Thu, 04 Apr 2025 00:00:00 GMT"

    const gmtString = (new Date(date)).toGMTString(); // e.g., "Thu, 04 Apr 2025 00:00:00 GMT"
    const parts = gmtString.split(" ");
    const day = parts[1]; // "04"
    const month = parts[2]; // "Apr"
    const year = parts[3]; // "2025"

    // Map English month abbreviations to Spanish
    const monthMap = {
        Jan: "Enero",
        Feb: "Febrero",
        Mar: "Marzo",
        Apr: "Abril",
        May: "Mayo",
        Jun: "Junio",
        Jul: "Julio",
        Aug: "Agosto",
        Sep: "Septiembre",
        Oct: "Octubre",
        Nov: "Noviembre",
        Dec: "Diciembre",
    };

    const spanishMonth = monthMap[month];
    return `${parseInt(day)} de ${spanishMonth} de ${year}`; // "4 de Abril de 2025"
};

function formatFechaDMY(fecha) {
    const [year, month, day] = fecha.split("-");
    return `${day}-${month}-${year}`;
}

function queryPlusFilters(query, conditions){
    let fullQuery = query 
    if (conditions.length > 0) {
        fullQuery +=
            " WHERE " +
            (conditions.length > 1
                ? conditions.join(" AND ")
                : conditions[0]);
    }

    return `${fullQuery} AND citas.status != 0`
}

// Function to parse req.query and build conditions
function parseQueryFilters(query, filterMap) {
    const conditions = [];
    const params = [];

    // Loop through query params
    for (const [key, value] of Object.entries(query)) {
        // Only include if key is in filterMap and value exists
        if (filterMap[key] && value) {
            // Custom date formatting 
            const sendValue = key == "date" ? formatFechaDMY(value) : value;

            conditions.push(`${filterMap[key]} = ?`);
            params.push(sendValue);
        }
    }

    return { conditions, params };
}

export { formatHoyTitle, formatFechaDMY, queryPlusFilters, parseQueryFilters }
