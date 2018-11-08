/**
 * Created by admin on 2017/8/30.
 */
// http://admin.dev.tnf.ibrand.cc/

/*
* 1.每次发布项目前都需要修改logo，url以及name。
* 2.logo对应登录页面的logo
* 3.url对应线上请求的url
* 4.name对应登录页面的xxx用户协议以及页面中的部分判断  //mier，uto的是英文
* */

export default  {

    BRAND: {
        // https://wx.qlogo.cn/mmhead/Q3auHgzwzM6OM5hb6yiap47BtficrcdCy0qviaOvpeYALPVBIdRzsgLxQ/0  艾游logo
        // https://wx.qlogo.cn/mmhead/Q3auHgzwzM7oaTiaOG353b1LoGRF9w45gxSAL7KIEj34F06Y5Rz9pbw/0 米尔logo
        // https://nuscents.ibrand.cc/m/static/img/nu-bar-logo.png  优仙姿logo
        // https://land-river-admin.ibrand.cc/storage/DvNvj2N2mkg2fvY4Cx5LJLLYLMTmdhV1J3qfd593.png 511logo
        // https://wx.qlogo.cn/mmhead/Q3auHgzwzM6mtAOqRqibo9LokKQx5tSCcz3TZ3EbYbtDSoDXHHXglJw/0  utologo
        // https://wx.qlogo.cn/mmhead/Q3auHgzwzM7nj78UwGmvz8ft59Fhu5tQculuDibltEsmJ7obTtl9j9Q/0  悦户外logo
        // https://wx.qlogo.cn/mmhead/Q3auHgzwzM4X8VfglpKKTygW0D4OmsSHB9LGiczHHdYRhIzKPZtBs2A/0   狼爪logo
        // https://wx.qlogo.cn/mmhead/Q3auHgzwzM4Hr59sxBlnH4jfKMQJYACQOzibNe0xticCaP7RnuFlrvXQ/0  运运清货
        // https://wx.qlogo.cn/mmhead/Q3auHgzwzM6AJcJTnABAibZjGruHrHHmibmmj5Qd5e5HCFIYlMr1ofZw/0  万有logo
        // https://wx.qlogo.cn/mmhead/Q3auHgzwzM5U3WrXNB2ibSic2zFETlNRl05wah0y5DicdiaVHnpAPwy2Dw/0 原物三生logo
        name: '岚川汇',
        logo: 'https://land-river-admin.ibrand.cc/storage/DvNvj2N2mkg2fvY4Cx5LJLLYLMTmdhV1J3qfd593.png',
        cache: ''
    },
    GLOBAL: {

        // https://ibrand-admin.beta.ibrand.cc/
        // http://pay.dev.tnf.ibrand.cc/
        // https://admin-dev.ibrand.cc/
        // http://admin.dev.tnf.ibrand.cc/
        // https://admin.viperky.com/
        // https://nuscents-admin.ibrand.cc/
        // https://land-river-admin.ibrand.cc/
        // https://uto-admin.ibrand.cc/
        // https://joyoutdoor-admin.ibrand.cc/
        // https://sansei-admin.ibrand.cc/

        // https://jw-admin.ibrand.cc/
        // https://admin.wanyoujishi.com/
        // https://ibrand-admin.beta.ibrand.cc/
        // https://maoda-admin.ibrand.cc/
        // https://miniprogram-proxy.ibrand.cc/  第三方平台请求接口
        // baseUrl: process.env.NODE_ENV === 'development' ? 'https://nuscents-admin.ibrand.cc/' : 'https://ibrand-admin.beta.ibrand.cc/', // 运行时自动替换变量
        baseUrl: process.env.NODE_ENV === 'development' ? 'https://admin-dev.ibrand.cc/' : 'https://land-river-admin.ibrand.cc/', // 运行时自动替换变量
    },
    VERSION:'1.0.0'

}