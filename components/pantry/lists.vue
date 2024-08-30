<script setup>
import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { getAllPantries } = pantriesStore

const { pantries, collaboratedPantries, isLoading } = storeToRefs(pantriesStore)

onMounted(async () => {
    await getAllPantries()
})
</script>
<template>
    <div
        v-if="isLoading"
        class="w-full flex justify-center items-center h-full"
    >
        <ion-spinner name="lines-sharp"></ion-spinner>
    </div>
    <div class="flex flex-col" v-else>
        <h2 class="text-center">Twoje spiżarnie</h2>
        <h3 v-if="!pantries || !pantries.length" class="col-span-2 text-center">
            Nie posiadasz swoich spiżarni
        </h3>
        <PantrySingleListItem
            v-for="pantry in pantries"
            :key="pantry.id"
            :pantry="pantry"
        />
        <!-- <div
            class="col-span-2 w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
            v-if="collaboratedPantries.length"
        >
            <h2 class="col-span-2 text-center">Współdzielone spiżarnie</h2>

            <PantrySingleListItem
                v-for="pantry in collaboratedPantries"
                :key="pantry.id"
                :pantry="pantry"
            />
        </div> -->
    </div>
</template>
