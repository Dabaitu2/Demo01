/**
 * Created by tomokokawase on 17-4-21.
 */
let express = require('express');
let io = require('io');
let app = express();
let credenticals = require('./public/lib/credentials');
app.use(require('body-parser')());
//凭证外化
app.use(require('cookie-parser')(credenticals.cookieSecret));
app.use(require('express-session')(
    {
        resave: false,
        saveUninitialized: false,
        secret: credenticals.cookieSecret
    }
));
//设置模板视图引擎
//指明默认布局是main.handlebars
let handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    helpers:{
        section:function (name,options) {
            if(!this._sections) this._sections={};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
// handlebars.registerPartials(__dirname+'/views/partials');

let fortunes = [
        "今天你的运气很好，买个包子吧",
        "今天你的运势也很好，买个大包子吧",
        "今天是个好日子，加入共产党吧",
        "达康书记向你报到",
        "哭坟好手祁同伟",
];

function NewsletterSignup(){
};
NewsletterSignup.prototype.save = function(callback){
    callback();
};
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('port',process.env.PORT || 3000);
app.use(express.static(__dirname+'/public'));
app.use(function (req,res,next) {
    res.locals.flash = req.session.flash;
    delete  req.session.flash;
    next();
});
//所有路由
//测试路由
app.use(function (req,res,next) {
    res.locals.showTests = app.get('env')!=='production'&&req.query.test ==='1';
    next();
});

function getWeatherData() {
    return {
        locations:[
            {
                name:'Portland',
                forecastUrl:'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl:'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather:'Overcast',
                temp:'54.1F(12.3C)',
            },
            {
                name:'Bend',
                forecastUrl:'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl:'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather:'Partly Cloudy',
                temp:'55.0F(12.8C)',
            },
            {
                name:'Manzanita',
                forecastUrl:'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl:'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather:'Light Rain',
                temp:'55.0F(12.8C)',
            },
        ]
    };
}

// Handlebars.registerHelper('json', function(context) {
//     return JSON.stringify(context);
// });

app.use(function (req,res,next) {
    if(!res.locals.partials) res.locals.partials={};
    // var wether = JSON.stringify(getWeatherData());
    // res.locals.partials.weather = wether;
    res.locals.partials.weatherContext = getWeatherData();
    next();
});



//用户页面路由
app.get('/',function (req,res) {
    //使用handlebars 模版引擎
    console.log(res.locals.partials.weatherContext.locations);
    res.render('home');
});


app.get('/about',function (req,res) {
        let randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
        res.render('about',
            { fortune:randomFortune,
                //当前pageTestScript对应路由为以下路由
                pageTestScript:'/qa/test-about.js'
        });
    // });
});

app.get('/tour/hood-river',function (req,res) {
    res.render('tour/hood-river');
});

app.get('/tour/request-group-rate',function (req,res) {
    res.render('tour/request-group-rate');
});

app.get('/jqueryTest', function(req, res){
    res.render('jqueryTest');
});
app.get('/nursery-rhyme', function(req, res){
    res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
    //传递假数据
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});

app.get('/newsletter',function (req,res) {
    res.render('newsletter',{ csrf:'CSRF token goes here'});
});
app.post('/newsletter',function (req,res) {
    let name = req.body.name || '',email = req.body.email||'';
    if(name!=='tomo'){
        if(req.xhr) return res.json({error:'Not right name'});
        req.session.flash = {
            type:'danger',
            intro:'Validation error!',
            message:'The name you entered was not correct',
        };
        return res.redirect(303,'/newsletter/archive');
    }

    new NewsletterSignup({name:name,email:email}).save(function (err) {
        if(err){
            if(req.xhr) return res.json({error:'DataBase error.'});
            req.session.flash = {
                type:'danger',
                intro:'DataBase error!',
                message:'DataBase error! wait for a second please',
            };
            return res.redirect(303,'/newsletter/archive');
        }
        if(req.xhr) return res.json({success:true});
        req.session.flash = {
            type:'success',
            intro:'Thank you!',
            message:'You have now been signed up for the newsletter',
        };
        return res.redirect(303,'/newsletter/archive');
    })
});

app.get('/newsletter/archive', function(req, res){
    res.render('tour/archive');
});

// app.post('/process',function (req,res) {
//     // console.log('Form (from querystring): '+req.query.form);
//     // console.log('CSRF token (from hidden form field): '+req.body._csrf);
//     // console.log('Name (from visible form field): '+req.body.name);
//     // console.log('Email (from visible form field): '+req.body.email);
//     // res.redirect(303,'/thank you');
//     if(req.xhr||req.accepts('json.html')==='json'){
//         res.send({success:true});
//     } else {
//         res.redirect(303,'/thank you');
//     }
// });

//定义404页面
app.use(function (req,res,next) {
    // res.type('text/plain');
    // res.status(404);
    // res.send('404 - Not Found');
    console.log(err);
    res.status(500);
    res.render('404');
});

//定制500页面
app.use(function (err,req,res,next) {
    // res.type('text/plain');
    // res.status(500);
    // res.send('500 - Server Error');
    console.log(err);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'),function () {
    console.log('Express started on http://localhost:'+app.get('port')+' ;press ctrl-c to terminate.');
});
