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

    @Component({
        components: {
            Field,
            DurationDisplay
        }
    })
    export default class Home extends Vue {
        private initialField: boolean[][] = [];
        private field: boolean[][] = [];

        private rule = [
            [false, true, false],
            [true,  true, true ],
            [false, true, false]
        ];

        private duration = 0;
        private timerHandle: number|null = null;

        mounted() {
            this.initialField = Home.generateRandomField(5, 5, 15, this.rule);
            this.field = JSON.parse(JSON.stringify(this.initialField));
        }

        private get isCleared(): boolean {
            return this.field.every(column => column.every(cell => !cell));
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
            this.field = JSON.parse(JSON.stringify(this.initialField));
        }

        private onCellClick(clickedX: number, clickedY: number) {
            if (this.isCleared) { return; }

            this.startTimerIfNotStartedYet();

            const field = this.field.concat();
            Home.invert(field, clickedX, clickedY, this.rule);
            this.field = field;
        }

        private static invert(field: boolean[][],
                              targetX: number,
                              targetY: number,
                              rule: boolean[][])
        {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const x = targetX + dx;
                    const y = targetY + dy;

                    if (x < 0 || x >= field.length) { continue; }
                    if (y < 0 || y >= field.length) { continue; }

                    if (rule[dx + 1][dy + 1]) {
                        field[x][y] = !field[x][y];
                    }
                }
            }
        }

        private static generateRandomField(
            columnCount: number,
            rowCount: number,
            complexity: number,
            rule: boolean[][]
        ): boolean[][] {
            const field = Array.from(
                Array(columnCount),
                () => Array.from(
                    Array(rowCount),
                    () => false
                )
            );

            for (let i = 0; i < complexity; i++) {
                const x = Math.floor(Math.random() * columnCount);
                const y = Math.floor(Math.random() * rowCount);

                this.invert(field, x, y, rule);
            }

            return field;
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
