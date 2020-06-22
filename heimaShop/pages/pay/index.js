import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx";
import {
  request
} from "../../request/index.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },
  onShow() {
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    cart = cart.filter(v => v.checked);

    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach((v) => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  handleChange(e) {
    const {
      id
    } = e.currentTarget.dataset;
    let {
      cart
    } = this.data;
    let index = cart.findIndex((v) => v.goods_id === id);
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);
  },

  async handleOrderPay() {
    try {
      const token = wx.getStorageSync('token');

      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
      }

      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price,
      }));
      const requestParams = {
        order_price: this.data.totalPrice,
        consignee_addr: this.data.address.all,
        goods,
      };

      // 生成订单编号
      const {
        order_number
      } = await request({
        url: '/my/orders/create',
        method: 'POST',
        data: requestParams,
      });

      // 发起预支付
      const {
        pay
      } = await request({
        url: '/my/orders/req_unifiedorder',
        method: 'POST',
        data: {
          order_number
        },
      });

      // 发起微信支付
      await requestPayment(pay);

      // 查询订单状态
      const res = await request({
        url: '/my/orders/chkOrder',
        data: {
          order_number
        },
        method: 'POST',
      });

      await showToast({
        title: '支付成功'
      });

      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart);

      // 支付成功，跳转到订单页
      wx.navigateTo({
        url: '/pages/order/index',
      });
    } catch (error) {
      console.log(error);
      await showToast({
        title: '支付失败'
      });
    }
  },
});