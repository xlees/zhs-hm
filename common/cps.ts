

export default {
	
	// 本地生活相关数据
	localLiving() {
		
		// 京东外卖
		const jdwm = {
			'category': 'jump', 
			'des': 'm',
			'url': "https://u.jd.com/HO0btVA"
		}
		
		// 美团优惠券&红包
		const meituan_cpn = {
			'url': "imeituan://www.meituan.com/takeout/browser?inner_url=https%3A%2F%2Fclick.meituan.com%2Ft%3Ft%3D1%26c%3D2%26p%3DRMDM-bxz0vmd&lch=cps:mtlm:10:8e97635367b440418c680a77bdef44af:172417jutuike4563r4:7:1688451586411667464"
		}
		
		return [
			{
				"name": "京东外卖",
				"img": "jdwm-icon.png",
				"appid": "wx91d27dbf599dff74",
				"ghid": "gh_45b306365c3d",
				"path": `pages/union/proxy/proxy?spreadUrl=${jdwm.url}`,
				'android_pkg': 'com.jd.hm.mall',
				"android_dplink": `openApp.jdMobile://virtual?params=${encodeURIComponent(JSON.stringify(jdwm))}`
			},
			{
				// 外卖券包
				"name": "美团拼饭",
				"img": "meituan2.png",
				"appid": "wxde8ac0a21135c07d",
				"ghid": "gh_870576f3c6f9",
				"path": "/waimai-bargain-sub1/pages/transfer/guide/index?path=%2FindependentPackages%2FmarketingVenue%2Fhost%2Findex%3FvenueId%3DBRAND_AWARENESS_V3&pageType=h5&channel_id=302008&p=vvbKNbxzxIyB&t=1&c=2",
				"android_dplink": "imeituan://www.meituan.com/web?url=https%3A%2F%2Fclick.meituan.com%2Ft%3Ft%3D1%26c%3D2%26p%3DRMDM-bxz0vmd&lch=cps:mtlm:10:8e97635367b440418c680a77bdef44af:172417jutuike4563r4:7:1688451586411667464"
			},
			{
				"name": "淘宝免单",
				"img": "tbsg1.png",
				// "appid": "wx91d27dbf599dff74",
				// "ghid": "gh_45b306365c3d",
				// "path": `pages/union/proxy/proxy?spreadUrl=${jdwm.url}`,
				'android_pkg': 'com.taobao.taobao',
				"android_dplink": "tbopen://m.taobao.com/tbopen/index.html?&action=ali.open.nav&module=h5&h5Url=https%3A%2F%2Fh5.ele.me%2Fminisite%2Fpages%2Findex-xsd%2Findex%3FisTab%3Dfalse%26disableNav%3DYES%26forceThemis%3Dtrue%26tfPos%3Dh5%26forbidRefineType%3DgoOut%26from%3Dminiapp.taobao%26channelInfo%3D%257B%2522subSubChannel%2522%253A%2522miniapp.taobao.et%2522%257D%26alsc_exsrc%3DES0006299852%26mdFrom%3D%26scene%3Da2d61ddcf73f4dd8860568049ff103aa%26o2i_1st_clk%3D__CLICK_ID__"
			},
			
			{
				// 打车5折
				"name": "打车五折",
				"img": "wangyueche.png",
				"appid": "wxaf35009675aa0b2a",
				"ghid": "gh_7a5c4141778f",
				"path": "/webx/entry/block-prevention?scene=28kmKvg&source_id=172417jutuike4563r4&ref_from=dunion"
			},
			
			{
				"name": "甜点饮品",
				"img": "naicha.png",
				// "android_pkg": "",
				"android_dplink": "imeituan://www.meituan.com/takeout/browser?inner_url=https%3A%2F%2Fclick.meituan.com%2Ft%3Ft%3D1%26c%3D2%26p%3D7aUg-bxzjdUe&lch=cps:mtlm:10:8e97635367b440418c680a77bdef44af:172417jutuike4563r4:569:1688451586411667464"
			},
			
			{
				"name": "特惠酒店",
				"img": "hotel.png",
				// "android_pkg": "",
				"android_dplink": "imeituan://www.meituan.com/web?lch=cps:x:0:65c5f4b9271221c79eae104d969a48a3:172417jutuike4563r4:129:85459&url=https%3A%2F%2Funionh5.meituan.com%2Fmiddlepage%3Fmt%3D3%26lm%3DMjA3NzQxNzM5NDc0NTgzMTUxMg%253D%253DNDY3%253D%253D%253D%253D%26uid%3D85459%26container%3Dmeituan_app"
			},
			
			// {
			// 	// 商超果蔬
			// 	"name": "商超果蔬",
			// 	"img": "guoshu.png",
			// 	"appid": "wxde8ac0a21135c07d",
			// 	"ghid": "gh_870576f3c6f9",
			// 	"path": "/index/pages/h5/h5?weburl=https%3A%2F%2Fclick.meituan.com%2Ft%3Ft%3D1%26c%3D2%26p%3De7ZfFb9zy9uD",
			// },
			
			// {
			// 	"appid": "wxde8ac0a21135c07d",
			// 	"name": "吃喝玩乐",
			// 	"img": "chwl2.png",
			// 	"ghid": "gh_870576f3c6f9",
			// 	"path": "/index/pages/h5/h5?weburl=https%3A%2F%2Fclick.meituan.com%2Ft%3Ft%3D1%26c%3D2%26p%3DozAod79zREpM"
			// },
			
			{
				// 美团买药
				"name": "在线买药",
				"img": "meituanmaiyao.png",
				"appid": "wxde8ac0a21135c07d",
				"ghid": "gh_870576f3c6f9",
				"path": "/index/pages/h5/h5?weburl=https%3A%2F%2Fclick.meituan.com%2Ft%3Ft%3D1%26c%3D2%26p%3DGZbMNbxznB9q"
			},
			
			// {
			// 	// 
			// 	"name": "瑞幸咖啡",
			// 	"img": "ruixing2.png",
			// 	"appid": "wx89752980e795bfde",
			// 	"ghid": "gh_87b858b8b89d",
			// 	"path": "/pages/index/index?pub_id=172417&sid=4563r4&act_id=33&source=jutuike"
			// },
			// {
			// 	"name": "特惠酒店",
			// 	"img": "hotel.png",
			// 	"appid": "wx3c08fc3019c05906",
			// 	"ghid": "gh_0a7bbb6498c3",
			// 	"path": "/pages/index/index?spreader_sid=4563r4&pub_id=172417&relation_flag_name=jutuike"
			// },
		]
		
	}
}