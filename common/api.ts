interface CloudHttpObj {
	name: string
	action: string
	data: Record<string, unknown>
}

export default {
	cloudHttp(obj: CloudHttpObj, status?: number) {
		let data: Record<string, unknown> = {
			action: obj.action,
			data: obj.data
		}
		if (status === 1) {
			data = {
				action: obj.action,
				params: obj.data
			}
		}
		return uniCloud.callFunction({
			name: obj.name,
			data: data
		})
	}
}
