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
    const rates = Object.keys(data.rates);
    const values = Object.values(data.rates);
    const base = data.base;
    const date = data.date;
    
        //create the same line as in DB: insert into currency_rates (currency_name, base_currency, value, date) values ('CAD', 'EUR', 1.5265, '2020-04-09');

    for (let i = 0; i < rates.length; i++){
            const str = `insert into currency_rates (currency_name, base_currency, value, date) values ('${rates[i]}', '${base}', ${values[i]}, '${date}')`;
            sql.push(str)
    }
    const stringSql = sql.join(" ; ")
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

