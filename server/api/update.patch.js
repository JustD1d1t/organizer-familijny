import { getQuery, readBody } from "h3"
import { updateNestedDocument } from "../lib/firestore"

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const body = await readBody(event)
        let docRef
        if (query.secondCol) {
            docRef = await updateNestedDocument(
                query.col,
                query.colId,
                query.secondCol,
                query.secondColId,
                body
            )
        } else {
            // docRef = await add(query.col, body);
        }

        return { result: docRef }
    } catch (error) {
        return { error: error.message }
    }
})
