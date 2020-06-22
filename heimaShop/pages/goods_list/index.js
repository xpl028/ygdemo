import {
  request
} from "../../request/index.js";

// pages/goods_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: '综合',
      isActive: true,
    }, {
      id: 1,
      value: '销量',
      isActive: false,
    }, {
      id: 2,
      value: '价格',
      isActive: false,
    }],
    goodsList: [],
  },

  queryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10,
  },
  totalPage: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryParams.cid = options.cid || '';
    this.queryParams.query = options.query || '';

    this.getGoodsList();
  },

  async getGoodsList() {
    try {
      const res = await request({
        url: '/goods/search',
        data: this.queryParams,
      });

      const total = res.total;
      this.totalPage = Math.ceil(total / this.queryParams.pagesize);

      this.setData({
        goodsList: [...this.data.goodsList, ...res.goods],
      });

      // 关闭下拉刷新loading
      wx.stopPullDownRefresh();
    } catch (error) {

    }
  },

  tabsItemChange(e) {
    const {
      index
    } = e.detail;

    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);

    this.setData({
      tabs
    });
  },

  onReachBottom() {
    if (this.queryParams.pagenum >= this.totalPage) {
      wx.showToast({
        title: '没有下一页数据了~',
      });
    } else {
      this.queryParams.pagenum++;
      this.getGoodsList();
    }
  },

  onPullDownRefresh() {
    this.setData({
      goodsList: [],
    });
    this.queryParams.pagenum = 1;
    this.getGoodsList();
  }
})