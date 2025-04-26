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

export { formatHoyTitle }
