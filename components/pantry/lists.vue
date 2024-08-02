<script setup>
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const route = useRoute()
const uid = useState(StateEntries.Uid)
const { queryDocsInCollection } = useFirebase()

import { usePantriesStore } from "~/stores/pantries"
const pantriesStore = usePantriesStore()
const {
    addPantriesToStore,
    addCollaboratedPantriesToStore,
    setCurrentPantry,
    removePantry,
} = pantriesStore

const { pantries, collaboratedPantries, currentPantry } =
    storeToRefs(pantriesStore)
const isLoading = ref(false)

const handleClick = (pantry) => {
    let list = pantries.value.find((list) => list.id === pantry.id)
    if (!list) {
        list = collaboratedPantries.value.find((list) => list.id === pantry.id)
    }
    setCurrentPantry(list)
    navigateTo(`/pantries/${pantry.id}`)
}

onMounted(async () => {
    const pantries = await queryDocsInCollection(
        [StateEntries.Pantries],
        false,
        [
            {
                key: "ownerId",
                value: uid.value,
                statement: "==",
            },
        ]
    )
    addPantriesToStore(pantries)
    const collaboratedPantries = await queryDocsInCollection(
        [StateEntries.Pantries],
        false,
        [
            {
                key: "members",
                value: uid.value,
                statement: "array-contains",
            },
        ]
    )
    addCollaboratedPantriesToStore(collaboratedPantries)
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
                <uiButton
                    @click="() => removePantry(pantry)"
                    :color="'danger'"
                    :size="'small'"
                    class="w-full"
                >
                    Usuń
                </uiButton>
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
