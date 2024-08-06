<script setup>
import { getAuth } from "firebase/auth"
import { StateEntries } from "@/types"
const { loginUser, error } = useFirebaseAuth()
const auth = getAuth()

const notificationsStore = useNotificationsStore()
const { getNotifications } = notificationsStore

const uid = useState(StateEntries.Uid)
const userEmail = useState(StateEntries.UserEmail)

const email = ref("")
const password = ref("")
const toastMessage = ref("")
const isOpen = ref(false)

if (auth.currentUser) {
    window.location.href = "/"
}

const handleError = (errorMessage) => {
    if (
        errorMessage === "auth/invalid-email" ||
        errorMessage === "auth/invalid-credential"
    ) {
        toastMessage.value = "Niepoprawne dane logowania"
    }
    isOpen.value = true
    setTimeout(() => {
        isOpen.value = false
    }, 2000)
}

const confirmLoginToast = () => {
    toastMessage.value = "Zalogowano pomyślnie"
    isOpen.value = true
    setTimeout(() => {
        isOpen.value = false
    }, 2000)
}

const login = async () => {
    try {
        const user = await loginUser(email.value, password.value, handleError)
        if (user) {
            uid.value = user.uid
            await getNotifications()
            userEmail.value = email.value
            confirmLoginToast()
        }
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Logowanie</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="flex items-center h-full w-full">
                <uiCard class="p-8 w-full">
                    <template v-slot:title> Logowanie </template>
                    <ion-list>
                        <uiInput label="Email" type="email" v-model="email" />
                        <uiInput
                            label="Hasło"
                            type="password"
                            v-model="password"
                        />
                    </ion-list>
                    <uiButton class="w-full mt-4" expand="block" @click="login"
                        >Zaloguj</uiButton
                    >
                    <uiButton
                        class="w-full mt-4"
                        expand="block"
                        fill="outline"
                        router-link="/register"
                        >Rejestracja</uiButton
                    >
                    <uiButton
                        class="w-full mt-4"
                        expand="block"
                        fill="outline"
                        router-link="/reset-password"
                        >Zapomniałem hasła</uiButton
                    >
                </uiCard>
            </div>

            <ion-toast
                :is-open="isOpen"
                :message="toastMessage"
                :duration="2000"
            ></ion-toast>
        </ion-content>
    </ion-page>
</template>
