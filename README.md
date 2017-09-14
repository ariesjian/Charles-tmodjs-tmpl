# 使用Charles代理页面，使用模版编写页面



---

[TOC]

---

## 简介

这个是我把自己做过的项目，纯粹的把前台拨出来的效果，只是供参考结构，download到本地后使用代理可以跑通，代理在这里体现的最好的地方就是代理请求的数据和页面，对于提交的数据我暂时还不会使用代理，嘿嘿。


## 目录结构

* *weixin* 总的公众号目录
* *![view][1]*   页面入口
* *![resources][2]*   所有的页面



  [2]: https://github.com/ariesjian/Charles-tmodjs-tmpl/blob/master/weiXin/resourecs.jpg
  [1]: https://github.com/ariesjian/Charles-tmodjs-tmpl/blob/master/weiXin/view.jpg



## 文件说明
          在view文件夹下只存放页面，里面只是一个空的页面，只是会存放页面的隐藏值和js，css链接
		  resources里面的Charles文件夹里面是代理的文件，通常是代理的页面和数据。这个需要在本地安装Charles代理工具
		  pages下面是所有页面文件，每个页面都是一个文件，index.html页面最后通过tmodjs编译成js文件，所以到最后加载的模版           是js.
		  utils是自定义的共方法。
		  
		  这个案例使用的工具是webstrom,使用的是weui和zepto
		  
		  
## 这样做的好处
      
	       可以让前端脱离后台接口，当接口没有完成的时候可以看着设计图依赖代理对页面进行对接。
