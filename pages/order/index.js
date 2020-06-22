import {
  request
} from "../../request/index.js";

// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [{
      id: 0,
      value: '全部',
      isActive: true,
    }, {
      id: 1,
      value: '待付款',
      isActive: false,
    }, {
      id: 2,
      value: '待发货',
      isActive: false,
    }, {
      id: 3,
      value: '退货/退款',
      isActive: false,
    }],
  },

  onShow() {
    const token = wx = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }

    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const {
      type
    } = currentPage.options;

    this.changeTitleByIdex(type - 1);
    this.getOrders(type);
  },

  async getOrders(type) {
    const res = await request({
      url: '/my/order/all',
      data: {
        type
      }
    });

    this.setData({
      orders: res.orders.map(v => ({
        ...v,
        create_time_cn: (new Date(v.create_time * 1000).toLocaleString()),
      })),
    });
  },

  changeTitleByIdex(index) {
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ?
      v.isActive = true : v.isActive = false
    );

    this.setData({
      tabs
    });
  },

  tabsItemChange(e) {
    const {
      index
    } = e.detail;

    this.changeTitleByIdex(index);

    this.getOrders(index + 1);
  },
})