export class Position {
    private row_id: number;
    private col_id: number;

    public constructor(row_id: number, col_id : number) {
        this.row_id = row_id;
        this.col_id = col_id;
    }

    public getRowId(): number {
        return this.row_id;
    }

    public getColumnId(): number {
        return this.col_id;
    }

}