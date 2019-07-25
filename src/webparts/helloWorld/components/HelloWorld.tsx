import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { Web } from 'sp-pnp-js';
import { ListItem } from './ListItem';
import { IProps, IListItem, IListItem2 } from './Interfaces';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IPropertyPaneDropdownOption } from '@microsoft/sp-property-pane';
import { IODataList } from '@microsoft/sp-odata-types';

export default class HelloWorld extends React.Component<IHelloWorldProps, any> {
  public constructor(props: IProps, any) {
    super(props);
    this.state = {
      items: [],
      options: []
    }
  }
  public render(): React.ReactElement<IHelloWorldProps> {
    console.log(this.props.spWebUrl.split('.com/')[1]);
    console.log(this.props.listdropdown);
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <div>
                <table>
                  <thead>
                    <td>ID</td>
                    <td>Title</td>
                    <td>Modified</td>
                    <td>ModifiedBy</td>
                  </thead>
                  <tbody>
                    {this.state.items.map(function (item: IListItem2) {
                      return (
                        <tr>
                          <td>{item.ID}</td>
                          <td>{item.Title}</td>
                          <td>{item.Modified}</td>
                          <td>{item.ModifiedBy}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className={styles.description}>{escape(this.props.siteurl)}</p>
              <p className={styles.description}>{this.props.slidervalue}</p>
              <p className={styles.description}>{this.props.filtervalue}</p>


            </div>
          </div>
        </div>
      </div>
    );
  }
  public componentDidMount() {
    this.getData();
  }
  public componentDidUpdate(){    
  }
 
  private getData(): void {
    let uri = this.props.siteurl || 'sites/dev1';
    let guid = this.props.listdropdown || '76df1868-1ae3-4efb-9653-0f4372392049';
    let top = this.props.slidervalue || 5;
    console.log(top);
    let wep = new Web('https://cupcuper.sharepoint.com/'+uri);
    wep.lists.filter('Hidden eq false').get().then((li)=>console.log(li));
    // pnp.sp.web.lists.filter('Hidden eq false').get().then((list)=> this.setState({options:list})).then(()=>console.log(this.state));
    // pnp.sp.web.lists.getByTitle(`MyList`).items.get().then
    /*pnp.sp.web*/wep.lists.getById(guid).items.top(top).get().then
    // 76df1868-1ae3-4efb-9653-0f4372392049
      ((response) => {
        console.log(response);
        let store = response.map(item => new ListItem(item));
        this.setState({ items: store });
        console.log('writing');
      }
      ).then(() => console.log(this.state))
  }
}
