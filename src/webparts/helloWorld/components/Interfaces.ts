import { SPHttpClient } from "@microsoft/sp-http";

export interface IListItem{
    ID:string;
    Title:string;
    Modified:string;
    EditorId:string;
  }
  export interface IListItem2{
    ID:string;
    Title:string;
    Modified:string;
    ModifiedBy:string;
  }

export interface IProps {
    siteurl: string;
    slidervalue: number;
    filtervalue: string;
    spWebUrl: string;
    spHttpClient: SPHttpClient;
    listdropdown: string;
}