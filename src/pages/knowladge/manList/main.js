import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        id:'',//圈子id
        memberList:[],//成员列表
        guest_list:[],//嘉宾列表
        owner_list:[],//圈主
        page:0,
        hasMore:true,
        name:''
    },
    onLoad(e){
        this.setData({
            id:e.id
        })
    },
    onShow(){
        var token = cookieStorage.get('user_token');
        if (token){
            this.getMember(this.data.id,1,this.data.name)
        }
    },
    onReachBottom() {
        if (this.data.hasMore) {
            var page = this.data.page + 1;
            this.getMember(this.data.id,page,this.data.name);
        } else {
            wx.showToast({
                image: '../../../assets/image/error.png',
                title: '再拉也没有啦'
            });
        }
    },
    //获取name
    changeName(e){
        this.setData({
            name:e.detail.value
        })
    },
    // 确认搜索
    sureSearch(){
        this.getMember(this.data.id,1,this.data.name) ;
    },
    //请求获取数据圈会员接口
    getMember(id,page,name){
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api:'api/member',
            data:{
                coterie_id:id,
                page:page,
                name:name || ''
            },
            header:{
                Authorization:token
            }
        }).then(res=>{
            if(res.statusCode == 200){
                res = res.data;
                if(res.status){
                    var pages = res.meta.pagination;
                    var current_page = pages.current_page;
                    var total_pages = pages.total_pages;
                    var owner_list = res.meta.owner_list;
                    var guest_list = res.meta.guest_list;
                    var member_list = res.data;
                    this.setData({
                        [`memberList[${page-1}]`]:member_list,
                        page:current_page,
                        hasMore:current_page<total_pages,
                        owner_list:owner_list,
                        guest_list:guest_list
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
            wx.hideLoading();
            wx.showModal({
                content:'服务器开了小差，请重试',
                showCancel:false
            })
        })
    }

})
