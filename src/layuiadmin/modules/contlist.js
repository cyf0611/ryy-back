/**

 @Name：layuiAdmin 内容系统
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form;
  
  //文章管理
  table.render({
    elem: '#LAY-app-content-list'
    ,url: layui.setter.url + '/back_query_user' //模拟接口
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'UserId', title: '用户名称', width: 150}
      ,{field: 'OpenTime', title: '开始日期', sort: true, align: 'center', templet: function(d) {return d.OpenTime && d.OpenTime.slice(0, 10) || ''}}
      ,{field: 'CloseTime', title: '到期日期', sort: true, align: 'center', templet: function(d) {return d.OpenTime && d.CloseTime.slice(0, 10) || ''}}
      ,{field: 'BindMobile', title: '绑定手机' , width: 150, align: 'center'}
      ,{field: 'Inviter', width: 100, title: '邀请人', align: 'center', template: function(d) {return d.Inviter || ''}}
      ,{field: 'InviteCode', width: 100, title: '邀请码', align: 'center'}
      ,{title: '操作', width: 100, align: 'center', fixed: 'right', toolbar: '#table-content-list'}
    ]]
    ,parseData: function(res){ //res 即为原始返回的数据
        return {
            "code": 0, //解析接口状态
            "msg": res.msg, //解析提示文本
            "count": res.count, //解析数据长度
            "data": res.data //解析数据列表
        };
    }
    ,page: true
    ,limit: 20
    ,limits: [10, 15, 20, 25, 30]
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(LAY-app-content-list)', function(obj){
    var data = obj.data, str = '';
    if(obj.event === 'del'){
      layer.confirm('确定删除此文章？', function(index){
        obj.del();
        layer.close(index);
      });
    } else if(obj.event === 'edit'){
        //传参
        for(var k in data) {
            str += k + '=' + data[k] + '&';
        }
      layer.open({
        type: 2
        ,title: '编辑账号'
        ,content: '../../views/manage/listform_edit.html?'+ str
        ,maxmin: true
        ,area: ['600px', '450px']
        ,btn: ['确定', '取消']
        ,yes: function(index, layero){
          var iframeWindow = window['layui-layer-iframe'+ index]
          ,submit = layero.find('iframe').contents().find("#layuiadmin-app-form-edit");

          //监听提交
          iframeWindow.layui.form.on('submit(layuiadmin-app-form-edit)', function(data){
            var field = data.field; //获取提交的字段
            //提交 Ajax 成功后，静态更新表格中的数据
            $.post(layui.setter.url + '/modify_user', field, function(data) {
                if(data.code == 200) {
                    obj.update({
                        UserId: field.UserId
                        ,OpenTime: field.Date.split(' - ')[0]
                        ,CloseTime: field.Date.split(' - ')[1]
                        ,InviteCode: field.InviteCode
                        ,UserPwd: field.UserPwd
                    }); //数据更新

                    form.render();
                    layer.close(index); //关闭弹层
                    layer.msg('修改成功')
                }else {
                  console.log(data.msg);
                   layer.msg(data.msg || '修改失败')
                }
            })

          });  
          
          submit.trigger('click');
        }
      });
    }
  });

  //分类管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,url: layui.setter.base + 'json/content/tags.js' //模拟接口
    ,cols: [[
      {type: 'numbers', fixed: 'left'}
      ,{field: 'id', width: 100, title: 'ID', sort: true}
      ,{field: 'tags', title: '分类名', minWidth: 100}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
    ]]
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(LAY-app-content-tags)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除此分类？', function(index){
        obj.del();
        layer.close(index);
      });
    } else if(obj.event === 'edit'){
      var tr = $(obj.tr);
      layer.open({
        type: 2
        ,title: '编辑分类'
        ,content: '../../../views/app/content/tagsform.html?id='+ data.id
        ,area: ['450px', '200px']
        ,btn: ['确定', '取消']
        ,yes: function(index, layero){
          //获取iframe元素的值
          var othis = layero.find('iframe').contents().find("#layuiadmin-app-form-tags")
          ,tags = othis.find('input[name="tags"]').val();
          
          if(!tags.replace(/\s/g, '')) return;
          
          obj.update({
            tags: tags
          });
          layer.close(index);
        }
        ,success: function(layero, index){
          //给iframe元素赋值
          var othis = layero.find('iframe').contents().find("#layuiadmin-app-form-tags").click();
          othis.find('input[name="tags"]').val(data.tags);
        }
      });
    }
  });

  //评论管理
  table.render({
    elem: '#LAY-app-content-comm'
    ,url: layui.setter.base + 'json/content/comment.js' //模拟接口
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'id', width: 100, title: 'ID', sort: true}
      ,{field: 'reviewers', title: '评论者', minWidth: 100}
      ,{field: 'content', title: '评论内容', minWidth: 100}
      ,{field: 'commtime', title: '评论时间', minWidth: 100, sort: true}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-content-com'}
    ]]
    ,page: true
    ,limit: 10
    ,limits: [10, 15, 20, 25, 30]
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(LAY-app-content-comm)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除此条评论？', function(index){
        obj.del();
        layer.close(index);
      });
    } else if(obj.event === 'edit') {
      layer.open({
        type: 2
        ,title: '编辑评论'
        ,content: '../../../views/app/content/contform.html'
        ,area: ['450px', '300px']
        ,btn: ['确定', '取消']
        ,yes: function(index, layero){
          var iframeWindow = window['layui-layer-iframe'+ index]
          ,submitID = 'layuiadmin-app-comm-submit'
          ,submit = layero.find('iframe').contents().find('#'+ submitID);

          //监听提交
          iframeWindow.layui.form.on('submit('+ submitID +')', function(data){
            var field = data.field; //获取提交的字段
            
            //提交 Ajax 成功后，静态更新表格中的数据
            //$.ajax({});
            table.reload('LAY-app-content-comm'); //数据刷新
            layer.close(index); //关闭弹层
          });  
          
          submit.trigger('click');
        }
        ,success: function(layero, index){
          
        }
      });
    }
  });

  exports('contlist', {})
});