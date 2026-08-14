
export default class SliceMsgToLastMsg {
	
	// 所有待插入的消息数据
	msgs = ''
	// 是否正在分割消息数据
	sliceMsgIng = false
	
	constructor(arg) {
		// 输入的参数为页面对象
		this.$ = arg
		//分割显示的速度(毫秒)
		this.t = 70
		// 要追加的消息的创建时间
		this.msgCreateTime = false
		// 是否立即结束追加
		this.stopAction = false
	}
	
	addMsg(msg) {
		this.msgs += msg
		
		// if (this.sliceMsgIng === false) {
		// 	this.sliceMsg()
		// }
	}
	end(){
		this.stopAction = true
	}
	sliceMsg() {
		if(this.stopAction === true) {
			return 
		}
		// 对消息进行分割
		this.sliceMsgIng = true
		
		// 拆成一个一个的token, 在混合文本里，确保汉字之间不粘英文
		const msgsArr = this.msgs.match(/[\p{Script=Han}]|[^\p{Script=Han}]+/gu);
		let msg = msgsArr.reverse().pop()
		
		// 更新最后一条消息的内容
		this.$.updateLastMsg(lastMsg => {
			if(this.msgCreateTime && this.msgCreateTime != lastMsg.create_time){
				return //console.log('要追加的消息不存在了，停止');
			}
			this.msgCreateTime = lastMsg.create_time
			lastMsg.content += msg
		})
		this.$.showLastMsg()
		
		this.msgs = msgsArr.reverse().join('')
		if (this.msgs.length) {
			// 设置分割显示的速度
			if(this.t) {
				setTimeout(() => {
					this.sliceMsg(this.msgs)
				}, this.t);
			} else {
				this.sliceMsg(this.msgs)
			}
		} else {
			this.sliceMsgIng = false
		}
		
		
	}
}