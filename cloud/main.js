var stripe = require('stripe')(process.env.STRIPE_API_KEY);

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});


Parse.Cloud.define("createStripeCustomer", function(req, res){
console.log(JSON.stringify(req))
})



function PayWithStripe(){
  return new Promise(function(resolve, reject){
  
  })
}


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


function createStripeAccount(country, email){
  return new Promise(function(resolve, reject){
      stripe.accounts.create({
      type: 'standard',
      country: country,
      email: email
    }, function(err, account) {
      if(err){
      reject(err)
      }else{
      resolve(account)
      }
    });
  })
}


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


function transfertMoney(){
  return new Promise(function(resolve, reject){
  
  })
}


