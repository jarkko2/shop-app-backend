async function SortByProperty(mongoDBcall, sort) {
    if (sort == "date" || sort == "-date") {
        result = await mongoDBcall
        if (sort == "date") {
            result.sort((a, b) => {
                return a.date - b.date; // descending
            })
        } else if (sort == "-date") {
            result.sort((a, b) => {
                return b.date - a.date; // ascending
            })
        }
    } else {
        // sort by something else than date
        result = mongoDBcall
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    return await result
}

module.exports = { SortByProperty }