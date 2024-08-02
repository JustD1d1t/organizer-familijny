<template>
    <ion-item class="border-0 grow flex items-start justify-between my-1">
        <span class="w-10/12 start-slot">
            <slot name="start" />
        </span>
        <span class="end-slot">
            <slot name="end" />
        </span>
    </ion-item>
</template>
