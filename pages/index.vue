<script setup>
const pages = usePages()
const uid = localStorage.getItem("uid")

const openPersonMenu = async () => {
    await menuController.open("person")
}
const nickname = localStorage.getItem("nickname")
</script>

<template>
    <ion-page id="main-content">
        <ion-header>
            <ion-toolbar>
                <ion-title>Cześć, {{ nickname }}!</ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="openPersonMenu">
                        <ion-icon slot="icon-only" :icon="ioniconsPerson" />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" v-if="uid">
            <MainPageComponentsSlider />

            <div
                class="w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto"
            >
                <uiCard
                    v-for="page in pages.pages"
                    :key="page.name"
                    class="flex flex-col m-2 py-12 px-8 text-center"
                    @click="() => navigateTo(page.path)"
                >
                    {{ page.name }}
                </uiCard>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped>
.swiper {
    padding-bottom: 1rem;
}
</style>
