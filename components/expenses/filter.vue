<script setup>
import { computed } from "vue"

const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth() + 1

const firstDayOfMonth = computed(() => {
    const formattedMonth = currentMonth.toString().padStart(2, "0")
    return `01.${formattedMonth}`
})

const lastDayOfMonth = computed(() => {
    const lastDay = new Date(currentYear, currentMonth, 0).getDate()
    const formattedMonth = currentMonth.toString().padStart(2, "0")
    return `${lastDay}.${formattedMonth}`
})

const showDateFilters = () => {
    console.log("showDateFilters")
}
</script>
<template>
    <div class="p-2">
        <div class="date-container">
            <uiPill @click="showDateFilters">
                <span class="text-sm"
                    >{{ firstDayOfMonth }} - {{ lastDayOfMonth }}</span
                >
            </uiPill>
        </div>
    </div>
</template>
