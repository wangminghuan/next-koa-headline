import React,{Component} from "react"
import http from "@http"
import Router from 'next/router'
class Detail extends Component{
  constructor(props){
    super(props);
    const renderData=this.props.renderData
    this.state={
      isRefresh:false,
      renderData:renderData
    }
  }
  $formatTime(data,type){
    var _data = data;
    //如果是13位正常，如果是10位则需要转化为毫秒
    if (String(data).length == 13) {
      _data = data
    } else {
      _data = data*1000
    }
    const time = new Date(_data);    
    const Y = time.getFullYear();
    const Mon = time.getMonth() + 1;
    const Day = time.getDate();
    const H = time.getHours();
    const Min = time.getMinutes();
    const S = time.getSeconds();
    //自定义选择想要返回的类型
    if(type==="Y"){
      return `${Y}-${Mon}-${Day}`
    }else if(type==="H"){
      return `${H}:${Min}:${S}`
    }else{
      return `${Y}-${Mon}-${Day} ${H}:${Min}:${S}`
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
        <h2>{this.state.renderData.title}</h2>
        <div className="article-info">
        <div className="left">
         <img style={{width:'20px',marginRight:'10px'}} src={this.state.renderData.media_user.avatar_url} alt="img" /><span>{this.state.renderData.source}</span>
        </div>
        <div className="right"><span>{this.state.renderData.comment_count}评论 </span><em v-if="renderData.publish_time">{this.$formatTime(this.state.renderData.publish_time)}</em></div>
        </div>
        <div className="content-wrap">
          <div className="content ql-editor" dangerouslySetInnerHTML = {{ __html:this.state.renderData.content}}></div>
        </div>
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
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
                    align-items: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                    justify-content: space-between;
          }
          .article-info .left, .article-info .right{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
                    align-items: center;
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
 const res = await http.get(process.browser?`/api/i${query.id}/info/`:`/i${query.id}/info/`, {params: {
  _signature:'HLIIRxARQk77xfBBg2LRhxyyCF',
  i:query.id
 }});
 const renderData=res.data.data||{};
 return {  
  renderData:renderData
 }
}
export default Detail;