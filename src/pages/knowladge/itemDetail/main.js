Page({
    data: {
        show_share: false,  // 分享
        show_setting: false, // 设置
    },


    changeSetting() {
        this.setData({
            show_setting: !this.data.show_setting
        })
    },
    changeShare() {
        this.setData({
            show_share: !this.data.show_share
        })
    }
})