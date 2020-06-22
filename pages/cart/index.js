import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },
  onShow() {
    const address = wx.getStorageSync("address");
    const cart = wx.getStorageSync("cart") || [];

    this.setData({
      address,
    });
    this.setCart(cart);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  async handleChooseAddress() {
    try {
      // 1 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];

      if (!scopeAddress && scopeAddress !== undefined) {
        await openSetting();
      }

      const address = await chooseAddress();
      address.all = `${address.provinceName}${address.cityName}${address.countyName}${address.detailInfo}`;
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },

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

  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });

    allChecked = cart.length ? allChecked : false;

    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum,
    });

    wx.setStorageSync("cart", cart);
  },

  handleItemAllChange() {
    let {
      cart,
      allChecked
    } = this.data;
    allChecked = !allChecked;
    cart.forEach((v) => (v.checked = allChecked));

    this.setCart(cart);
  },

  async handleEditNm(e) {
    const {
      id,
      operation
    } = e.currentTarget.dataset;
    let {
      cart
    } = this.data;
    const index = cart.findIndex((v) => v.goods_id === id);

    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({
        content: '您是否要删除？'
      })

      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      } else if (res.cancel) {
        console.log("用户取消");
      }
    } else {
      cart[index].num += operation;

      this.setCart(cart);
    }
  },

  async handlePay() {
    const {
      address,
      totalNum
    } = this.data;

    if (!address.userName) {
      await showToast({
        title: '您还没有选择收货地址'
      });
      return;
    }

    if (!totalNum) {
      await showToast({
        title: '您还没有选购商品'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
});