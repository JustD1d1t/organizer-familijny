<script setup>
const paletteToggle = ref(false)
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")

const toggleDarkPalette = (shouldAdd) => {
    document.body.classList.toggle("dark", shouldAdd)
    // document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
}

const initializeDarkPalette = (isDark) => {
    paletteToggle.value = isDark
    toggleDarkPalette(isDark)
}

prefersDark.addEventListener("change", (mediaQuery) =>
    initializeDarkPalette(mediaQuery.matches)
)

const toggleChange = (ev) => {
    toggleDarkPalette(ev.detail.checked)
}

onMounted(() => {
    initializeDarkPalette(prefersDark.matches)
})
</script>
<template>
    <ion-menu side="start" menu-id="settings" content-id="main-content">
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Użytkownik</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list lines="none" :inset="true">
                <ion-item>
                    <ion-toggle
                        :checked="paletteToggle"
                        @ionChange="toggleChange($event)"
                        justify="space-between"
                        >Dark Mode</ion-toggle
                    >
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-menu>
</template>
