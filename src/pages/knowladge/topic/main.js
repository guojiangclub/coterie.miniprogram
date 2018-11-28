Page({
    data: {
        rec: ''
    },
    onLoad() {
        const rec = wx.getRecorderManager();
        const cre = wx.createInnerAudioContext()
        console.log(rec, cre);
        this.setData({
            rec: rec,
            cre: cre
        })

    },
    start() {
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
      /*this.data.cre.setSrc = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46';
      this.data.cre.play();*/
        const innerAudioContext = wx.createInnerAudioContext()
        // innerAudioContext.autoplay = true
        innerAudioContext.src = this.data.src;
        // innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
        innerAudioContext.play();
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
    }
})