function getTotal(items) {
    let total = 0
    for (let i = 0; i < items.length; i++) {
        total += items[i].price
    }
    return total
}

module.exports = { getTotal }