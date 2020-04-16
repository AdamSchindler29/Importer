const axios = require('axios');

async function fetchData(){
    let data;
    try {
        const response = await axios.get("https://prime.exchangerate-api.com/v5/218c74784e69efd198ea4f5b/latest/EUR");
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
    const conversion_rates = Object.keys(data.conversion_rates);
    const values = Object.values(data.conversion_rates);
    const base = data.base;
    let unixTimestamp = data.time_last_update;
    var date = new Date(unixTimestamp * 1000);
    var formattedDate = date.toISOString().split('T')[0]
    var now = new Date();
    var timeTs = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    var timeStamp = formattedDate  + " " + timeTs.join(":") + " ";

    console.log(unixTimestamp)
        //create the same line as in DB: insert into currency_rates (currency_name, base_currency, value, date) values ('CAD', 'EUR', 1.5265, '2020-04-09');

    for (let i = 0; i < conversion_rates.length; i++){
            const str = `insert into currency_rates (currency_name, base_currency, value, date, time_stamp) values ('${conversion_rates[i]}', '${base}', ${values[i]}, '${formattedDate}', '${timeStamp}')`;
            sql.push(str)
    }
    const stringSql = sql.join(" ; ")
    console.log(stringSql)
    connection.query(stringSql, function (err, result){
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

