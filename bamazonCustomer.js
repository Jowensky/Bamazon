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
      console.log(res[i]);
    }
    inquirer
      .prompt([
        {
          name: "id",
          message: "What is the (ID) of the item you would like to purchase?"
        },
        {
          name: "amount",
          message: "What is the quanity of you purchase?"
        }
      ])
      .then(function(purchase) {
        var id = purchase.id
        var amount = purchase.amount
      });
  });
  connection.end();
});
