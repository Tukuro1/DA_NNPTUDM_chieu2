var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//các route
app.get('',function(require , res){
    res.send('<form method = "POST" action="/register"><button>Register</button></form>');
})
app.get('/hello',function(require , res){
    var name = require.query.name;
    res.send({result: require.query});
})

app.get('/student/:name',function(require , res){
    var name = require.params.name;
    res.send({result: require.params});
})

app.post('/register',function(require , res){
    console.table(require.body);
    res.send({result: require.body});
});

app.put('/update',function(require , res){
    var respomData ={
        "message" : "Cập nhật dữ liệu thành công",
        "data" :require.body,
        "status" : true
    }
    res.send(respomData);
});

app.delete('/delete :id',function(require , res){
    var id = require.params.id;
    res.send("Hello delete"+id);
});

//mở cổng server
app.listen(3000, function(){
    console.log("Ứng dụng đang chạy tại địa chỉ: http://localhost:3000");
});