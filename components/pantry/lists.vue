<script setup>
import { useRoute } from "vue-router"

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const { setCurrentPantry, removePantry, getAllPantries } = pantriesStore

const { pantries, collaboratedPantries, isLoading } = storeToRefs(pantriesStore)

const handleClick = (pantry) => {
    let list = pantries.value.find((list) => list.id === pantry.id)
    if (!list) {
        list = collaboratedPantries.value.find((list) => list.id === pantry.id)
    }
    setCurrentPantry(list)
    navigateTo(`/pantries/${pantry.id}`)
}

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
    <div class="w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto" v-else>
        <h2 class="col-span-2 text-center">Twoje spiżarnie</h2>
        <h3 v-if="!pantries || !pantries.length" class="col-span-2 text-center">
            Nie posiadasz swoich spiżarni
        </h3>
        <uiCard
            data-test="own-pantry"
            v-else
            v-for="pantry in pantries"
            :key="pantry.id"
            class="flex flex-col m-2"
        >
            <div
                class="py-8 cursor-pointer flex justify-center grow"
                @click="() => handleClick(pantry)"
            >
                <p :size="'2xl'" :classes="'text-center'">
                    {{ pantry.name }}
                </p>
            </div>
            <div class="flex">
                <ion-button
                    @click="() => removePantry(pantry)"
                    :color="'danger'"
                    :size="'small'"
                    class="w-full"
                >
                    Usuń
                </ion-button>
            </div>
        </uiCard>
        <div
            class="col-span-2 w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
            v-if="collaboratedPantries.length"
        >
            <h2 class="col-span-2 text-center">Współdzielone spiżarnie</h2>
            <uiCard
                v-for="pantry in collaboratedPantries"
                :key="pantry.id"
                class="flex flex-col m-2"
            >
                <div
                    class="py-8 cursor-pointer flex justify-center grow"
                    @click="() => handleClick(pantry)"
                >
                    <p :size="'2xl'" :classes="'text-center'">
                        {{ pantry.name }}
                    </p>
                </div>
            </uiCard>
        </div>
    </div>
</template>
