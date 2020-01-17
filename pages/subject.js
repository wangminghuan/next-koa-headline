
import React,{Component} from "react"
import http from "@http"
import Router from 'next/router'
import { Toast, ListView } from 'antd-mobile';

class Subject extends Component{
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
    http.get(`/api/head/head/subjectDetail`, {
      params: {
        hs_id: Router.query.id,
        page:this.state.page
      }
      }).then((res)=>{
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
    return (
    <div>
    <div className="subject-wrap">
    <div className="head">
      <div className="img-wrap"><img alt="pic"
             src={this.props.subjectinfo.hs_bgurl}
             className="column-bg" /></div>
      <section className="content">
        <h1>{this.props.subjectinfo.hs_name}</h1>
        <p>{this.props.subjectinfo.hs_describe}</p>
      </section>
    </div>
    <div className="art-list">
      <h4 ><span>相关文章</span></h4>
      <ListView
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{ padding: 0, textAlign: 'center',fontSize:12 }}>
          {this.state.isLoading ? '正在加载...' : this.state.hasMore?'加载完毕...':'-- 已经到底了 --'}
        </div>)}
        useBodyScroll
        renderBodyComponent={() => <ul className="article-list-wrap"></ul>}
        renderRow={row}
        pageSize={10}
        scrollRenderAheadDistance={500}
        onEndReached={()=>this.onEndReached()}
        onEndReachedThreshold={10}
      />
    </div>
  </div>
    <style jsx>{`
    .subject-wrap {
    background-color: #fff;
    }

    .img-wrap {
    width: 100%;
    height: 145px;
    overflow: hidden;
    position: relative;
    }

    .content {
    padding: 12px 18px;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5;
    }

    .content h1 {
    height: 50px;
    line-height: 50px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #353535;
    font-size: 20px;
    font-weight: 700;
    }

    .content p {
    line-height: 24px;
    color: #959595;
    overflow: hidden;
    }



    .art-list h4 {
    height: 44px;
    line-height: 44px;
    padding-left: 26px;
    border-bottom: 1px solid #e5e5e5;
    position: relative;
    background-color: #fff;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    }
    .art-list span {
      font-size: 14px;
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
      left: 15px;
      border-radius: 2px;
    }


    .page-infinite-loading {
      text-align: center;
      height: 20px;
      line-height: 20px;
      color: #7e7e7e;
    }

    .page-infinite-loading div {
      display: inline-block;
      vertical-align: middle;
      margin-right: 5px;
    }
    `}</style>
  </div>)
  }
}
Subject.getInitialProps = async ({ query }) => {
  const res = await http.get(`/api/head/head/subjectDetail`, {params: {
   hs_id: query.id,
   page: 1
 }});
 return {  
  subjectinfo:res.data.data.subjectinfo||{},
   articlelist:res.data.data.articlelist||[],
 }
}
export default Subject