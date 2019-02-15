//app.js
App({   //App()函数用来注册小程序，接受Object参数，只能在app.js中调用且必须调用且只能调用一次。
  onLaunch: function(option){
    var that = this;
    wx.getSystemInfo({ //获取设备信息
      success: function(res){
        that.globalData.sys = res;
      },
    })
  },
  onShow(options){
    this.globalData.scene = options.scene;
    if(options.query.songid){
      var songid = [],
      name = [],
      shareId = wx.getStorageSync('share_id');
      songid.push(parseInt(options.query.songid))
      name.push(options.query.name);
      if(shareId){
        if(songid[0]!=shareId[0]){
          this.globalData.changeMusic = true;
        }else {
          this.globalData.changeMusic = false;
        }
      }
      wx.setStorage({
        key:'share_id',
        data: songid,
      });
      wx.setStorage({
        key:'share_name',
        data: name
      })
    }
  },
  onHide(){

  },
  globalData:{},
  timestampToTime: function(time){
    var data = new Date(time*1000);
    var Y = data.getFullYear() +'-';
    var M = (data.getMonth+1<10?'0'+(data.getMonth()+1):data.getMonth()+1)+'-';
    var D = data.getDate()+' ';
    var h = data.getHours() + ':';
    var m = data.getMinutes() + ':';
    var s = data.getSeconds();
    return Y + M + D + h + m + s;
  },
  gePlay(id,num){
    wx.setStorageSync('labelid',id);
    wx.request({
      url:'歌单API',
      data: {},
      success: res =>{
        var Data = res.data,
        code = Data.code;
        if(code===0){
          var id = Data.songids.split(','),
            songlist = Data.songlist,
            music_name = [];
          for (var i = 0; i < id.length; i++) {
            id[i] = parseInt(id[i]);
            music_name.push(songlist[i].songname);
          } 
          wx.setStorageSync('song_id', id);//将电台随机生成的歌曲id存入缓存
          wx.setStorageSync('num', num);//当前要播放歌曲的序号
          wx.setStorageSync('music_name', music_name);//对应歌曲id的歌曲名称
          wx.switchTab({
            url: '../playSong/playSong',
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: '哎呀！数据出错了，别急，程序猿正在加急修改中',
          })
        }
      },
      error: req =>{
        wx.showToast({
          icon: 'none',
          title: '哎呀！出错了'
        })
      }
    })
  }
})