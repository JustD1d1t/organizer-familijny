<script setup>
const notificationsStore = useNotificationsStore()
const { getNotifications } = notificationsStore

const { displayToast } = useAlerts()

const userStore = useUserStore()
const { loginUser } = userStore

const familyMembersStore = useFamilyMembersStore()
const { getFamilyDetails } = familyMembersStore

const emailValue = ref("")
const password = ref("")
const toastMessage = ref("")
const isOpen = ref(false)

const confirmLoginToast = () => {
    toastMessage.value = "Zalogowano pomyślnie"
    isOpen.value = true
    setTimeout(() => {
        isOpen.value = false
    }, 2000)
}

const login = async () => {
    try {
        const response = await loginUser(emailValue.value, password.value)
        if (!response.error) {
            navigateTo("/")
            await getNotifications()
            await getFamilyDetails()
            confirmLoginToast()
        } else {
            displayToast(response.error)
        }
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Logowanie</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="flex items-center h-full w-full">
                <uiCard class="p-8 w-full">
                    <template v-slot:title> Logowanie </template>
                    <ion-list>
                        <uiInput
                            label="Email"
                            type="email"
                            v-model="emailValue"
                        />
                        <uiInput
                            label="Hasło"
                            type="password"
                            v-model="password"
                        />
                    </ion-list>
                    <ion-button
                        class="w-full mt-4"
                        expand="block"
                        @click="login"
                        >Zaloguj</ion-button
                    >
                    <ion-button
                        class="w-full mt-4"
                        expand="block"
                        fill="outline"
                        @click="navigateTo('/register')"
                        >Rejestracja</ion-button
                    >
                    <ion-button
                        class="w-full mt-4"
                        expand="block"
                        fill="clear"
                        @click="navigateTo('/reset-password')"
                        >Zapomniałem hasła</ion-button
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
