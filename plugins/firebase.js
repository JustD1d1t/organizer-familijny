import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig()
    const firebaseConfig = {
        apiKey: "AIzaSyDnWc1nzf8Lkg9NFG1sThlDRGmCsu2QBn4",
        authDomain: "fo-mobile-b53c4.firebaseapp.com",
        projectId: "fo-mobile-b53c4",
        storageBucket: "fo-mobile-b53c4.appspot.com",
        messagingSenderId: "181718454239",
        appId: "1:181718454239:web:890b97bc57fd2364c1fe6a",
    }

    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const firestore = getFirestore(app)

    return {
        provide: {
            firebaseApp: app,
            firebaseAuth: auth,
            firebaseFirestore: firestore,
        },
    }
})
