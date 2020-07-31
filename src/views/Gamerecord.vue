<template>
    <div class="gamerecord">
        <div class="main">
            <DurationDisplay class="duration"
                    :step-count="stepIndex"
                    :duration-millis="duration"/>

            <Field class="field" :field="field"/>

            <div>
                <button class="back-to-first"
                        @click="stopPlayingGamerecord(); reset()">
                    0手目に戻る
                </button>

                <button class="controller-button"
                        @click="stopPlayingGamerecord(); prevStep()">
                    1手戻る
                </button>

                <button class="controller-button"
                        @click="startToPlayGamerecord">
                    再生
                </button>

                <button class="controller-button"
                        @click="stopPlayingGamerecord(); nextStep()">
                    1手進む
                </button>
            </div>
            <div>
                <button class="footer-button" @click="startToPlayThisField">このステージをプレイする</button>
                <button class="footer-button" @click="isNewGameDialogShown = true">NEW GAME!</button>
            </div>
        </div>

        <div class="new-game-dialog" v-show="isNewGameDialogShown">
            <div class="background" @click="isNewGameDialogShown = false"/>
            <NewGameDialog class="foreground" @submit="onSubmitNewFieldSize"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import Field from '@/components/Field.vue';
    import DurationDisplay from "@/components/DurationDisplay.vue";
    import NewGameDialog from "@/components/NewGameDialog.vue";
    import {fieldModule} from "@/store/FieldModule";
    import axios from 'axios';
    import config from '@/config/api';

    @Component({
        components: {
            Field,
            DurationDisplay,
            NewGameDialog
        }
    })
    export default class Gamerecord extends Vue {
        private isNewGameDialogShown = false;

        private gamerecord: any = null;
        private stepIndex = 0;

        private playerTimerHandle: number|null = null;

        private duration = 0;

        @Watch('$route', { immediate: true })
        private fetchGamerecord() {
            axios.get(`${config.apiBaseUrl}/gamerecords/${this.$route.params.id}`)
                .then(res => {
                    const gamerecord = res.data;
                    this.gamerecord = gamerecord;

                    const initialField = gamerecord['initial_field'];

                    let cells;

                    if (initialField) {
                        cells = initialField['cells'];
                    } else {
                        cells = [];
                    }

                    this.stepIndex = 0;

                    fieldModule.setInitialField(cells);
                    fieldModule.setField(cells);

                    fieldModule.setRule(gamerecord['rule']);
                });
        }

        get field(): boolean[][] {
            return fieldModule.field;
        }

        private reset() {
            this.stepIndex = 0;
            this.duration = 0;
            fieldModule.reset();
        }

        private startToPlayGamerecord() {
            if (this.playerTimerHandle != null) { return; }

            this.playerTimerHandle = setInterval(() => this.nextStep(), 500);
        }

        private stopPlayingGamerecord() {
            if (this.playerTimerHandle == null) { return; }
            clearInterval(this.playerTimerHandle);
            this.playerTimerHandle = null;
        }

        private nextStep() {
            const steps = this.gamerecord['steps'] ?? [];

            if (this.stepIndex > steps.length - 1) { return; }

            const step = steps[this.stepIndex];
            const point = step['point'];

            this.stepIndex++;

            fieldModule.invert({ targetX: point[0], targetY: point[1] });
            this.duration = step['time'];
        }

        private prevStep() {
            const steps = this.gamerecord['steps'] ?? [];

            if (this.stepIndex <= 0) { return; }

            this.stepIndex--;

            const step = steps[this.stepIndex];
            const point = step['point'];

            fieldModule.invert({ targetX: point[0], targetY: point[1] });

            if (this.stepIndex > 0) {
                this.duration = steps[this.stepIndex - 1]['time'];
            } else {
                this.duration = 0;
            }
        }

        private startToPlayThisField() {
            this.$router.push(`/${this.$route.params.id}`);
        }

        private onSubmitNewFieldSize(width: number, height: number) {
            fieldModule.setNewRandomField({width, height});
            this.isNewGameDialogShown = false;
            this.$router.push('/');
        }
    }
</script>

<style scoped lang="stylus">
    .gamerecord {
        position relative

        .duration {
            margin 16px
        }

        .field {
            margin 16px auto
        }

        .back-to-first {
            margin 8px 32px 8px 0
        }

        .controller-button {
            margin 24px 4px 8px 4px
        }

        .footer-button {
            margin 16px 8px
        }
    }

    .new-game-dialog {
        width 100%
        height 100%
        position absolute
        top 0
        padding 160px 0

        .background {
            width 100%
            height 100%
            position absolute
            top 0
            background-color rgba(0, 0, 0, 0.5)
        }

        .foreground {
            width fit-content
            position absolute
            left 50%
            transform translateX(-50%)
        }
    }
</style>
