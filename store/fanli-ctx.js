
import { defineStore } from 'pinia'

import Common from '@/common/common'
import Api from "@/common/api"

export const storeFanliCtx = defineStore('fanli_context', {
	
	state: () => {
		return {
			uid: uni.getStorageSync('uid'),
			uniq_ctx: new Set(),
			// 保存用户历史查询内容
			context: [],
		}
	},
	
	// 默认网页端
	// persist: true,
	
	// 小程序端
	persist: {
		storage: {
			getItem: (key) => uni.getStorageSync(key),
			setItem: (key, value) => uni.setStorageSync(key, value),
		}
	},
	
	actions: {
			
		exit() {
			
		},
		
		// 将当前内容添加到context里
		addToCtx(content) {
			console.log("this.uniq_ctx:",this.uniq_ctx)
			
			const curtime = new Date();
			const curtimeStr = curtime.toLocaleString('zh-CN', { hour12: false,year: 'numeric', month: '2-digit', day: '2-digit',hour: '2-digit', minute: '2-digit', second: '2-digit' })
			
			// this.uniq_ctx = new Set(this.uniq_ctx).add(content)
			this.context.push([curtimeStr,content])
		},
		
		clearCtx() {
			
		}
	},
	
	getters: {
		
		get_ctx_str: (state) => {
			let rst = ''
			for (const x of state.context) {
				rst += x[1]+'\n'
			}
			return rst
		},
		
		get_ctx_uniq: (state) => {
			let rst = []
			let items = new Set()
			
			const _ctx = state.context
			_ctx.reverse()
			
			for (const x of _ctx) {
				if (!items.has(x[1])) {
					rst.push(x[1])
					
					items.add(x[1])
				}
			}
			return rst
		}
		
	},
})
