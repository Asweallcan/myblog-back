webpackJsonp([2],{J3Ri:function(n,t,e){var a=e("lCyM");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);e("8bSs")("46eac033",a,!0)},Qt9A:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=e("eQt9"),i={render:function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"page-wrapper"},[e("div",{staticClass:"m-container"},[e("div",{staticClass:"left"},[e("div",{staticClass:"top"},[e("div",{staticClass:"articles"},[e("h3",{staticStyle:{width:"100%"}},[n._v("最新文字")]),n._v(" "),e("hr"),n._v(" "),e("ul",[e("p",{directives:[{name:"show",rawName:"v-show",value:n.articles.length<1,expression:"articles.length<1"}]},[n._v("暂无最新文章")]),n._v(" "),n._l(n.articles,function(t,a){return e("li",{key:a,staticClass:"article"},[e("p",[e("router-link",{attrs:{to:"/article/"+t.title}},[n._v(n._s(t.title))]),n._v(" "),e("span",[n._v(n._s(n.parseTime(t.time)))])],1)])})],2)]),n._v(" "),e("div",{staticClass:"movieSlide"},[e("h3",{staticStyle:{width:"100%"}},[n._v("最新电影")]),n._v(" "),e("hr"),n._v(" "),e("el-carousel",{attrs:{interval:1e4,type:"card","indicator-position":"none",height:"200px"}},n._l(n.moviesInfo,function(t){return e("el-carousel-item",{key:t,style:n.slideImg(t.image)},[e("a",{attrs:{href:t.link,target:"_blank"}},[n._v(n._s(t.title)+"\n                "),e("mark",[n._v(n._s(t.rate))])])])}))],1)]),n._v(" "),e("div",{staticClass:"center"},[e("div",{staticClass:"nbaSlide"},[e("h3",{staticStyle:{width:"100%"}},[n._v("NBA资讯")]),n._v(" "),e("hr"),n._v(" "),e("el-carousel",{attrs:{trigger:"click",height:"400px","indicator-position":"none",interval:1e4}},n._l(n.nbaImage.slide,function(t,a){return e("el-carousel-item",{key:a,style:n.slideImg(t.image)},[e("a",{attrs:{href:t.link,target:"_blank"}},[n._v(n._s(t.title))])])}))],1)]),n._v(" "),e("div",{staticClass:"bottom"},[e("div",{staticClass:"nbaNews"},[e("ul",n._l(n.nbaNews,function(t,a){return e("li",{key:a,staticClass:"new"},[e("a",{attrs:{href:t.link,target:"_blank"}},[n._v(n._s(t.title))])])}))]),n._v(" "),e("div",{staticClass:"nbaRec"},[e("ul",n._l(n.nbaImage.rec,function(t,a){return e("li",{key:a,staticClass:"rec"},[e("a",{attrs:{href:t.link,target:"_blank"}},[e("img",{attrs:{src:t.image,alt:""}}),n._v(" "),e("p",[n._v(n._s(t.title))])])])}))])])]),n._v(" "),e("div",{staticClass:"right"},[e("div",{staticClass:"gameNews"},[e("h3",[n._v("游戏资讯")]),n._v(" "),e("hr"),n._v(" "),e("ul",n._l(n.gamesInfo,function(t,a){return e("li",{key:a,staticClass:"new"},[e("a",{attrs:{href:t.link,target:"_blank"}},[n._v(n._s(t.title))])])}))]),n._v(" "),e("div",{staticClass:"bizhi"},[e("h3",[n._v("精美壁纸")]),n._v(" "),e("hr"),n._v(" "),e("ul",n._l(n.bizhi,function(t,a){return e("li",{key:a},[e("div",{staticClass:"box"},[e("a",{attrs:{href:t.link,target:"_blank"}},[n._v(n._s(t.title))]),n._v(" "),e("span",[e("i",{staticClass:"el-icon-time"}),n._v(n._s(t.time))])])])}))])])])])},staticRenderFns:[]};var r=function(n){e("J3Ri")},o=e("X4nt")(a.a,i,!1,r,"data-v-42906d30",null);t.default=o.exports},eQt9:function(n,t,e){"use strict";(function(n){t.a={name:"index",activated:function(){document.title="繁华依旧"},mounted:function(){var n=this;this.$nextTick(function(){n.getArticles(),n.getBizhi(),n.getGamesInfo(),n.getNbaImg(),n.getMovie(),n.getNbaNews(),document.title="繁华依旧"})},updated:function(){n("img").bind("error",function(){n(this).attr("src","/static/404_not_found.jpg")})},data:function(){return{articles:[],gamesInfo:[],moviesInfo:[],nbaImage:{},nbaNews:[],bizhi:[]}},methods:{getArticles:function(){var n=this;this.API.getIndexArticle().then(function(t){n.articles=t.data.articles}).catch(function(t){console.log(t),n.showMessage("error","获取文章失败")})},getNbaImg:function(){var n=this;this.API.getNbaImg().then(function(t){n.nbaImage=t.data.nbaimg}).catch(function(t){console.log(t),n.showMessage("error","爬虫错误")})},getNbaNews:function(){var n=this;this.API.getNbaNews().then(function(t){n.nbaNews=t.data.nbanews}).catch(function(t){console.log(t),n.showMessage("error","爬虫错误")})},getBizhi:function(){var n=this;this.API.getBizhi().then(function(t){n.bizhi=t.data.bizhi}).catch(function(t){console.log(t),n.showMessage("error","爬虫错误")})},getGamesInfo:function(){var n=this;this.API.getGamesInfo().then(function(t){n.gamesInfo=t.data.game}).catch(function(t){console.log(t),n.showMessage("error","爬虫错误")})},getMovie:function(){var n=this;this.fullscreenLoading=!0,this.API.getMovie().then(function(t){n.moviesInfo=t.data.movie}).catch(function(t){console.log(t),n.showMessage("error","爬虫错误")})},slideImg:function(n){return"background:url("+n+") center center;background-size:100% 100%"}}}}).call(t,e("0iPh"))},lCyM:function(n,t,e){(n.exports=e("l95E")(!1)).push([n.i,"\nh1[data-v-42906d30],\nh2[data-v-42906d30],\nh3[data-v-42906d30],\nh4[data-v-42906d30],\nh5[data-v-42906d30],\nh6[data-v-42906d30],\np[data-v-42906d30],\nul[data-v-42906d30],\nli[data-v-42906d30] {\n  margin: 0;\n  padding: 0;\n}\na[data-v-42906d30] {\n  display: block;\n  text-decoration: none;\n}\nli[data-v-42906d30] {\n  list-style: none;\n}\n.page-wrapper[data-v-42906d30] {\n  width: 100%;\n  min-width: 1253px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.page-wrapper .m-container[data-v-42906d30] {\n    -webkit-box-shadow: 0 10px 30px 0 #000;\n            box-shadow: 0 10px 30px 0 #000;\n    background: #fff;\n    padding: 30px;\n    margin: 30px 10px;\n    position: relative;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n.page-wrapper .m-container .left[data-v-42906d30] {\n      width: 640px;\n      margin-right: 20px;\n}\n.page-wrapper .m-container .left .center[data-v-42906d30] {\n        width: 615px;\n}\n.page-wrapper .m-container .left .center .nbaSlide[data-v-42906d30] {\n          margin-bottom: 20px;\n}\n.page-wrapper .m-container .left .center .nbaSlide a[data-v-42906d30] {\n            width: 100%;\n            text-align: center;\n            position: absolute;\n            bottom: 0;\n            font-size: 22px;\n            color: #f2f2f2;\n            font-weight: bold;\n            height: 60px;\n            line-height: 60px;\n            text-shadow: 1px 1px 1px #000;\n            display: inline-block;\n            background: rgba(0, 0, 0, 0.7);\n            cursor: pointer;\n}\n.page-wrapper .m-container .left .center .nbaSlide a[data-v-42906d30]:hover {\n              text-decoration: underline;\n}\n.page-wrapper .m-container .left .bottom[data-v-42906d30] {\n        width: 640px;\n        position: relative;\n}\n.page-wrapper .m-container .left .bottom .nbaNews[data-v-42906d30] {\n          width: 370px;\n          display: inline-block;\n          position: absolute;\n          top: 0;\n          left: 250px;\n}\n.page-wrapper .m-container .left .bottom .nbaNews .new[data-v-42906d30] {\n            margin-bottom: 10px;\n}\n.page-wrapper .m-container .left .bottom .nbaNews .new a[data-v-42906d30] {\n              display: inline-block;\n              font-size: 16px;\n              color: #000;\n}\n.page-wrapper .m-container .left .bottom .nbaNews .new a[data-v-42906d30]:hover {\n                text-decoration: underline;\n}\n.page-wrapper .m-container .left .bottom .nbaRec[data-v-42906d30] {\n          display: inline-block;\n}\n.page-wrapper .m-container .left .bottom .nbaRec .rec a[data-v-42906d30] {\n            width: 240px;\n            height: 135px;\n            display: inline-block;\n            cursor: pointer;\n            position: relative;\n            margin-bottom: 10px;\n}\n.page-wrapper .m-container .left .bottom .nbaRec .rec a img[data-v-42906d30] {\n              max-width: 240px;\n}\n.page-wrapper .m-container .left .bottom .nbaRec .rec a p[data-v-42906d30] {\n              position: absolute;\n              bottom: 0;\n              text-align: center;\n              color: #fff;\n              background: #000;\n              height: 20px;\n              line-height: 20px;\n              width: 100%;\n}\n.page-wrapper .m-container .left .bottom .nbaRec .rec a p[data-v-42906d30]:hover {\n                text-decoration: underline;\n}\n.page-wrapper .m-container .left .top[data-v-42906d30] {\n        width: 640px;\n        height: 284px;\n        display: -webkit-box;\n        display: -ms-flexbox;\n        display: flex;\n        -webkit-box-pack: justify;\n            -ms-flex-pack: justify;\n                justify-content: space-between;\n}\n.page-wrapper .m-container .left .top .articles[data-v-42906d30] {\n          width: 45%;\n}\n.page-wrapper .m-container .left .top .articles .article[data-v-42906d30] {\n            margin: 10px 0;\n}\n.page-wrapper .m-container .left .top .articles .article p[data-v-42906d30] {\n              width: 279px;\n              height: 27px;\n              white-space: nowrap;\n              display: -webkit-box;\n              display: -ms-flexbox;\n              display: flex;\n              -webkit-box-pack: justify;\n                  -ms-flex-pack: justify;\n                      justify-content: space-between;\n}\n.page-wrapper .m-container .left .top .articles .article p a[data-v-42906d30] {\n                max-width: 205px;\n                font-size: 16px;\n                color: #000;\n                cursor: pointer;\n                overflow: hidden;\n                text-overflow: ellipsis;\n                white-space: nowrap;\n}\n.page-wrapper .m-container .left .top .articles .article p a[data-v-42906d30]:hover {\n                  text-decoration: underline;\n}\n.page-wrapper .m-container .left .top .articles .article p span[data-v-42906d30] {\n                color: #777;\n}\n.page-wrapper .m-container .left .top .movieSlide[data-v-42906d30] {\n          width: 45%;\n}\n.page-wrapper .m-container .left .top .movieSlide mark[data-v-42906d30] {\n            background: none;\n            color: #ff4d51;\n}\n.page-wrapper .m-container .left .top .movieSlide a[data-v-42906d30] {\n            color: #fff;\n            width: 100%;\n            text-align: center;\n            position: absolute;\n            bottom: 0;\n            font-size: 15px;\n            height: 20px;\n            line-height: 20px;\n            background: rgba(0, 0, 0, 0.7);\n            display: inline-block;\n            cursor: pointer;\n}\n.page-wrapper .m-container .left .top .movieSlide a[data-v-42906d30]:hover {\n              text-decoration: underline;\n}\n.page-wrapper .m-container .right[data-v-42906d30] {\n      width: 400px;\n}\n.page-wrapper .m-container .right .gameNews[data-v-42906d30] {\n        margin-bottom: 20px;\n}\n.page-wrapper .m-container .right .gameNews .new[data-v-42906d30] {\n          margin: 10px 0;\n          text-align: left;\n          font-size: 16px;\n}\n.page-wrapper .m-container .right .gameNews .new a[data-v-42906d30] {\n            color: #000;\n}\n.page-wrapper .m-container .right .gameNews .new a[data-v-42906d30]:hover {\n              text-decoration: underline;\n}\n.page-wrapper .m-container .right .bizhi[data-v-42906d30] {\n        width: 400px;\n}\n.page-wrapper .m-container .right .bizhi li[data-v-42906d30] {\n          margin: 10px 0;\n}\n.page-wrapper .m-container .right .bizhi li .box[data-v-42906d30] {\n            height: 50px;\n            position: relative;\n}\n.page-wrapper .m-container .right .bizhi li .box a[data-v-42906d30] {\n              font-size: 15px;\n              font-weight: 600;\n              color: #000;\n}\n.page-wrapper .m-container .right .bizhi li .box a[data-v-42906d30]:hover {\n                text-decoration: underline;\n}\n.page-wrapper .m-container .right .bizhi li .box span[data-v-42906d30] {\n              bottom: 0;\n              color: #777;\n}\n",""])}});