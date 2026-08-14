export default {

  data() {
    return {}
  },
  
  //1.配置发送给朋友
  onShareAppMessage() {
    return {
		title: '分享的标题', //分享的标题
		path: 'pages/index', //点击分享链接之后进入的页面路径
		imageUrl: '' //分享发送的链接图片地址
    };
  },

  //2.配置分享到朋友圈
  onShareTimeline() {
    return {
		title: '分享的标题', //分享的标题
		query: 'pages/index', //点击分享链接之后进入的页面路径
		imageUrl: '' //分享发送的链接图片地址
    }
  },
}