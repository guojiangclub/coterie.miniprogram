import {config,pageLogin,sandBox,getUrl,cookieStorage,is} from '../../../lib/myapp.js';
Page({
    data: {
        hotTagList:[],
        tagpage:0,
        tagMore:true,
        title:'',
        id:'',
        selectList:[]

    },
    onLoad(e) {
        /*const rec = wx.getRecorderManager();
        const cre = wx.createInnerAudioContext()
        console.log(rec, cre);
        this.setData({
            rec: rec,
            cre: cre
        })*/
        var id = e.id;
        this.setData({
            id:id
        })
        this.getTags(id,1);
    },
    //获取input
    getTitle(e){
        this.setData({
            title:e.detail.value
        });
    },
    //点击搜索按钮搜索
    searchTags(e){
        this.getTags(this.data.id,1,e.detail.value)
    },
    //点击热门标签
    selectTags(e){
        var topic_list = cookieStorage.get('topic_list');
        var list = [];
        if(topic_list){
            list = topic_list;
        } else {
            list = this.data.selectList;
        }
        var title = e.currentTarget.dataset.title;
        list.push(title);
        this.setData({
            selectList:list
        })
        cookieStorage.set('topic_list',this.data.selectList);
        wx.navigateBack({
            delta:1
        })
    },
    //确认添加标签
    addTags(){
        if (!this.data.title) {
            wx.showModal({
                content: '请输入标签',
                showCancel: false
            })
        }
        var topic_list = cookieStorage.get('topic_list');
        var list = [];
        if(topic_list){
            list = topic_list;
        } else {
            list = this.data.selectList;
        }
      list.push(this.data.title);
      this.setData({
          selectList:list
      })
        cookieStorage.set('topic_list',this.data.selectList);
        wx.navigateBack({
            delta:1
        })

    },

    //获取热门标签
    getTags(id,page,title) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token');
        sandBox.get({
            api: 'api/content/tags',
            header:{
                Authorization: token
            },
            data:{
                coterie_id: id,
                page:page,
                title:title || ''
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    if (!res.data) {
                        wx.hideLoading();
                        return
                    }
                    //分页数据
                    var pages = res.data.meta;
                    var current_page = pages.current_page;
                    var total_pages = pages.total_pages;
                    this.setData({
                        [`hotTagList[${page-1}]`]:res.data.data,
                        tagpage:current_page,
                        tagMore:current_page < total_pages
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
   /* start() {
        this.data.rec.start();
    },
    pause() {
        this.data.rec.pause();
    },
    stop() {
        this.data.rec.stop();
        this.data.rec.onStop(res => {
            this.setData({
                src: res.tempFilePath
            })
            console.log(res);
        })
    },
    play() {
      /!*this.data.cre.setSrc = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46';
      this.data.cre.play();*!/
        const innerAudioContext = wx.createInnerAudioContext()
        // innerAudioContext.autoplay = true
        innerAudioContext.src = this.data.src;
        // innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
        innerAudioContext.play();
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
    }*/
})