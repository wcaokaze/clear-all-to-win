<template>
    <div class="home">
        <Field :field="field" />
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
    }
</script>

<style lang="stylus">
</style>
