import {
  request
} from "../../request/index.js";

// pages/goods_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    isCollect: false,
  },
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;

    this.getGoodsDetail(options.goods_id);
  },

  // 商品详情
  async getGoodsDetail(goods_id) {
    try {
      const res = await request({
        url: '/goods/detail',
        data: {
          goods_id: goods_id
        }
      });

      this.GoodsInfo = res;

      // 获取收藏数组
      let collect = wx.getStorageSync('collect') || [];
      // 判断当前商品是否被收藏
      let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);

      this.setData({
        goodsDetail: {
          goods_name: res.goods_name,
          goods_price: res.goods_price,
          // iphone部分手机不支持webp图片格式
          goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
          pics: res.pics,
        },
        isCollect,
      })
    } catch (err) {
      console.log(err);
    }
  },

  // 预览图片
  handlePreviewImg(e) {
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;

    wx.previewImage({
      current,
      urls,
    });
  },

  // 加入购物车
  handleCartAdd() {
    // 获取缓存中的购物车 数组
    let cart = wx.getStorageSync('cart') || [];
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);

    if (index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
    }

    wx.setStorageSync('cart', cart);

    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    });
  },

  // 收藏
  handleCollect() {
    let isCollect = false;
    let collect = wx.getStorageSync('collect') || [];
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);

    if (index !== -1) {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }

    wx.setStorageSync('collect', collect);

    this.setData({
      isCollect
    });
  }
})