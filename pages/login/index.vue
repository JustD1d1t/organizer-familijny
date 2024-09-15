<script setup>
const notificationsStore = useNotificationsStore()
const { getNotifications } = notificationsStore

const { openToast } = useAlerts()

const userStore = useUserStore()
const { loginUser } = userStore

const familyMembersStore = useFamilyMembersStore()
const { getFamilyDetails } = familyMembersStore

const email = ref("")
const password = ref("")

const toastType = ref("")

const confirmLoginToast = () => {
    openToast("Zalogowano pomyślnie")
}

const errorLoginToast = (message) => {
    openToast(message, "danger")
}

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
}

const emailInputError = ref("")
const passwordInputError = ref("")

const login = async () => {
    // Reset error messages
    emailInputError.value = ""
    passwordInputError.value = ""

    // Validate email
    if (!email.value) {
        emailInputError.value = "Email jest wymagany."
    }
    if (!validateEmail(email.value)) {
        emailInputError.value = "Nieprawidłowy format email."
    }

    // Validate password
    if (!password.value) {
        passwordInputError.value = "Hasło jest wymagane."
    }
    if (password.value.length < 6) {
        passwordInputError.value = "Hasło musi mieć co najmniej 6 znaków."
    }

    if (emailInputError.value || passwordInputError.value) {
        return
    }
    try {
        const response = await loginUser(email.value, password.value)
        if (!response.error) {
            navigateTo("/")
            await getNotifications()
            await getFamilyDetails()
            confirmLoginToast()
        } else {
            errorLoginToast(response.error)
        }
    } catch (error) {
        errorLoginToast(error)
    }
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title>Logowanie</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="flex items-center h-full w-full">
                <uiCard class="p-8 w-full">
                    <template v-slot:title> Logowanie </template>
                    <ion-list lines="none" class="pb-4">
                        <uiInput
                            label="Email"
                            type="email"
                            v-model="email"
                            :error="emailInputError"
                        />
                        <uiInput
                            label="Hasło"
                            type="password"
                            v-model="password"
                            :error="passwordInputError"
                        />
                    </ion-list>
                    <uiButton class="w-full mt-4" expand="block" @click="login"
                        >Zaloguj</uiButton
                    >
                    <uiButton
                        class="w-full mt-4"
                        expand="block"
                        fill="outline"
                        @click="navigateTo('/register')"
                        type="secondary"
                        >Rejestracja</uiButton
                    >
                    <uiButton
                        class="w-full mt-4"
                        expand="block"
                        fill="clear"
                        @click="navigateTo('/reset-password')"
                        type="tertiary"
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
