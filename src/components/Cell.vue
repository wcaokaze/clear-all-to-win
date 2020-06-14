<template>
    <span :class="{ live: isLive, dead: !isLive }"></span>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component
    export default class Cell extends Vue {
        @Prop() private isLive?: boolean;
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