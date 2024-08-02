import { getQuery } from "h3"
import {
    queryByCollection,
    queryByNestedCollection,
    queryDoc,
    queryDocByNestedCollection,
    querySpecificNestedDoc,
} from "../lib/firestore"

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)

        // Check if the 'col' parameter is present and not empty
        if (!query.col) {
            throw new Error(
                "Collection name ('col') is missing or empty in the query parameters."
            )
        }
        let docs
        if (
            query.col &&
            query.colId &&
            query.secondCol &&
            query.key &&
            query.value
        ) {
            docs = await queryDocByNestedCollection(
                query.col,
                query.colId,
                query.secondCol,
                query.key,
                query.value
            )
        } else if (query.col && query.key && query.value) {
            docs = await queryDoc(query.col, query.key, query.value)
        } else if (
            query.col &&
            query.colId &&
            query.secondCol &&
            query.secondColId
        ) {
            docs = await querySpecificNestedDoc(
                query.col,
                query.colId,
                query.secondCol,
                query.secondColId
            )
        } else if (query.secondCol) {
            docs = await queryByNestedCollection(
                query.col,
                query.colId,
                query.secondCol
            )
        } else {
            docs = await queryByCollection(query.col)
        }
        return { result: docs }
    } catch (error) {
        return { result: [], error: error.message }
    }
})
