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
  // inquire grabs from database based on chioce parameter
  inquirer
    .prompt([
      {
        name: "Manage",
        type: "rawlist",
        message: "What task to you want to complete?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      }
    ])
    .then(function(answer) {
      var manage = answer.Manage;
      if (manage === "View Products for Sale") {
        viewProducts();
      } else if (manage === "View Low Inventory") {
        lowInventory();
      } else if (manage === "Add to Inventory") {
        addInventory();
      } else if (manage === "Add New Product") {
        newProduct();
      }
    });
});

function viewProducts() {
  var query = connection.query("SELECT * FROM bamazon", function(err, res) {
    if (err) throw err;
    // select all from database
    for (var i = 0; i < res.length; i++) {
      console.log(
        `ID: ${res[i].ID} | Product: ${res[i].product_name} | Department: ${
          res[i].department_name
        } | Price: ${res[i].price} | Stock: ${res[i].stock_quantity}`
      );
    }
    connection.end();
  });
}

function lowInventory() {
  var query = connection.query(
    `SELECT * FROM bamazon WHERE stock_quantity > 200`,
    function(err, res) {
      if (err) throw err;
      for (var prod in res) {
        console.log(
          `ID: ${res[prod].ID} | Product: ${
            res[prod].product_name
          } | Department: ${res[prod].department_name} | Price: ${
            res[prod].price
          } | Stock: ${res[prod].stock_quantity}`
        );
      }
      connection.end();
    }
  );
}

function addInventory() {
  var query = connection.query(`SELECT * FROM bamazon`, function(err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "ID",
          message: "What is the [ID] of the Item you would like to add to?"
        },
        {
          name: "Add",
          message: "What is the amount you would like to add?"
        }
      ])
      .then(function(answer) {
        var query = connection.query(
          `UPDATE bamazon SET ? WHERE ?`,
          [
            {
              stock_quantity: answer.Add
            },
            {
              ID: answer.ID
            }
          ],
          function(err) {
            if (err) throw err;
            console.log(`Stock Updated!`);
            connection.end();
          }
        );
      });
  });
}

function newProduct() {
  var query = connection.query(`SELECT * FROM bamazon`, function(err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "Name",
          message: "What is the name of the product your adding?"
        },
        {
          name: "Department",
          message: "What is the department?"
        },
        {
          name: "Price",
          message: "What is the price?"
        },
        {
          name: "Stock",
          message: "What is the stock inventory?"
        }
      ])
      .then(function(answer) {
        var query = connection.query(
          `INSERT INTO bamazon SET ?`,
          [
            {
              product_name: answer.Name,
              stock_quantity: answer.Stock,
              department_name: answer.Department,
              price: answer.Price
            }
          ],
          function(err) {
            if (err) throw err;
            console.log(`New Item Inserted!`);
            connection.end();
          }
        );
      });
  });
}
