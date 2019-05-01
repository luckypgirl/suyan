// pages/article/article.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		mainInfo: [],
		painting: {},
		shareImage: '',

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options)
		var id = options.id
		var that = this
		const db = wx.cloud.database()
		// 查询当前用户所有的 counters
		db.collection('articles').where({ _id: id }).get({
			success: res => {
				console.log(res.data.length)
				if (res.data.length > 0){
					that.setData({
						mainInfo: res.data[0]
					})
					wx.setNavigationBarTitle({
						title: res.data[0].title,
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
	goList() {
		wx.switchTab({
			url: '/pages/index/index',
		})
	},
	create() {
		wx.showLoading({
			title: '绘制分享图片中',
			mask: true
		})

		var that = this
		that.setData({
			painting: {
				width: 400,
				height: 720,
				clear: true,
				views: [

					{
						type: 'text',
						content: that.data.mainInfo.title,
						fontSize: 24,
						lineHeight: 21,
						color: '#000',
						textAlign: 'left',
						top: 100,
						left: 50,
						width: 300,
						MaxLineNumber: 2,
						breakWord: true,
						bolder: true
					},
					{
						type: 'text',
						content: '文 / ' + that.data.mainInfo.author,
						fontSize: 14,
						color: '#555',
						textAlign: 'left',
						top: 150,
						left: 50,
						lineHeight: 30,
						MaxLineNumber: 1,
						breakWord: true,
						width: 300
					},
					{
						type: 'text',
						content: that.data.mainInfo.content,
						fontSize: 18,
						color: '#222',
						textAlign: 'left',
						top: 220,
						left: 50,
						lineHeight: 40,
						MaxLineNumber: 10,
						breakWord: true,
						width: 300
					},
					{
						type: 'text',
						content: '微信小程序搜索「素颜诗」',
						fontSize: 16,
						color: '#aaa',
						textAlign: 'left',
						top: 650,
						left: 50,
						lineHeight: 30,
						MaxLineNumber: 1,
						breakWord: true,
						width: 300
					}
				]
			}
		})
	},
	eventGetImage(event) {
		wx.hideLoading()
		const { tempFilePath } = event.detail
		wx.saveImageToPhotosAlbum({
			filePath: tempFilePath,
			success(res) {
				wx.showToast({
					title: '保存图片成功',
					icon: 'success',
					duration: 500
				})
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

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

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
		var that = this
		return {
			title: that.data.mainInfo.title,
			success: function (res) {
				wx.showToast({
					title: '转发成功',
					icon: 'none'
				})
			},
			fail: function (res) {
				wx.showToast({
					title: '转发取消',
					icon: 'none'
				})
			}
		}
	}
})