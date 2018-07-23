function isHasElement(arr,value){
    var str = arr.toString();
    var index = str.indexOf(value);
    if(index >= 0){
        value = value.toString().replace(/(\[|\])/g,"\\$1");
        var reg1 = new RegExp("((^|,)"+value+"(,|$))","gi");
        return str.replace(reg1,"$2@$3").replace(/[^,@]/g,"").indexOf("@");
    }else{
        return -1;
    }
}
function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window){

        return true;
    }else {
        return false;
    }
}
function fileChange(target) {
    var fileSize = 0;
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    if (isIE && !target.files) {
        var filePath = target.value;
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
        var file = fileSystem.GetFile (filePath);
        fileSize = file.Size;
    } else {
        fileSize = target.files[0].size;
    }
    var size = fileSize / 1024;
    if(size>2000){
        alert("附件不能大于2M");
        target.value="";
        return
    }
    var name=target.value;
    var fileName = name.substring(name.lastIndexOf(".")+1).toLowerCase();
    if(fileName !="xls" && fileName !="xlsx"&& fileName !="txt"){
        alert("请选择execl格式文件上传！");
        target.value="";
        return
    }
};
function mouseOut() {

        $("#jgappsdkleave").hide();


}
function mouseOver() {

    $("#jgappsdkleave").show();


}
// 日期格式化
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');

}
// 数组是否包含
Array.prototype.contains = function ( needle ) {
    for (i in this) {
        if (this[i].indexOf("needle"))
            return true;
    }
    return false;
};
//验证方法
function cherkImei(imei){
    var reg = /^\d{14,17}$/;
    imeitr=reg.test(imei);
    if(imei){
        return imeitr;
    }else{
        return
    }
};
function CheckMac(Mac)
{
    //([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}
    // var Mac_name=/^[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}$/;
    // Mactr=Mac_name.test(Mac);
    // if(Mactr){
    //     return Mactr;
    // }
    // return false;
};
function checkMobile(mobileNum){
    var mobile =/^1[3|4|5|6|7|0|8][0-9]\d{4,8}$/;
    mobilestr= mobile.test(mobileNum);
    if(mobilestr){
        return mobilestr;
    }else {
        return false;
    }
};
//字符串截取加*
function plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
        xing+='*';
    }
    return str.substr(0,frontLen)+xing+str.substr(str.length-endLen);
};
function getCookie(cookie_name)
{var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);
    if (cookie_pos != -1)
    {cookie_pos += cookie_name.length + 1;
        var cookie_end = allcookies.indexOf(";", cookie_pos);
        if (cookie_end == -1)
        {
            cookie_end = allcookies.length;
        }
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
    }
    return value;
}
var loginvalidation=function () {
    return sessionStorage.getItem("user");

};

var getvalidation=function (v) {
    return sessionStorage.getItem(v);

}
//数组求和

function getSum(array){
    var sum = 0;
    for (var i = 0; i < array.length; i++){
        sum = sum+parseInt(array[i]);
    }
    return sum;
}
//for循环

var cycle=function (array) {
    var  cycleArray=[]
    if(array!==undefined&&array!==''){
        for(var i=0 ;i<array.length;i++ ){
            cycleArray.push(array[i].value);
        }
    }

    return cycleArray;
}
var cyclecount=function (array) {
    var  cycleArray=[]
    if(array!==undefined&&array!==null&&array!==''){
        for(var i=0 ;i<array.length;i++ ){
            cycleArray.push(array[i].count);
        }
    }

    return cycleArray;
}
var cyclename=function (array) {
    var  cycleArrayName=[]
    if(array!==undefined&&array!==null&&array!==''){
        for(var i=0;i<array.length;i++){
            cycleArrayName.push(array[i].name);
        }
    }

    return cycleArrayName;
}
//求百分比

var percentage=function (m,d) {
    var percent=(((parseInt(m)/parseInt(d)).toFixed(3))*100).toFixed(2)+'%';
    return percent;
};
var percentage_=function (m,d) {
    var percent=(((parseInt(m)/parseInt(d)).toFixed(3))*100).toFixed(2);
    return percent;
};
//验证数据是否为空
var isnull=function (data) {
    if(data===undefined||data===null||data===''){
        return false
    }else if(data){
        return data;
    }

}
var randomNum=function () {
    var randomNum = ((((Math.random()))*312)).toFixed(2);
    return randomNum;
}

var  cycleitem=function(item,total){
    var itemle=item.length;
    for(var i=0 ; i<itemle;i++){
        if(i===0){
            var f=item[i].value;
           return percentage(f,total)
        }else if(item===1){
            var w=item[i].value;
           return percentage(w,total)
        }else if(i===2){
            var a=item[i].value;
            return percentage(a,total)
        }else if(i===3){
            var b=item[i].value;
            return percentage(b,total)
        }else if(i===4){
            var c=item[i].value;
            return percentage(c,total)
        }else if(i===5){
            var d=item[i].value;
            return percentage(d,total)
        }else if(i===6){
            var g=item[i].value;
            return percentage(g,total)
        }else{
            var k=item[i].value;
            return percentage(k,total)
            break;
        }

    }
}
var isvalue=function(value){
    var v=parseInt(Math.random()*10)
    if(value===''||value===null||value===undefined){
        return value=v;
    }else{
        return value;
    }
}

//分页算法
var calculateIndexes = function (current, length, displayLength) {
    var indexes = [];
    var start = Math.round(current - displayLength / 2);
    var end = Math.round(current + displayLength / 2);
    if (start <= 1) {
        start = 1;
        end = start + displayLength - 1;
        if (end >= length - 1) {
            end = length - 1;
        }
    }
    if (end >= length - 1) {
        end = length;
        start = end - displayLength + 1;
        if (start <= 1) {
            start = 1;
        }
    }
    for (var i = start; i <= end; i++) {
        indexes.push(i);
    }
    return indexes;
};
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;

    for(var i = 0; i < x.length; i += 16)
    {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;

        a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
        d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
        b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
        d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
        c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
        d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
        d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

        a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
        d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
        c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
        b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
        d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
        c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
        d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
        c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
        a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
        d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
        c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
        b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

        a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
        d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
        b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
        d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
        c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
        d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
        a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
        d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
        b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

        a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
        d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
        c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
        d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
        d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
        a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
        d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
        b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
    var bkey = str2binl(key);
    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
    return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
    var str = "";
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
    return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++)
    {
        str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
    }
    return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i += 3)
    {
        var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
            | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
            |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
        for(var j = 0; j < 4; j++)
        {
            if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
        }
    }
    return str;
}

/*!
 * LABELAUTY jQuery Plugin
 *
 * @file: jquery-labelauty.js
 * @author: Francisco Neves (@fntneves)
 * @site: www.francisconeves.com
 * @license: MIT License
 */

(function( $ ){

    $.fn.labelauty = function( options )
    {
        /*
         * Our default settings
         * Hope you don't need to change anything, with these settings
         */
        var settings = $.extend(
            {
                // Development Mode
                // This will activate console debug messages
                development: false,

                // Trigger Class
                // This class will be used to apply styles
                class: "labelauty",

                // Use text label ?
                // If false, then only an icon represents the input
                label: true,

                // Separator between labels' messages
                // If you use this separator for anything, choose a new one
                separator: "|",

                // Default Checked Message
                // This message will be visible when input is checked
                checked_label: "Checked",

                // Default UnChecked Message
                // This message will be visible when input is unchecked
                unchecked_label: "Unchecked",

                // Minimum Label Width
                // This value will be used to apply a minimum width to the text labels
                minimum_width: false,

                // Use the greatest width between two text labels ?
                // If this has a true value, then label width will be the greatest between labels
                same_width: true
            }, options);

        /*
         * Let's create the core function
         * It will try to cover all settings and mistakes of using
         */
        return this.each(function()
        {
            var $object = $( this );
            var use_labels = true;
            var labels;
            var labels_object;
            var input_id;

            // Test if object is a check input
            // Don't mess me up, come on
            if( $object.is( ":checkbox" ) === false && $object.is( ":radio" ) === false )
                return this;

            // Add "labelauty" class to all checkboxes
            // So you can apply some custom styles
            $object.addClass( settings.class );

            // Get the value of "data-labelauty" attribute
            // Then, we have the labels for each case (or not, as we will see)
            labels = $object.attr( "data-labelauty" );

            use_labels = settings.label;

            // It's time to check if it's going to the right way
            // Null values, more labels than expected or no labels will be handled here
            if( use_labels === true )
            {
                if( labels == null || labels.length === 0 )
                {
                    // If attribute has no label and we want to use, then use the default labels
                    labels_object = new Array();
                    labels_object[0] = settings.unchecked_label;
                    labels_object[1] = settings.checked_label;
                }
                else
                {
                    // Ok, ok, it's time to split Checked and Unchecked labels
                    // We split, by the "settings.separator" option
                    labels_object = labels.split( settings.separator );

                    // Now, let's check if exist _only_ two labels
                    // If there's more than two, then we do not use labels :(
                    // Else, do some additional tests
                    if( labels_object.length > 2 )
                    {
                        use_labels = false;
                        debug( settings.development, "There's more than two labels. LABELAUTY will not use labels." );
                    }
                    else
                    {
                        // If there's just one label (no split by "settings.separator"), it will be used for both cases
                        // Here, we have the possibility of use the same label for both cases
                        if( labels_object.length === 1 )
                            debug( settings.development, "There's just one label. LABELAUTY will use this one for both cases." );
                    }
                }
            }

            /*
             * Let's begin the beauty
             */

            // Start hiding ugly checkboxes
            // Obviously, we don't need native checkboxes :O
            $object.css({ display : "none" });

            // We don't need more data-labelauty attributes!
            // Ok, ok, it's just for beauty improvement
            $object.removeAttr( "data-labelauty" );

            // Now, grab checkbox ID Attribute for "label" tag use
            // If there's no ID Attribute, then generate a new one
            input_id = $object.attr( "id" );

            if( input_id == null )
            {
                var input_id_number = 1 + Math.floor( Math.random() * 1024000 );
                input_id = "labelauty-" + input_id_number;

                // Is there any element with this random ID ?
                // If exists, then increment until get an unused ID
                while( $( input_id ).length !== 0 )
                {
                    input_id_number++;
                    input_id = "labelauty-" + input_id_number;
                    debug( settings.development, "Holy crap, between 1024 thousand numbers, one raised a conflict. Trying again." );
                }

                $object.attr( "id", input_id );
            }

            // Now, add necessary tags to make this work
            // Here, we're going to test some control variables and act properly
            $object.after( create( input_id, labels_object, use_labels ) );

            // Now, add "min-width" to label
            // Let's say the truth, a fixed width is more beautiful than a variable width
            if( settings.minimum_width !== false )
                $object.next( "label[for=" + input_id + "]" ).css({ "min-width": settings.minimum_width });

            // Now, add "min-width" to label
            // Let's say the truth, a fixed width is more beautiful than a variable width
            if( settings.same_width != false && settings.label == true )
            {
                var label_object = $object.next( "label[for=" + input_id + "]" );
                var unchecked_width = getRealWidth(label_object.find( "span.labelauty-unchecked" ));
                var checked_width = getRealWidth(label_object.find( "span.labelauty-checked" ));

                if( unchecked_width > checked_width )
                    label_object.find( "span.labelauty-checked" ).width( unchecked_width );
                else
                    label_object.find( "span.labelauty-unchecked" ).width( checked_width );
            }
        });
    };

    /*
     * Tricky code to work with hidden elements, like tabs.
     * Note: This code is based on jquery.actual plugin.
     * https://github.com/dreamerslab/jquery.actual
     */
    function getRealWidth( element )
    {
        var width = 0;
        var $target = element;
        var style = 'position: absolute !important; top: -1000 !important; ';

        $target = $target.clone().attr('style', style).appendTo('body');
        width = $target.width(true);
        $target.remove();

        return width;
    }

    function debug( debug, message )
    {
        if( debug && window.console && window.console.log )
            window.console.log( "jQuery-LABELAUTY: " + message );
    };

    function create( input_id, messages_object, label )
    {
        var block;
        var unchecked_message;
        var checked_message;

        if( messages_object == null )
            unchecked_message = checked_message = "";
        else
        {
            unchecked_message = messages_object[0];

            // If checked message is null, then put the same text of unchecked message
            if( messages_object[1] == null )
                checked_message = unchecked_message;
            else
                checked_message = messages_object[1];
        }

        if( label == true )
        {
            block = '<label for="' + input_id + '">' +
                '<span class="labelauty-unchecked-image"></span>' +
                '<span class="labelauty-unchecked">' + unchecked_message + '</span>' +
                '<span class="labelauty-checked-image"></span>' +
                '<span class="labelauty-checked">' + checked_message + '</span>' +
                '<span class="labelauty-unchecked-noimage"></span>' +
                '</label>';
        }
        else
        {
            block = '<label for="' + input_id + '">' +
                '<span class="labelauty-unchecked-image"></span>' +
                '<span class="labelauty-checked-image"></span>' +
                '</label>';
        }

        return block;
    };

}( jQuery ));
function fcomdify(n)
{
    n=n.toString();
    var re=/\d{1,3}(?=(\d{3})+$)/g;
    var n1=n.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});

    return n1;

}
function JsonSort(json,key){
    //console.log(json);
    if(json!==undefined){
        for(var j=1,jl=json.length;j < jl;j++){
            var temp = json[j],
                val  = temp[key],
                i    = j-1;
            while(i >=0 && json[i][key]<val){
                json[i+1] = json[i];
                i = i-1;
            }
            json[i+1] = temp;

        }
        //console.log(json);
        return json;
    }

};
var getNameArr=function (data) {
    var arrname=[];
    if(data!==undefined){
        for(var i=0;i<data.length;i++){
            arrname.push(data[i].name.substr(0,12));
        }
    }
    return arrname

}
var getValueArr=function (data) {
    var arrvalue=[];
    if(data!==undefined){
        if(data!==undefined&&data!==''){
            for(var i=0;i<data.length;i++){
                arrvalue.push(data[i].value);
            }
        }
    }


    return arrvalue

};
var getmenuRole = function (arr,key) {
    if(arr!==undefined){
        var urls=[];
        for(var i=0;i<arr.length;i++){
            urls.push(arr[i][key]);
        }
        return urls;
    }
};
function jgTrim(str,is_global)
{
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    if(is_global.toLowerCase()=="g")
    {
        result = result.replace(/\s/g,"");
    }
    return result;
}
/*
* 数组随机获取
* */

function jg_shuffle(array,array1) {
    var m = array.length,
        t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        t1 = array1[m];
        array[m] = array[i];
        array1[m] = array1[i];
        array[i] = t;
        array1[i] = t1;
    }
    return [array,array1];
};
//删除最后一个字符
var delcolon=function (str,a) {
    if(str.length!==0){
        var newstr;
        var iscolon=str.substr(str.length-1,1);
        if(iscolon===a){
            newstr=str.substring(0,str.length-1);
        }else {
            newstr=str;
        };
        return newstr;
    }

};
/*
格式化日期
* */
Date.prototype.format =function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}

/*
* 添加水印
* */
var watermark_text=function (id,text) {

    var header2 = document.getElementsByClassName(id);


    var i;
    for (i = 0; i < header2.length; i++) {
        var div = document.createElement("div");
        div.innerHTML=text;
        div.className="watermark_class"
        insertAfter(div,header2[i]);

    }

    function insertAfter( newElement, targetElement ){
        var parent = targetElement.parentNode;
        if( parent.lastChild == targetElement ){
            parent.appendChild( newElement, targetElement );
        }else{
            parent.insertBefore( newElement, targetElement.nextSibling );
        };
    };
};
function stripscript(s)
{
    if(s!==null){
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs+s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    }else {
        return s
    }

};
//制保留2位小数，如：2，会在2后面补上00.即2.00
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
};
//最小值
Array.prototype.min = function() {
    var min = this[0];
    var len = this.length;
    if(len>1){


    for (var i = 1; i < len; i++){
        if (this[i] < min){
            min = this[i];
        }
    }
    return min;
    }else {
        return undefined;
    }
}
//最大值
Array.prototype.max = function() {
    var max = this[0];
    var len = this.length;
    if(len>1) {
        for (var i = 1; i < len; i++) {
            if (this[i] > max) {
                max = this[i];
            }
        }
        return max;
    }else {
        return undefined;
    }
}
var loginvalidation=function () {
    return sessionStorage.getItem("UserName");

};
Array.prototype.jgindexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].name == val) return i;
    }
    return -1;
};
Array.prototype.jgremove = function(val) {
    var index = this.jgindexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
var ly_OnFullScreen = function (fullID,mapID) {

    var viewFullScreen = document.getElementById(fullID);
    if (viewFullScreen) {
        var docElm = document.getElementById(mapID);
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else {


            }

        }


};

var ly_ExtFullScreen=function () {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else {

        }



};
var lynavsm=function (id) {
    $(function(){
        $("#ly-nav-sm li").click(function() {
            $(this).siblings('li').removeClass('lyactive');  // 删除其他兄弟元素的样式
            $(this).addClass('lyactive');                            // 添加当前元素的样式
        });
    });
}
var lynavmd=function (id) {
    $(function(){
        $("#ly-nav-md li").click(function() {
            $(this).siblings('li').removeClass('lyactive');  // 删除其他兄弟元素的样式
            $(this).addClass('lyactive');                            // 添加当前元素的样式
        });
    });
}

var StringOperate ={
    separator    : ",",//字符串分隔符
    baforeInsert : false,//字符串追加方式，默认false是在后面添加，true在追加到前面
    isRepeat     : false,//追加的字符串是否可重复添加
    isDeleteAll  : true,//删除所有匹配的字符串

    //左边添加分隔符
    lInsertSeparator : function(operateString){
        if(operateString.indexOf(this.separator)  == 0)
            return operateString;
        return this.separator + operateString;
    },
    //右边添加分隔符
    rInsertSeparator : function(operateString){
        if(operateString.lastIndexOf(this.separator)  == (operateString.length - this.separator.length))
            return operateString;
        return operateString + this.separator;
    },
    //去除左边分隔符
    lSeparatorTrim   : function(operateString){
        if(operateString.indexOf(this.separator)  == 0)
            return operateString.substring(1);
        return operateString;
    },
    //去除右边的分隔符
    rSeparatorTrim   : function(operateString){
        if(operateString.lastIndexOf(this.separator)  == (operateString.length - this.separator.length))
            return operateString.substring(0,operateString.length-1);
        return operateString;
    },
    //追加字符串，将str字符串 追加到operateString中
    add : function(operateString, str){
        if( str  && str != ""){
            if(this.isRepeat){//重复追加
                if(this.baforeInsert){//追加在开头
                    return this.rSeparatorTrim(this.lSeparatorTrim(str + this.separator + operateString));
                }
                return this.rSeparatorTrim(this.lSeparatorTrim(operateString + this.separator + str));
            }else{
                //开头和结尾都添加分隔符
                operateString =	this.lInsertSeparator(this.rInsertSeparator(operateString));
                if(operateString.indexOf(this.separator + str + this.separator) == -1){
                    if(this.baforeInsert){
                        return this.rSeparatorTrim(this.lSeparatorTrim(str + operateString));
                    }else{
                        return this.rSeparatorTrim(this.lSeparatorTrim(operateString + str));
                    }
                }
                return this.rSeparatorTrim(this.lSeparatorTrim(operateString));
            }
        }
    },
    //删除指定字符串
    remove : function(operateString, str){
        if(operateString && str && operateString != "" && str != ""){
            //开头和结尾都添加分隔符
            operateString =	this.lInsertSeparator(this.rInsertSeparator(operateString));
            if(this.isDeleteAll){
                operateString = operateString.replace(new RegExp(this.separator,"g"),this.separator + this.separator);
                //删除所有匹配的字符串
                operateString =	 operateString.replace(new RegExp(this.separator + str +this.separator,"g"),this.separator);
                operateString = operateString.replace(new RegExp(this.separator+"{2,}","g"),this.separator);
            }else{
                operateString =	 operateString.replace(new RegExp(this.separator + str + this.separator),this.separator);
            }
            return this.rSeparatorTrim(this.lSeparatorTrim(operateString));
        }
    }


};
//模拟下载
var echartsDl=function (url,data) {
    var appkey="9c418970093b352d1a8fb7e8";
    var secret="13f9644a74ba92c3ebe916a3";
    var m_token =Base64.encode(appkey+":"+secret);
    //access_token暂时没用---日期2018.5.4
    var access_token=localStorage.getItem("access_token");

    data=JSON.parse(data)
    data=data.data;
    var d=[];
    $.ajax({
        url: url,
        type: 'post',
        async : true,
        data: JSON.stringify(data),
        contentType : 'application/json;charset=utf-8', //设置请求头信息
        headers: { 'Authorization': "Bearer "+m_token},
        success: function (response, status, request) {
            if(response!==""&&response!=undefined){
                window.location.href="https://api-jdi.jiguang.cn/down_data/chart_data/"+response.data;
            }
        },

    });

    //
    // var form=$("<form>");//定义一个form表单
    // form.attr("style","display:none");
    // form.attr("target","");
    // form.attr("method","post");
    // form.attr("action",utl);
    // var input1=$("<input>");
    // input1.attr("type","hidden");
    // input1.attr("name","data");
    // input1.attr("value",data);
    // $("body").append(form);//将表单放置在web中
    // form.append(input1);
    // form.submit();//表单提交


};
function nofind(img,imgName){
    img.src="https://izone.jiguang.cn/img/izone/bsis/"+imgName;
    img.onerror=null; //如果错误图片也不存在就会死循环一直跳，所以要设置成null，也可以不加
}
function modifyJosnKey(json,oddkey,newkey){
    for(var i=0;i<json.length;i++){
        var val=json[i][oddkey];
        delete json[i][oddkey];
        json[i][newkey]=val;
    }
    return json
}
