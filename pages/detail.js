import React,{Component} from "react"
import http from "@http"
import Router from 'next/router'
class Detail extends Component{
  constructor(props){
    super(props);
    this.state={
      isRefresh:false
    }
  }
  handleJump(item){
    Router.push('/detail?id='+item.ha_id)
    this.setState({
      isRefresh:true
    })
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      isRefresh:false
    })
 }
  render(){
    return (
      <div>
      <div className="detail-outer-wrap" style={{display:this.state.isRefresh?"none":"block"}}>
    <div className="detail-inner-wrap">
      <div className="article-wrap">
        <h2>{this.props.renderData.title}</h2>
        <p className="article-info"><span className="time">{this.props.renderData.detail.time}</span> <span>阅读<i>{this.props.renderData.detail.ha_readNum}</i></span> <span>赞<i>{this.props.renderData.detail.ha_upNum}</i></span></p>
        <div className="content-wrap">
          <div className="content ql-editor" dangerouslySetInnerHTML = {{ __html:this.props.renderData.detail.ha_content }}></div>
        </div>
        <p className="article-info"><span>小编：<i>{this.props.renderData.detail.ha_author}</i></span> <span>文章来源：<i>{this.props.renderData.detail.ha_source}</i></span></p>
      </div>
      <div className="recom-more">
        <h4 className="detail-com-title"><em>相关推荐</em></h4>
        <ul className="article-list-wrap">
          {this.props.renderData.recommendList.map((item,index)=>
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
           <div className="pic"><img src={item.ha_image} alt="pic" /></div>
         </li> 
          )}
          
        </ul>
      </div>
    </div>
    <div style={{height:'20px'} }></div>
  </div>
          <style jsx>{`
          .detail-com-title {
            text-align: center;
            margin-bottom: 8px;
            position: relative;
          }
          
          .detail-com-title em {
            font-size: 18px;
            font-weight: 400;
            color: #353535;
            text-align: center;
            font-weight: 700;
            font-weight: 600;
            color: #333;
            padding: 0 2px;
            background: -webkit-linear-gradient(top,
                hsla(0, 0%, 100%, 0.1) 50%,
                rgba(163, 201, 255, 0.35) 0);
            background: -webkit-gradient(linear,
                left top,
                left bottom,
                color-stop(50%, hsla(0, 0%, 100%, 0.1)),
                color-stop(50%, rgba(163, 201, 255, 0.35)));
            background: linear-gradient(180deg,
                hsla(0, 0%, 100%, 0.1) 50%,
                rgba(163, 201, 255, 0.35) 0);
          }
          
          
          .recom-more {
            background-color: #fff;
          }
          
          .recom-more .article-list-item:last-child {
            border-bottom: 0;
          }
          
          .article-wrap {
            background-color: #fff;
            padding: 15px;
            padding-bottom: 0;
          }
          
          h2 {
            font-size: 20px;
            font-weight: 700;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            /*! autoprefixer: ignore next */
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            color: rgba(17, 23, 29, 0.86);
            line-height: 30px;
          }
          
          .article-info {
            font-size: 12px;
            font-weight: 400;
            color: #999;
            line-height: 20px;
            margin: 32px 0;
          }
          
          .article-info i {
            margin-left: 5px;
          }
          
          .article-info span {
            margin-right: 8px;
          }
          
          
          .content {
            line-height: 30px;
          }
          
          .content img {
            display: block;
            margin: 0 auto;
          }
          
          .content p {
            font-size: 14px;
            color: #555;
            line-height: 28px;
          }
          `}</style>
  </div>
    )
  }
}
Detail.getInitialProps = async ({ query }) => {
 const res = await http.get(`/api/head/head/detail`, {params: {
   ha_id: query.id
 }});
 const renderData=res.data.data||{};
 if(!renderData.commentList)renderData.commentList=[];
 if(!renderData.detail)renderData.detail={};
 if(!renderData.recommendList)renderData.recommendList=[];
 return {  
  renderData:renderData||{}
 }
}
export default Detail;