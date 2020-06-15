<template>
    <span :class="{ live: isLive, dead: !isLive }" @click="onClick"></span>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from "vue-property-decorator";

    @Component
    export default class Cell extends Vue {
        @Prop() private isLive?: boolean;

        @Emit("click") private onClick() {}
    }
</script>

<style scoped lang="stylus">
    span {
        background-clip padding-box

        &.live {
            background-color aquamarine
        }

        &.dead {
            background-color gray
        }
    }
</style>