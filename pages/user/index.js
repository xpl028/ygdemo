// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    collectnum: 0,
  },

  onShow() {
    const userInfo = wx.getStorageSync('userinfo');
    const collect = wx-getStorageSync('collect');

    this.setData({
      userInfo,
      collectnum: collect.length,
    });
  }
})