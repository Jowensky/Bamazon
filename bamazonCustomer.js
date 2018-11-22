var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;

  var query = connection.query("SELECT * FROM bamazon", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(`ID: ${res[i]. ID} | Product: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${res[i].price} | Stock: ${res[i].stock_quantity}`);
    }
    inquirer
      .prompt([
        {
          name: "id",
          message: "What is the (ID) of the item you would like to purchase?"
        }, 
        {
        name: "quanity",
        message: "What is the quanity you want to purchase"
        }
      ])
      .then(function(purchase) {
          var itemId = purchase.id
          var Cquanity = purchase.quanity
         
          var query = connection.query(`SELECT * FROM bamazon WHERE ID = ${itemId}`, function(err, res) {
                stock = res[0].stock_quantity
                price = res[0].price
            if (Cquanity > stock) {
                console.log("Insufficient quantity!")
                connection.end();
            } else {
                stockLeft = stock - Cquanity
                cost = price * Cquanity 
                var query = connection.query(`UPDATE bamazon SET stock_quantity = ${stockLeft} WHERE ID = ${itemId} `, function (err, res) {
                    console.log(`Your purchase have been made! 
                    Your total is: $${cost}`)
                    connection.end();
                })
            }
          })
          })
      });
  });

