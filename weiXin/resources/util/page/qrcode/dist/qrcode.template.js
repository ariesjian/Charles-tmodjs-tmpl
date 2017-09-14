/*v:4*/
template('qrcode_util',function($data,$filename
                                /**/) {
    'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,activity_name=$data.activity_name,getImgPath=$helpers.getImgPath,enroll_qrcode_url=$data.enroll_qrcode_url,$out='';$out+='<div class="c_activity_codepopup" id="QRCodeView">\n    <div class="c_activity_codepopup_inner">\n        <div class="c_activity_codepopup_inner_title">\n            <span class="c_activity_codepopup_inner_title_txt">';
    $out+=$string(activity_name||'');
    $out+='</span>\n            <a href="javascript:;" class="j-close c_activity_codepopup_close"><img src="';
    $out+=$string(getImgPath('close.png'));
    $out+='" /></a>\n        </div>\n        <div class="c_activity_codepopup_inner_img">\n            <span class="c_activity_codepopup_inner_img_txt">扫描二维码<br />可获得10积分</span>\n            <b class="c_activity_codepopup_inner_img_img"><img src="';
    $out+=$string(enroll_qrcode_url);
    $out+='" /></b>\n        </div>\n    </div>\n</div>\n';
    return new String($out);
});