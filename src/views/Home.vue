<template>
    <div class="home">
        <Field :field="field" @cellClick="onCellClick"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
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

        mounted() {
            this.field = Home.generateRandomField(5, 5, 15, this.rule);
        }

        private onCellClick(clickedX: number, clickedY: number) {
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
</style>
