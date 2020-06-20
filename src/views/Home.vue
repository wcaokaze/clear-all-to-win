<template>
    <div class="home">
        <div class="main">
            <DurationDisplay class="duration" :duration-millis="duration"/>
            <Field class="field" :field="field" @cellClick="onCellClick"/>
            <button class="retry" @click="reset">やり直す</button>
        </div>
        <div class="cleared" v-if="isCleared">
            <span>
                CLEAR
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import Field from '@/components/Field.vue';
    import DurationDisplay from "@/components/DurationDisplay.vue";
    import {fieldModule} from '@/store/FieldModule';

    @Component({
        components: {
            Field,
            DurationDisplay
        }
    })
    export default class Home extends Vue {
        private duration = 0;
        private timerHandle: number|null = null;

        mounted() {
            fieldModule.setNewRandomField();
        }

        get field(): boolean[][] {
            return fieldModule.field;
        }

        get isCleared(): boolean {
            return fieldModule.isCleared;
        }

        private startTimerIfNotStartedYet() {
           if (this.timerHandle == null) {
               this.timerHandle = setInterval(() => { this.duration += 1000 }, 1000);
           }
        }

        private stopTimer() {
            if (this.timerHandle != null) {
                clearInterval(this.timerHandle);
                this.timerHandle = null;
            }
        }

        @Watch('isCleared')
        private stopTimerIfCleared() {
            if (this.isCleared) {
                this.stopTimer();
            }
        }

        private reset() {
            this.duration = 0;
            this.stopTimer();
            fieldModule.reset();
        }

        private onCellClick(clickedX: number, clickedY: number) {
            if (this.isCleared) { return; }

            this.startTimerIfNotStartedYet();
            fieldModule.invert({ targetX: clickedX, targetY: clickedY });
        }
    }
</script>

<style lang="stylus">
    .main {
        position relative

        .duration {
            margin 16px
        }

        .field {
            margin 16px auto
        }

        .retry {
            margin 16px
        }
    }

    .cleared {
        width 100%
        position absolute
        top 168px
        margin auto

        span {
            padding 32px
            color #73e5bf
            font-size 150%
            font-weight bold
            background-color #aaaaaa
        }
    }
</style>
