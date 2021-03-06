//  Required Packages
var mySql = require("mysql");
var inquirer = require("inquirer");

var connection = mySql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "82791997Ak",
    database: "bamazon"
});

//  Establish connection to server
connection.connect(function(err) {
    if(err) throw err;
    console.log("connected as id "+ connection.threadId+ "\n");
    displayProducts();
})

//  Then display the products
var displayProducts = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        console.log("Welcome to Bamazon!\n"+
        "type in a product to buy the item\n"
        );
        for(var i=0; i < res.length; i++) {
            console.log(
                "------------------------------------------\n"+
                "Product Name: "+ res[i].product_name+ "\n"+
                "Product ID: "+ res[i].item_id+ "\n"+
                "Department: "+ res[i].department_name+ "\n"+
                "Price: $"+ res[i].price
            );
        }
        promptUser();
    })
}

// then ask user to purchase an item
var promptUser = function() {
    inquirer.prompt([
        {
            message: "please enter the id you want to buy.",
            name: "id"
        },
        {
            message: "please choose the quantity",
            name: "quantity"
        }
    ]).then(function(res) {
        searchProduct(res.id, res.quantity);
    })
}

var searchProduct = function(id, quantityReq) {
    connection.query("SELECT * FROM products WHERE ?", {item_id: id}, function(err, res) {
        if(err) throw err;
        var productObj = res[0];
        quantityReq = parseInt(quantityReq); // will work without this line but it helps keep the data type uniform

        if(res[0].stock_quantity - quantityReq < 0) {
            console.log("sorry we dont have enough of "+ res[0].product_name);
            if(res[0].stock_quantity > 0) {
                console.log("try ordering less of this item. we have "+res[0].stock_quantity+ " of this left.");
            } else {
                console.log("were completely out of this item. we will restock soon, sorry for the inconvience.");
            }
        } else {
            var total = quantityReq * res[0].price;
            inquirer.prompt([
                {
                    type: "confirm",
                    message: "The total cost of your is $"+ total+ ".\n Are you sure you want to make this purchase?\n",
                    name: "confirmPurchase"
                }
            ]).then(function(res) {
                if(res.confirmPurchase){
                    processTransaction(productObj, quantityReq);
                    console.log(productObj);
                }
            })
        }
    });
}
var processTransaction = function(obj,float) {

    var newStock = obj.stock_quantity - float;
    var objId = obj.item_id;
    var sql = "UPDATE products SET ? WHERE ?";
    connection.query(sql, [{stock_quantity: newStock}, {item_id: objId}], function (error, results, fields) {
        if (error) throw error;
        console.clear();
        //console.log(results);
        console.log("------------TRANSACTION RECEIPT-----------\n");
        console.log("Product name: "+ obj.product_name+"\n"+
                    "Product ID: "+ obj.item_id+ "\n"+
                    "Price per unit: "+ obj.price+ "\n"+
                    "Quantity: "+ float+ ".......Total: "+ obj.price * float
        )
      });

}