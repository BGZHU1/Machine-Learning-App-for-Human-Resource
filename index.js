//at the end, compare it to real results

var pg = require('pg');
var express = require('express');
// body parser
var bodyParser = require('body-parser');

var jquery = require('jQuery');

var app = express();

// json method
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs')
app.set('views', './views')

var path = require('path');
app.use('/public',express.static(path.join(__dirname,'public')));
app.use( express.static( "public" ) );

var mysql=require('mysql');
var connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'123456',
  database:'hrdata'
})//connection


app.get('/main',function(req,res){
  res.render('main',{});
})

app.post('/main', function(req, res){

  //var startRows=1000;//ask for user input
  //var finishRows=2000;
//console.log(req.body.sta)
if(req.body.satisfaction_level==undefined){var satisfaction_level=0;}
else{satisfaction_level=1;}

if(req.body.last_evaluation==undefined){var last_evaluation=0;}
else{last_evaluation=1;}

if(req.body.number_project==undefined){var number_project=0;}
else{number_project=1;}

if(req.body.average_montly_hours==undefined){var average_montly_hours=0;}
else{average_montly_hours=1;}

if(req.body.time_spend_company==undefined){var time_spend_company=0;}

else{ time_spend_company=	1;}


if(req.body.Work_accident==undefined){var Work_accident=0;}
else{Work_accident=1;}


if(req.body.left==undefined){var left=0;}
else{left=1;}

if(salary==undefined){var salary=0;}
else{salary=1;}

if(req.body.promotion_last_5years==undefined){var promotion_last_5years=0;}
else{promotion_last_5years	=1;}

var startRows;
if(req.body.startRows==undefined){startRows =0;}
else{startRows=req.body.startRows;}

var finishRows;
if(req.body.finishRows==undefined){ finishRows=500;}
else{finishRows=req.body.finishRows;}


var columnChoice=[satisfaction_level,last_evaluation,number_project,average_montly_hours,time_spend_company,Work_accident,left,promotion_last_5years,salary];//ask for user input
//
console.log("columnChoice"+columnChoice);
//var dataSize=finishRows-startRows;
//console.log(dataSize);

var queryData=new Array();

connection.query(`select * from data`,function(err,rows,fields){
  if(err) throw err;


  //console.log("item zero is : "+rows[10000].left);

for(var i=startRows;i<finishRows-1;i++){

 queryData[i]=new Array ();
 //console.log("item zero is : "+rows[0].left);
 //console.log(columnChoice);
 if(columnChoice[0]==1){
  //rows[i] works
 queryData[i][0]=rows[i].satisfaction_level;
 //console.log(queryData[i][0]);

 }else{queryData[i][0]=0;}

 if(columnChoice[1]==1){
 queryData[i][1]=rows[i].last_evaluation;
 }else{queryData[i][1]=0;}

 if(columnChoice[2]==1){
 queryData[i][2]=rows[i].number_project;
 }else{queryData[i][2]=0;}


 if(columnChoice[3]==1){
 queryData[i][3]=rows[i].average_montly_hours;
 }else{queryData[i][3]=0;}

 if(columnChoice[4]==1){
 queryData[i][4]=rows[i].time_spend_company;
 }else{queryData[i][4]=0;}

 if(columnChoice[5]==1){
 queryData[i][5]=rows[i].	Work_accident;
 }else{queryData[i][5]=0;}

 if(columnChoice[6]==1){
 queryData[i][6]=rows[i].left;
 }else{queryData[i][6]=0;}

 if(columnChoice[7]==1){
 queryData[i][7]=rows[i].	promotion_last_5years;
 }else{queryData[i][7]=0;}

 if(columnChoice[8]==1){
 queryData[i][8]=rows[i].salary;
}else{queryData[i][8]=0;}

}//for loop for reading the data

//console.log("query data is :"+queryData);
//console.log("the queryData"+queryData[450][4])
//pick 2 start point
var startPoint1=queryData[startRows];
var startPoint2=queryData[finishRows-10];

//2 clusters to store different row numbers
var cluster1=[];
var cluster2=[];


//calculate the each xi points distance and assign the xi to one cluster

for(var i=startRows;i<finishRows-1;i++){
  //console.log("startRows" + (startPoint1[0]));

var distance_to_cluster1= Math.sqrt(Math.pow(startPoint1[0]-queryData[i][0],2)+Math.pow(startPoint1[1]-queryData[i][1],2)+
					Math.pow(startPoint1[2]-queryData[i][2],2)+Math.pow(startPoint1[3]-queryData[i][3],2)+Math.pow(startPoint1[4]-queryData[i][4],2)+
					Math.pow(startPoint1[5]-queryData[i][5],2)+Math.pow(startPoint1[6]-queryData[i][6],2)+Math.pow(startPoint1[7]-queryData[i][7],2)+
          Math.pow(startPoint1[8]-queryData[i][8],2));

var distance_to_cluster2= Math.sqrt(Math.pow(startPoint2[0]-queryData[i][0],2)+Math.pow(startPoint2[1]-queryData[i][1],2)+
         					Math.pow(startPoint2[2]-queryData[i][2],2)+Math.pow(startPoint2[3]-queryData[i][3],2)+Math.pow(startPoint2[4]-queryData[i][4],2)+
         					Math.pow(startPoint2[5]-queryData[i][5],2)+Math.pow(startPoint2[6]-queryData[i][6],2)+Math.pow(startPoint2[7]-queryData[i][7],2)+
                  Math.pow(startPoint2[8]-queryData[i][8],2));

if(distance_to_cluster1<distance_to_cluster2){cluster1.push(i);}
else{cluster2.push(i);}

}

//console.log("value of cluster1:"+cluster1);
//console.log("value of cluster2"+cluster2);
var change_cluster=true;

//new buckets to store the new means
var newClusterMean1=[];
var newClusterMean2=[];

var newCluster1=[];
var newCluster2=[];


//note the cluster is stored in row numbers
//change from there
var sum1=0;
var sum2=0;


//while
while(change_cluster==true){

    //mean for cluster 1
    for(var features=0;features<9;features++){
    sum1=0;
    for(var row=0;row<cluster1.length;row++){

       sum1+=queryData[cluster1[row]][features];
      //console.log(sum1);
    }

       newClusterMean1.push(sum1/cluster1.length);


    }




    //mean for cluster 2
    for(var features=0;features<9;features++){
    var sum2=0;
    for(var row=0;row<cluster2.length;row++){
       sum2+=queryData[cluster2[row]][features];
    }

       newClusterMean2.push(sum2/cluster2.length);
    }

//restablish the change value to false;
change_cluster=false;

  //two new cluster holders
  //2 new clusters to store different row numbers



  for(var i=startRows;i<finishRows-1;i++){

  var distance_to_cluster1= Math.sqrt(Math.pow(newClusterMean1[0]-queryData[i][0],2)+Math.pow(newClusterMean1[1]-queryData[i][1],2)+
  					Math.pow(newClusterMean1[2]-queryData[i][2],2)+Math.pow(newClusterMean1[3]-queryData[i][3],2)+Math.pow(newClusterMean1[4]-queryData[i][4],2)+
  					Math.pow(newClusterMean1[5]-queryData[i][5],2)+Math.pow(newClusterMean1[6]-queryData[i][6],2)+Math.pow(newClusterMean1[7]-queryData[i][7],2)+
            Math.pow(newClusterMean1[8]-queryData[i][8],2));

    var distance_to_cluster2= Math.sqrt(Math.pow(newClusterMean2[0]-queryData[i][0],2)+Math.pow(newClusterMean2[1]-queryData[i][1],2)+
           					Math.pow(newClusterMean2[2]-queryData[i][2],2)+Math.pow(newClusterMean2[3]-queryData[i][3],2)+Math.pow(newClusterMean2[4]-queryData[i][4],2)+
           					Math.pow(newClusterMean2[5]-queryData[i][5],2)+Math.pow(newClusterMean2[6]-queryData[i][6],2)+Math.pow(newClusterMean2[7]-queryData[i][7],2)+
                    Math.pow(newClusterMean2[8]-queryData[i][8],2));

   //first check change and then add
   if(distance_to_cluster1>distance_to_cluster2){
      newCluster2.push(i);

       function checkChangeCluster2(cluster2) {
         return cluster2==i;
       }

       //console.log("hi here"+cluster1.find(checkChangeCluster1));
       if(cluster2.find(checkChangeCluster2)==i){

         change_cluster==true;
      }

  }//outer if



  if(distance_to_cluster1<distance_to_cluster2){
     newCluster1.push(i);

      function checkChangeCluster2(cluster2) {
        return cluster2==i;
      }

      //console.log("hi here"+cluster1.find(checkChangeCluster1));
      if(cluster1.find(checkChangeCluster2)==i){

        change_cluster==true;
     }

 }//outer if



}

cluster1=[];
cluster2=[];
cluster1=JSON.parse(JSON.stringify(newCluster1));
cluster2=JSON.parse(JSON.stringify(newCluster2));
//make a deep copy of new Cluster1 to cluster1 before clean it;
newCluster1=[];
newCluster2=[];


//need to add deep copy before clear;
}//while


console.log("cluster1"+cluster1);
console.log("cluster2"+cluster2);

var plotly = require('plotly')("bijiezhu", "ZskmtJqxRjjnsKigjWcn");



var data = [{x:[1,2], cluster2, type: 'bar'}];
var layout = {fileopt : "overwrite", filename : "simple-node-example"};

plotly.plot(data, layout, function (err, msg) {
	if (err) return console.log(err);
	console.log(msg);
  var open = require('open');

 open(msg.url);


//res.render("main",{msg:msg});
});


res.send("\n"+"cluster 1 is : "+"\n"+cluster1+"\n"+"cluster 2 is :"+"\n"+cluster2+"\n");

})



})

app.listen(3000, function(){
  console.log("Listening on port 3000")
})
