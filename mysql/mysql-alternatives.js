import csv from "csvtojson";

async function importCsvFile() {
    // test different in ms speed between csvtojson and fast-csv

    // return new Promise((resolve, reject) => {
    return csv({
        delimiter: ",",
        noheader: false,
    }).fromFile(filePath).subscribe((jsonObj) => {
        return jsonObj
        //     if(jsonObj){
        //     resolve(jsonObj)
        //     } else {
        //         reject(jsonObj)
        //     }
    })
    // }) // Promise

    // let stream = fs.createReadStream(csvFilePath);
    //
    // let csvStream = await fastcsv.parse()
    //     .on("data", function(data) {
    //         // console.log(data)
    //         csvData.push(data);
    //
    //     })
    //     .on("end", function() {
    //         // remove the first line: header
    //         csvData.shift();
    //
    //         // connect to the MySQL database
    //         // save csvData
    //     });
    // stream.pipe(csvStream);
}

export function ObjToArray(obj) {
    let arr = obj instanceof Array;
    return (arr ? obj : Object.keys(obj)).map(function (i) {
        let val = arr ? i : obj[i];
        if (typeof val === 'object')
            return ObjToArray(val);
        else
            return val;
    });
}