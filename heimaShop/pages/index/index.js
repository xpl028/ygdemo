import {
  request
} from '../../request/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    cateList: [],
    floorList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     const {
    //       data
    //     } = result;

    //     this.setData({
    //       swiperList: data.message,
    //     })
    //   }
    // });

    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  async getSwiperList() {
    try {
      const res = await request({url: '/home/swiperdata'});

      this.setData({
        swiperList: res.map(v => ({
          ...v,
          navigator_url: v.navigator_url.replace('main', 'index')
        }))
      })
    } catch (error) {
      console.log(error)
    }
  },

  async getCateList() {
    try {
      const res = await request({url: '/home/catitems'});

      this.setData({
        cateList: res.map(v => ({
          ...v,
          navigator_url: v.navigator_url ?
            v.navigator_url.replace('main', 'index') :
            '/pages/category/index'
        }))
      })
    } catch (error) {
      console.log(error)
    }
  },

  async getFloorList() {
    try {
      const res = await request({url: '/home/floordata'});
      const newRes = res.map(v => ({
        ...v,
        product_list: v.product_list.map(item => ({
          ...item,
          navigator_url: item.navigator_url ?
            item.navigator_url.replace('?', '/index?') :
            '/pages/goods_list/index'
        })),
      }))

      this.setData({
        floorList: newRes
      });
    } catch (error) {
      console.log(error)
    }
  }
})