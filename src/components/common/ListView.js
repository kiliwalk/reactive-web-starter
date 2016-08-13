'use strict'

const React = require('react');
import ListView from 'rmc-list-view';

const MyListView = React.createClass({
  getDefaultProps(){
    return {onEndReachedThreshold: 1200, initialListSize: 0, emptyText: '还没有内容',
      pageSize: 20, automaticallyAdjustContentInsets: false,
      rowHasChanged: (r1, r2) => r1 !== r2,
    }
  },
  getInitialState(props){
    return {
      refreshing: false,
    }
  },
  onRefresh(){
    if(!this.props.onRefresh) return;
    if(this.state.refreshing) return;
    this.setState({refreshing: true})

    return Promise.resolve(this.props.onRefresh()).catch(e=>{}).then(()=>{
      this.setState({refreshing: false})
    })
  },
  onEndReached(){
    if(!this.props.onEndReached) return;
    if(!this.props.rows || this.props.rows.length===0) return;
    if(this.state.refreshing) return;
    
    if(this._endFetching) return;
    this._endFetching = true;
    
    return Promise.resolve(this.props.onEndReached()).catch(e=>{}).then(()=>{
      this._endFetching = false;
    })
  },
  renderRow(row, sectionId, rowId){
    let {renderTopRow, renderRow, emptyText} = this.props;
    if(renderTopRow && row && row.__isTopRow) return renderTopRow();
    else if(row && row.__isEmpty){
      return (
        <div style={{alignItems: 'center', justifyContent: 'center', paddingTop: 45, paddingBottom: 45}}>
          <span style={{color: '#888'}}>{emptyText}</span>
        </div>
      )
    }else return renderRow(row, sectionId, +rowId);
  },
  render(){
    let {style, children, onRefresh, onEndReached, rowHasChanged, rows, emptyText, renderTopRow, renderRow, ...props} = this.props;//eslint-disable-line

    if(!rows || rows.length<=0){
      rows = [{__isEmpty: true}];
    }

    if(renderTopRow) rows = [{__isTopRow: true}, ...rows];

    if(!this._ds){
      let ds = new ListView.DataSource({rowHasChanged});
      this._ds = ds.cloneWithRows(rows);
    }else this._ds = this._ds.cloneWithRows(rows);

    return (
      <div style={{flex: 1}}>
        <ListView style={{flex: 1}} 
          dataSource={this._ds} renderRow={this.renderRow} onEndReached={this.onEndReached}
          {...props}>
          {children}
        </ListView>
      </div>
    )
  }
})

module.exports = exports = MyListView;
