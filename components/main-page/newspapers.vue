<script setup>
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay } from "swiper/modules"
const { shopList } = useShops()
const newspapersStore = useNewspapersStore()
const { shops } = storeToRefs(newspapersStore)
const openShop = (shopName) => {
    const shopIndex = shops.value.findIndex((shop) =>
        shop.title.toLowerCase().includes(shopName.toLowerCase())
    )
    if (shopIndex > -1) {
        navigateTo(`/newspaper/${shopIndex}`)
    }
}
</script>
<template>
    <div class="flex justify-between w-full items-center">
        <h2>Gazetki</h2>
        <uiButton class="text-primary" @click="() => navigateTo('/newspaper')" type="tertiary">
            Więcej
        </uiButton>
    </div>
    <swiper :modules="[Autoplay]" :slides-per-view="4.5" :space-between="30">
        <swiper-slide
            v-for="shop in shopList"
            :key="shop.id"
            @click="() => openShop(shop.name)"
        >
            <div class="flex flex-col items-center h-24">
                <div class="h-[70%] flex items-center">
                    <img :src="shop.src" alt="shop image" />
                </div>
                <span class="text-sm mt-auto">{{ shop.name }}</span>
            </div>
        </swiper-slide>
    </swiper>
</template>
