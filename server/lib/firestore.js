import {
    collection,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    setDoc,
    updateDoc,
    query,
    where,
} from "firebase/firestore"
import { firestore } from "./firebase"

export const queryDoc = async (col, key, value) => {
    const searchedCollection = collection(firestore, col)
    const docs = query(searchedCollection, where(key, "==", value))
    const querySnapshot = await getDocs(docs)
    const dataToReturn = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
    return dataToReturn
}

export const queryByCollection = async (col) => {
    const colRef = collection(firestore, col)

    const snapshot = await getDocs(colRef)

    const docs = Array.from(snapshot.docs).map((doc) => {
        return {
            ...doc.data(),
            id: doc.id,
        }
    })

    return docs
}

export const queryByNestedCollection = async (col, colId, secondCol) => {
    const colRef = collection(firestore, col, colId, secondCol)

    const snapshot = await getDocs(colRef)

    const docs = Array.from(snapshot.docs).map((doc) => {
        return {
            ...doc.data(),
            id: doc.id,
        }
    })

    return docs
}

export const querySpecificNestedDoc = async (
    col,
    colId,
    secondCol,
    secondColId
) => {
    const docRef = doc(firestore, col, colId, secondCol, secondColId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        return null
    }
}

export const queryDocByNestedCollection = async (
    col,
    colId,
    secondCol,
    key,
    value
) => {
    const searchedCollection = collection(firestore, col, colId, secondCol)
    const docs = query(searchedCollection, where(key, "==", value))
    const querySnapshot = await getDocs(docs)
    const dataToReturn = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
    return dataToReturn
}

export const setDocument = async (col, uid, document) => {
    const docRef = doc(firestore, col, uid)
    await setDoc(docRef, document)
    return docRef
}

export const add = async (col, document) => {
    const colRef = collection(firestore, col)

    const docRef = await addDoc(colRef, document)

    return docRef
}

export const addNested = async (col, colId, secondCol, document) => {
    const colRef = collection(firestore, col, colId, secondCol)

    const docRef = await addDoc(colRef, document)

    return docRef
}

export const updateNestedDocument = async (col, colId, secondCol, id, body) => {
    const docRef = doc(firestore, col, colId, secondCol, id)
    await updateDoc(docRef, body)
    return docRef
}

export const del = async (col, id) => {
    const docRef = doc(firestore, col, id)
    return await deleteDoc(docRef)
}

export const delNested = async (col, colId, secondCol, id) => {
    const docRef = doc(firestore, col, colId, secondCol, id)
    return await deleteDoc(docRef)
}
