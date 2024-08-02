import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore/lite"
import {
    collection as colletionFs,
    getFirestore as getFs,
    doc as docFirestore,
    onSnapshot,
} from "firebase/firestore"

import {
    getStorage,
    deleteObject,
    ref as storRef,
    uploadBytes,
    uploadString,
    getDownloadURL,
} from "firebase/storage"

const savePhotoStringToStorageWithId = async (
    collectionName,
    docId,
    imageUrl
) => {
    try {
        const storage = getStorage()
        const storageRef = storRef(storage, `${collectionName}/${docId}.jpeg`)
        await uploadString(storageRef, imageUrl, "data_url")
    } catch (error) {
        console.error("Error saving photo and document:", error)
        throw error
    }
}

const savePhotoToStorageWithId = async (
    collectionName,
    docId,
    document,
    photoBase64
) => {
    try {
        // Prześlij zdjęcie do Firebase Storage
        const storage = getStorage()
        const storageRef = storRef(storage, `${collectionName}/${docId}.jpeg`)
        const blob = await fetch(`data:image/jpeg;base64,${photoBase64}`).then(
            (res) => res.blob()
        )
        await uploadBytes(storageRef, blob)

        // Dodaj dane do Firestore
        const docRef = doc(getFirestore(), collectionName, docId)
        await setDoc(docRef, {
            ...document,
            photoUrl: `gs://${storageRef.bucket}/${storageRef.fullPath}`, // Przypisz URL zdjęcia z Firebase Storage
        })

        console.log("Photo uploaded and document added to Firestore")
    } catch (error) {
        console.error("Error saving photo and document:", error)
        throw error
    }
}

const getPhotoById = async (collection, photoId) => {
    const storage = getStorage()
    try {
        const url = await getDownloadURL(
            storRef(storage, `${collection}/${photoId}.jpeg`)
        )
        return url
    } catch (error) {
        return undefined
    }
}

const removePhotoFromStorage = async (collection, photoId) => {
    const storage = getStorage()
    try {
        const desertRef = storRef(storage, `${collection}/${photoId}.jpeg`)
        deleteObject(desertRef)
    } catch (error) {
        console.error("Error removing photo from storage:", error)
        throw error
    }
}

let unsubscribe

const queryDocsByCollection = async (sequence) => {
    const q = query(collection(getFirestore(), ...sequence))
    const querySnapshot = await getDocs(q)
    const docs = []
    querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id })
    })
    return docs
}

const queryDoc = async (sequence, id) => {
    const q = doc(getFirestore(), ...sequence, id)
    const docSnap = await getDoc(q)
    return {
        ...docSnap.data(),
        id,
    }
}

const queryDocsInCollection = async (
    sequence,
    orderByTimestamp = false,
    statements = []
) => {
    const queryStatements = []
    statements.forEach((statement) => {
        if (
            statement.key &&
            statement.value !== undefined &&
            statement.statement
        ) {
            queryStatements.push(
                where(statement.key, statement.statement, statement.value)
            )
        }
    })

    let q
    if (orderByTimestamp) {
        q = query(
            collection(getFirestore(), ...sequence),
            ...queryStatements,
            orderBy("timestamp", "desc")
        )
    } else {
        q = query(collection(getFirestore(), ...sequence), ...queryStatements)
    }

    const querySnapshot = await getDocs(q)
    const docs = []
    querySnapshot.forEach((doc) => {
        docs.push({
            ...doc.data(),
            id: doc.id,
            timestamp: doc.data().timestamp
                ? doc.data().timestamp.toDate()
                : null,
        })
    })

    return docs
}

const onSnapshotCollection = async (sequence, cb) => {
    const q = query(colletionFs(getFs(), ...sequence))
    onSnapshot(q, (snapshot) => {
        const newDocs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        cb(newDocs)
    })
}

const onSnapshotDoc = async (sequence, cb) => {
    const db = getFs()
    const docRef = docFirestore(db, ...sequence)
    unsubscribe = onSnapshot(
        docRef,
        (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data()
                cb(data)
            } else {
                console.log("No such document!")
            }
        },
        (error) => {
            console.log("Error listening to document: ", error)
        }
    )
}

const clearSnapshot = () => {
    unsubscribe()
}

const deleteDocument = async (sequence) => {
    return await deleteDoc(doc(getFirestore(), ...sequence))
}

const addDocument = async (sequence, data) => {
    return await addDoc(collection(getFirestore(), ...sequence), {
        ...data,
        timestamp: data.timestamp
            ? Timestamp.fromDate(new Date(data.timestamp))
            : Timestamp.now(),
    })
}

const updateDocument = async (sequence, data) => {
    return await updateDoc(doc(getFirestore(), ...sequence), data)
}

const setDocument = async (sequence, data) => {
    return await setDoc(doc(getFirestore(), ...sequence), data)
}

export const useFirebase = () => {
    return {
        addDocument,
        clearSnapshot,
        deleteDocument,
        onSnapshotCollection,
        onSnapshotDoc,
        queryDoc,
        queryDocsByCollection,
        queryDocsInCollection,
        setDocument,
        updateDocument,
        savePhotoToStorageWithId,
        getPhotoById,
        removePhotoFromStorage,
        savePhotoStringToStorageWithId,
    }
}
