import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';

Page({
    data:{
        name:'',
        circleList:[],
        recommendList:[],
        page:0,
        hasMore:true
    },
    onLoad(){

    },
    onShow(){
       this.getRecommend();
    },
    onReachBottom() {
        if (this.data.hasMore) {
            var page = this.data.page + 1;
            if(this.data.name){
                this.getSearch(this.data.name,page);
            } else {
                return
            }
        } else {
            wx.showToast({
                image: '../../../assets/image/error.png',
                title: '再拉也没有啦'
            });
        }
    },
    changeInput(e){
        this.setData({
            name:e.detail.value
        })
    },
    cancle(){
        this.setData({
            name:'',
            circleList:[]
        })
    },
    //确认搜索
    search(){
        if(this.data.name){
            this.getSearch(this.data.name,1)
        } else {
            return
        }
    },
    //跳到详情页
    jumpDetail(e){
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url:'/pages/knowladge/join/main?id='+ id
        })
    },
    //请求搜索接口
    getSearch(name,page){
        wx.showLoading({
            title:'搜索中',
            mask:true
        });
        sandBox.get({
            api:'api/coterie/search',
            data:{
                name:name,
                page:page
            }
        }).then(res=>{
            if (res.statusCode == 200){
                res = res.data;
                if(res.status){
                    if(res.data.length == 0){
                        wx.showModal({
                            content:'暂无搜索到相关圈子',
                            showCancel:false
                        })

                    } else {
                        var pages = res.meta.pagination;
                        var current_page = pages.current_page;
                        var total_pages = pages.total_pages;
                        this.setData({
                            [`circleList[${page-1}]`]:res.data,
                            page:current_page,
                            hasMore:current_page < total_pages
                        })
                    }

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
    //请求推荐圈子接口
    getRecommend(){
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        sandBox.get({
            api:'api/coterie/recommend',
            data:{
                page:1
            }
        }).then(res=>{
            if (res.statusCode == 200){
                res = res.data;
                if(res.status){
                    this.setData({
                        recommendList:res.data
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
