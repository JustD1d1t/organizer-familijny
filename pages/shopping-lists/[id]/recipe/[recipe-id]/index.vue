<script setup>
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { handleIngredientChange, removeIngredient } = shoppingListsStore
const { currentRecipe } = storeToRefs(shoppingListsStore)
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>{{ currentRecipe.name }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list lines="none">
                <UiListCheckboxItem
                    v-for="ingredient in currentRecipe.ingredients"
                    :key="ingredient.key"
                    :item="ingredient"
                    :handle-item-change="
                        async () => await handleIngredientChange(ingredient)
                    "
                    :removeItem="() => removeIngredient(ingredient)"
                >
                    <template #label>
                        <div class="flex flex-col grow ml-4">
                            <ion-label class="border-0 grow"
                                >{{ ingredient.quantity }} {{ ingredient.name }}
                            </ion-label>
                        </div>
                    </template>
                </UiListCheckboxItem>
            </ion-list>
        </ion-content>
    </ion-page>
</template>
