<script setup>
const { updateDocument } = useFirebase()
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const route = useRoute()
const emit = defineEmits([
    "changeLayout",
    "sortByName",
    "sortByCategory",
    "addToPantry",
])
const props = defineProps({
    layout: {
        type: String,
        default: "",
    },
    nameDir: {
        type: String,
        default: "",
    },
    dir: {
        type: String,
        default: "",
    },
    lastSort: {
        type: String,
        default: "",
    },
})

import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { currentShoppingList } = storeToRefs(shoppingListsStore)

const removeAllItems = () => {
    currentShoppingList.value.items = []
    updateDocument([StateEntries.ShoppingLists, route.params.id], { items: [] })
}

const selectAllItems = () => {
    currentShoppingList.value.items.forEach((item) => (item.checked = true))
    updateDocument([StateEntries.ShoppingLists, route.params.id], {
        items: currentShoppingList.value.items,
    })
}

const deselectAllItems = () => {
    currentShoppingList.value.items.forEach((item) => (item.checked = false))
    updateDocument([StateEntries.ShoppingLists, route.params.id], {
        items: currentShoppingList.value.items,
    })
}

const removeSelectedItems = () => {
    currentShoppingList.value.items = currentShoppingList.value.items.filter(
        (item) => !item.checked
    )
    updateDocument([StateEntries.ShoppingLists, route.params.id], {
        items: currentShoppingList.value.items,
    })
}
</script>

<template>
    <uiButton fill="clear" id="open-menu">
        <ion-icon slot="icon-only" :icon="ioniconsEllipsisVerticalOutline" />
    </uiButton>
    <ion-popover
        trigger="open-menu"
        trigger-action="click"
        :dismiss-on-select="true"
    >
        <ion-content class="ion-padding">
            <ion-list lines="none">
                <ion-item @click="emit('changeLayout', 'category')">
                    <ion-label>Widok kategorii</ion-label>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsCheckmarkOutline"
                        v-if="layout === 'category'"
                    ></ion-icon>
                </ion-item>
                <ion-item @click="emit('changeLayout', 'products')">
                    <ion-label>Widok produktów</ion-label>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsCheckmarkOutline"
                        v-if="layout === 'products'"
                    ></ion-icon>
                </ion-item>
                <ion-item
                    @click="emit('sortByCategory')"
                    v-if="layout === 'products'"
                >
                    <ion-label>Sortuj po kategorii</ion-label>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsCheckmarkOutline"
                        v-if="lastSort === 'category'"
                    ></ion-icon>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsArrowDown"
                        v-if="dir === 'desc'"
                    ></ion-icon>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsArrowUp"
                        v-else
                    ></ion-icon>
                </ion-item>
                <ion-item
                    @click="emit('sortByName')"
                    v-if="layout === 'products'"
                >
                    <ion-label>Sortuj po nazwie</ion-label>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsCheckmarkOutline"
                        v-if="lastSort === 'name'"
                    ></ion-icon>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsArrowDown"
                        v-if="nameDir === 'desc'"
                    ></ion-icon>
                    <ion-icon
                        slot="end"
                        :icon="ioniconsArrowUp"
                        v-else
                    ></ion-icon>
                </ion-item>
                <ion-item @click="emit('addToPantry')">
                    <ion-label>Dodaj zaznaczone produkty do spiżarni</ion-label>
                </ion-item>
                <ion-item @click="removeAllItems">
                    <ion-label>Usuń wszystkie produkty</ion-label>
                </ion-item>
                <ion-item @click="removeSelectedItems">
                    <ion-label>Usuń zakupione produkty</ion-label>
                </ion-item>
                <ion-item @click="selectAllItems">
                    <ion-label>Zaznacz wszystkie produkty</ion-label>
                </ion-item>
                <ion-item @click="deselectAllItems">
                    <ion-label>Odznacz wszystkie produkty</ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-popover>
</template>

<style lang="scss" scoped>
ion-popover {
    --width: 350px;
}
</style>
