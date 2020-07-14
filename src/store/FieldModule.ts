import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";

import axios from 'axios';
import config from '@/config/api';
import store from'./index';

@Module({ dynamic: true, store, name: 'field', namespaced: true })
class FieldModule extends VuexModule {
    private rule = [
        [false, true, false],
        [true,  true, true ],
        [false, true, false]
    ];

    initialField: boolean[][] = [];
    field: boolean[][] = [];

    get isCleared(): boolean {
        return this.field.every(column => column.every(cell => !cell));
    }

    @Mutation
    reset() {
        this.field = JSON.parse(JSON.stringify(this.initialField));
    }

    @Mutation
    private setInitialField(initialField: boolean[][]) {
        this.initialField = initialField;
    }

    @Mutation
    private setField(field: boolean[][]) {
        this.field = field;
    }

    @Action
    fetchInitialField(arg: { id: string }) {
        this.setInitialField([
            [false, true,  false, false],
            [false, true,  true,  true ],
            [true,  true,  true,  false],
            [false, false, true,  false]
        ]);

        this.reset();

        axios.get(`${config.apiBaseUrl}/gamerecords/${arg.id}`)
            .then(res => {
                const cells = res.data['initial_field']['cells'];
                this.setInitialField(cells);
                this.reset();
            });
    }

    @Action
    setNewRandomField(arg: { width: number, height: number }) {
        this.setInitialField(
            FieldModule.generateRandomField(
                arg.width,
                arg.height,
                /* complexity = */ Math.pow(arg.width * arg.height, 3.0 / 4.0),
                this.rule
            )
        );

        this.reset();
    }

    @Action
    invert(arg: { targetX: number, targetY: number }) {
        const field = JSON.parse(JSON.stringify(this.field));
        FieldModule.invert(field, arg.targetX, arg.targetY, this.rule);
        this.setField(field);
    }

    private static invert(field: boolean[][],
                          targetX: number,
                          targetY: number,
                          rule: boolean[][])
    {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const x = targetX + dx;
                const y = targetY + dy;

                if (x < 0 || x >= field   .length) { continue; }
                if (y < 0 || y >= field[x].length) { continue; }

                if (rule[dx + 1][dy + 1]) {
                    field[x][y] = !field[x][y];
                }
            }
        }
    }

    private static generateRandomField(
        columnCount: number,
        rowCount: number,
        complexity: number,
        rule: boolean[][]
    ): boolean[][] {
        const field = Array.from(
            Array(columnCount),
            () => Array.from(
                Array(rowCount),
                () => false
            )
        );

        for (let i = 0; i < complexity; i++) {
            const x = Math.floor(Math.random() * columnCount);
            const y = Math.floor(Math.random() * rowCount);

            FieldModule.invert(field, x, y, rule);
        }

        return field;
    }
}

export const fieldModule = getModule(FieldModule)
