export default  {

    BRAND: {
        name: '数据圈',
        logo: 'https://land-river-admin.ibrand.cc/storage/DvNvj2N2mkg2fvY4Cx5LJLLYLMTmdhV1J3qfd593.png'
    },
    GLOBAL: {

        // https://ibrand-admin.beta.ibrand.cc/
        // https://admin-dev.ibrand.cc/
        // https://miniprogram-proxy.ibrand.cc/  第三方平台请求接口
        baseUrl: process.env.NODE_ENV === 'development' ? 'https://hellobi-quanzi-dev-admin.ibrand.cc/' : 'https://land-river-admin.ibrand.cc/', // 运行时自动替换变量
    },
    VERSION:'1.0.0'

}