<template>
    <div class="home">
        <div class="field">
            <div class="row" v-for="row in field">
                <Cell class="cell" v-for="cell in row" :style="cellStyle" :is-live="cell"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import Cell from '@/components/Cell.vue'

    @Component({
        components: {
            Cell
        }
    })
    export default class Home extends Vue {
        private width  = 0;
        private height = 0;

        private field: boolean[][] = [
            [true,  false, false],
            [true,  true,  false],
            [false, true,  true ]
        ];

        private get cellStyle(): string {
            const cellSize = Math.min(this.width / 3.0 - 8, 64);

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

<style lang="stylus">
    .field {
        width 100%
        display flex
        flex-direction column
        flex-wrap nowrap

        .row {
            width 100%
            display flex
            flex-direction row
            flex-wrap nowrap
            justify-content center
        }
    }
</style>
