<script setup>
import { useRoute } from "vue-router"
const route = useRoute()
const pantriesStore = usePantriesStore()
const { currentPantry } = storeToRefs(pantriesStore)
const { editPantry } = pantriesStore

const { formatDate } = useTime()

const editedItem = computed(() => {
    return currentPantry.value.items.find(
        (item) => item.name === route.params.name
    )
})

const expiryDate = computed(() => {
    if (editedItem.value && editedItem.value.expiryDate) {
        const date = new Date(editedItem.value.expiryDate)
        return formatDate(date)
    }
    return null
})

const updateExpiryDate = (e) => {
    const editedItems = currentPantry.value.items.map((item) => {
        if (item.name === route.params.name) {
            item.expiryDate = new Date(e.target.value).getTime()
        }
        return item
    })
    editPantry({
        ...currentPantry.value,
        items: editedItems,
    })
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light);">
            <ion-toolbar >
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Spiżarnia</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="flex items-center" v-if="expiryDate">
                <span>Termin przydatności:</span>
                <ion-datetime-button
                    datetime="expiryDate"
                    :value="expiryDate"
                ></ion-datetime-button>
            </div>

            <ion-modal :keep-contents-mounted="true">
                <ion-datetime
                    id="expiryDate"
                    preferWheel="false"
                    presentation="date"
                    :value="expiryDate"
                    @ionChange="updateExpiryDate"
                    min="2024-01-01"
                    max="2030-12-31"
                ></ion-datetime>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>
