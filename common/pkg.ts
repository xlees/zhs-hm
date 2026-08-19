
export type AppKey = 'taobao' | 'jd' | 'pdd'

// Android 应用包名。根据实际要检测的应用继续增加或修改。
const APP_PACKAGES: Record<AppKey, string> = {
	taobao: 'com.taobao.taobao',
	jd: 'com.jingdong.app.mall',
	pdd: 'com.xunmeng.pinduoduo'
}

/**
 * 判断 Android 设备上是否安装指定应用。
 * 非 Android 平台返回 false。
 */
export function isAppInstalled(app: AppKey): boolean {
	// #ifdef APP-ANDROID
	const packageName = APP_PACKAGES[app]

	if (!packageName) {
		return false
	}

	try {
		const mainActivity = plus.android.runtimeMainActivity()
		const packageManager = mainActivity.getPackageManager()

		packageManager.getPackageInfo(packageName, 0)

		return true
	} catch (error) {

		console.warn(`应用未安装或查询失败：${packageName}`, error)
		return false
	}
	// #endif

	return false
}


/**
 * 批量判断应用安装状态。
 */
export function getInstalledApps(apps: AppKey[]): Record<AppKey, boolean> {
	return apps.reduce((result, app) => {
		result[app] = isAppInstalled(app)
		return result
	}, {} as Record<AppKey, boolean>)
}
