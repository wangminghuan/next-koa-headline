
import React,{Component} from "react"
import http from "@http"
import Router from 'next/router'
import { Toast, ListView, List } from 'antd-mobile';

class NewsList extends Component{
 constructor(props){
   super(props);
   const list=this.props.list;
    this.state={
    isLoading:false,
    list:list,
    page:2,
    hasMore:true,
    dataSource:new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(list)
   }
 }
 handleJump(item){
    Router.push('/detail?id='+item.item_id)
}
onEndReached (){
  if (this.state.isLoading || !this.state.hasMore) {
    return;
  }
  this.setState({ isLoading: true ,page: this.state.page+1});
  this.getData()
}

getData(){
  const behot_time = this.state.list[this.state.list.length - 1] ? this.state.list[this.state.list.length - 1].behot_time : (new Date().getTime()-2*60*60*1000).toString().substring(0,10);
  http.get(`/api/list/`, {
    params: {
        tag: '__all__',
        ac: 'wap',
        count: '20',
        format: 'json_raw',
        as: 'A1750EBF6820180',
        cp: '5EF860E1D8F03E1',
        max_behot_time: behot_time,
        _signature: 'zzhYuAAAkcgoT6C-L.hV.s84WK',
        i: behot_time,
        page: this.page
      }}).then((res)=>{
    const _data=res.data;
    if(_data.data && _data.has_more){
      const arr=[...this.state.list,..._data.data||[]];
      this.setState({
        hasMore:arr.length>0,
        isLoading:false,
        list:arr,
        dataSource: this.state.dataSource.cloneWithRows(arr)
      })
    }else{
      Toast.info(_data.message)
    }
  })
}
 render(){
  const row=(item,index)=>{
    return item.image_list && item.image_list.length>0?(
     <li className="article-list-item"
         key={index}
         onClick={()=>this.handleJump(item)}>
       <div className="cont">
         <p>{item.title}</p>
         <div className="img-arr">
         {
           item.image_list.map((sitem,sindex)=>{
             return <div className="pic" key={sindex} ><img src={sitem.url} alt="img"/></div>
           })
         }
         </div>
         <ul className="tag-btm">
           <div className="nums"><b><em className="tag">{item.media_name}</em><em className="read">评论 {item.comment_count}</em></b> <em className="time">{item.datetime}
             </em></div>
         </ul>
       </div>
     </li>
    ):(
     <li className="article-list-item"
         key={index}
         onClick={()=>this.handleJump(item)}>
       <div className="cont">
         <p>{item.title}</p>
         <ul className="tag-btm">
           <div className="nums"><b><em className="tag">{item.media_name}</em><em className="read">评论 {item.comment_count}</em></b> <em className="time">{item.datetime}
             </em></div>
         </ul>
       </div>
       {item.large_image_url?<div className="pic"><img src={item.large_image_url} alt="img" /></div>:<></>}
     </li>
    )
  };
   return(
   <div>
    <div className="column-wrap">
   <div className="art-list">
     <ListView
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{ padding: 0, textAlign: 'center',fontSize:12 }}>
          {this.state.isLoading ? '正在加载...' : this.state.hasMore?'加载完毕...':'-- 已经到底了 --'}
        </div>)}
        renderBodyComponent={() => <ul className="article-list-wrap"></ul>}
        renderRow={row}
        style={{
          height: '100vh',
          overflow: 'auto',
        }}
        pageSize={10}
        scrollRenderAheadDistance={500}
        onEndReached={()=>this.onEndReached()}
        onEndReachedThreshold={10}
      />
   </div>
 </div>
<style jsx>{
`.mint-spinner-fading-circle {
    margin: 0 auto;
  }
  .column-wrap{
    background:#fff;
  }
  .finish-tips {
    text-align: center;
    height: 20px;
    line-height: 20px;
    color: #7e7e7e;
  }`
}
</style>
 </div>
 )}
}
NewsList.getInitialProps = async ({ query }) => {
  const behot_time=(new Date().getTime()-2*60*60*1000).toString().substring(0,10)
     const res = await http.get(process.browser?`/api/list/`:`/list/`, {params: {
      tag: '__all__',
      ac: 'wap',
      count: '20',
      format: 'json_raw',
      as: 'A1750EBF6820180',
      cp: '5EF860E1D8F03E1',
      max_behot_time: behot_time,
      _signature: 'zzhYuAAAkcgoT6C-L.hV.s84WK',
      i: behot_time,
      page: 1
    }});
    return {  
      list:res.data.data||[],
    }
}
export default NewsList;