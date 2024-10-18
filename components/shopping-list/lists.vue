<script setup>
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()

const { shoppingLists, isLoading, collaboratedShoppingLists } =
    storeToRefs(shoppingListsStore)

const shoppingListsWithMembers = computed(() =>
    shoppingLists.value.filter((list) => list.members?.length)
)
const shoppingListsWithoutMembers = computed(() =>
    shoppingLists.value.filter((list) => !list.members?.length)
)
</script>
<template>
    <div
        v-if="isLoading"
        class="w-full flex justify-center items-center h-full"
    >
        <ion-spinner name="lines-sharp"></ion-spinner>
    </div>
    <div v-else>
        <ion-accordion-group v-if="shoppingLists.length">
            <ion-accordion value="first">
                <ion-item slot="header" color="light">
                    <ion-label><b>Czy wiesz, że...</b></ion-label>
                </ion-item>
                <div class="ion-padding" slot="content">
                    <uiInfoCard
                        subtitle="Możesz utworzyć własne listy zakupowe i zaprosić do nich członków rodziny"
                        icon="ioniconsBulb"
                        class="mb-4 mt-2"
                    >
                        <br />
                        <p>Dzięki temu możecie wspólnie planować zakupy</p>
                        <br />
                        <p>
                            Osoby do listy możesz dodać przy tworzeniu lub
                            edycji danej listy
                        </p>
                    </uiInfoCard>
                </div>
            </ion-accordion>
        </ion-accordion-group>
        <ShoppingListListsContainer
            v-if="shoppingLists.length"
            title="Twoje listy zakupowe"
            :shoppingLists="shoppingListsWithoutMembers"
        />
        <uiInfoCard
            v-else
            title="Czy wiesz, że..."
            subtitle="Możesz utworzyć własne listy zakupowe i zaprosić do nich członków rodziny?"
            icon="ioniconsBulb"
            class="mt-8"
        >
            <br />
            <p>Dzięki temu możecie wspólnie planować zakupy</p>
            <br />
            <p>
                Osoby do listy możesz dodać przy tworzeniu lub edycji danej
                listy
            </p>
            <br />
            <p class="h3 font-bold">Stwórz pierwszą listę zakupową</p>
        </uiInfoCard>

        <ShoppingListListsContainer
            v-if="shoppingLists.length && shoppingListsWithMembers.length"
            title="Współdzielone listy zakupowe"
            :shoppingLists="shoppingListsWithMembers"
        />
        <ShoppingListListsContainer
            v-if="collaboratedShoppingLists.length"
            title="Listy do których zostałeś zaproszony"
            :shoppingLists="collaboratedShoppingLists"
        />
    </div>
</template>
