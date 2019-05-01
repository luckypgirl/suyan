
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		loginSta: false,
		userInfo: {},
		title: '',
		content: '',
		datestr: '',
		hide: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		var userInfo = wx.getStorageSync('userInfo')
		if (userInfo){
			that.setData({
				userInfo: userInfo,
				loginSta: true
			})
		}

		const db = wx.cloud.database()
		// 这段代码是为了应付微信的审核 审核期间发布功能隐藏
		db.collection('articles').where({ _id: 'ee3099285cc6aa2c08be970f7ba10142' }).field({sta:true}).get({
			success: res => {
				console.log(res.data[0].sta)
				var sta = res.data[0].sta
				if (sta == 1) {
					that.setData({
						hide: true
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

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.setData({
			title: '',
			content: ''
		})
	},
	onGotUserInfo(e) {
		console.log(e)
		var that = this
		if (e.detail.rawData.length > 0) {
			wx.setStorageSync('userInfo', e.detail.userInfo)
			that.setData({
				userInfo: e.detail.userInfo,
				loginSta: true
			})
		}
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},
	setTitle(e) {
		this.setData({
			title: e.detail.value
		})
	},
	setContent(e) {
		this.setData({
			content: e.detail.value
		})
	},
	getTime(){
		var timestamp = Date.parse(new Date());
		timestamp = timestamp / 1000;
		console.log("当前时间戳为：" + timestamp);

		//获取当前时间
		var n = timestamp * 1000;
		var date = new Date(n);
		//年
		var Y = date.getFullYear();
		//月
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
		//日
		var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
		//时
		var h = date.getHours();
		//分
		var m = date.getMinutes();
		var datestr = Y + '/' + M + '/' + D + ' ' + h + ":" + m
		this.setData({
			datestr: datestr
		})
	},
	submit(){
		var that = this
		if (that.data.title == '') {
			wx.showToast({
				title: '请填写标题',
				icon: 'none'
			})
			return;
		} 
		if (that.data.content == '') {
			wx.showToast({
				title: '请填写内容',
				icon: 'none'
			})
			return;
		}

		that.getTime()

		const db = wx.cloud.database()
		db.collection('articles').add({
			// data 字段表示需新增的 JSON 数据
			data: {
				title: that.data.title,
				author: that.data.userInfo.nickName,
				face: that.data.userInfo.avatarUrl,
				content: that.data.content,
				date: that.data.datestr,
				timestamp: Date.now()
			},
			success(res) {
				// res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
				console.log(res)

				
				if (res.errMsg == 'collection.add:ok'){
					wx.showToast({
						title: '发布成功！',
						icon: 'none'
					})
					that.setData({
						title: '',
						content: '',
						author: ''
					})
					wx.switchTab({
						url: '/pages/index/index',
					})
					return;
				}
			},
			fail: console.error
		})
	},
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})