//Set account number
acc_num = "0"

//Define rest of month filter function
function rom(obj){
   var today = new Date()
   const trn_dt  = new Date(obj.date_next)
   return today.getUTCMonth() === trn_dt.getUTCMonth()
}

//Define accumulator function
function addTrn(total, trn) {
  return total + trn;
}

//Get USAA Checking Account Info
var accounts = JSON.parse(global('YNAB_ACCOUNTS'))
eval("var acc" + acc_num + " = accounts.data.accounts[" + acc_num + "]")

//Process Scheduled Transactions
var sch_trn_tot = JSON.parse(global('YNAB_SCHEDULED_TRANSACTIONS')).data.scheduled_transactions
eval("sch_trn_tot = sch_trn_tot.filter(obj => obj.account_id === acc" + acc_num + ".id)")
sch_trn_tot = sch_trn_tot.filter(rom)

if (sch_trn_tot.length === 0) {
    sch_trn_tot = 0
} else {
    sch_trn_tot = sch_trn_tot.map((x) => x.amount)
    sch_trn_tot = sch_trn_tot.reduce(addTrn)
}

// Form temp array
var arr_acc0 = [
Math.trunc((sch_trn_tot + eval("acc" + acc_num + ".balance"))/10)/100,
Math.trunc(eval("acc" + acc_num + ".balance")/10)/100,
Math.trunc(eval("acc" + acc_num + ".cleared_balance")/10)/100]

// Form Temp String in tmp variable
var str_acc0 = 'End of Month Estimate - $' + arr_acc0[0]
 + '\nWorking Balance - $' + arr_acc0[1]
 + '\nCleared Balance - $' + arr_acc0[2]

// Set individual variables
var acc0_mee = arr_acc0[0].toFixed(2)
var acc0_wb = arr_acc0[1].toFixed(2)
var acc0_cb = arr_acc0[2].toFixed(2)
