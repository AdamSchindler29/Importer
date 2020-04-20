const axios = require('axios');

async function fetchData(){
    let data;
    try {
        const response = await axios.get("https://api.exchangeratesapi.io/latest");
        data = response.data;
    } catch (error) {
        console.error("There was an error fetching the data in main: ", error);
    }
    return data;
}

function connectToDb(){
    const Pool = require('pg').Pool
    const connection = new Pool({
      host: 'localhost',
      database: 'Adamsch',
      port: 5432,
    })
    return connection;
}

function insertIntoDb(connection, data){
    let sql=[];
    // console.log(data);
    const conversion_rates = JSON.stringify(data.rates);
    const base = data.base;
    var date = data.date;
    console.log(data.rates)
    // var now = new Date();
    // var timeTs = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    // var timeStamp = date  + " " + timeTs.join(":") + " ";

        //create the same line as in DB: insert into currency_rates (currency_name, base_currency, value, date) values ('CAD', 'EUR', 1.5265, '2020-04-09');

    // for (let i = 0; i < conversion_rates.length; i++){
    //     const str = `insert into currency_rates (rates, base, date) values ('{"${conversion_rates[i]}": ${conversion_values[i]}}', '${base}', '${date}')`
    //     sql.push(str)
    // }
    const str = `delete from currency_rates where rates is not null; insert into currency_rates (rates, base, date) values ('${conversion_rates}', '${base}', '${date}')`
    
    // const stringSql = sql.join("; ")
    // // console.log(stringSql)
    // // const deletePrevious = `delete from currency_rates where rates is not null; 
    console.log(str)
 
    // console.log(stringSql)
    
    // const returnStringSql = deletePrevious + sql;
    // console.log(returnStringSql)
    
    connection.query(str, function (err, result){
        console.log("1 record inserted");
    })
}


async function main (){
    // step 1: Fetch 3rd party data: axios - return the data
    const data = await fetchData()
    // step 2: Connect to database: return a connection (pool shit)
    const connection = connectToDb()
    // // step 3: Insert into database: take as parameters data - result of function 1 goes into function 3
    insertIntoDb(connection, data)
}

main()

