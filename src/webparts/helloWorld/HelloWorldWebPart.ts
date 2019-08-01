import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, PropertyPaneSlider } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';

import * as strings from 'HelloWorldWebPartStrings';
import HelloWorld from './components/HelloWorld';
import { IHelloWorldProps } from './components/IHelloWorldProps';
import { IODataList } from '@microsoft/sp-odata-types';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IHelloWorldWebPartProps {
  siteurl: string;
  slider: number;
  odatafilter: string;
  listdropdown: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  private dropdownOptions: IPropertyPaneDropdownOption[];
  private listsFetched: boolean;
  // private reactprops = {
  //   siteurl: this.properties.siteurl,
  //   slidervalue: this.properties.slider,
  //   filtervalue: this.properties.odatafilter,
  //   spWebUrl: this.context.pageContext.web.absoluteUrl,
  //   spHttpClient: this.context.spHttpClient,
  //   listdropdown: this.properties.listdropdown
  // }
  public render(): void {
    const element: React.ReactElement<IHelloWorldProps> = React.createElement(
      HelloWorld, 
      {
        siteurl: this.properties.siteurl,
        slidervalue: this.properties.slider,
        filtervalue: this.properties.odatafilter,
        spWebUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        listdropdown: this.properties.listdropdown
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  private fetchLists(url: string): Promise<any> {
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("WARNING - failed to hit URL " + url + ". Error = " + response.statusText);
        return null;
      }
    });
  }

  private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`;
    // var url = `https://cupcuper.sharepoint.com/sites/dev1/_api/web/lists?$filter=Hidden%20eq%20false`;
    return this.fetchLists(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      response.value.map((list: IODataList) => {
        console.log("Found list with title = " + list.Title);
        options.push({ key: list.Id, text: list.Title });
      });

      return options;
    });
  }
  // protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {

  // }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    if (!this.listsFetched) {
      this.fetchOptions().then((response) => {
        this.dropdownOptions = response;
        this.listsFetched = true;
        // now refresh the property pane, now that the promise has been resolved..
        this.onDispose();
      });
    }
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('siteurl', {
                  label: strings.SiteUrlLabel,
                  placeholder: 'Enter server url',
                  value: this.context.pageContext.web.absoluteUrl.split('.com/')[1]
                }),
                PropertyPaneSlider('slider', {
                  label: 'Top',
                  min: 1,
                  max: 20,
                  value: 5
                }),
                PropertyPaneDropdown('listdropdown', {
                  label: 'Lists',
                  options: this.dropdownOptions
                }),
                PropertyPaneTextField('odatafilter', {
                  label: 'OData filter'


                })
              ]
            }
          ]
        }
      ]
    };
  }
}
