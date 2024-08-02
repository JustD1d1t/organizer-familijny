<template>
    <div class="pill">
        <slot></slot>
    </div>
</template>
<style lang="scss" scoped>
.pill {
    border: 2px solid gray;
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
}
</style>
