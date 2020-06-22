let ajaxTimes = 0;
export const request = (params) => {
  let header = {
    ...params.header,
  };

  if (params.url.includes('/my/')) {
    // header['Authorization'] = wx.getStorageSync('token');
    header['Authorization'] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
  }

  ajaxTimes++;
  wx.showLoading({
    title: '加载中',
    mask: true,
  });

  // 定义公共url
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: `${baseUrl}${params.url}`,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      }
    });
  })
}