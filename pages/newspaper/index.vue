<script setup>
const newspapersStore = useNewspapersStore()
const { shops, isLoading } = storeToRefs(newspapersStore)

import allshops from '@/data/allshops';

const searchValue = ref("")

const shopsToDisplay = computed(() => {
    return shops?.value.filter((shop) =>
        shop.title.toLowerCase().includes(searchValue.value.toLowerCase())
    )
})

const goToShop = (title) => {
    const searchedIndex = shops.value.findIndex((shop) => shop.title === title)
    navigateTo(`/newspaper/${searchedIndex}`)
}
</script>

<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Gazetki</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div
                v-show="isLoading"
                class="w-full flex flex-col justify-center items-center h-full"
            >
                <ion-spinner name="lines-sharp"></ion-spinner>
                <span>ładowanie sklepów</span>
            </div>
            <UiList v-show="!isLoading">
                <uiInput
                    label="Wyszukaj gazetki"
                    type="text"
                    placeholder="Szukaj..."
                    v-model="searchValue"
                />
            </UiList>
            <UiList v-show="!isLoading">
                <ion-item v-for="shop in shopsToDisplay" :key="shop.title">
                    <div class="w-16 h-16 mr-2 flex items-center">
                        <img
                            :src="allshops[shop.title].img"
                            alt="shop"
                            style="
                                width: 100%;
                                height: 100%;
                                object-fit: contain;
                            "
                        />
                    </div>
                    <ion-label>{{ shop.title }}</ion-label>
                    <uiButton type="tertiary" @click="goToShop(shop.title)">
                        <ion-icon
                            :icon="ioniconsChevronForwardOutline"
                        ></ion-icon>
                    </uiButton>
                </ion-item>
            </UiList>
        </ion-content>
    </ion-page>
</template>
