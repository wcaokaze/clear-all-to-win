<template>
    <div class="gamerecord">
        <div class="main">
            <DurationDisplay class="duration" :duration-millis="duration"/>

            <Field class="field" :field="field"/>

            <div>
                <button class="back-to-first">1手目に戻る</button>
                <button class="controller-button">1手戻る</button>
                <button class="controller-button">再生</button>
                <button class="controller-button">1手進む</button>
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
        private field: boolean[][] = [];
        private stepIndex = 0;

        private duration = 0;

        @Watch('$route', { immediate: true })
        private fetchGamerecord() {
            axios.get(`${config.apiBaseUrl}/gamerecords/${this.$route.params.id}`)
                .then(res => {
                    this.gamerecord = res.data;
                    this.stepIndex = 0;
                    this.field = this.initialField;
                });
        }

        private get initialField(): boolean[][] {
            const gamerecord = this.gamerecord;
            if (gamerecord == null) { return []; }

            const initialField = gamerecord['initial_field'];
            if (!initialField) { return []; }

            return initialField['cells'];
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
