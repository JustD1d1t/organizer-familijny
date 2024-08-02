import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification,
} from "firebase/auth"
import { auth } from "~/server/lib/firebase"

export const useFirebaseAuth = () => {
    let user
    let error

    async function sendVeritifactionEmail() {
        const auth = getAuth()
        sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log("Email sent")
            })
            .catch((error) => {
                console.error(error)
            })
    }

    async function resetPassword(email) {
        const auth = getAuth()
        return sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Email sent")
            })
            .catch((error) => {
                console.error(error)
            })
    }

    async function updateDisplayName(name) {
        const auth = getAuth()
        updateProfile(auth.currentUser, {
            displayName: name,
        })
    }

    async function registerUser(email, password, name, handleError) {
        const auth = getAuth()
        return createUserWithEmailAndPassword(auth, email, password)
            .then(function (result) {
                return result.user.updateProfile({
                    displayName: name,
                })
            })
            .catch((error) => {
                handleError(error.code)
            })
    }

    async function loginUser(email, password, handleError) {
        const auth = getAuth()
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                return user
            })
            .catch((error) => {
                handleError(error.code)
            })
    }

    async function logoutUser() {
        try {
            await auth.signOut()
            user = null
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error signing out" + error)
            }
        }
    }

    async function getUserByMail(email) {}

    return {
        error,
        user,
        registerUser,
        loginUser,
        logoutUser,
        getUserByMail,
        resetPassword,
        updateDisplayName,
        sendVeritifactionEmail,
    }
}
