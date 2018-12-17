import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';

Page({
    data: {
        descAll: false,
        guestAll: false,
        id: '',
        detail: '',
        init: false,
        show_desc_btn: false,
        show_guest_btn: false,
        code:''
    },
    onLoad(e) {
      if (e.id) {
          this.setData({
              id: e.id,
          })
          this.getDetail(e.id);
          this.getinviteCode(e.id);
      } else {
          wx.showModal({
              content: '参数错误',
              showCancel: false
          })
      }
      var token = cookieStorage.get('user_token');
      this.setData({
          token: token
      })
    },
    onShareAppMessage(){
        var title = this.data.detail.user.nick_name;
        var name  = this.data.detail.name;
        return{
            title:title + '邀请您成为' + name + '的嘉宾',
            path:'/pages/knowladge/invite/main?id='+ this.data.id+'&code='+this.data.code
        }
    },
    changeDesc() {
        this.setData({
            descAll: !this.data.descAll
        })
    },
    changeGuest() {
        this.setData({
            guestAll: !this.data.guestAll
        })
    },
    // 获取节点信息
    getDomInfo(name) {
        console.log(name);
        var query = wx.createSelectorQuery();
        query.select(name).boundingClientRect(res => {
            if (name == '.js_desc' && res.height == 64) {
                this.setData({
                    show_desc_btn: true
                })
            }
        }).exec();
    },
    // 获取圈子详情
    getDetail(id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api: 'api/coterie',
            header:{
                Authorization: token
            },
            data:{
                coterie_id: id
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    // 如果加入过当前圈子，需要跳转到详情页面
                    /*if (res.data.is_coterie_member) {
                        wx.redirectTo({
                            url: '/pages/knowladge/detail/main?id=' + res.data.id
                        })
                    }*/
                    this.setData({
                        detail: res.data,
                        init: true
                    }, () => {
                        this.getDomInfo('.js_desc');

                        if (res.data.member_guest.length != 0) {
                            this.getDomInfo('.js_guest');
                        }
                    })
                } else {
                    wx.showModal({
                        content:res.message ||  "请求失败",
                        showCancel: false
                    });
                }
                wx.hideLoading();
            }
            else{
                wx.showModal({
                    content:"请求失败",
                    showCancel: false
                });
                wx.hideLoading();
            }
        })
    },
    //生成邀请链接群主用
    getinviteCode(id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api: 'api/member/invite/code',
            header:{
                Authorization: token
            },
            data:{
                coterie_id: id
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        code:res.data.code
                    })

                } else {
                    wx.showModal({
                        content:res.message ||  "请求失败",
                        showCancel: false
                    });
                }
                wx.hideLoading();
            }
            else{
                wx.showModal({
                    content:"请求失败",
                    showCancel: false
                });
                wx.hideLoading();
            }
        })
    },
})