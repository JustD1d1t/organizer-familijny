<script setup>
import { Swiper, SwiperSlide } from "swiper/vue"
import { Pagination, Autoplay } from "swiper/modules"

import zakupy_90x90 from "../../assets/img/main/zakupy_90x90.png"

const { components } = useComponents()
</script>

<template>
    <swiper
        :modules="[Pagination, Autoplay]"
        :slides-per-view="1"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 500000 }"
        :space-between="30"
    >
        <swiper-slide
            data-test="swiper-slide-test"
            v-for="cmp in components"
            :key="cmp.id"
        >
            <div
                class="swiper-slide-content flex flex justify-center h-[160px] items-center py-6 px-8 my-4 gap-4"
            >
                <div class="flex flex-col w-8/12">
                    <span class="text-xl font-bold mb-4">{{ cmp.name }}</span>
                    <span class="text-md">{{ cmp.content }}</span>
                </div>
                <div class="w-4/12">
                    <img
                        :src="cmp.src"
                        alt="component image"
                        class="w-full h-full object-cover"
                    />
                </div>
            </div>
        </swiper-slide>
    </swiper>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.swiper-slide {
    color: $white;
    .swiper-slide-content {
        border-radius: 1rem;
    }
    &:first-of-type {
        .swiper-slide-content {
            background: linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.5) 0%,
                rgba(88, 218, 12, 0.5) 100%
            );
        }
    }
    &:nth-child(2) {
        .swiper-slide-content {
            background: linear-gradient(
                90deg,
                rgba(8, 4, 245, 0.5) 0%,
                rgba(54, 126, 7, 0.5) 100%
            );
        }
    }
    &:nth-child(3) {
        .swiper-slide-content {
            background: linear-gradient(
                90deg,
                rgba(152, 212, 12, 0.5) 0%,
                rgba(216, 10, 199, 0.5) 100%
            );
        }
    }
    &:nth-child(4) {
        .swiper-slide-content {
            background: linear-gradient(
                90deg,
                rgba(199, 30, 30, 0.5) 0%,
                rgba(109, 56, 231, 0.5) 100%
            );
        }
    }
}
</style>
