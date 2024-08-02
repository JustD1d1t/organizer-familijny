<script setup>
const props = defineProps({
    cancel: {
        type: Function,
        default: () => {},
    },
    confirmModal: {
        type: Function,
        default: () => {},
    },
    shoppingLists: {
        type: Array,
        default: () => [],
    },
    collaboratedShoppingLists: {
        type: Array,
        default: () => [],
    },
})
</script>

<template>
    <div class="inner-content">
        <h2>wybierz listę zakupową</h2>
        <ion-list lines="none">
            <h2>Twoje listy zakupowe</h2>
            <ion-item
                v-for="list in shoppingLists"
                :key="list.id"
                @click="confirmModal(list)"
            >
                <ion-label>{{ list.name }}</ion-label>
            </ion-item>
            <h2 v-if="collaboratedShoppingLists.length">
                Listy do których Cię dodano
            </h2>
            <ion-item
                v-for="list in collaboratedShoppingLists"
                :key="list.id"
                @click="confirmModal(list)"
            >
                <ion-label>{{ list.name }}</ion-label>
            </ion-item>
        </ion-list>
    </div>
</template>
