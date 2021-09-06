const express = require('express');
const app = express();
const csvFilePath= 'gwpByCountry.csv';
const csv=require('csvtojson') 
app.use(express.json());
let results = [];
async function convert (){
    const ans =  await csv().fromFile(csvFilePath)
    results = ans;
}
convert();
app.post("/api/gwp/avg/",(req,res)=>{
    const ctry = req.body.country;
    const lob = req.body.lob;
    const filteredByCtry = results.filter((result)=>{
        return result.country === ctry;
    });
    let obj = {};
    lob.forEach((x)=>{
        let arr = filteredByCtry.filter((y)=>{
            return y.lineOfBusiness === x;
        })
        let valarr = [];
        valarr.push(arr[0].Y2008,arr[0].Y2009,arr[0].Y2010,arr[0].Y2011,arr[0].Y2012,arr[0].Y2013,arr[0].Y2014,arr[0].Y2015);
        let avg;
        let sum = valarr.reduce((curr,val)=>{
            if(val.length === 0) return curr;
            return curr+parseFloat(val);
        },0.0);
        avg = sum/8;
        console.log(avg);
        obj[x] = avg;
    })
    res.send(obj);
});
app.listen(9091,()=>{
    console.log("listening to 9091");
});