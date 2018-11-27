import {config,pageLogin,sandBox,getUrl,cookieStorage,is} from '../../../lib/myapp.js';
Page({
    data:{
        describe:'',
        img_list:[],
        is_show:false,
        url:'',
        urlDetail:'',
        tags_list:'',
        id:'',
        is_grey:false,
        is_showgrey:false
    },
    onLoad(e){
        this.setData({
            id:e.id
        })
    },
    onShow(){

    },
    changeinput(e){
        this.setData({
            describe:e.detail.value
        })
    },
    //上传图片
    changeImage() {
       if(!this.data.url){
           wx.chooseImage({
               count:1,
               success: res => {
                   this.upload(res.tempFilePaths)
               }
           })
       } else {
           return
       }
    },
    upload(path) {
        wx.showLoading({
            content: '上传中',
            mask: true
        })
        var token=cookieStorage.get('user_token');
        sandBox.uploadFile({
            api: 'api/upload/image',
            filePath: path[0],
            header: {
                Authorization:token
            },
            name: 'image',
        }).then(res => {
            var result = JSON.parse(res.data);
            if (result.status) {
                var img_list = this.data.img_list;
                img_list.push(result.data.url);
                this.setData({
                    img_list:img_list,
                    is_showgrey:true
                })
            } else {
                wx.showModal({
                    content: result.message || '上传失败',
                    showCancel: false
                })
            }
            wx.hideLoading();
        }).catch(err => {
            wx.showModal({
                content: '上传失败',
                showCancel: false
            })
            wx.hideLoading();
        })
    },
    //删除图片
    deleteImg(e){
        var index = e.currentTarget.dataset.index;
        var img_list = this.data.img_list;
        img_list.splice(index,1);
        this.setData({
            img_list:img_list
        })
        if(this.data.img_list.length == 0){
            this.setData({
                is_showgrey:false
            })
        }

    },
    //添加标签
    jumpTopic(){
        wx.navigateTo({
            url:'/pages/knowladge/topic/main'
        })
    },
    //显示链接
    changeLink(){
        if(this.data.img_list.length == 0){
            this.setData({
                is_show:!this.data.is_show
            })
        } else {
            return
        }
    },
    linkInfo(e){
        this.setData({
            url:e.detail.value
        })
    },
    //删除链接
    deleteLink(){
      this.setData({
          url:'',
          is_grey:false,
          urlDetail:''

      })
    },
    //确定按钮
    sure(){
        var message = '';
        if(!is.has(this.data.url)){
            message = '链接不能为空'
        } else if(!is.url(this.data.url)){
            message = '链接不合法'
        }
        if (message){
            wx.showModal({
                content:message,
                showCancel:false
            })
        } else {
            this.postLink(this.data.url);
            this.changeLink();

        }
    },
    //请求获取link相关信息
    postLink(url){
      wx.showLoading({
          title:'加载中',
          mask:true
      });
      var token = cookieStorage.get('user_token');
      sandBox.post({
          api:'api/content/query/link',
          data:{
              link:url
          },
          header:{
              Authorization:token
          }
      }).then(res=>{
          if (res.statusCode == 200){
              res = res.data;
              if (res.status){
                  this.setData({
                      urlDetail:res.data,
                      is_grey:true
                  })

              } else{
                  wx.showModal({
                      content: res.message || '服务器开了小差，请重试',
                      showCancel: false
                  })
              }
          } else {
              wx.showModal({
                  content: res.message || '服务器开了小差，请重试',
                  showCancel: false
              })
          }
          wx.hideLoading();
      }).catch(rej=>{
          wx.hideLoading();
          wx.showModal({
              content: '服务器开了小差，请重试',
              showCancel: false
          })
      })
    },
    //@别人
    jumpAite(){
        wx.navigateTo({
            url:'/pages/knowladge/manList/main?id='+this.data.id+'&type=news'
        })
    },
    //发布按钮
    publish(){
        var message = '';
        if(!this.data.describe){
            message = '请分享自己自己的观点'
        }
        if(message){
            wx.showModal({
                content:message,
                showCancel:false
            })
        } else {
            this.postContent(this.data.img_list,this.data.describe,this.data.url,this.data.tags_list,this.data.id)
        }
    },
    //请求发布接口
    postContent(img_list,description,link,tags_list,coterie_id){
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        var token = cookieStorage.get('user_token');
        var content_type = '';
        if(link){
            content_type = 'link'
        } else {
            content_type = 'default'
        }
        sandBox.post({
            api:'api/content/store',
            data:{
                img_list:img_list || '',
                tags_list:tags_list || '',
                coterie_id:coterie_id,
                content_type:content_type,
                description:description,
                link:link || '',
                style_type:'default'
            },
            header:{
                Authorization:token
            }
        }).then(res=>{
            if (res.statusCode == 200){
                res = res.data;
                if (res.status){
                    wx.redirectTo({
                        url:'/pages/knowladge/detail/main?id='+this.data.id
                    })
                } else{
                    wx.showModal({
                        content: res.message || '服务器开了小差，请重试',
                        showCancel: false
                    })
                }
            } else {
                wx.showModal({
                    content: res.message || '服务器开了小差，请重试',
                    showCancel: false
                })
            }
            wx.hideLoading();
        }).catch(rej=>{
            wx.hideLoading();
            wx.showModal({
                content: '服务器开了小差，请重试',
                showCancel: false
            })
        })
    }



})