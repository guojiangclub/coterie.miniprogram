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
        is_showgrey:false,
        at_user_id:'',
        is_aite:true
    },
    onLoad(e){
        this.setData({
            id:e.id
        })
    },
    onShow(){
        var aite = cookieStorage.get('aite_person');
        var topic_list = cookieStorage.get('topic_list');
        var txt = this.data.describe;
        var reg = /@\S+\s+/;
        //利用对象的属性去重
       if(topic_list){
           if(topic_list.length != 0 || topic_list.length != 1){
               var res = [];
               var obj = {};
               for(var i = 0;i < topic_list.length;i++){
                   if(!obj[topic_list[i]]){
                       res.push(topic_list[i]);
                       obj[topic_list[i]] = 1
                   }
               }
               this.setData({
                   tags_list:res
               })
               cookieStorage.set('topic_list',this.data.tags_list);
           }
       }

        if(aite && txt.search(reg) == -1){
            var nick_name = aite.user_meta_info.nick_name;
            var describe = txt + '@'+nick_name+' ';
            this.setData({
                at_user_id:aite.user_id,
                describe:describe || txt,
                is_aite:false
            })
        }
    },
    changeinput(e){
        this.setData({
            describe:e.detail.value
        })
        var reg = /@\S+\s+/;
        var aite = cookieStorage.get('aite_person');
        if(aite){
            var nick_name = '@'+aite.user_meta_info.nick_name;
            if (this.data.describe.search(reg) == -1){
                var newtxt = this.data.describe.replace(nick_name,' ');
                this.setData({
                    describe:newtxt,
                    is_aite:true
                })
                cookieStorage.clear('aite_person');
            }
        }

    },
    //点击删除标签的按钮
    deleteTag(e){
        var index = e.currentTarget.dataset.index;
        var list = this.data.tags_list;
        list.splice(index,1);
        this.setData({
            tags_list:list
        })
        cookieStorage.set('topic_list',this.data.tags_list);
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
            url:'/pages/knowladge/topic/main?id='+ this.data.id
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
        if(this.data.is_aite){
            wx.navigateTo({
                url:'/pages/knowladge/manList/main?id='+this.data.id+'&type=news'
            })
        } else {
            return
        }
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
            var reg = /@\S+\s+/;
            var arr = this.data.describe.match(reg);
            var aite = cookieStorage.get('aite_person');
            if(aite){
                var nick_name = '@'+aite.user_meta_info.nick_name+ ' ';
                if(arr[0] == nick_name){
                    this.postContent(this.data.img_list,this.data.describe,this.data.urlDetail.link_info,this.data.id,this.data.at_user_id,this.data.tags_list);
                } else {
                    this.postContent(this.data.img_list,this.data.describe,this.data.urlDetail.link_info,this.data.id,'',this.data.tags_list);
                }
            } else {
                this.postContent(this.data.img_list,this.data.describe,this.data.urlDetail.link_info,this.data.id,'',this.data.tags_list);
            }

        }
    },
    //请求发布接口
    postContent(img_list,description,link,coterie_id,at_user_id,tags_list){
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
                style_type:'default',
                at_user_id:at_user_id || '',
                tags_list:tags_list || ''

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
                    cookieStorage.clear('aite_person');
                    cookieStorage.clear('topic_list');
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