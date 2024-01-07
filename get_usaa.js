/*******************************************************************************
 * get_usaa.js
 * 
 * This is a script that parses a YNAB json file from its REST API and parses
 * It for specific information. These key information are then saved in
 * variables and passed to to KWGT for display in homescreen widgets.
 * ****************************************************************************/

// Set account number
acc_num = "0"

// Define rest of month filter function
function rom(obj){
   var today = new Date()
   const trn_dt  = new Date(obj.date_next)
   return today.getUTCMonth() === trn_dt.getUTCMonth()
}

// Define accumulator function
function addTrn(total, trn) {
  return total + trn;
}

// Parse account info and save it to a variable
var accounts = JSON.parse(global('YNAB_ACCOUNTS'))
eval("var acc" + acc_num + " = accounts.data.accounts[" + acc_num + "]")

// Parse scheduled transactions and filter it to the rest of month
var sch_trn_tot = JSON.parse(global('YNAB_SCHEDULED_TRANSACTIONS')).data.scheduled_transactions
eval("sch_trn_tot = sch_trn_tot.filter(obj => obj.account_id === acc" + acc_num + ".id)")
sch_trn_tot = sch_trn_tot.filter(rom)

// Derive the rest of month total for scheduled transactions
if (sch_trn_tot.length === 0) {
    sch_trn_tot = 0
} else {
    sch_trn_tot = sch_trn_tot.map((x) => x.amount)
    sch_trn_tot = sch_trn_tot.reduce(addTrn)
}

// Calculate the End of Month Estimate, Working Balance, and Cleared Balance
// and put it in an array
var arr_acc0 = [
Math.trunc((sch_trn_tot + eval("acc" + acc_num + ".balance"))/10)/100,
Math.trunc(eval("acc" + acc_num + ".balance")/10)/100,
Math.trunc(eval("acc" + acc_num + ".cleared_balance")/10)/100]

// Form a summary string
var str_acc0 = 'End of Month Estimate - $' + arr_acc0[0]
 + '\nWorking Balance - $' + arr_acc0[1]
 + '\nCleared Balance - $' + arr_acc0[2]

// Set individual variables to be sent to KWGT
var acc0_mee = arr_acc0[0].toFixed(2)
var acc0_wb = arr_acc0[1].toFixed(2)
var acc0_cb = arr_acc0[2].toFixed(2)
