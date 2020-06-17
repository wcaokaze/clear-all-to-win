<template>
    <div class="home">
        <div class="field">
            <div class="duration">{{formattedTime}}</div>
            <Field :field="field" @cellClick="onCellClick"/>
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
    import Field from '@/components/Field.vue'

    @Component({
        components: {
            Field
        }
    })
    export default class Home extends Vue {
        private field: boolean[][] = [];

        private rule = [
            [false, true, false],
            [true,  true, true ],
            [false, true, false]
        ];

        private duration = 0;
        private timerHandle?: number;

        mounted() {
            this.field = Home.generateRandomField(5, 5, 15, this.rule);
            this.timerHandle = setInterval(() => { this.duration += 1000 }, 1000);
        }

        private get isCleared(): boolean {
            return this.field.every(column => column.every(cell => !cell));
        }

        private get formattedTime(): string {
            const min = Math.floor( this.duration / 1000  / 60).toString();
            const sec = Math.floor((this.duration / 1000) % 60).toString();

            if (sec.length == 1) {
                return `${min}:0${sec}`;
            } else {
                return `${min}:${sec}`;
            }
        }

        @Watch('isCleared')
        private stopTimerIfCleared() {
            if (this.isCleared) {
                clearInterval(this.timerHandle);
            }
        }

        private onCellClick(clickedX: number, clickedY: number) {
            if (this.isCleared) { return; }

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
    .field {
        position relative

        .duration {
            margin 16px
            color #00aac1
            font-size 150%
        }
    }

    .cleared {
        width 100%
        position absolute
        top 168px

        span {
            padding 32px
            color #00c15a
            font-size 150%
            font-weight bold
            background-color #fff
        }
    }
</style>
