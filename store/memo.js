
import { defineStore } from 'pinia'

import Common from '@/common/common'
import Api from "@/common/api"
import dayjs from "dayjs"

export const useMemoStore = defineStore('memo', {
	
	state: () => {
		return {
			uid: uni.getStorageSync('uid'),
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
		
		// 增加一条memory
		add(query) {	
			const tstamp = dayjs().unix()
			this.context.push([tstamp, query])
		},
		
		// 获取&搜索memory
		search(query) {
			
		},
		
		clear() {
		}
	},
	
	getters: {
		
		getContext: (state) => {
			let result = []
			
			for (const x of state.context)
				result.push(x[1])
				
			return result;
		}
		
	},
})
