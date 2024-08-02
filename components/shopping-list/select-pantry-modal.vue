<script setup>
import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { pantries, collaboratedPantries } = pantriesStore
const props = defineProps({
    cancel: {
        type: Function,
        default: () => {},
    },
    confirmModal: {
        type: Function,
        default: () => {},
    },
})
</script>

<template>
    <div class="inner-content">
        <h2>wybierz spiżarnię</h2>
        <ion-list lines="none">
            <h2>Twoje spiżarnie</h2>
            <ion-item
                v-for="pantry in pantries"
                :key="pantry.id"
                @click="confirmModal(pantry)"
            >
                <ion-label>{{ pantry.name }}</ion-label>
            </ion-item>
            <h2 v-if="collaboratedPantries && collaboratedPantries.length">
                Spiżarnie do których Cię dodano
            </h2>
            <ion-item
                v-for="pantry in collaboratedPantries"
                :key="pantry.id"
                @click="confirmModal(pantry)"
            >
                <ion-label>{{ pantry.name }}</ion-label>
            </ion-item>
        </ion-list>
    </div>
</template>
