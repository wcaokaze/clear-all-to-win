<template>
    <div class="field">
        <div class="row" v-for="rowIdx in rowCount">
            <Cell class="cell"
                  v-for="columnIdx in columnCount"
                  :style="cellStyle"
                  :is-live="getCell(columnIdx - 1, rowIdx - 1)"
                  @click="onCellClick(columnIdx - 1, rowIdx - 1)"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from "vue-property-decorator";
    import Cell from '@/components/Cell.vue'

    @Component({
        components: {
            Cell
        }
    })
    export default class Home extends Vue {
        private width  = 0;
        private height = 0;

        @Prop() private field?: boolean[][];

        @Emit("cellClick") private onCellClick(x: number, y: number) {}

        private get columnCount(): number {
            if (this.field === undefined) { return 0; }

            return this.field.length;
        }

        private get rowCount(): number {
            if (this.field === undefined) { return 0; }

            return this.field
                .map(column => column.length)
                .reduce((a, b) => Math.max(a, b), /* initialValue = */ 0);
        }

        private getCell(x: number, y: number): boolean {
            const field = this.field ?? [];
            const column = field[x] ?? [];
            return column[y] ?? false;
        }

        private get cellStyle(): string {
            const fieldSize = this.width - 12;
            const cellSize = Math.min(fieldSize / this.columnCount - 8, 64);

            return `
               width:  ${cellSize}px;
               height: ${cellSize}px;
               margin: 4px;
            `;
        }

        private updateWindowSize() {
            this.width  = window.innerWidth;
            this.height = window.innerHeight;
        }

        mounted() {
            this.updateWindowSize();
            window.addEventListener('resize', this.updateWindowSize);
        }

        beforeDestroy() {
            window.removeEventListener('resize', this.updateWindowSize);
        }
    }
</script>

<style scoped lang="stylus">
    .field {
        width fit-content
        align-self center
        padding 4px
        background-color #3b3b3b
        display flex
        flex-direction column
        flex-wrap nowrap

        .row {
            display flex
            flex-direction row
            flex-wrap nowrap
            justify-content center
        }
    }
</style>