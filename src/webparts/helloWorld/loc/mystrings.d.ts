declare interface IHelloWorldWebPartStrings {
  SListLabel: string;
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  SiteUrlLabel: string;
  SliderLabel: string;
  ODataLabel: string;
  SListLabel: string;
  FieldLabel: string;
  WebpartLabel: string;
}

declare module 'HelloWorldWebPartStrings' {
  const strings: IHelloWorldWebPartStrings;
  export = strings;
}
