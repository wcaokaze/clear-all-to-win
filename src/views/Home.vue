<template>
    <div class="home">
        <div class="field">
            <Cell class="cell" />
            <Cell class="cell"/>
            <Cell class="cell"/>
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
    export default class Home extends Vue {}
</script>

<style lang="stylus">
    .field {
        width 100%
        display flex
        flex-direction row
        flex-wrap nowrap
        justify-content center

        .cell {
            width  48px
            height 48px
            margin 4px
        }
    }
</style>
