import { SPHttpClient } from "@microsoft/sp-http";

export interface IHelloWorldProps {
  siteurl: string;
  slidervalue: number;
  filtervalue: string;
  spWebUrl: string;
  spHttpClient: SPHttpClient;
  listdropdown: string;
}
