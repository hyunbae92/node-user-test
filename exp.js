const exp = require('express');
const dbInfo = require('./db-config');
const oracleDb = require('oracledb');
const port = 80;

var server = exp();

server.get('/views/*',function(req,res){
    res.sendFile(__dirname+req.url+'.html');
})

var getNodeTests = async function(params){
    console.log(params);    
    var conn = await oracleDb.getConnection(dbInfo);
    var sql = 'select * from node_test';
    if(params){
        sql += ' where 1=1 ';
        if(params.nt_num){
            sql += ' and nt_num=:nt_num ';
        }
        if(params.nt_name){
            sql += ' and nt_name=:nt_name ';
        }
    }
    var result = await conn.execute(sql,params);
    var arr = [];
    for(var row of result.rows){
        var rowParam = {};
        for(var i=0;i<row.length;i++){
            rowParam[result.metaData[i].name] = row[i];
        }
        arr.push(rowParam);
    }
    return arr;
};

server.get('/nodetests',(async function(req,res,next){
    var jsonArr = await getNodeTests(req.query);
    res.json(jsonArr);
    
}))

// server.get('/nodetests',function(req,res,next){
//     getNodeTests()
//         .then((list)=>{
//             res.json(list);
//         })
    
// })

server.listen(port,function(){
    console.log(`server started whit ${port} port`)
})
