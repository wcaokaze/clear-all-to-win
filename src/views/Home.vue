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
            this.generateRandomField(5, 5);
        }

        private onCellClick(clickedX: number, clickedY: number) {
            const field = this.field.concat();
            const rule = this.rule;

            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const x = clickedX + dx;
                    const y = clickedY + dy;

                    if (x < 0 || x >= field.length) { continue; }
                    if (y < 0 || y >= field.length) { continue; }

                    if (rule[dx + 1][dy + 1]) {
                        field[x][y] = !field[x][y];
                    }
                }
            }

            this.field = field;
        }

        private generateRandomField(columnCount: number, rowCount: number) {
            this.field = Array.from(Array(columnCount), () =>
                Array.from(Array(rowCount), () =>
                    Math.random() > 0.5
                )
            );
        }
    }
</script>

<style lang="stylus">
</style>
