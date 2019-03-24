layui.define(function(exports){
    var $ = layui.$;
    $.ajaxSetup({
        headers: {
            "token": localStorage.token
        },
        // xhrFields: {
        //     withCredentials: true
        // },
        complete: function(xhr) {
            //token过期，则跳转到登录页面
            console.log(xhr);
            if(xhr.responseJSON && "code" in xhr.responseJSON && xhr.responseJSON.code == 10010){
                parent.location.href = location.origin + '/src/login.html';
            }
        }
    });

    //对外暴露的接口
    exports('setToken', {});
});