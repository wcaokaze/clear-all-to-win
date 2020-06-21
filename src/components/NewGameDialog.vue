<template>
    <div class="dialog">
        <div>
            <label>
                <input v-model="inputWidth">
                ×
                <input v-model="inputHeight">
            </label>
        </div>

        <button @click="onButtonClick">スタート</button>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Vue, Watch} from "vue-property-decorator";
    import {Debounce} from "vue-debounce-decorator";

    @Component
    export default class NewGameDialog extends Vue {
        private inputWidth  = '5';
        private inputHeight = '5';

        private normalizedWidth  = 5;
        private normalizedHeight = 5;

        private static normalize(input: string): number|null {
            if (input == '') { return 0; }

            const i = parseInt(input);

            if (isNaN(i)) {
                return null;
            } else {
                return i;
            }
        }

        @Watch('inputWidth')
        private normalizedInputWidth() {
            const w = NewGameDialog.normalize(this.inputWidth);

            if (w != null) {
                this.normalizedWidth = w;
            }
        }

        @Watch('inputHeight')
        private normalizedInputHeight() {
            const h = NewGameDialog.normalize(this.inputHeight);

            if (h != null) {
                this.normalizedHeight = h;
            }
        }

        @Watch('inputWidth')
        @Debounce(1000)
        private setNormalizedWidth() {
            if (this.inputWidth == '') { return; }

            if (this.inputWidth != this.normalizedWidth.toString()) {
                this.inputWidth = this.normalizedWidth.toString();
            }
        }

        @Watch('inputHeight')
        @Debounce(1000)
        private setNormalizedHeight() {
            if (this.inputHeight == '') { return; }

            if (this.inputHeight != this.normalizedHeight.toString()) {
                this.inputHeight = this.normalizedHeight.toString();
            }
        }

        @Emit() private submit(width: number, height: number) {}

        private onButtonClick() {
            this.submit(this.normalizedWidth, this.normalizedHeight);
        }
    }
</script>

<style scoped lang="stylus">
    .dialog {
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
</style>