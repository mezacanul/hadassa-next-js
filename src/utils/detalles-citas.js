// utils/getCurrentDateSpans.js
function getCurrentDateSpan() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;

    const formatter = new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    // Start of this week (Monday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // End of this week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Start of next week (next Monday)
    const nextWeekStart = new Date(startOfWeek);
    nextWeekStart.setDate(startOfWeek.getDate() + 7);

    // End of previous week (last Sunday)
    const prevWeekEnd = new Date(startOfWeek);
    prevWeekEnd.setDate(startOfWeek.getDate() - 1);

    return {
        thisWeek: {
            startDate: formatter.format(startOfWeek),
            endDate: formatter.format(endOfWeek),
        },
        future: formatter.format(nextWeekStart),
        past: formatter.format(prevWeekEnd),
    };
}

function filterTimeSlotsByRange(timeSlots, rangeData) {
    const toMinutes = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    };

    const filterByRange = (slots, rangeStr) => {
        const [startStr, endStr] = rangeStr
            .split(" - ")
            .map((str) => str.trim());
        const start = toMinutes(startStr);
        const end = toMinutes(endStr);
        return slots.filter((slot) => {
            const minutes = toMinutes(slot);
            return minutes >= start && minutes < end;
        });
    };

    // If it's a single range string
    if (rangeData.length <= "09:30 - 13:00".length) {
        return filterByRange(timeSlots, rangeData);
    }

    // Else, parse JSON array of ranges
    let ranges = [];
    try {
        ranges = JSON.parse(rangeData);
    } catch (e) {
        console.error("Invalid JSON hour format:", rangeData);
        return [];
    }

    // Merge filtered slots from all ranges
    const result = ranges.flatMap((range) => filterByRange(timeSlots, range));
    return [...new Set(result)]; // Ensure uniqueness just in case
}

export { getCurrentDateSpan, filterTimeSlotsByRange };
