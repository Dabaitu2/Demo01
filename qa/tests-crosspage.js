/**
 * Created by tomokokawase on 17-4-22.
 */
//跨页测试
//引入zombie和chai的断言库
var Browser = require('zombie'),
    assert = require('chai').assert;
var browser;

suite('跨页面测试',function () {
    setup(function () {
        browser = new Browser();
    });

    test('从hood river tour page(胡德河之旅)页面请求一个组团报价'+'应该产生一个指向这个页面的区域',function (done) {
        var referrer = 'http://localhost:3000/tour/hood-river';
        browser.visit(referrer,function () {
            browser.clickLink('.requestGroupRate',function () {
                assert(browser.field('referrer').value===referrer);
                // assert(document.getElementsByTagName('input').length);
                done();
            });
        });
    });

    test('从oregon coast tour page(俄亥俄海滩之旅)页面请求一个组团报价'+'应该产生一个指向这个页面的区域',function (done) {
        var referrer = 'http://localhost:3000/tour/oregon-coast';
        browser.visit(referrer,function () {
            browser.clickLink('.requestGroupRate',function () {
                assert(browser.field('referrer').value===referrer);
                done();
            });
        });
    });

    test('直接访问request-group-page页面得到的referrer值应该为空',function (done) {
        var referrer = 'http://localhost:3000/tour/request-group-rate';
        browser.visit(referrer,function () {
                assert(browser.field('referrer').value==='');
                done();
        });
    });


});