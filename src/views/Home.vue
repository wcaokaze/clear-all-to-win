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
        private field: boolean[][] = [
            [true,  false, false],
            [true,  true,  false],
            [false, true,  true ]
        ];

        private onCellClick(x: number, y: number) {
            const field = this.field.concat();
            field[y][x] = !field[y][x];
            this.field = field;
        }
    }
</script>

<style lang="stylus">
</style>
