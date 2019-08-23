Page({
    data: {
        monthCount: 5,//显示几个月份
        leastDays: 0,//最小日期间隔
        timeArr: [0, 0],//数组的两个元素分别为选中的开始毫秒时间戮和结束开始毫秒时间戮
        curYear: '',
        curMonth: '',
        curDay: '',
        calendars: [],
        sFtv: [{
            month: 1,
            day: 1,
            name: "元旦"
        },
        {
            month: 2,
            day: 14,
            name: "情人节"
        },
        {
            month: 3,
            day: 8,
            name: "妇女节"
        },
        {
            month: 3,
            day: 12,
            name: "植树节"
        },
        {
            month: 3,
            day: 15,
            name: "消费者权益日"
        },
        {
            month: 4,
            day: 1,
            name: "愚人节"
        },
        {
            month: 5,
            day: 1,
            name: "劳动节"
        },
        {
            month: 5,
            day: 4,
            name: "青年节"
        },
        {
            month: 5,
            day: 12,
            name: "护士节"
        },
        {
            month: 6,
            day: 1,
            name: "儿童节"
        },
        {
            month: 7,
            day: 1,
            name: "建党节"
        },
        {
            month: 8,
            day: 1,
            name: "建军节"
        },
        {
            month: 9,
            day: 10,
            name: "教师节"
        },
        {
            month: 9,
            day: 28,
            name: "孔子诞辰"
        },
        {
            month: 10,
            day: 1,
            name: "国庆节"
        },
        {
            month: 10,
            day: 6,
            name: "老人节"
        },
        {
            month: 10,
            day: 24,
            name: "联合国日"
        },
        {
            month: 12,
            day: 24,
            name: "平安夜"
        },
        {
            month: 12,
            day: 25,
            name: "圣诞节"
        }
        ]
    },
    onLoad: function (options) {
        //传入开始结束时间
        this._init(options);
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // this.selectDataMarkLine()
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    /**
     * 页面初始化
     */
    _init: function (options) {
        console.log(options);
        if(options.startDate && options.endDate){
            let start = new Date(options.startDate.replace("-","/"));
            let end = new Date(options.endDate.replace("-", "/"));
            let startYear = start.getFullYear();
            let startMonth = start.getMonth();
            let endYear = end.getFullYear();
            let endMonth = end.getMonth();
            let monthCount = endYear * 12 + endMonth -(startYear * 12 + startMonth);
            this.setData({
                curYear: startYear,
                curMonth: startMonth,
                monthCount: monthCount < 5 ? 5 : monthCount + 1,
                'timeArr[0]': start.getTime(),
                'timeArr[1]': end.getTime()
            });
            console.log(this.data);
        }else{
            let date = new Date();
            this.setData({
                curYear: parseInt(date.getFullYear(), 10),
                curMonth: parseInt(date.getMonth(), 10)
            });
        }
        
        this._createCalendars();
    },
    /**
     * 初始化创建日期数据
     */
    _createCalendars: function () {
        let calendars = [];
        let currentYear = this.data.curYear;
        let startMonth = this.data.curMonth + 1;

        for (let i = 0; i < this.data.monthCount; i++) {
            (startMonth > 12) && (startMonth = 1) && (currentYear += 1);

            calendars.push(this._calendarFactory(currentYear, startMonth));

            startMonth += 1;
        }

        this.setData({
            calendars
        })
    },
    /**
     * 改变日期数据
     * params {
     *  Number num:添加num条
     *  String type:1,头部添加.2尾部添加
     * }
     */
    _addCalendars: function (num,type) {
        let calendars = this.data.calendars;
        if(num==0){
            return
        }
        if(type==1){
            let firstYear = calendars[0].year;
            let firstMonth = calendars[0].month;

            for (let i = 0; i < num; i++) {
                firstMonth -= 1;
                (firstMonth < 1) && (firstMonth = 12) && (firstYear -= 1);

                calendars.unshift(this._calendarFactory(firstYear, firstMonth));
            }

        }else{
            let lastYear = calendars[calendars.length - 1].year;
            let lastMonth = calendars[calendars.length - 1].month;

            for (let i = 0; i < num; i++) {
                lastMonth += 1;
                (lastMonth > 12) && (lastMonth = 1) && (lastYear += 1);
                calendars.push(this._calendarFactory(lastYear, lastMonth));

            }
        }

        this.setData({
            calendars
        })
    },
    /**
     * 根据传进来的年月获取日期数组
     * param year month
     * return {
     * String year,
     * String month,
     * Array days,
     * String startWeek,
     * Array placeholders
     * }
     */
    _calendarFactory: function (year, month) {
        let daysCount = this._getDays(year, month);
        let startWeek = this._getWeek(year, month);
        let days = Array.from(new Array(daysCount), (val, index) => {
            return {
                text: index + 1,
                timestamp: new Date(`${year}/${month}/${index + 1}`).getTime()
            };
        });
        let placeholders = Array.from(new Array(startWeek), (val, index) => index + 1);

        return {
            year,
            month,
            days,
            startWeek,
            placeholders
        }
    },
    /**
     * 根据传进来的日期获取当前getDate()
     */
    _getDays: function (year, month) {
        let day = new Date(year, month, 0);
        return day.getDate();
    },
    /**
     * 根据传进来的日期获取当前月第一天的week
     */
    _getWeek: function (year, month) {
        let date = new Date();

        date.setYear(year);
        date.setMonth(month - 1);
        date.setDate(1);
        return date.getDay();
    },
    _chooseDay: function (e) {
        const timestamp = e.currentTarget.dataset.timestamp;
        const disabled = e.currentTarget.dataset.disabled;

        if (disabled) return false;

        if (this.data.timeArr[0] && this.data.timeArr[1]) {
            this.setData({
                'timeArr[0]': timestamp,
                'timeArr[1]': 0
            })
        } else if (!this.data.timeArr[0] || this.data.timeArr[0] > timestamp) {
            this.setData({
                'timeArr[0]': timestamp
            })
        } else if (timestamp < this.data.timeArr[0]) {
            this.setData({
                'timeArr[0]': timestamp
            })
        } else {
            let diffDay = ((timestamp - this.data.timeArr[0]) / 864e5) + 1;

            if (diffDay < this.data.leastDays) { // 设置的时间小于规定的间隔
                wx.showToast({
                    title: `最少选择 ${this.data.leastDays} 天`,
                    icon: 'none'
                })
                return false;
            }
            this.setData({
                'timeArr[1]': timestamp
            })
        }
        console.log(this.data.timeArr);
        // this._notify();
    },
    /**
     * 用户触底事件
     */
    onReachBottom(res) {
        this._addCalendars(1,2)
    },
    /**
     * 下拉加载更多
     */
    onPullDownRefresh (){
        this._addCalendars(1, 1);
        wx.stopPullDownRefresh();
    },
    
    //返回上一层
    go() {
        wx.setStorageSync("selectDate", this.data.timeArr)
        wx.navigateBack({})
    }
})