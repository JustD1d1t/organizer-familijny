<script setup>
const pages = usePages()
const userStore = useUserStore()
const { nickname, uid } = storeToRefs(userStore)

const openPersonMenu = async () => {
    await menuController.open("person")
}
</script>

<template>
    <ion-page id="main-content">
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title>Cześć, {{ nickname }}!</ion-title>
                <ion-buttons slot="end">
                    <uiButton type="tertiary" @click="openPersonMenu">
                        <ion-icon slot="icon-only" :icon="ioniconsPerson" />
                    </uiButton>
                </ion-buttons>
            </ion-toolbar>
            
        </ion-header>

        <ion-content :fullscreen="true" v-if="uid">
            <MainPageComponentsSlider />

            <div
                class="w-full py-2 grid-cols-2 gap-4 grid auto-rows-max overflow-auto py-8"
            >
                <UiImageWithTitle
                    v-for="page in pages.pages"
                    :key="page.name"
                    :src="page.src"
                    :alt="page.src"
                    @click="navigateTo(page.path)"
                >
                    <span>{{ page.name }}</span>
                </UiImageWithTitle>
            </div>
            <MainPageNewspapers />
        </ion-content>
    </ion-page>
</template>

<style scoped lang="scss">
.swiper {
    padding-bottom: 1rem;
}
</style>
