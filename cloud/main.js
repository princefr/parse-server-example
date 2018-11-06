var stripe = require('stripe')(process.env.STRIPE_API_KEY);
var geocoder = require('geocoder');

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});



function GetBalanceOfTheConnectedAccount(account){
  return new Promise(function(resolve, reject){
   stripe.balance.retrieve({
    stripe_account: account
  }, function(err, balance) {
    if(err){
    reject(err)
    }else{
     resolve(balance)
    }
  })
 })
}


Parse.Cloud.define("GetProduct", function(req, res){
  return {title: "Nutella", barcode: req.params.barcode, description: "Pot de nutella de 500G", imgUrl: "https://products-images.di-static.com/image/base/9782263060632-475x500-1.jpg", price: Math.floor(10 + Math.random() * 90), quantity: 1}
})


Parse.Cloud.define("UpQuantityProduct", function(req, res) {
  // description, barcode, imgUrl, price, quantity, title, createdAt, updateAt, cardID
  var Productsquery = new Parse.Query("ProductsInCarts")
  // status,  storeId, total, transactionID, objectID, updateAt, createdAt
  var Cartsquery = new Parse.Query("Carts")
  Productsquery.get(req.params.productId).then(function(products){
    Cartsquery.get(results.get("cardID")).then(function(carts){

    })
  })

})


Parse.Cloud.define("DownQuantityProduct", function(req, res){
  var Productsquery = new Parse.Query("Products")
  var Cartsquery = new Parse.Query("Carts")
  Productsquery.get(req.params.productId).then(function(products){
    Cartsquery.get(results.get("cardID")).then(function(carts){

    })
  })
})


Parse.Cloud.define("RetrieveBalance", function(req, res){
  return GetBalanceOfTheConnectedAccount(req.params.account).then(function(results){
    res.success(results)
  }, function(err){
    res.error(err)
  })
})


Parse.Cloud.define("ephemeralKeys", function(req, res) {
    return stripe.ephemeralKeys.create({customer: req.params.customer}, {stripe_version: req.params.apiVersion, api_key: process.env.customer}).then(function(key){
      res.success(key)
    }).catch(function(err){
      res.error(err)
    })
})



function createExTernalAccount(account, country, account_number, currency, account_holder_name){
  return new Promise(function(resolve, reject){
    stripe.accounts.createExternalAccount(
    account,
    { external_account: {
     object: "bank_account",
     country: country,
     account_number: account_number,
     currency: currency,
     account_holder_name: account_holder_name
    }},
    function(err, bank_account) {
      if(err){
        reject(err)
      }else{
        resolve(bank_account)
      }
    }
  );
  })
}



  Parse.Cloud.define("createExternalAccount", function(req, res){
    return createExTernalAccount(req.params.account, req.params.country, req.params.account_number, req.params.currency, req.params.account_holder_name).then(function(results){
      res.success(results)
    }, function(err){
      res.error(err)
    })
  })



  function MakePayout(account, amount, currency){
    return new Promise(function(resolve, reject){
      stripe.payouts.create({
        amount: amount,
        currency: currency,
      }, {
        stripe_account: account,
      }).then(function(payout) {
        resolve(payout)
      }, function(err){
        reject(err)
      });
     })
  }


 Parse.Cloud.define("MakePayout", function(req, res){
   return MakePayout(req.params.account, req.params.amount, req.params.currency).then(function(results){
    res.success(results)
   }, function(err){
    res.error(err)
   })

 })





Parse.Cloud.job("activate_rating", function(req, status){
  console.log("bravouuuu je suis la ")
})

Parse.Cloud.define("getlocation", function(req, res){
  console.log(req.params.adresse)
    return geocoder.geocode(req.params.adresse, function ( err, data ) {
      if(err){
        res.error(err)
      }else{
        res.success(data)
      }
  });
})


Parse.Cloud.define("createStripeCustomer", function(req, res){
  return createStripeCustomer(req.params.email).then(function(results){
    res.success(results)
    }, function(err){
      res.error(err)
  })
})



function PayWithStripe(amount, currency, customer){
  return new Promise(function(resolve, reject){
      stripe.charges.create({
      amount: amount,
      currency: currency,
      customer: customer, // obtained with Stripe.js
      description: "Charge for joshua.thompson@example.com"
    }, function(err, charge) {
      if(err){
      reject(err)
      }else{
      resolve(charge)
      }
    });
  })
}


Parse.Cloud.define("PayWithStripe", function(req, res){
  var query = new Parse.Query("Ventes")
  query.get(req.params.id).then(function(results){
    console.log(results)
    if(results.get("Quantite") == 0){
      res.error("il n'ya plus rien")
    }else if(results.get("Quantite") < req.params.quantite){
      res.error("il ne reste plus que" + " " + results.get("Quantite"))
    }else{
     return PayWithStripe(req.params.amount, "eur", req.params.customer).then(function(payment){
        results.increment("Quantite", - parseInt(req.params.quantite))
        results.increment("NotifCount", +1)
        results.save().then(function(results){
           res.success(payment)
        })
      }, function(err){
      res.error(err)
     })
    }
  })
})


function createStripeCustomer(email){
  return new Promise(function(resolve, reject){
    stripe.customers.create({
    email: email
  }, function(err, customer) {
    if(err){
      reject(err)
    }else{
     resolve(customer)
    }
  });
  })
}


function retrieveSteripeCustomer(id){
  return new Promise(function(resolve, reject){
    stripe.customers.retrieve(
    id,
    function(err, customer) {
      if(err){
        reject(err)
      }else{
        resolve(customer)
      }
    }
  );
  })
}


function updateStripeCustomer(id){
  return new Promise(function(resolve, reject){
      stripe.customers.update(id, {
      description: "Customer for mia.jackson@example.com"
    }, function(err, customer) {
        if(err){
        reject(err)
        }else{
        resolve(customer)
        }
    });
  })
}


function deleteStripeCustomer(id){
  return new Promise(function(resolve, reject){
      stripe.customers.del(
      id,
      function(err, confirmation) {
        if(err){
          reject(err)
        }else{
        resolve(confirmation)
        }
      }
    );
  })
}


function listAllStripeCustomer(limit,starting_after){
  return new Promise(function(resolve, reject){
  stripe.customers.list(
  { limit: limit ,  starting_after: starting_after},
  function(err, customers) {
    // asynchronously called
  }
);
  })
}


function createStripePayout(amount){
  return new Promise(function(resolve, reject){
    stripe.payouts.create({
      amount: amount,
      currency: "eur"
    }, function(err, payout) {
      // asynchronously called
    });
  })
}


function retrieveAllStripePayout(){
  return new Promise(function(resolve, reject){
    stripe.payouts.list(
    { limit: 3 },
    function(err, payouts) {
      // asynchronously called
    }
  );
  })
}


function createStripeRefound(charge){
  return new Promise(function(resolve, reject){
    stripe.refunds.create({
    charge: charge
  }, function(err, refund) {
    // asynchronously called
  });
  })
}


function updateStripeRefound(){
  return new Promise(function(resolve, reject){
    stripe.refund.update(
    "re_1BUt25F9cRDonA7m8D1vAaNT",
    { metadata: { order_id: "6735"} },
    function(err, refund) {
      // asynchronously called
    }
  );
  })
}


function listAllStripeRefound(limit, starting_after){
  return new Promise(function(resolve, reject){
  stripe.refunds.list(
  { limit: limit, starting_after: starting_after },
  function(err, refunds) {
    // asynchronously called
  }
);
  })
}



function addStripeCreditCard(customer, number, exp_month, exp_year, cvc, name){
  return new Promise(function(resolve, reject){
    stripe.customers.createSource(
      customer,
      { source: {
        number: number,
        object: "card",
        exp_month: exp_month,
        exp_year: exp_year,
        cvc: cvc,
        name: name
      } },
      function(err, card) {
        if(err){
          reject(err)
        }else{
        resolve(card)
        }
      }
    );
  })
}


function getAllCustomerCards(customer){
  return new Promise(function(resolve, reject){
     stripe.customers.listCards(customer, function(err, cards) {
        if(err){
        reject(err)
        }else{
        resolve(cards)
        }
    });
  })
}


function deleteStripeCustomerCard(customer, card){
  return new Promise(function(resolve, reject){
      stripe.customers.deleteCard(
      customer,
      card,
      function(err, confirmation) {
        if(err){
          reject(err)
        }else{
        resolve(confirmation)
        }
      }
    );
  })
}


function createStripeAccount(country, email, type){
  console.log("ok i'm in the create function" + " " + country + " " + email + " " + type)
   return new Promise(function(resolve, reject){
       stripe.accounts.create({
        type: type,
        country: country,
        email: email
      }).then(function(results){
        resolve(results)
      }, function(err){
         reject(err)
       });
    })
}


Parse.Cloud.define("CreateStripe", function(req, res){
  return createStripeAccount(req.params.country, req.params.email, req.params.way).then(function(results){
    res.success(results)
  }, function(err){
    res.error(err)
  })
})


function deleteStripeAccount(account){
  return new Promise(function(resolve, reject){
  stripe.accounts.del(account)
  })
}


function rejectStripeAccount(reason, accountholder){
  return new Promise(function(resolve, reject){
      stripe.accounts.reject(accountholder, {reason: reason}, function(err, account) {
        if(err){
          reject(err)
        }else{
          resolve(account)
        }
    });
  })
}


function updateStripeAccount(){
  return new Promise(function(resolve, reject){
    stripe.accounts.update("acct_1623aEF9cRDonA7m", {
      support_phone: "555-867-5309"
    })
  })
}


function listAllConnectedAccount(limit, starting_after){
  return new Promise(function(resolve, reject){
    stripe.accounts.list(
      { limit: limit, starting_after: starting_after },
      function(err, accounts) {
        if(err){
          reject(err)
        }else{
        resolve(accounts)
        }
      }
    );
  })
}


function transfertMoney(amount, currency, account){
  return new Promise(function(resolve, reject){
    stripe.transfers.create({
    amount: amount,
    currency: currency,
    destination: account,
  }, function(err, transfer) {
    if(err){
    reject(err)
    }else{
      resolve(transfer)
    }
  });
  })
}



Parse.Cloud.define("Transfer", function(req, res){
  return transfertMoney(req.params.amount, req.params.currency, req.params.account).then(function(results){
    res.success(results)
  }, function(err){
    res.error(err)
  })
})
