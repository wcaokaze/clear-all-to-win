<template>
    <div class="home">
        <div class="main">
            <DurationDisplay class="duration" :duration-millis="duration"/>

            <Field class="field" :field="field" @cellClick="onCellClick"/>

            <button class="footer-button" @click="reset">やり直す</button>
            <button class="footer-button" @click="isNewGameDialogShown = true">NEW GAME!</button>
        </div>

        <ClearedDialog
                class="cleared-dialog"
                v-if="isCleared"
                :duration-millis="duration"
                :step-count="steps.length"
                :gamerecord-id="gamerecordId"/>

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
    import {fieldModule} from '@/store/FieldModule';
    import ClearedDialog from "@/components/ClearedDialog.vue";
    import axios from 'axios';
    import config from '@/config/api';

    type Step = { time: number, point: number[] };

    @Component({
        components: {
            ClearedDialog,
            Field,
            DurationDisplay,
            NewGameDialog
        }
    })
    export default class Home extends Vue {
        private isNewGameDialogShown = false;

        private startTime = 0;
        private steps: Step[] = [];

        private duration = 0;
        private timerHandle: number|null = null;

        private gamerecordId: string|null = null;

        @Watch('$route', { immediate: true })
        private loadField() {
            this.reset();

            const id = this.$route.params.id;

            if (id) {
                fieldModule.fetchInitialField({ id: id });
            } else if (this.isCleared) {
                fieldModule.setNewRandomField({ width: 4, height: 4 });
            }
        }

        @Watch('isCleared')
        private postGamerecordIfCleared() {
            if (!this.isCleared) { return; }
            if (this.gamerecordId != null) { return; }

            const columnCount = this.field.length;

            const rowCount = this.field
                .map(column => column.length)
                .reduce((a, b) => Math.max(a, b), /* initialValue = */ 0);

            axios.post(`${config.apiBaseUrl}/gamerecords`,
                    {
                        player_name: null,
                        start_time: this.formattedStartTime,
                        initial_field: {
                            width: columnCount,
                            height: rowCount,
                            cells: fieldModule.initialField
                        },
                        rule: fieldModule.rule,
                        steps: this.steps
                    }
                )
                .then(res => {
                    this.gamerecordId = res.data['id'];
                });
        }

        get formattedStartTime(): string {
            const startDate = new Date(this.startTime);
            const year = startDate.getFullYear();
            const month = startDate.getMonth() + 1;
            const day = startDate.getDate();
            const hour = startDate.getHours();
            const minute = startDate.getMinutes();

            let str = "";
            str += year.toString();
            if (month < 10) { str += "0"; }
            str += month.toString();
            if (day < 10) { str += "0"; }
            str += day.toString();
            str += "T";
            if (hour < 10) { str += "0"; }
            str += hour.toString();
            if (minute < 10) { str += "0"; }
            str += minute.toString();
            str += "Z";

            return str;
        }

        get field(): boolean[][] {
            return fieldModule.field;
        }

        get isCleared(): boolean {
            return fieldModule.isCleared;
        }

        private startTimerIfNotStartedYet() {
           if (this.timerHandle == null) {
               this.startTime = Date.now();
               this.timerHandle = setInterval(() => { this.duration += 1000 }, 1000);
           }
        }

        private stopTimer() {
            if (this.timerHandle != null) {
                clearInterval(this.timerHandle);
                this.timerHandle = null;
            }
        }

        @Watch('isCleared')
        private stopTimerIfCleared() {
            if (this.isCleared) {
                this.stopTimer();
            }
        }

        private onSubmitNewFieldSize(width: number, height: number) {
            fieldModule.setNewRandomField({width, height});
            this.isNewGameDialogShown = false;
            this.$router.push('/');
        }

        private reset() {
            this.steps = [];
            this.duration = 0;
            this.stopTimer();
            fieldModule.reset();
        }

        private onCellClick(clickedX: number, clickedY: number) {
            if (this.isCleared) { return; }

            this.startTimerIfNotStartedYet();

            this.steps.push({
                time: Date.now() - this.startTime,
                point: [clickedX, clickedY]
            });

            fieldModule.invert({ targetX: clickedX, targetY: clickedY });
        }
    }
</script>

<style lang="stylus">
    .main {
        position relative

        .duration {
            margin 16px
        }

        .field {
            margin 16px auto
        }

        .footer-button {
            margin 16px 8px
        }
    }

    .cleared-dialog {
        width fit-content
        position absolute
        top 168px
        left 0
        right 0
        margin auto
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
