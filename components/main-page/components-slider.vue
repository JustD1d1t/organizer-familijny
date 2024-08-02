<script setup>
import { Swiper, SwiperSlide } from "swiper/vue"
import { Pagination, Autoplay } from "swiper/modules"

const { components } = useComponents()
</script>

<template>
    <swiper
        :modules="[Pagination, Autoplay]"
        :slides-per-view="1"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 3000 }"
    >
        <swiper-slide
            data-test="swiper-slide-test"
            v-for="cmp in components"
            :key="cmp.id"
        >
            <uiCard
                class="flex flex-col h-[250px] flex justify-center items-center"
            >
                {{ cmp.name }}
            </uiCard>
        </swiper-slide>
    </swiper>
</template>
