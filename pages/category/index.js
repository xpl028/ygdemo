import { request } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates = wx.getStorageSync("cates");

    // 判断是否有本地存储
    if (!Cates) {
      this.getCates();
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates();
      } else {
        this.Cates = Cates.data;
        this.getData();
      }
    }
  },

  async getCates() {
    try {
      const res = await request({ url: "/categories" });

      this.Cates = res;

      // 存入本地存储
      wx.setStorageSync("cates", {
        time: Date.now(),
        data: this.Cates,
      });

      this.getData();
    } catch (err) {
      console.log(err);
    }

    // request({
    //   url: "/categories",
    // }).then((result) => {
    //   this.Cates = result.data.message;

    //   // 存入本地存储
    //   wx.setStorageSync("cates", {
    //     time: Date.now(),
    //     data: this.Cates,
    //   });

    //   this.getData();
    // });
  },

  handleItemTap(e) {
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;

    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0,
    });
  },

  getData() {
    let leftMenuList = this.Cates.map((v) => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent,
    });
  },
});
