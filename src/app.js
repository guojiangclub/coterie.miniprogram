import {config, getUrl, pageLogin, sandBox, cookieStorage} from './lib/myapp.js';

App({
    onLaunch(e) {
        var token = cookieStorage.get('user_token');   // 确保缓存跟当前版本保持一致

        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate(res => {
            if (res.hasUpdate) {
                wx.showLoading({
                    title: '正在更新，请稍后',
                    mask: true
                })
            }
        })
        updateManager.onUpdateReady(res => {
            wx.hideLoading();
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(err => {
            wx.showModal({
                title: '更新提示',
                content: '更新失败',
            })
        })
    },
    onShow() {
        // 获取第三方平台配置
        if (wx.getExtConfig) {
            wx.getExtConfig({
                success: res => {
                    if (res.extConfig.appid) {
                        cookieStorage.set('globalConfig', res.extConfig)
                    }
                }
            })
        }
    }
});