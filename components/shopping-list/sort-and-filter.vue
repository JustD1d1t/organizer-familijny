<script setup>
const emits = defineEmits([
    "changeLayout",
    "sortByCategory",
    "sortByName",
    "openPantryModal",
    "removeAllItems",
    "removeSelectedItems",
    "selectAllItems",
    "deselectAllItems",
])
const props = defineProps({
    layout: {
        type: String,
        required: true,
    },
    dir: {
        type: String,
        required: true,
    },
    nameDir: {
        type: String,
        required: true,
    },
    lastSort: {
        type: String,
        required: true,
    },
})
</script>
<template>
    <PopoverContainer sortId="shopping-list-sort">
        <PopoverItem
            @click="emits('changeLayout', 'category')"
            label="Widok kategorii"
            :active="layout === 'category'"
        />
        <PopoverItem
            @click="emits('changeLayout', 'products')"
            label="Widok produktów"
            :active="layout === 'products'"
        />
        <SortItem
            label="Sortuj po kategorii"
            @click="emits('sortByCategory')"
            type="amount"
            :dir="dir"
            :active="lastSort === 'category'"
        />
        <SortItem
            label="Sortuj po nazwie"
            @click="emits('sortByName')"
            type="amount"
            :dir="nameDir"
            :active="lastSort === 'name'"
        />
        <PopoverItem
            @click="emits('openPantryModal')"
            label="Dodaj zaznaczone produkty do spiżarni"
        />

        <PopoverItem
            @click="emits('removeAllItems')"
            label="Usuń wszystkie
        produkty"
        />
        <PopoverItem
            @click="emits('removeSelectedItems')"
            label="Usuń zakupione produkty"
        />
        <PopoverItem
            @click="emits('selectAllItems')"
            label="Zaznacz wszystkie produkty"
        />
        <PopoverItem
            @click="emits('deselectAllItems')"
            label="Odznacz wszystkie produkty"
        />
    </PopoverContainer>
</template>
