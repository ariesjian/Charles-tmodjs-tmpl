/*TMODJS:{"version":"1.0.0"}*/
!function(){function a(a,b){return(/string|function/.test(typeof b)?h:g)(a,b)}function b(a,c){return"string"!=typeof a&&(c=typeof a,"number"===c?a+="":a="function"===c?b(a.call(a)):""),a}function c(a){return l[a]}function d(a){return b(a).replace(/&(?![\w#]+;)|[<>"']/g,c)}function e(a,b){if(m(a))for(var c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)}function f(a,b){var c=/(\/)[^\/]+\1\.\.\1/,d=("./"+a).replace(/[^\/]+$/,""),e=d+b;for(e=e.replace(/\/\.\//g,"/");e.match(c);)e=e.replace(c,"/");return e}function g(b,c){var d=a.get(b)||i({filename:b,name:"Render Error",message:"Template not found"});return c?d(c):d}function h(a,b){if("string"==typeof b){var c=b;b=function(){return new k(c)}}var d=j[a]=function(c){try{return new b(c,a)+""}catch(d){return i(d)()}};return d.prototype=b.prototype=n,d.toString=function(){return b+""},d}function i(a){var b="{Template Error}",c=a.stack||"";if(c)c=c.split("\n").slice(0,2).join("\n");else for(var d in a)c+="<"+d+">\n"+a[d]+"\n\n";return function(){return"object"==typeof console&&console.error(b+"\n\n"+c),b}}var j=a.cache={},k=this.String,l={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},m=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},n=a.utils={$helpers:{},$include:function(a,b,c){return a=f(c,a),g(a,b)},$string:b,$escape:d,$each:e},o=a.helpers=n.$helpers;a.get=function(a){return j[a.replace(/^\.\//,"")]},a.helper=function(a,b){o[a]=b},"function"==typeof define?define(function(){return a}):"undefined"!=typeof exports?module.exports=a:this.template=a,/*v:1*/
a("tpl/index",'<div class="mobile_outcontainer"> <div class="mobile_nopadding_container1"> <div class="c_activity_enrolltop"> <div class="c_activity_enrolltop1"><%=activity_name||\'\'%></div> <div class="c_activity_enrolltop2"><%=activity_start_time.replace(/-/g,\'/\')||\'\'%>-<%=activity_end_time.replace(/-/g,\'/\')||\'\'%></div> <div class="c_activity_enrolltop3"><%=activity_address||\'\'%></div> </div> <div class="c_activity_confirmlist"> <div class="c_activity_confirmlist_inner"> <div class="weui-cell"> <div class="weui-cell__bd"> <p>\u59d3\u540d</p> </div> <div class="weui-cell__ft"><%=contact_name||\'\'%></div> </div> <div class="weui-cell"> <div class="weui-cell__bd"> <p>\u8054\u7cfb\u65b9\u5f0f</p> </div> <div class="weui-cell__ft"><%=contact_mobile||\'\'%></div> </div> <div class="weui-cell"> <div class="weui-cell__bd"> <p>\u7535\u5b50\u90ae\u7bb1</p> </div> <div class="weui-cell__ft"><%=contact_email||\'\'%></div> </div> <%if(contact_company){%> <div class="weui-cell"> <div class="weui-cell__bd"> <p>\u516c\u53f8\u540d\u79f0</p> </div> <div class="weui-cell__ft"><%=contact_company%></div> </div> <%}%> <div class="weui-cell"> <div class="weui-cell__bd"> <p>\u6027\u522b</p> </div> <div class="weui-cell__ft"><%=(2==contact_sex)?\'\u5973\u58eb\':\'\u7537\u58eb\'%></div> </div> <div class="weui-cell"> <div class="weui-cell__bd"> <p>\u652f\u4ed8\u65b9\u5f0f</p> </div> <div class="weui-cell__ft">\u5fae\u4fe1\u652f\u4ed8</div> </div> </div> <div class="c_activity_confirmlist_inner c_room_detail_listcolor" style="margin-top: 10px;"> <div class="c_room_confirm_costtitle"> <div class="c_room_confirm_costtitle_inner1"></div> <div class="c_room_confirm_costtitle_inner2">\u53d1\u7968\u4fe1\u606f</div> <div class="c_room_confirm_costtitle_inner1"></div> </div> <div class="weui-cell c_room_confirm_nobefore"> <div class="weui-cell__bd"> <p>\u53d1\u7968\u7c7b\u578b</p> </div> <div class="weui-cell__ft"><%=(1==is_need_invoice)?(1==invoice_type?"\u4e2a\u4eba":"\u4f01\u4e1a"):"\u65e0"%></div> </div> <%if(1==is_need_invoice){%> <div class="weui-cell"> <div class="weui-cell__bd"> <p>\u5f00\u7968\u62ac\u5934</p> </div> <div class="weui-cell__ft"><%=invoice_title||""%></div> </div> <div class="weui-cell"> <div class="weui-cell__bd"> <p>\u90ae\u5bc4\u5730\u5740</p> </div> <div class="weui-cell__ft"><%=invoice_mail_address||""%></div> </div> <%if(2==invoice_type){%> <div class="weui-cell"> <div class="weui-cell__bd"> <p>\u4f01\u4e1a\u7a0e\u53f7</p> </div> <div class="weui-cell__ft"><%=invoice_tax_no||""%></div> </div> <%}%> <%}%> </div> </div> </div> </div> <div class="footer_fixed_box"> <div class="footer_fixed_box_left c_activity_confirm_footer_left">\u652f\u4ed8\uff1a&yen;<%=activity_price%></div> <div class="footer_fixed_box_right"><a href="javascript:;" style="cursor:pointer;" class="footer_fixed_box_right_inner" id="Confirm">\u786e\u8ba4\u652f\u4ed8</a></div> </div>')}();