var noticeDate = require("../../data/notice.js");
const app = getApp()
Page({
  data: {
    range: '',
    imgNum:0,
    notice: noticeDate.noticeData,
    noticeItem:'',
    hasUserInfo: false,
    userInfo: {},
    wWidth:0,
    wHeight:0,
    nameTitW: 152 ,
    ctx:''
  },
  onLoad: function (options) {
   
    var that = this;
    var range = ''
    var lastScore = options.lastScore;
    var imgNum=0;
    var nameTitW = 152
    range = lastScore * 10 + '%'
    if (lastScore<=1){
      imgNum=0
      nameTitW=152
    }else if (lastScore >= 2&&lastScore <= 3){
      imgNum = 1
      nameTitW = 315
    } else if (lastScore >= 4&& lastScore <= 5) {
      imgNum = 2
      nameTitW = 312
    } else if (lastScore >= 6 && lastScore <= 7) {
      imgNum = 3
      nameTitW = 311
    } else if (lastScore >= 8 && lastScore <= 9) {
      imgNum = 4
      nameTitW = 316
    } else if (lastScore > 9) {
      range = '99.99%'
      imgNum = 5
      nameTitW = 312
    }
    this.setData({
      range: range,
      imgNum: imgNum,
      nameTitW: nameTitW
    })
  
    var notice=this.data.notice;
    var len=notice.length;
    var radomNum=Math.floor(Math.random()*len);
    var noticeItem=notice[radomNum];
    this.setData({
      noticeItem: noticeItem
    })
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        if (res.userInfo.nickName.length>18){
          var nickNameText = res.userInfo.nickName.slice(0,18)+'...'
        }else{
          var nickNameText = res.userInfo.nickName
        }
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: nickNameText,
          hasUserInfo: true
        })

        wx.downloadFile({
          url: res.userInfo.avatarUrl,
          success: function (res) {
            if (res.statusCode === 200) {
              app.globalData.uPhoto = res.tempFilePath
              that.poster()  
            }
          }
        })
      },
      fail:function(){
        if (!that.data.hasUserInfo) {
          that.setData({
            userInfo: { 'nickName': '匿名考生', avatarUrl: "../../image/user_default.png" },
          })
        }
        that.poster()  
      }
    })
    
  },
  savePic(){
    let that = this;
    wx.showLoading({
      title: '生成图片中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'myCanvas',
      success: function (res) {
        that.setData({
          canvasTemppath: res.tempFilePath,
        })
        wx.hideLoading()
        wx.saveImageToPhotosAlbum({
          filePath: that.data.canvasTemppath,
          success(res) {
            wx.showToast({
              title: '已保存相册',
              icon: 'success',
              duration: 2500
            })
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  shareFri(e){
    this.onShareAppMessage()
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '听说99%的人都是伪球迷，快来领取自己的专属证书！',
      path: 'pages/begin/begin',
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
  poster(){
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        var wWidth = res.windowWidth;
        var wHeight = res.windowHeight
        var ratio = wWidth/750;
        const ctx = wx.createCanvasContext('myCanvas');
        that.setData({
          ctx: ctx
        })
        ctx.drawImage('../../image/result_bg.jpg', 0, 0, wWidth, wHeight);
        ctx.drawImage('../../image/card_bg.png', (wWidth - 663 * ratio) / 2, 66 * ratio, 663 * ratio, 931 * ratio);

        ctx.save(); // 先保存状态 已便于画完圆再用
        ctx.beginPath(); //开始绘制
        ctx.strokeStyle = "#e7e7e7";
        ctx.arc((wWidth) / 2, (335 + 45) * ratio, 45 * ratio, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.clip();
      
        if (that.data.userInfo.avatarUrl == '') {
          ctx.drawImage('../../image/user_default.png', (wWidth - 90 * ratio) / 2, 335 * ratio, 90 * ratio, 90 * ratio);
        } else {
          ctx.drawImage(app.globalData.uPhoto, (wWidth - 90 * ratio) / 2, 335 * ratio, 90 * ratio, 90 * ratio);
        }
        
        ctx.restore();

        ctx.setFillStyle('#454545')
        ctx.setFontSize(28*ratio)
        if (that.data.userInfo.nickName==''){
          var nickName=' 匿名考生 '
        }else{
          var nickName = ' '+that.data.userInfo.nickName+' '
        }
        var textNameL='恭喜'
        var textNameR ='喜提称号'
        var textName = textNameL + nickName + textNameR
        var textNameLW = ctx.measureText(textNameL).width;
        var textNameRW = ctx.measureText(textNameR).width;
        var nickNameW = ctx.measureText(nickName).width;
        var textNameW = ctx.measureText(textName).width;
        var nameLineL = (wWidth - textNameW) / 2 + textNameLW
        ctx.lineWidth = 1*ratio;
        ctx.beginPath(); 
        ctx.moveTo(nameLineL + 7 * ratio, 470 * ratio)
        ctx.lineTo(nameLineL + nickNameW - 7 * ratio, 470 * ratio)
        
        ctx.stroke()
        ctx.setTextAlign('center')
        ctx.fillText(textName, wWidth/2, 460*ratio)
        
        var nameTitPic = '../../image/name_tit_' + that.data.imgNum+'.png'
        ctx.drawImage(nameTitPic, (wWidth - that.data.nameTitW * ratio) / 2, 534 * ratio, that.data.nameTitW * ratio, 78 * ratio);
        ctx.setFontSize(36 * ratio)
       
        ctx.font = 'normal bold ' + 36 * ratio + 'px Arial'
        var textScoreL ='击败全国'
        var textScoreR ='的球迷'
        var percent = ' '+that.data.range+' ';
        var textScore = textScoreL + percent + textScoreR
        var textScoreW = ctx.measureText(textScore).width;
        var texScoreLW = ctx.measureText(textScoreL).width;
        var percentL = (wWidth - textScoreW) / 2 + texScoreLW
        var percentW = ctx.measureText(percent).width;
        ctx.setTextAlign('left')
        ctx.fillText(textScoreL, (wWidth - textScoreW) / 2, 670 * ratio)
        ctx.fillText(textScoreR, percentL + percentW, 670 * ratio)
        ctx.setFillStyle('#b90000') 
        ctx.fillText(percent, percentL, 670 * ratio)
        
        ctx.setFillStyle('#686868') 
        ctx.font = 'normal normal ' + 26 * ratio + 'px Arial'
        let details = {
          x: (wWidth - 428 * ratio)/2,
          y: 766*ratio,
          width: 428 * ratio,
          height: 30 * ratio,
          line: 4,
          color: '#686868',
          size: 26 * ratio,
          align: 'left',
          baseline: '',
          text: that.data.noticeItem.text,
          bold: false
        }
        that.textWrap(details);
        ctx.setTextAlign('left')
        var noticeNameL = wWidth - (wWidth - 428 * ratio) / 2 - ctx.measureText(that.data.noticeItem.name).width;
        ctx.fillText('--' + that.data.noticeItem.name, noticeNameL, (766 +80)* ratio)

        ctx.drawImage('../../image/code.png', (wWidth - 110 * ratio) / 2, 1020 * ratio, 110 * ratio, 110 * ratio);
        var codeText = '长按识别二维码 领取证书'
        ctx.setFillStyle('#ffffff') 
        ctx.fillText(codeText, (wWidth - ctx.measureText(codeText).width) / 2, 1170 * ratio)

        
        ctx.draw();


      }
    })

    
   
  },
  getTextLine (obj) {
    this.data.ctx.setFontSize(obj.size);
    let arrText = obj.text.split('');
    let line = '';
    let arrTr = [];
    for (let i = 0; i < arrText.length; i++) {
      var testLine = line + arrText[i];
      var metrics = this.data.ctx.measureText(testLine);
      var width = metrics.width;
      if (width > obj.width && i > 0) {
        arrTr.push(line);
        line = arrText[i];
      } else {
        line = testLine;
      }
      if (i == arrText.length - 1) {
        arrTr.push(line);
      }
    }
    return arrTr;
  },

  textWrap (obj) {
    console.log('文本换行')
    let tr = this.getTextLine(obj);
    for (let i = 0; i < tr.length; i++) {
      if (i < obj.line) {
        let txt = {
          x: obj.x,
          y: obj.y + (i * obj.height),
          color: obj.color,
          size: obj.size,
          align: obj.align,
          baseline: obj.baseline,
          text: tr[i],
          bold: obj.bold
        };
        if (i == obj.line - 1) {
          txt.text = txt.text.substring(0, txt.text.length - 3) + '......';
        }
        this.drawText(txt);
      }
    }
  },
  drawText: function (obj) {
    console.log('渲染文字')
    this.data.ctx.save();
    this.data.ctx.setFillStyle(obj.color);
    this.data.ctx.setFontSize(obj.size);
    this.data.ctx.setTextAlign(obj.align);
    this.data.ctx.setTextBaseline(obj.baseline);
    if (obj.bold) {
      console.log('字体加粗')
      this.data.ctx.fillText(obj.text, obj.x, obj.y - 0.5);
      this.data.ctx.fillText(obj.text, obj.x - 0.5, obj.y);
    }
    this.data.ctx.fillText(obj.text, obj.x, obj.y);
    if (obj.bold) {
      this.data.ctx.fillText(obj.text, obj.x, obj.y + 0.5);
      this.data.ctx.fillText(obj.text, obj.x + 0.5, obj.y);
    }
    this.data.ctx.restore();
  },



})
