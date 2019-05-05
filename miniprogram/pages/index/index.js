//index.js
const app = getApp()

Page({
    data: {
		pages: 0,
        articles: [],
		nodata: false,
		openid: ''
    },

    onLoad: function() {
        if (!wx.cloud) {
            wx.redirectTo({
                url: '../chooseLib/chooseLib',
            })
            return
        }

		wx.cloud.callFunction({
			name: 'login',
			complete: res => {
				this.setData({
					openid: res.result.openid
				})
			}
		})
    },
    onShow() {
        this.getlist()
    },
	showInfo(e) {
		console.log(e)
		var id = e.currentTarget.dataset.id
		if(id){
			wx.navigateTo({
				url: '/pages/article/article?id=' + id,
			})
		}
	},
	onReachBottom() {
		let pages = this.data.pages
		if (!this.data.nodata){
			this.setData({
				pages: pages + 5
			})
			this.getlist()
		}
	},
    onPullDownRefresh: function() {
		this.setData({
			pages: 0
		})
        this.getlist()
    },
    getlist: function() {
		let pages = this.data.pages
		console.log(pages)
		// wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
		// 	title: '加载中',
		// 	icon: 'loading',
		// });
		wx.showNavigationBarLoading()
        const db = wx.cloud.database()
        // 查询当前用户所有的 counters
		db.collection('articles').orderBy('timestamp', 'desc').skip(pages).limit(5).get({
            success: res => {
				// wx.hideLoading()
				wx.hideNavigationBarLoading()
				wx.stopPullDownRefresh()
                console.log(res.data)
				if (res.data.length > 0){
					if (pages > 0) {

						this.setData({
							articles: this.data.articles.concat(res.data),
							nodata: false
						})
					} else {
						this.setData({
							articles: res.data,
							nodata: false
						})
					}
				} else {
					this.setData({
						nodata: true
					})
				}
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
            }
        })
	}, 
	del(e) {
		var id = e.currentTarget.dataset.id
		var that = this
		if (id) {
			console.log(id)
			const db = wx.cloud.database()
			db.collection('articles').doc(id).update({
				data: {
					// 表示将 done 字段置为 true
					timestamp: 0
				},
				success: console.log,
				fail: console.error
			})
			wx.showToast({
				icon: 'none',
				title: '删除成功'
			})
			that.getlist()
		}	
	},
	onShareAppMessage: function () {
		
	},
})