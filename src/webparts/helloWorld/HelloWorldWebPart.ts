import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, PropertyPaneSlider } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';

import * as strings from 'HelloWorldWebPartStrings';
import HelloWorld from './components/HelloWorld';
import { IHelloWorldProps } from './components/IHelloWorldProps';
import { IODataList } from '@microsoft/sp-odata-types';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import pnp from 'sp-pnp-js';

export interface IHelloWorldWebPartProps {
  siteurl: string;
  slider: number;
  odatafilter: string;
  listdropdown: string;
  fieldfilter: string;
  webparttitle: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  private dropdownOptions: IPropertyPaneDropdownOption[];
  private listsFetched: boolean;
  private urlvalid: boolean = true;
  public render(): void {
    const element: React.ReactElement<IHelloWorldProps> = React.createElement(
      HelloWorld,
      {
        siteurl: this.properties.siteurl,
        slidervalue: this.properties.slider,
        filtervalue: this.properties.odatafilter,
        spWebUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        listdropdown: this.properties.listdropdown,
        fieldfilter: this.properties.fieldfilter,
        webparttitle: this.properties.webparttitle
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
  private async fetchLists(): Promise<any> {
    const pnp = await import(/* webpackChunkName: "pnplib" */ 'sp-pnp-js').then((pnp) => {
      // return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      return pnp.sp.web.lists.get().then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("WARNING - failed to hit URL. Error = " + response.statusText);
          return null;
        }
      });
    });
    console.log(pnp);
  }
  private UrlExists(url: string) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
  }
  private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    // this.urlvalid = this.UrlExists(this.properties.siteurl);
    // console.log(this.properties.siteurl);
    // var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`;
    // var url = `https://cupcuper.sharepoint.com/sites/dev1/_api/web/lists?$filter=Hidden%20eq%20false`;
    return this.fetchLists().then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      if (response.ok) {
      response.value.map((list: IODataList) => {
        console.log("Found list with title = " + list.Title);
        options.push({ key: list.Id, text: list.Title });
      });
    }
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
                PropertyPaneTextField('webparttitle', {
                  label: strings.WebpartLabel,
                }),
                PropertyPaneTextField('siteurl', {
                  label: strings.SiteUrlLabel,
                  placeholder: 'Enter server url',
                  value: this.context.pageContext.web.absoluteUrl.split('.com/')[1]
                }),
                PropertyPaneSlider('slider', {
                  label: strings.SliderLabel,
                  min: 1,
                  max: 20,
                  value: 5
                }),
                PropertyPaneTextField('odatafilter', {
                  label: strings.ODataLabel


                }),
                PropertyFieldListPicker('listdropdown', {
                  label: strings.SListLabel,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: !this.urlvalid,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId',
                  webAbsoluteUrl: this.properties.siteurl
                }),
                PropertyPaneTextField('fieldfilter', {
                  label: 'Field filter',
                  placeholder: 'Enter field filter',
                  value: 'Id;Title'

                })
              ]
            }
          ]
        }
      ]
    };
  }
}
