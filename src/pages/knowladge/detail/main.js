Page({
    data: {
        descAll: false,
        guestAll: false
    },


    changeDesc() {
        this.setData({
            descAll: !this.data.descAll
        })
    },
    changeGuest() {
        this.setData({
            guestAll: !this.data.guestAll
        })
    }
})