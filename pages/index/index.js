//获取全局的app实例

//获取全局属性 定义全局属性在app.js中
const config = app.globalData.config;
const api = app.globalData.api;
const loading = app.globalData.loading;
const util = app.globalData.util;
// 天气图标基地址
const COND_ICON_BASE_URL = config.COND_ICON_BASE_URL;
// 背景图片基地址
const BG_IMG_BASE_URL = config.BG_IMG_BASE_URL;
//为了使用async await 引用regeneratorRuntime

//引用wxCharts

Page({
  data:{
    greetings: '',//问候语
    bgImgUrl: BG_IMG_BASE_URL + './calm.jpg',//背景图片地址
    location: '',//地理坐标
    geoDes: '定位中...', //地理位置描述
    nowWeather: { //实时天气数据
      tmp: '-2', //温度
      condTxt: '多云',//天气状况
      windDir: '东北风', // 风向
      windSc: '1', // 风力
      windSpd: '', // 风速
      pres: '1029', // 大气压
      hum: '90', // 湿度
      pcpn: '0.0', // 降水量
      condIconUrl:`${COND_ICON_BASE_URL}/999.png`, //天气图标
      loc: '02-20 08:10' //更新时间
    },
    days:['今天','明天','后天'],
    canvasWidth: 0,
    canvasSrc:'',
    dailyWeather: [],//逐日天气数据
    hourlyWeather: [], //三小时天气数据
    lifestyle: [] //生活指数
  },
    //加载提示  page注册页可以添加任何的数据通过this获取
    ...loading,
    //页面显示时触发
    onShow(){
      //初始化函数init()
    },
    //初始化 init()
    
      //1loading解构出来的函数 showLoading
     
      //2初始化问候语 initGreetings
     
      //3初始化天气 initWeatherInfo
     
  
    //允许分享转发，该方法与button 组件联合使用 onShareAppMessage
    
    //跳到搜索页 toSearchPage
    
  //下拉刷新onPullDownRefresh
    
      //1再次进行初始化
      //2结束刷新
    
    //初始化问候语 initGreetings() greetings
  
    //初始化天气情况 initWeatherInfo
    
      //1getLocation
      
      // 2getNowWeather
      
      //3getDailyWeather
      
      //4getHourlyWeather
      
      // 5getLifestyle
      

      // 6关闭加载框 
    
    //获取地理位置信息 getLocation
    async getLocation() {
      let position = wx.getStorageSync('POSITION');
      position= position?JSON.parse(position):position;
      if(position) {
        this.setData({
          location:`${position.longitude},${position.latitude}`,
          geoDes: position.title
        })
        return;
      }
      await api.getLocation().then((res)=>{  //获取地理位置api
        let {longitude,latitude} = res  //es6的写法 let {a,b} = res
        this.setData({
          location:`${longitude},${latitude}`
        })
        //逆地址获取地址描述
        this.getGeoDes({
          longitude,
          latitude
        })
      })
      .catch((err)=>{
        console.error(err)
      })
    },
    //逆地址获取地址描述
    getGeoDes(options){
      api.reverseGeocoder(options).then((res)=>{
        //地址部件
        let addressComponet = res.address_component
        //依次为城市，区 街道号
        let geoDes = `${addressComponet.city}${addressComponet.district}${addressComponet.street_number}`
        this.setData({
          geoDes
        })
      })
    },
    //获取实时天气
  getNowWeather() {
    return new Promise((resolve, reject) => {
      api.getNowWeather({
        location: this.data.location
      })
        .then((res) => {
          let data = res.HeWeather6[0]
          this.formatNowWeather(data)
          this.initBgImg(data.now.cond_code)
          resolve()
        })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },
  // 格式化实时天气数据
  formatNowWeather(data) {
    console.log(data)
    this.setData({
      nowWeather: {
        parentCity: data.basic.parent_city,
        location: data.basic.location,
        tmp: data.now.tmp,
        condTxt: data.now.cond_txt,
        windDir: data.now.wind_dir,
        windSc: data.now.wind_sc,
        windSpd: data.now.wind_spd,
        pres: data.now.pres,
        hum: data.now.hum,
        pcpn: data.now.pcpn,
        condIconUrl: `${COND_ICON_BASE_URL}/${data.now.cond_code}.png`,
        //把年份截取掉了
        loc: data.update.loc.slice(5).replace(/-/, '/')
      }
    })
  },

  // 初始化背景（导航和内容） 参数是天气状况码
  initBgImg(code) {
    let cur = config.bgImgList.find((item) => {
      return item.codes.includes(parseInt(code))
    })
    let url = BG_IMG_BASE_URL + (cur ? `/${cur.name}` : '/calm') + '.jpg'

    this.setData({
      bgImgUrl: url
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: cur.color,
      animation: {
        duration: 4000,
        timingFunc: 'easeIn'
      }
    })
  },

  // 获取逐日天气
  getDailyWeather() {
    return new Promise((resolve, reject) => {
      api.getDailyWeather({
        location: this.data.location
      })
        .then((res) => {
          let data = res.HeWeather6[0].daily_forecast
          this.formatDailyWeather(data)
          this.getDailyContainer()
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  // 格式化逐日天气数据
  formatDailyWeather(data) {
    let dailyWeather = data.reduce((pre, cur, index) => {
      let date = cur.date.slice(5).replace(/-/, '/')

      pre.push({
        date: date,
        parseDate: this.data.days[index] ? this.data.days[index] : date,
        condDIconUrl: `${COND_ICON_BASE_URL}/${cur.cond_code_d}.png`, //白天天气状况图标
        condNIconUrl: `${COND_ICON_BASE_URL}/${cur.cond_code_n}.png`, //晚间天气状况图标
        condTxtD: cur.cond_txt_d, // 白天天气状况描述
        condTxtN: cur.cond_txt_n, // 晚间天气状况描述
        sr: cur.sr, // 日出时间
        ss: cur.ss, // 日落时间
        tmpMax: cur.tmp_max, // 最高温度
        tmpMin: cur.tmp_min, // 最低气温
        windDir: cur.wind_dir, // 风向
        windSc: cur.wind_sc, // 风力
        windSpd: cur.wind_spd, // 风速
        pres: cur.pres, // 大气压
        vis: cur.vis // 能见度
      })

      return pre
    }, [])

    this.setData({
      dailyWeather
    })
  },

  // 获取逐日天气容器宽
  getDailyContainer() {
    let temperatureData = this.formatTemperatureData(this.data.dailyWeather)

    wx.createSelectorQuery().select('.forecast-day')
      .fields({
        size: true
      }).exec((res) => {
        console.log(res[0].width)
        this.drawTemperatureLine({
          temperatureData,
          diagramWidth: res[0].width * 7
        })
      })
  },

  // 绘制气温折线图
  drawTemperatureLine(data) {
    let { temperatureData, diagramWidth } = data
    let rate = wx.getSystemInfoSync().windowWidth/375

    // 设置绘制 canvas 宽度
    this.setData({
      canvasWidth: diagramWidth //canvas宽度与容器宽度一致数据即可对齐
    })

    new wxCharts({
      canvasId: 'canvasWeather',
      type: 'line',
      categories: temperatureData.dateArr, //x轴的数据类型
      animation: false,
      config: {
        fontSize: 16 * rate,
        color: "#ffffff",
        paddingX: 0, //数据线距离屏幕左侧的距离
        paddingY: 30 * rate  
      },
      series: [{
        name: '最高气温',
        data: temperatureData.tmpMaxArr,
        fontOffset: -8 * rate, //数据距离数据线的位置
        format: function (val, name) { //对数据的处理
          return val + '℃'
        }
      }, {
        name: '最低气温',
        data: temperatureData.tmpMinArr,
        fontOffset: -8 * rate,
        format: function (val, name) {
          return val + '℃'
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        disabled: true
      },
      width: diagramWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve',
        radar:{
          max: 300
        }
      }
    })

    this.canvasToImg()
  },

  // 将 canvas 复制到图片
  canvasToImg() {
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'canvasWeather',
        success: (res) => {
          var shareTempFilePath = res.tempFilePath;
          this.setData({
            canvasSrc: shareTempFilePath
          })
        }
      })
    }, 500)
  },

  // 格式化气温数据用于绘制折线图
  formatTemperatureData(data) {
    return data.reduce((pre, cur) => {
      let { date, tmpMax, tmpMin } = cur
      pre.dateArr.push(date)
      pre.tmpMaxArr.push(tmpMax)
      pre.tmpMinArr.push(tmpMin)
      return pre
    }, { dateArr: [], tmpMaxArr: [], tmpMinArr: [] })
  },

  // 获取逐三小时天气
  getHourlyWeather() {
    return new Promise((resolve, reject) => {
      api.getHourlyWeather({
        location: this.data.location
      })
        .then((res) => {
          let data = res.HeWeather6[0].hourly
          this.formaHourlyWeather(data)
          resolve()
        })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },

  // 格式化逐三小时天气
  formaHourlyWeather(data) {
    let formatData = data.reduce((pre, cur) => {
      pre.push({
        date: cur.time.split(' ')[1],
        condIconUrl: `${COND_ICON_BASE_URL}/${cur.cond_code}.png`, // 天气图标
        condTxt: cur.cond_txt, // 天气状况描述
        tmp: cur.tmp, // 气温
        windDir: cur.wind_dir, // 风向
        windSc: cur.wind_sc, // 风力
        windSpd: cur.wind_spd, // 风速
        pres: cur.pres // 大气压
      })

      return pre
    }, [])

    let gap = 4
    let trip = Math.ceil(formatData.length / gap)
    let hourlyWeather = []
    for (let i = 0; i < trip; i++) {
      hourlyWeather.push(formatData.slice(i * gap, (i + 1) * gap))
    }

    this.setData({
      hourlyWeather
    })
  },

  // 获取生活指数
  getLifestyle() {
    return new Promise((resolve, reject) => {
      api.getLifestyle({
        location: this.data.location
      })
        .then((res) => {
          let data = res.HeWeather6[0].lifestyle
          this.formatLifestyle(data)
          resolve()
        })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },

  // 格式化生活指数数据
  formatLifestyle(data) {
    const lifestyleImgList = config.lifestyleImgList
    let lifestyle = data.reduce((pre, cur) => {
      pre.push({
        brf: cur.brf,
        txt: cur.txt,
        iconUrl: lifestyleImgList[cur.type].src,
        iconTxt: lifestyleImgList[cur.type].txt
      })
      return pre
    }, [])
    this.setData({
      lifestyle
    })
  }
})