import React, {Component} from 'react';
import Link from 'next/link'
import logo from '@assets/logo.svg';
// import "@pages/index.less"
import { Button } from 'antd-mobile';
class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    handleJump(path){
      this.props.history.push(path)
    }
    render(){
      return (
        <section className="container">
          <div>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="title">
            Next-koa-project
          </h1>
          <h2 className="subtitle">
            基于NextJs创建的SSR项目
          </h2>
          <div className="links">
          <Link href="/patent?id=4"><Button type="primary" style={ {marginRight:'20px'}} inline >进入专栏页面</Button></Link>
          <Link href="/subject?id=2"><Button type="primary" inline >进入专题页面</Button></Link>
          </div>
          </div>
          <style jsx>{
            `
            .container {
              margin: 0 auto;
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
            }
            
            .title {
              font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
                "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              display: block;
              font-weight: 300;
              font-size: 24px;
              color: #35495e;
              letter-spacing: 1px;
            }
            
            .subtitle {
              font-weight: 300;
              font-size: 22px;
              color: #526488;
              word-spacing: 5px;
              padding-bottom: 15px;
            }
            
            .links {
              padding-top: 15px;
            }
            `
          }
          </style>
      </section>
      )
    }
    componentDidMount(){
      console.log("组件已装载，执行ajax")
    }
    componentWillUnmount(){
      console.log("组件已卸载")
    }
  }
export default Home;