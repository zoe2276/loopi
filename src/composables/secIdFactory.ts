export const newIdFactory =(prefix = "sec") => {
    let n = 0
    return () => `${prefix}_${++n}`
}