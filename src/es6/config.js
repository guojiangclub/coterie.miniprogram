export default  {

    BRAND: {
        name: '知识圈',
        logo: 'http://ibrand-miniprogram.oss-cn-hangzhou.aliyuncs.com/19-1-3/67807153.jpg'
    },
    GLOBAL: {

        // https://hellobi-beta-admin.ibrand.cc/
        // https://ibrand-admin.beta.ibrand.cc/
        // https://admin-dev.ibrand.cc/
        // https://miniprogram-proxy.ibrand.cc/  第三方平台请求接口
        baseUrl: process.env.NODE_ENV === 'development' ? 'https://hellobi-beta-admin.ibrand.cc/' : 'https://miniprogram-proxy.ibrand.cc/', // 运行时自动替换变量
    },
    VERSION:'1.0.0'

}