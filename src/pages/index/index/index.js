import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';

Page({
    data:{
        token:'',
        coterieList:[],
        page:0,
        hasMore:true,
        is_perfect_user_info:''//是否完善信息

    },
    onShow(){
        var token = cookieStorage.get('user_token');
        if(token) {
            this.setData({
                token:token
            })
            this.getMycoterie();
        }

    },
    onReachBottom() {
        if (this.data.hasMore) {
            var page = this.data.page + 1;
            this.getMycoterie(page);
        } else {
            wx.showToast({
                image: '../../../assets/image/error.png',
                title: '再拉也没有啦'
            });
        }
    },
    bindgetuserinfo(e){
        this.updateUserInfo(e.detail.userInfo);
    },
    //将得到的信息发送给后台
    updateUserInfo(info){
        wx.showLoading({
            title: '更新中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.post({
            api: 'api/users/update/info',
            header:{
                Authorization: token
            },
            data:{
                nick_name:info.nickName,
                sex:info.gender == 1 ? '男' : '女',
                avatar:info.avatarUrl,
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    //重新请求列表页接口
                    this.getMycoterie(1);
                } else {
                    wx.showModal({
                        content:res.message ||  "更新失败",
                        showCancel: false
                    });
                }
                wx.hideLoading();
            }
            else{
                wx.showModal({
                    content:"更新失败",
                    showCancel: false
                });
                wx.hideLoading();
            }
        })
    },
    //跳到搜索页面
    jumpSearch(){
        wx.navigateTo({
            url:'/pages/index/search/main'
        })
    },
    //跳到详情页
    jumpDetail(e){
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url:'/pages/knowladge/detail/main?id='+id
        })
    },
    //获取自己的圈子列表
    getMycoterie(page = 1){
      wx.showLoading({
          title:'加载中',
          mask:true
      });
      var token = cookieStorage.get('user_token');
      sandBox.get({
          api:'api/coterie/user',
          data:{
              page:page
          },
          header:{
              Authorization:token
          }
      }).then(res=>{
          if (res.statusCode == 200){
              res = res.data;
              if (res.status){
                  //分页数据
                  var pages = res.meta.pagination;
                  var current_page = pages.current_page;
                  var total_pages = pages.total_pages;
                  this.setData({
                      [`coterieList[${page-1}]`]:res.data,
                      page:current_page,
                      hasMore:current_page < total_pages,
                      is_perfect_user_info:res.meta.is_perfect_user_info
                  })
              } else {
                  wx.showModal({
                      content:res.message || '服务器开了小差，请重试',
                      showCancel:false
                  })
              }
          } else {
              wx.showModal({
                  content:res.message || '服务器开了小差，请重试',
                  showCancel:false
              })
          }
          wx.hideLoading();
      }).catch(rej=>{
          wx.showModal({
              content:'服务器开了小差，请重试',
              showCancel:false
          })
          wx.hideLoading();
      })
    },
    //跳到创建圈子页面
    jumpSet(){
        if (this.data.token){
            wx.navigateTo({
                url:'/pages/index/setUp/main'
            })
        } else {
            var url = getUrl();
            wx.navigateTo({
                url: '/pages/user/login/main?url=' + url
            })
        }
    }

})