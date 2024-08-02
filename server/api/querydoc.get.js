import { getQuery } from "h3"
import { queryDocByNestedCollection } from "../lib/firestore"

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)

        // Check if the 'col' parameter is present and not empty
        if (!query.col) {
            throw new Error(
                "Collection name ('col') is missing or empty in the query parameters."
            )
        }

        let doc
        if (query.secondCol) {
            doc = await queryDocByNestedCollection(
                query.col,
                query.colId,
                query.secondCol,
                query.id
            )
        } else {
            doc = await queryByCollection(query.col)
        }
        return { result: doc }
    } catch (error) {
        return { result: [], error: error.message }
    }
})
