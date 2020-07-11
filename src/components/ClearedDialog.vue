<template>
    <div class="dialog">
        <div class="caption">CLEAR!!</div>

        <span class="time">{{formattedTime}}</span>
        <span class="step-count">{{stepCount}}手</span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component
    export default class ClearedDialog extends Vue {
        @Prop() private durationMillis?: number;
        @Prop() private stepCount?: number;

        private get formattedTime(): string {
            const duration = this.durationMillis ?? 0;
            const min = Math.floor( duration / 1000  / 60).toString();
            const sec = Math.floor((duration / 1000) % 60).toString();

            if (sec.length == 1) {
                return `${min}分0${sec}秒`;
            } else {
                return `${min}分${sec}秒`;
            }
        }
    }
</script>

<style scoped lang="stylus">
    .dialog {
        padding 16px 24px
        background-color #aaaaaa

        .caption {
            margin 16px
            color #73e5bf
            font-size 150%
            font-weight bold
        }

        .time, .step-count {
            margin 4px
            color #3b3b3b
        }
    }
</style>