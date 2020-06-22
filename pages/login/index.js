// pages/login/index.js
Page({
  handleGetUser(e) {
    const {
      userInfo
    } = e.detail;

    wx.setStorageSync('userinfo', userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})