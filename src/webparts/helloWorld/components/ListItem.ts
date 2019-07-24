import { IListItem } from "./Interfaces";

export class ListItem {
    public ID: string;
    public Title: string;
    public Modified: string;
    public ModifiedBy: string;
    constructor(item: IListItem) {
        this.ID = item.ID;
        this.Title = item.Title;
        this.Modified = item.Modified;
        this.ModifiedBy = item.EditorId;
    }
}