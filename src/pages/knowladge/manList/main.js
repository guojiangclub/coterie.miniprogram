import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        id:'',//圈子id
        memberList:[],//成员列表
        guest_list:[],//嘉宾和圈主列表
        page:0,
        hasMore:true,
        name:'',
        type:''
    },
    onLoad(e){
        this.setData({
            id:e.id,
            type:e.type
        })
    },
    onShow(){
        var token = cookieStorage.get('user_token');
        if (token){
            this.getMember(this.data.id,1,this.data.name)
        }
        if(this.data.type == 'news'){
            wx.setNavigationBarTitle({
                title:'@'
            })
        }
        if(this.data.type == 'question'){
            wx.setNavigationBarTitle({title:'向TA提问'})
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
    //请求获取果酱圈会员接口
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
                    var forbidden_list = res.meta.forbidden_list;
                    var member_list = res.data;
                    this.setData({
                        guest_list:owner_list.concat(guest_list),
                        'memberList[0]':owner_list.concat(guest_list),
                        [`memberList[${page}]`]:member_list,
                        page:current_page,
                        hasMore:current_page<total_pages
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
    },
    //选择提问人
    selectQuestioner(e){
        if(this.data.type == 'question'){
            cookieStorage.set('questioner',e.currentTarget.dataset.item);
        } else if(this.data.type == 'news'){
            cookieStorage.set('aite_person',e.currentTarget.dataset.item);
        }
            wx.navigateBack({
                delta:1
            })
    }

})
