/**
 * Created by tomokokawase on 17-4-21.
 */
suite('"About"page tests',function () {
    test('页面应该包含一个可以连接到contact页面的超链接',function () {
        //通过jquery检测href为/contact的a元素的集合是否存在
        assert($('a[href="/contact"]').length);
    });
});