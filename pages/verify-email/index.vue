<script setup>
const userStore = useUserStore()
const { resendVerificationEmail, checkEmailVerification, setEmailVerified } =
    userStore
const checkVerification = async () => {
    const { emailVerified } = await checkEmailVerification()
    if (emailVerified) {
        setEmailVerified(true)
        navigateTo("/")
    }
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title>Email niezweryfikowany</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="flex justify-center items-center h-full w-full">
                <uiCard class="parent flex justify-center items-center">
                    <div class="text-center">Zweryfikuj emaila</div>
                    <div class="text-center">Nie otrzymałeś/aś maila?</div>
                    <uiButton
                        @click="resendVerificationEmail"
                        class="w-full mt-4"
                        type="secondary"
                        >Wyślij ponownie</uiButton
                    >
                    <uiButton @click="checkVerification" class="w-full mt-4"
                        >Sprawdź weryfikację</uiButton
                    >
                </uiCard>
            </div>
        </ion-content>
    </ion-page>
</template>
<style lang="scss" scoped>
.parent {
    flex-direction: column;
    gap: 36px;
    margin: auto;
    padding: 24px;

    div:first-child {
        font-size: 36px;
        color: blueviolet;
    }
}
</style>
