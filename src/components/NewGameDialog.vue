<template>
    <div class="dialog">
        <div>
            <label>
                <input type="number" v-model="inputFieldWidth">
                ×
                <input type="number" v-model="inputFieldHeight">
            </label>
        </div>

        <button @click="onButtonClick">スタート</button>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Vue} from "vue-property-decorator";

    @Component
    export default class NewGameDialog extends Vue {
        private inputFieldWidth  = '5';
        private inputFieldHeight = '5';

        private get fieldWidth(): number {
            const width = parseInt(this.inputFieldWidth);

            if (isNaN(width)) {
                return 5;
            } else {
                return width;
            }
        }

        private get fieldHeight(): number {
            const height = parseInt(this.inputFieldHeight);

            if (isNaN(height)) {
                return 5;
            } else {
                return height;
            }
        }

        @Emit() private submit(width: number, height: number) {}

        private onButtonClick() {
            this.submit(this.fieldWidth, this.fieldHeight);
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