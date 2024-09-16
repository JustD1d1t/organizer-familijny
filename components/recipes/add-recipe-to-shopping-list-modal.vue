<script setup>
const shoppingListsStore = useShoppingListsStore()
const { updateShoppingList, getAllShoppingLists } = shoppingListsStore
const { shoppingLists, collaboratedShoppingLists } =
    storeToRefs(shoppingListsStore)

const props = defineProps({
    recipe: {
        type: Object,
        default: () => {},
    },
    cancel: {
        type: Function,
        default: () => {},
    },
    confirmModal: {
        type: Function,
        default: () => {},
    },
})

const isOpen = ref(false)
const toastMessage = ref("")

const handleRecipeToShoppingList = async (list) => {
    const recipes = list.recipes

    isOpen.value = true

    if (recipes.find((rec) => rec.name === props.recipe.name)) {
        const recipeIndex = recipes.findIndex(
            (rec) => rec.name === props.recipe.name
        )
        toastMessage.value = `Przepis "${props.recipe.name}" został usunięty z listy "${list.name}"`
        recipes.splice(recipeIndex, 1)
    } else {
        toastMessage.value = `Przepis "${props.recipe.name}" został dodany do listy "${list.name}"`
        recipes.push(props.recipe)
    }

    setTimeout(() => {
        isOpen.value = false
    }, 2000)

    await updateShoppingList({
        ...list,
        recipes,
    })
    list.recipes = recipes
}

onMounted(async () => {
    await getAllShoppingLists()
})
</script>
<template>
    <div class="inner-content py-2" v-if="recipe">
        <ion-header class="text-lg text-center"
            >Wybierz listę do której chcesz dodać przepis</ion-header
        >
        <ion-list :inset="true" lines="inset">
            <ion-list-header> Twoje listy </ion-list-header>
            <ion-item
                @click="() => handleRecipeToShoppingList(list)"
                v-for="list in shoppingLists"
                :key="list.id"
            >
                <ion-text
                    v-if="!list.recipes.find((rec) => rec.name === recipe.name)"
                >
                    <p>{{ list.name }}</p>
                </ion-text>
                <ion-text v-else>
                    <span class="line-through">{{ list.name }} </span>
                    <span>&nbsp;dodane</span>
                </ion-text>
            </ion-item>
        </ion-list>
        <ion-header
            class="text-lg"
            v-if="collaboratedShoppingLists && collaboratedShoppingLists.length"
            >Listy do których zostałeś zaproszony</ion-header
        >
        <ion-list :inset="true" lines="inset">
            <ion-item
                @click="() => handleRecipeToShoppingList(list)"
                v-for="list in collaboratedShoppingLists"
                :key="list.id"
            >
                <ion-text
                    v-if="!list.recipes.find((rec) => rec.name === recipe.name)"
                >
                    <p>{{ list.name }}</p>
                </ion-text>
                <ion-text v-else>
                    <span class="line-through">{{ list.name }} </span>
                    <span>&nbsp;dodane</span>
                </ion-text>
            </ion-item>
        </ion-list>
    </div>
</template>
