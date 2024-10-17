<script setup>
const notificationsStore = useNotificationsStore()

const familyMembersStore = useFamilyMembersStore()
const { createFamily } = familyMembersStore
const userStore = useUserStore()
const { uid, email, nickname } = storeToRefs(userStore)

const emit = defineEmits("cancel", "confirmModal")

const familyName = ref("")

const create = async () => {
    const newMembersDetails = [
        {
            email: email.value,
            id: uid.value,
            uid: uid.value,
            nickname: nickname.value,
            status: "accepted",
        },
    ]
    await createFamily(newMembersDetails, familyName.value)
    emit("confirmModal")
}

const cancel = () => {
    emit("cancel")
}
</script>

<template>
    <div class="ion-padding inner-content">
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="cancel()">Anuluj</ion-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button :strong="true" @click="create"
                        >Stwórz</ion-button
                    >
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <uiList>
            <ion-item>
                <ion-text>
                    <h3>Stwórz rodzinę</h3>
                </ion-text>
            </ion-item>
            <uiInput
                data-test="shop-input"
                label="Nazwa rodziny"
                class="shopInput"
                type="text"
                v-model="familyName"
            />
        </uiList>
    </div>
</template>
