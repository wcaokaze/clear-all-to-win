<template>
    <div class="dialog">
        <div class="caption">CLEAR!!</div>

        <div class="score">
            {{formattedTime}}、
            {{stepCount}}手
        </div>

        <div v-show="gamerecordId != null">
            <a :href="tweetButtonHref"
               class="twitter-share-button" data-show-count="false" data-lang="ja">Tweet</a>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import config from '@/config/api';

    @Component
    export default class ClearedDialog extends Vue {
        @Prop() private durationMillis?: number;
        @Prop() private stepCount?: number;
        @Prop() private gamerecordId?: string|null;

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

        private get tweetButtonHref(): string {
            const url = 'https://twitter.com/intent/tweet?lang=ja';
            const message = `#全消ししたら勝ち を${this.formattedTime}、${this.stepCount}手でクリアしました！`;
            const gamerecordUrl = `${config.webBaseUrl}/gamerecord/${this.gamerecordId}`;

            return `${url}&text=${encodeURI(message)}&url=${encodeURI(gamerecordUrl)}`;
        }

        mounted() {
            const scriptElement = document.createElement('script');
            scriptElement.async = true;
            scriptElement.src = 'https://platform.twitter.com/widgets.js';
            document.head.appendChild(scriptElement);
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

        .score {
            margin 4px
            color #3b3b3b
        }
    }
</style>
