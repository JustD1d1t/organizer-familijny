import { getQuery, readBody } from "h3"
import { setDocument } from "../lib/firestore"

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const body = await readBody(event)

        let docRef = await setDocument(query.col, query.uid, body)
        // return { result: docRef };
    } catch (error) {
        return { error: error.message }
    }
})
