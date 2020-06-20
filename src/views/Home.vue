<template>
    <div class="home">
        <div class="main">
            <DurationDisplay class="duration" :duration-millis="duration"/>

            <Field class="field" :field="field" @cellClick="onCellClick"/>

            <button class="footer-button" @click="reset">やり直す</button>
            <button class="footer-button" @click="isNewGameDialogShown = true">NEW GAME!</button>
        </div>

        <div class="cleared" v-if="isCleared">
            <span>
                CLEAR
            </span>
        </div>

        <div class="new-game-dialog" v-if="isNewGameDialogShown">
            <div class="background" @click="isNewGameDialogShown = false"/>

            <div class="foreground">
                <div>
                    <label>
                        <input type="number" v-model="inputFieldWidth">
                        ×
                        <input type="number" v-model="inputFieldHeight">
                    </label>
                </div>

                <button @click="regenerateField(); isNewGameDialogShown = false">
                    スタート
                </button>
            </div>
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
        private isNewGameDialogShown = false;
        private inputFieldWidth  = '5';
        private inputFieldHeight = '5';

        private duration = 0;
        private timerHandle: number|null = null;

        mounted() {
            this.regenerateField();
        }

        private get fieldWidth(): number {
            const width = parseInt(this.inputFieldWidth);

            if (isNaN(width)) {
                return 5;
            } else {
                return width;
            }
        }

        private get fieldHeight(): number {
            const height = parseInt(this.inputFieldHeight);

            if (isNaN(height)) {
                return 5;
            } else {
                return height;
            }
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

        private regenerateField() {
            fieldModule.setNewRandomField({
                width:  this.fieldWidth,
                height: this.fieldHeight
            });
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

        .footer-button {
            margin 16px 8px
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

    .new-game-dialog {
        width 100%
        height 100%
        position absolute
        top 0
        padding 160px 0

        .background {
            width 100%
            height 100%
            position absolute
            top 0
            background-color rgba(0, 0, 0, 0.5)
        }

        .foreground {
            width fit-content
            position absolute
            left 50%
            transform translateX(-50%)
            padding 16px 32px
            background-color #aaaaaa

            div {
                margin 8px

                input {
                    width 3em
                }
            }

            button {
                margin 8px
            }
        }
    }
</style>
