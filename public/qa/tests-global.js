/**
 * Created by tomokokawase on 17-4-21.
 */
suite('Global Tests',function () {
    test('页面存在合法名称',function () {
        //检查页面是否存在title属性，并用正则表达式检测title是否合理
        assert(document.title&&document.title.match(/\S/)&&document.title.toUpperCase()!=='TODO');
    });
});