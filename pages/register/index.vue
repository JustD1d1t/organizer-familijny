<script setup>
const { backendUrl } = useConfig()

const userStore = useUserStore()
const { registerUser } = userStore
const { openToast } = useAlerts()

const email = ref("")
const password = ref("")
const nickname = ref("")

const emailInputError = ref("")
const passwordInputError = ref("")
const nicknameInputError = ref("")

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
}

const register = async () => {
    // Reset error messages
    emailInputError.value = ""
    passwordInputError.value = ""
    nicknameInputError.value = ""

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

    // Validate nickname
    if (!nickname.value) {
        nicknameInputError.value = "Nazwa jest wymagana."
    }

    if (
        emailInputError.value ||
        passwordInputError.value ||
        nicknameInputError.value
    ) {
        return
    }
    try {
        const user = await registerUser(
            email.value,
            password.value,
            nickname.value
        )
        if (user.error) {
            openToast(user.error, "danger")
            return
        }
        const uid = user.localId
        await fetch(`${backendUrl}/users/add-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: {
                    uid,
                    email: email.value.toLowerCase(),
                },
            }),
        })
        openToast("Zarejestrowano pomyślnie")
        navigateTo("/login")
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Rejestracja</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="flex items-center h-full w-full">
                <uiCard class="p-8 w-full">
                    <template v-slot:title> Rejestracja </template>
                    <uiList class="pb-4">
                        <uiInput
                            class="w-full"
                            label="Email"
                            type="email"
                            v-model="email"
                            :error="emailInputError"
                        ></uiInput>
                        <uiInput
                            class="w-full"
                            label="Hasło"
                            type="password"
                            v-model="password"
                            :error="passwordInputError"
                        ></uiInput>
                        <uiInput
                            class="w-full"
                            label="Nazwa"
                            v-model="nickname"
                            :error="nicknameInputError"
                        ></uiInput>
                    </uiList>
                    <uiButton class="w-full mt-4" @click="register"
                        >Zarejestruj</uiButton
                    >
                    <uiButton
                        class="w-full mt-4"
                        fill="outline"
                        router-link="/login"
                        type="secondary"
                        >Logowanie</uiButton
                    >
                </uiCard>
            </div>
        </ion-content>
    </ion-page>
</template>
