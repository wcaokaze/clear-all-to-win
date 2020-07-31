<template>
    <div>
        <span class="step-count" v-if="stepCount !== undefined">{{stepCount}}手目</span>
        <span class="duration">{{formattedTime}}</span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component
    export default class DurationDisplay extends Vue {
        @Prop() private durationMillis?: number;
        @Prop() private stepCount?: number;

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
    .step-count {
        margin 0 32px 0 0
        color #18bb8c
        font-size 150%
        font-weight 530
    }

    .duration {
        color #18bb8c
        font-size 150%
        font-weight 530
    }
</style>
