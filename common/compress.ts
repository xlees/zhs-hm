/**
 * APP端图片压缩
 * @param img 图片url
 * @param scale 缩放比例 1-100
 * @param callback 回调设置返回值
 */
export function translateapp(img: string, scale: number, callback: (path: string) => void) {
	plus.io.resolveLocalFileSystemURL(img, (entry: any) => {
		entry.file((file: any) => {
			console.log('压缩前图片信息:' + JSON.stringify(file))
			if (file.size > 504800) {
				plus.zip.compressImage({
					src: img,
					dst: img
						.replace('.png', 'yasuo.png')
						.replace('.PNG', 'yasuo.PNG')
						.replace('.jpg', 'yasuo.jpg')
						.replace('.JPG', 'yasuo.JPG'),
					width: '40%',
					height: '40%',
					quality: scale,
					overwrite: true,
				}, (event: any) => {
					console.log('压缩后图片信息:' + JSON.stringify(event))
					callback(event.target)
				}, function(err: any) {
					console.log('Resolve file URL failed: ' + err.message)
				})
			} else {
				callback(img)
			}
		})
	}, (e: any) => {
		console.log('Resolve file URL failed: ' + e.message)
	})
}

/**
 * H5端图片压缩
 * @param imgSrc 图片url
 * @param scale 缩放比例 0-1
 * @param type 返回图片类型  默认blob
 * @param callback 回调设置返回值
 */
export function translate(
	imgSrc: string,
	scale: number,
	type: string,
	callback: (path: string) => void,
) {
	const img = new Image()
	img.src = imgSrc
	img.onload = function() {
		const that = this as HTMLImageElement
		const canvas = document.createElement('canvas')
		canvas.width = that.width
		canvas.height = that.height
		const ctx = canvas.getContext('2d')!
		ctx.drawImage(that, 0, 0, canvas.width, canvas.height)
		const base64 = canvas.toDataURL('image/jpeg', scale)
		if (type === 'base64') {
			callback(base64)
		} else {
			const blob = base64ToBlob(base64)
			const blobUrl = window.URL.createObjectURL(blob)
			callback(blobUrl)
		}
	}
}

// base转Blob
// export function base64ToBlob(base64: string) {
// 	const arr = base64.split(','),
// 		mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg',
// 		bstr = atob(arr[1]),
// 		n = bstr.length,
// 		u8arr = new Uint8Array(n)
// 	while (n--) {
// 		u8arr[n] = bstr.charCodeAt(n)
// 	}
// 	return new Blob([u8arr], { type: mime })
// }
