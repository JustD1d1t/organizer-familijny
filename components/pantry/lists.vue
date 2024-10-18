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
        <uiInfoCard
            v-if="!pantries || !pantries.length"
            title="Czy wiesz, że..."
            subtitle="Możesz utworzyć własne spiżarnie i zaprosić do nich członków rodziny?"
            icon="ioniconsBulb"
            class="mt-8"
        >
            <br />
            <p>
                Dzięki temu możecie wspólnie panować nad zapasami oraz dodawać
                wykorzystane produkty do listy zakupowej.
            </p>
            <br />
            <p>
                Osoby do listy możesz dodać przy tworzeniu lub edycji spiżarni
            </p>
            <br />
            <p class="h3 font-bold">Stwórz pierwszą spiżarnię</p>
        </uiInfoCard>
        <div v-else>
            <ion-accordion-group>
                <ion-accordion value="first">
                    <ion-item slot="header" color="light">
                        <ion-label><b>Czy wiesz, że...</b></ion-label>
                    </ion-item>
                    <div class="ion-padding" slot="content">
                        <uiInfoCard
                            subtitle="Możesz utworzyć własne spiżarnie i zaprosić do nich członków rodziny"
                            icon="ioniconsBulb"
                            class="mb-4 mt-2"
                        >
                            <br />
                            <p>
                                Dzięki temu możecie wspólnie panować nad
                                zapasami oraz dodawać wykorzystane produkty do
                                listy zakupowej.
                            </p>
                            <br />
                            <p>
                                Osoby do spiżarni możesz dodać przy tworzeniu
                                lub edycji danej spiżarni
                            </p>
                        </uiInfoCard>
                    </div>
                </ion-accordion>
            </ion-accordion-group>
            <h2 class="text-center">Twoje spiżarnie</h2>
            <PantrySingleListItem
                v-for="pantry in pantries"
                :key="pantry.id"
                :pantry="pantry"
            />
        </div>

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
