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
    <h2>Gazetki</h2>
    <swiper :modules="[Autoplay]" :slides-per-view="4.5" :space-between="30">
        <swiper-slide
            v-for="shop in shopList"
            :key="shop.id"
            @click="() => openShop(shop.name)"
        >
            <div class="flex flex-col items-center">
                <img :src="shop.src" alt="shop image" class="rounded-full" />
                <span class="text-sm">{{ shop.name }}</span>
            </div>
        </swiper-slide>
    </swiper>
</template>
