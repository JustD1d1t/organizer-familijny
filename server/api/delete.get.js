import { getQuery } from "h3"
import { del, delNested } from "../lib/firestore"

export default defineEventHandler(async (event) => {
    try {
        const { col, colId, secondCol, id } = getQuery(event)

        if (secondCol) {
            delNested(col, colId, secondCol, id)
        } else {
            await del(col, id)
        }

        return { result: id }
    } catch (error) {
        console.log(error)
        return { error: error.message }
    }
})
