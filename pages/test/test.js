// pages/test/test.js
var testData = require("../../data/data.js");

Page({
  data: {
    testData: testData.testData,
    orderNum: 1,
    last:false,
    question:'',
    answer: '',
    meScore:0,
    youScore:0,
    bgWrong:false,
    bgRight: false,
    animationData: {},
    show:true,
    clickOne:true,
    wWidth:'',
    wHeight: '',
    ratio:''
  },

  choose(e) {
    if (this.data.last){
      var isRight = e.target.dataset.isright;
      var that = this;
      var isRight = e.target.dataset.isright;
      var ratio = that.data.ratio
      var wHeight = that.data.wHeight
      var wWidth = that.data.wWidth
      if (this.data.clickOne){
        if (isRight) {
          var animation = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease',
            transformOrigin: '0 0 0'
          })

          //375宽为基础，实际高603：球门位置 横向['35-150','230-340']
          //纵向['80-162']
          var ballD = 153 / 2 * 0.25
          var maxT = (162 - ballD) * wHeight / 603
          var minT = 80 * wHeight / 603
          var ballTop = Math.random() * (maxT - minT + 1) + minT
          var minLA = 35 * wWidth / 375
          var maxLA = (150 - ballD) * wWidth / 375
          var minLB = 230 * wWidth / 375
          var maxLB = (340 - ballD) * wWidth / 375
          var ballLeftA = Math.random() * (maxLA - minLA + 1) + minLA
          var ballLeftB = Math.random() * (maxLB - minLB + 1) + minLB
          var ballLeftArr = [ballLeftA, ballLeftB]
          var ballLeftIndexRandom = Math.round(Math.random() * 1);
          var ballLeft = ballLeftArr[ballLeftIndexRandom]
          animation.scale(0.25, 0.25).left(ballLeft + 'px').top(ballTop + 'px').opacity(1).step()
          this.setData({
            animationData: animation.export(),
            bgRight: true,
            show: false
          })
          this.setData({
            meScore: this.data.meScore + 1,
          })
        } else {
          var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
            transformOrigin: '0 0 0'
          })
          //375宽为基础，实际高603：球门位置 横向['0-375']
          //纵向['0-67']
          var ballD = 153 / 2 * 0.15
          var minL = 0 * wWidth / 375
          var maxL = (375 - ballD) * wWidth / 375
          var ballLeft = Math.random() * (maxL - minL + 1) + minL
          var minT = 0 * wHeight / 603
          var maxT = (67 - ballD) * wHeight / 603
          var ballTop = Math.random() * (maxT - minT + 1) + minT
          animation.scale(0.15, 0.15).left(ballLeft + 'px').top(ballTop + 'px').opacity(1).step()
          this.setData({
            animationData: animation.export(),
            show: false
          })
          this.setData({
            youScore: this.data.youScore + 1,
          })
        }
      }
      this.setData({
        clickOne: false,
      })
      var lastScore = this.data.meScore;
      setTimeout(function () {
        wx.showToast({
          title: '证书生成中',
          icon: 'loading',
          duration: 2000
        })
      },1000)
      setTimeout(function () {
        wx.redirectTo({
          url: '../result/result?lastScore=' + lastScore
        })
      }, 3000)
    }else{
      this.answer(e);
      this.next();
    }
   
  },
  answer(e){
    var that = this;
    var isRight = e.target.dataset.isright;
    var ratio = that.data.ratio
    var wHeight = that.data.wHeight
    var wWidth = that.data.wWidth

    if (isRight) {
      var animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
        transformOrigin: '0 0 0'
      })
      
      //375宽为基础，实际高603：球门位置 横向['35-150','230-340']
      //纵向['80-162']
      var ballD = 153/2*0.25 
      var maxT = (162 - ballD) * wHeight  / 603
      var minT = 80 * wHeight / 603
      var ballTop = Math.random() * (maxT - minT + 1) + minT
      var minLA = 35 * wWidth / 375
      var maxLA = (150 - ballD) * wWidth / 375
      var minLB =230 * wWidth  / 375
      var maxLB = (340 - ballD) * wWidth  / 375
      var ballLeftA = Math.random() * (maxLA - minLA + 1) + minLA
      var ballLeftB = Math.random() * (maxLB - minLB + 1) + minLB
      var ballLeftArr = [ballLeftA, ballLeftB]
      var ballLeftIndexRandom = Math.round(Math.random() * 1);
      var ballLeft = ballLeftArr[ballLeftIndexRandom]
      animation.scale(0.25, 0.25).left(ballLeft + 'px').top(ballTop + 'px').opacity(1).step()
      this.setData({
        animationData: animation.export(),
        bgRight: true,
        show: false
      })
      animation = wx.createAnimation({
        duration: 10,
        timingFunction: 'ease',
        transformOrigin: '0 0 0'
      })
      animation.scale(1, 1).translateX('-50%').left('50%').top( '37%').opacity(0).step()
      setTimeout(function () {
        this.setData({
          show: true,
          bgRight: false,
          meScore: this.data.meScore + 1,
          animationData: animation.export(),
        })
      }.bind(that), 1000)
    } else {
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
        transformOrigin:'0 0 0'
      })
      //375宽为基础，实际高603：球门位置 横向['0-375']
      //纵向['0-67']
      var ballD = 153 / 2 * 0.15 
      var minL = 0 * wWidth / 375
      var maxL = (375 - ballD) * wWidth / 375
      var ballLeft = Math.random() * (maxL - minL + 1) + minL
      var minT = 0 * wHeight / 603
      var maxT = (67 - ballD) * wHeight / 603
      var ballTop = Math.random() * (maxT - minT + 1) + minT
      animation.scale(0.15, 0.15).left(ballLeft + 'px').top(ballTop + 'px').opacity(1).step()
      this.setData({
        animationData: animation.export(),
        show: false
      })
      animation = wx.createAnimation({
        duration: 10,
        timingFunction: 'ease',
        transformOrigin: '0 0 0'
      })
      animation.scale(1, 1).translateX('-50%').left('50%').top('37%').opacity(0).step()
      setTimeout(function () {
        this.setData({
          show: true,
          bgWrong: true,
          youScore: this.data.youScore + 1,
          animationData: animation.export(),
        })
      }.bind(that), 1000)
    }
  },
  next(){
    var orderNum=this.data.orderNum;
    orderNum++;
    this.setData({
      orderNum:orderNum,
      question: this.data.testData[orderNum-1].question,
      answer: this.data.testData[orderNum-1].answer,
      last: this.data.testData[orderNum-1].last
    })
    
  },
  onLoad: function () {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        var wWidth = res.windowWidth;
        var wHeight = res.windowHeight
        var ratio = wWidth / 750;
        that.setData({
          ratio: ratio,
          wWidth: wWidth,
          wHeight: wHeight
        })
      }
    })
    this.setData({
      question: this.data.testData[this.data.orderNum-1].question,
      answer: this.data.testData[this.data.orderNum-1].answer,
      orderNum: this.data.testData[this.data.orderNum-1].orderNum,
      last: this.data.testData[this.data.orderNum-1].last,
    })
  },
  onShareAppMessage: function (ops) {
    return {
      title: '听说99%的人都是伪球迷，快来领取自己的专属证书！',
      path: 'pages/begin/begin',
      imageUrl: '../../image/share_pic.jpg',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'succes',
          duration: 3000,
          mask: true
        })
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
})