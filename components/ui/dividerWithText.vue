<template>
    <span>
        <slot />
    </span>
</template>

<style lang="scss" scoped>
span {
    display: flex;
    width: 100%;
    text-align: center;
    &::before,
    &::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid #000;
        transform: translateY(-50%);
    }
    &::before {
        margin-right: 0.5em;
    }
    &::after {
        margin-left: 0.5em;
    }
}
</style>
