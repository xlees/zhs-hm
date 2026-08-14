import {
	translateapp,
	translate,
} from './compress'

export interface ImgOptions {
	type?: string
	success: (res: any) => void
}

export interface AvatarOptions {
	url: string
	success: (res: any) => void
}

export interface UserAddressOptions {
	type?: string
	success: (res: any) => void
}

export interface FwljOptions {
	url: string
	fun?: (res: any) => void
	bm?: string
}

export interface SbCodeOptions {
	url: string
}

export interface LoginUniverifyOptions {
	success?: (res: any) => void
	fail?: (res: any) => void
}

export default {
	// 提示
	showToast(title: string) {
		uni.showToast({
			title,
			icon: 'none' as const,
			position: 'bottom' as const,
		})
	},

	// 加载
	showLoading(title: string) {
		uni.showLoading({
			title,
			mask: true,
		})
	},

	// 跳转nvue无法页面传参,只能缓存
	navigate(url: string, data?: Record<string, unknown>, name?: string) {
		try {
			const token = uni.getStorageSync('uni_id_token')
			if (!token && name) {
				this.clearInfo()
			} else {
				if (name && data) {
					uni.setStorageSync(name, data)
				}
				uni.navigateTo({ url })
			}
		} catch (e) {
			this.showToast('跳转失败,请重试')
		}
	},

	redirect(url: string, data?: Record<string, unknown>, name?: string) {
		try {
			const token = uni.getStorageSync('uni_id_token')
			if (!token && name) {
				this.clearInfo()
			} else {
				if (name && data) {
					uni.setStorageSync(name, data)
				}
				uni.redirectTo({ url })
			}
		} catch (e) {
			this.showToast('跳转失败,请重试')
		}
	},

	// 阿里云上传图片
	img(obj: ImgOptions) {
		const type = obj.type || ''
		const success = obj.success
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			success: (res: any) => {
				// #ifdef APP
				translateapp(res.tempFilePaths[0], 80, (imgUrl: string) => {
					const filePath = imgUrl
					console.log(imgUrl)
					uniCloud.uploadFile({
						filePath,
						cloudPath: 'a.jpg',
						success: (uploadRes: any) => {
							success(uploadRes)
							this.showToast('上传成功')
						},
						fail() {
							this.showToast('上传失败')
						},
					})
				})
				// #endif
				// #ifdef MP-WEIXIN
				uniCloud.uploadFile({
					filePath: res.tempFilePaths[0],
					cloudPath: 'a.jpg',
					success: (uploadRes: any) => {
						success(uploadRes)
						this.showToast('上传成功')
					},
					fail() {
						this.showToast('上传失败')
					},
				})
				// #endif
			},
		})
	},

	// 防盗链头像处理
	avatarUpload(obj: AvatarOptions) {
		const url = obj.url || ''
		const success = obj.success
		uni.downloadFile({
			url,
			success: (res: any) => {
				if (res.statusCode === 200) {
					uniCloud.uploadFile({
						filePath: res.tempFilePath,
						cloudPath: 'a.jpg',
						success: (uploadRes: any) => {
							success(uploadRes)
						},
						fail(e: any) {
							console.log('e: ', e)
						},
					})
				}
			},
		})
	},

	// 错误处理
	errorout(err: any) {
		const code = err.code
		console.log(err.message)
		if (
			code === 'TOKEN_INVALID_INVALID_CLIENTID' ||
			code === 'TOKEN_INVALID' ||
			code === 'TOKEN_INVALID_TOKEN_EXPIRED' ||
			code === 'TOKEN_INVALID_WRONG_TOKEN' ||
			code === 'TOKEN_INVALID_ANONYMOUS_USER' ||
			code === 403
		) {
			this.clearInfo()
		} else if (code === 'SYNTAX_ERROR' || code === 'SYSTEM_ERROR' || code === 'DUPLICATE_KEY') {
			this.showToast('系统错误')
		} else if (code === 'PERMISSION_ERROR') {
			this.showToast('您暂无此权限')
		} else if (code === 'VALIDATION_ERROR') {
			this.showToast('格式错误')
		} else if (code === 250) {
			this.showToast(err.message)
		} else {
			this.showToast('网络好像开小差了！')
		}
	},

	// tab点击声音
	tabmp3() {
		const innerAudioContext = uni.createInnerAudioContext()
		innerAudioContext.autoplay = true
		innerAudioContext.src = '/static/voice/an.mp3'
		innerAudioContext.onPlay(() => {
			console.log('播放成功')
		})
		innerAudioContext.onError((res: any) => {
			console.log(res.errMsg)
			console.log(res.errCode)
		})
	},

	// 金币声音
	jbbmp3() {
		const innerAudioContext = uni.createInnerAudioContext()
		innerAudioContext.autoplay = true
		innerAudioContext.src = '/static/voice/14131.mp3'
		innerAudioContext.onPlay(() => {
			console.log('播放成功')
		})
		innerAudioContext.onError((res: any) => {
			console.log(res.errMsg)
			console.log(res.errCode)
		})
	},

	// 复制
	fz(data: string, title?: string, istS?: boolean) {
		uni.setClipboardData({
			data,
			success: () => {
				const tit = title || ''
				if (istS) {
					uni.hideToast()
				} else {
					this.showToast(tit)
				}
			},
		})
	},

	// 获取用户地址
	userAddress(obj: UserAddressOptions) {
		const type = obj.type || ''
		const success = obj.success
		uni.getLocation({
			type: 'wgs84' as const,
			geocode: true,
			success: (res: any) => {
				console.log(res)
				success(res)
			},
		})
	},

	// 保存图片
	bctp(url: string) {
		uni.showLoading({
			title: '保存中',
			mask: true,
		})
		uni.downloadFile({
			url,
			success: (res: any) => {
				uni.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success: () => {
						this.showToast('保存成功')
					},
				})
			},
		})
	},

	// 访问链接
	fwlj(obj: FwljOptions) {
		const { url, fun, bm } = obj
		let fun_z: (res: any) => void
		let bm_z = bm || ''
		if (!fun) {
			fun_z = (res: any) => {
				this.showToast('链接错误，访问失败')
			}
		} else {
			fun_z = fun
		}
		plus.runtime.openURL(url, fun_z, bm_z)
	},

	// 访问内部
	fwlj2(url: string) {
		plus.runtime.openWeb(url, () => {
			this.showToast('链接错误，访问失败')
		})
	},

	// 放大图片
	fdImg(url: string) {
		uni.previewImage({ urls: [url] })
	},

	// 清除
	clearInfo(i?: boolean) {
		uni.removeStorageSync('userinfo')
		uni.removeStorageSync('uni_id_token')
		uni.removeStorageSync('uni_id_token_expired')
		if (!i) {
			this.showToast('请先登录')
			uni.redirectTo({
				url: '/sub_pkgs/common/login/login',
			})
		}
	},

	// 识别二维码
	sbCode(url: string) {
		uni.downloadFile({
			url,
			success: (res: any) => {
				console.log(res.tempFilePath)
				const tempFilePath = res.tempFilePath
				plus.barcode.scan(
					tempFilePath,
					function(type: any, result: any) {
						plus.runtime.openWeb(result)
					},
					() => {
						this.showToast('识别失败，请保存二维码，去别处看看')
					},
				)
			},
		})
	},

	// 放大识别
	fdCode(url: string) {
		uni.previewImage({
			urls: [url],
			longPressActions: {
				itemList: ['识别二维码'],
				success: (data: any) => {
					if (data.tapIndex === 0) {
						uni.downloadFile({
							url,
							success: (res: any) => {
								console.log(res.tempFilePath)
								const tempFilePath = res.tempFilePath
								plus.barcode.scan(
									tempFilePath,
									function(type: any, result: any) {
										plus.runtime.openWeb(result)
									},
									() => {
										this.showToast('识别失败，请保存二维码，去别处看看')
									},
								)
							},
						})
					}
				},
			},
		})
	},

	// 一键登录
	loginUniverify(data: LoginUniverifyOptions) {
		uni.login({
			provider: 'univerify',
			univerifyStyle: {
				fullScreen: true,
				icon: {
					path: 'static/logo.png',
				},
				authButton: {
					normalColor: '#000000',
					textColor: '#ffffff',
					title: '本机号码一键登录/注册',
					borderRadius: '24px',
				},
				otherLoginButton: {
					visible: false,
					textColor: '#656565',
					title: '注册',
					borderRadius: '0px',
				},
				privacyTerms: {
					defaultCheckBoxState: true,
					uncheckedImage: '/static/xzz.png',
					checkedImage: '/static/xzz.png',
					textColor: '#000000',
					checkBoxSize: 15,
					termsColor: '#F91305',
					prefix: '我已阅读并同意',
					suffix: '并使用本机号码登录',
					privacyItems: [
						{
							url: 'https://static-7b6aadb1-52fc-4bae-a744-5e8fe69e1a8e.bspapp.com/#/pages/yhyy/yhyy',
							title: '用户协议',
						},
						{
							url: 'https://static-7b6aadb1-52fc-4bae-a744-5e8fe69e1a8e.bspapp.com/#/pages/ysxy/ysxy',
							title: '隐私协议',
						},
					],
				},
			},
			success: data.success,
			fail: data.fail,
		})
	},
}
