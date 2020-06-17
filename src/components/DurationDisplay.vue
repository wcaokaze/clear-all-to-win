<template>
    <div class="duration">{{formattedTime}}</div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component
    export default class DurationDisplay extends Vue {
        @Prop() private durationMillis?: number;

        private get formattedTime(): string {
            const duration = this.durationMillis ?? 0;
            const min = Math.floor( duration / 1000  / 60).toString();
            const sec = Math.floor((duration / 1000) % 60).toString();

            if (sec.length == 1) {
                return `${min}:0${sec}`;
            } else {
                return `${min}:${sec}`;
            }
        }
    }
</script>

<style scoped lang="stylus">
    .duration {
        margin 16px
        color #00aac1
        font-size 150%
    }
</style>