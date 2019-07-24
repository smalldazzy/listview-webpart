import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp from 'sp-pnp-js';
import { ListItem } from './ListItem';
import { IProps, IListItem, IListItem2 } from './Interfaces';

export default class HelloWorld extends React.Component<IHelloWorldProps, any> {
  public constructor(props:IProps,any)
  {
    super(props);
    this.state={
      items:[]
    }
  }
  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={ styles.helloWorld }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <div>
              <table>
                    <thead>
                      <td>ID</td>
                      <td>Title</td>
                      <td>Modified</td>
                      <td>ModifiedBy</td>
                    </thead>
                    <tbody>
                  
                {this.state.items.map(function(item:IListItem2){
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
              <p className={ styles.description }>{escape(this.props.description)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  public componentDidMount()
  {
    this.getData();
  }
  private getData():void
  {
      pnp.sp.web.lists.getByTitle(`MyList`).items.get().then
      ((response)=>{
        console.log(response);
        let store=response.map(item=>new ListItem(item));
        this.setState({items:store});
        console.log('writing');
      }
      ).then(()=>console.log(this.state))
      // setTimeout(() => {console.log(this.state)},1000);
      // console.log(this.state);
  }
}
