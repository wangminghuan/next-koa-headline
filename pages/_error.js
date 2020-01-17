import React from 'react'

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }

  render() {
    return (
      <div>
        <div className="error-wrap"><p>您访问的网页被外星人抓走了~</p><p>错误代码：{this.props.statusCode}</p></div>
        <style jsx>{`  
            .error-wrap{
              width: 100%;
              position: fixed;
              top:50%;
              left: 0;
              right: 0;
              text-align: center;
              transform: translateY(-50%);
              font-size: 14px;
            }`}</style>
     </div>
    )
  }
}