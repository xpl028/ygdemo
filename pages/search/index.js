import {
  request
} from "../../request/index.js";

// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    isFocus: false,
    inpValue: '',
  },
  timeId: -1,

  // 搜索
  handleInput(e) {
    const {
      value
    } = e.detail;

    clearTimeout(this.timeId);

    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false,
      });
      return;
    }

    this.setData({
      isFocus: true
    });

    this.timeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },

  async qsearch(query) {
    try {
      const res = await request({
        url: '/goods/qsearch',
        data: {
          query
        }
      });

      this.setData({
        goods: res
      });
    } catch (error) {
      console.log(error);
    }
  },

  handleCancel() {
    this.setData({
      inpValue: '',
      goods: [],
      isFocus: false,
    });
  }
})