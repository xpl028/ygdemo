// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: '体验问题',
      isActive: true,
    }, {
      id: 1,
      value: '商品/商家投诉',
      isActive: false,
    }],
    chooseImage: [],
    textVal: '',
  },
  UploadImgs: [],

  tabsItemChange(e) {
    const {
      index
    } = e.detail;
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

  // 图片上传
  handleUpImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImage: [
            ...this.data.chooseImage,
            ...result.tempFilePaths
          ],
        });
      }
    });
  },

  // 删除图片
  handleRemoceImg(e) {
    const {
      index
    } = e.currentTarget.dataset;

    let {
      chooseImage
    } = this.data;

    chooseImage.splice(index, 1);

    this.setData({
      chooseImage
    });
  },

  // 获取文本域内容
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    });
  },

  // 提交
  handleSubmit(e) {
    const {
      textVal,
      chooseImage,
    } = this.data;

    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });

      return;
    }

    wx.showLoading({
      title: '正在上传中',
      mask: true,
    });

    if (chooseImage.length) {
      chooseImage.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://images.ac.cn/api/upload/upload',
          filePath: v,
          name: 'file',
          formData: {},
          success: (result) => {
            const {
              url,
            } = JSON.parse(result.data);
            this.UploadImgs.push(url);

            if (i === chooseImage.length - 1) {
              wx.hideLoading();

              this.setData({
                textVal: '',
                chooseImage: [],
              });

              wx.navigateBack({
                delta: 1
              });
            }
          },
        });
      });
    } else {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }

  },
})