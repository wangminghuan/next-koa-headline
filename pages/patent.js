
import React,{Component} from "react"
import http from "@http"
import Router from 'next/router'
import { Toast, ListView } from 'antd-mobile';

class Patent extends Component{
 constructor(props){
   super(props);
   const articlelist=[...this.props.articlelist];
    this.state={
    isLoading:false,
    articlelist:articlelist,
    page:2,
    hasMore:true,
    dataSource:new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(articlelist)
   }
 }
 handleJump(item){
    Router.push('/detail?id='+item.ha_id)
}
onEndReached (){
  if (this.state.isLoading || !this.state.hasMore) {
    return;
  }
  this.setState({ isLoading: true ,page: this.state.page+1});
  this.getData()
}

getData(){
  http.get(`/api/head/head/patentDetail`, {params: {
    hp_id:Router.query.id,
    page: this.state.page
  }}).then((res)=>{
    const _data=res.data;
    if(_data.code===0){
      const arr=[...this.state.articlelist,..._data.data.articlelist||[]];
      this.setState({
        hasMore:_data.data.articlelist.length>0,
        isLoading:false,
        articlelist:arr,
        dataSource: this.state.dataSource.cloneWithRows(arr)
      })
    }else{
      Toast.info(_data.message)
    }
  })
}
 render(){
   const row=(item,index)=>{
     return (
      <li className="article-list-item"
          key={index}
          onClick={()=>this.handleJump(item)}>
        <div className="cont">
          <p>{item.ha_title}</p>
          <ul className="tag-btm">
            <div className="nums"><b><em className="tag">{item.ha_tags}</em><em className="read">阅读 {item.ha_readNum}</em></b> <em className="time">{item.time}
              </em></div>
          </ul>
        </div>
        <div className="pic"><img src={item.ha_image} alt="img" /></div>
      </li>
     )
   };
   return(
   <div>
    <div className="column-wrap">
    <div className="head" ref="headBg">
     <div className="head-bg"><img alt="pic"
            src={this.props.patentinfo?this.props.patentinfo.hp_bgurl:''}
            className="column-bg" />
     </div>
     <section className="content-wrap">
       <div className="inner-wrap">
         <div className="avatar"><img alt="pic"
                src={this.props.patentinfo?this.props.patentinfo.hp_headurl:''} /></div>
         <div className="content">
           <h1>{this.props.patentinfo?this.props.patentinfo.hp_name:''}</h1>
           <p>{this.props.patentinfo?this.props.patentinfo.hp_describe:''}</p>
         </div>
       </div>
     </section>
   </div>
   <div className="art-list">
     <h4 ref="headTil"><span>相关文章</span></h4>
     <ListView
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{ padding: 0, textAlign: 'center',fontSize:12 }}>
          {this.state.isLoading ? '正在加载...' : this.state.hasMore?'加载完毕...':'-- 已经到底了 --'}
        </div>)}
        renderBodyComponent={() => <ul className="article-list-wrap"></ul>}
        renderRow={row}
        style={{
          height: 'calc(100vh - 212px)',
          overflow: 'auto',
        }}
        pageSize={10}
        scrollRenderAheadDistance={500}
        onEndReached={()=>this.onEndReached()}
        onEndReachedThreshold={10}
      />
   </div>
 </div>
      <style jsx>{`.mint-spinner-fading-circle {
  margin: 0 auto;
}

.column-wrap {
  background-color: #f2f2f2;
}

.head {
  background-color: #fff;
  margin-bottom: 10px;
}

.head-bg {
  height: 103px;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.head-bg :before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  height: 103px;
  display: block;
  z-index: 1;
}


.content-wrap {
  position: relative;
  height: 55px;
}

.inner-wrap {
  position: absolute;
  top: -55px;
  left: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  color: #959595;
  font-size: 12px;
  z-index: 2;
  height: 110px;
  width: 100%;
  overflow: hidden;
}

.avatar {
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  margin-right: 10px;
  margin-left: 15px;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-align-self: center;
  -ms-flex-item-align: center;
  -ms-grid-row-align: center;
  align-self: center;
  border: 1px solid #f2f2f2;
}

.avatar,
.avatar img {
  height: 50px;
  width: 50px;
}



.column-bg {
  width: 100%;
  height: auto;
  left: 50%;
  top: -50%;
  position: relative;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}

.content {
  margin-right: 15px;
  width: 100%;
}

.content h1 {
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
  margin-top: 27px;
  margin-bottom: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content p {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  /*! autoprefixer: ignore next */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: #959595;
  font-size: 12px;
}


.art-list h4 {
  height: 44px;
  line-height: 44px;
  padding-left: 20px;
  border-bottom: 1px solid #e5e5e5;
  position: relative;
  background-color: #fff;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.art-list h4:after {
  content: "";
  position: absolute;
  height: 14px;
  width: 3px;
  background-color: #4396f4;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 10px;
  border-radius: 2px;
}

.art-list h4 span {
  font-size: 14px;
}

.finish-tips {
  text-align: center;
  height: 20px;
  line-height: 20px;
  color: #7e7e7e;
}`}</style>
 </div>
 )}
}
Patent.getInitialProps = async ({ query }) => {
     const res = await http.get(`/api/head/head/patentDetail`, {params: {
      hp_id: query.id,
      page: 1
    }});
    return {  
      patentinfo:res.data.data.patentinfo,
      articlelist:res.data.data.articlelist,
    }
}
export default Patent;