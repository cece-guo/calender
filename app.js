/**
 * Created by tokei on 2017/4/24.
 */

(function () {
    //appendchild：链接创建子节点
	HTMLElement.prototype.appendChildren = function(){
		for(let i=0; i<arguments.length; i+=1){
			this.appendChild(arguments[i]);
		}
	};
    //定义常量对象：查询界面上的DIV，存放today
   const option = {
       today: 'today', // 'today' for today
       entry: document.getElementById('app')
   };
   //定义常量对象：存放每周的数组，和当日期小于10时前面自动加0的算法
   const format = {
       week: function(v){
           return ['日','一','二','三','四','五','六'][v];
       },
       frontZero: function (v) {
           return v<10?'0'+v:''+v;
       }
   };
   //定义常量对象：cr：创建新的节点，并设置其classname
                //$：将对象中的值设置成类似jquery的方法
   const util = {
   		cr: function(tag, classname){
   			let newDiv = document.createElement(tag);
   			newDiv.className = classname;
   			return newDiv;
   		},
   		$: function(tag){
   			return document.querySelector(tag);	
   		}
   };
   //定义常量对象：run：创建classname为dgtime和dgdate的div，并将其链接到上面找到的div中，并设置定时器，定时刷新
                //core：方法先分别获取到上面创建的两个div，然后获取到当前时间，根据当前时间获取年月日
   const digital = {
       run: function () {
           timeDiv = util.cr('div', 'dgtime');//新增classname为dgtime的div
           dateDiv = util.cr('div', 'dgdate');
           option.entry.appendChildren(timeDiv, dateDiv);
           digital.core();
           setInterval(digital.core, 1000);
       },
       core: function () {
           let d, timeDiv, dateDiv;
           timeDiv = util.$('.dgtime');
           dateDiv = util.$('.dgdate');
           d = new Date();
           let y = d.getFullYear(),
               m = format.frontZero(d.getMonth() + 1),//获取当前月
               dd = format.frontZero(d.getDate()),//获取当前日期
               xq = format.week(d.getDay()),//getday方法：返回处于0~6之间的一个数
               hh = format.frontZero(d.getHours()),//获取当前小时
               mm = format.frontZero(d.getMinutes()),//获取当前分
               ss = format.frontZero(d.getSeconds());
           timeDiv.innerHTML = '<h2 class="digital">' + hh + ':' + mm + ':' + ss + '</h2>';//将拼接的时间插入之前创建的div中，并设置其classname为digital
           dateDiv.innerHTML = '<h3 class="date">' + y + '年' + m + '月' + dd + '日, 星期' + xq + '</h3>';//同上
       }
   };
   //定义calender常量
   const calendar = {
           timeIndex: 0,
           entry: document.getElementById('app'),
           init: function(){
               calendar.core();
           },
           //点击上一月下一月按钮时调用函数
           genCalServer: function(method){
               return function () {
                   switch (method){
                       case 'page prev':
                           calendar.timeIndex--;
                           break;
                       case 'page next':
                           calendar.timeIndex++;
                           break;
                       default:
                           calendar.timeIndex = 0;
                   }
                   calendar.genCalendar(calendar.timeIndex);
               };
           },
           genCalendar: function(sp){
               let dd = new Date();
               // 上个月最后一天
               let lastEndDay =  calendar.handler(dd.getFullYear(), dd.getMonth()+sp, 0, 'day');
               // 本月最后一天
               let curEndDay = calendar.handler(dd.getFullYear(), dd.getMonth()+sp+1, 0, 'day');
               // 第一天星期几
               let curWeek = calendar.handler(dd.getFullYear(), dd.getMonth()+sp, 1, 'week');
               //  本月年份
               let curYear = calendar.handler(dd.getFullYear(), dd.getMonth()+sp, 0, 'year');
               //  本月月份
               let curMonth = calendar.handler(dd.getFullYear(), dd.getMonth()+sp, 0, 'month') + 1;
               //
               curWeek = curWeek == 0 ? 7: curWeek;
               //
               let container = util.$('.main div'),
                   indicator = util.$('span.curmonth');
               let tempStr = '',
                   nextDay = 1;
               for(let i=0; i<7*6; i+=1){
                   if(i<curWeek){
                       tempStr = '<span style="color: #a2a2a2">' + (lastEndDay --) + '</span>' + tempStr;
                   }else if(i>=curWeek + curEndDay){
                       tempStr += '<span style="color: #a2a2a2">' + (nextDay ++) + '</span>';
                   }else{
                       let cl = (i - curWeek + 1) == dd.getDate() && calendar.timeIndex == 0?'active':'';
                       tempStr += '<span class='+ cl +'>' + (i - curWeek + 1) + '</span>';
                   }
               }
               container.innerHTML = tempStr;
               indicator.innerHTML = curYear + '年' + format.frontZero(curMonth) + '月';
           },
           core: function(){
               let titleDiv = util.cr('div','title');
               let dd = new Date();
               titleDiv. innerHTML = '<span class="curmonth">'+ dd.getFullYear() + '年' + format.frontZero(dd.getMonth()+1) + '月' + '</span><span class="page prev"> - </span><span class="page next"> + </span>';
               calendar.entry.appendChild(titleDiv);
               let mainDiv = util.cr('div', 'main');
               mainDiv.innerHTML = '<ul> <li>日</li> <li>一</li> <li>二</li> <li>三</li> <li>四</li> <li>五</li> <li>六</li> </ul> <div> </div>';
               calendar.entry.appendChild(mainDiv);
               document.querySelectorAll('span.page').forEach(function (spanDiv) {
                   spanDiv.onclick = calendar.genCalServer(spanDiv.className);
               });
               calendar.genCalendar(calendar.timeIndex);
           },
           handler: function (year, month, day, method) {
               switch (method){
                   case 'week':
                       return new Date(year, month, day).getDay();
                   case 'day':
                       return new Date(year, month, day).getDate();
                   case 'year':
                       return new Date(year, month, day).getFullYear();
                   case 'month':
                       return new Date(year, month, day).getMonth() + 1;
                   default:
                       return null;
               }
           }
   };

   //定义完常量之后开始调用，调用两个方法
   digital.run();
   calendar.init();
}());