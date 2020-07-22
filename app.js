const express = require('express');
const mongoose = require('mongoose');
const {
    response
} = require('express');
const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://testuser:test12345@cluster0.3mpbf.mongodb.net/bankapi', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection is successfull');
}).catch(err => console.error("Connection failed", err));


const bankAccounts = new mongoose.Schema({
    cardNumber: String,
    holder: String,
    expireDate: String,
    cvc: Number,
    balance: Number,
    currency: String
});

const transaction = new mongoose.Schema({
    cardNumber: String,
    holder: String,
    expireDate: String,
    cvc: Number,
    amounttopay: Number,
    transfernumber: String,
    date: Date
});

const BankAccount = mongoose.model('accounts', bankAccounts);
const TransactionLog = mongoose.model('transaction', transaction)


async function createAccount(cardnumber, cardholder, expiredate, cvc, balance, currency) {

    let backAccount = new BankAccount({
        cardNumber: cardnumber,
        holder: cardholder,
        expireDate: expiredate,
        cvc: cvc,
        balance: balance,
        currency: currency
    })
    backAccount.save();
    return backAccount;

};

async function getAccountData(findquery, selectquery) {
    const accountCard = await BankAccount.find(findquery).select(selectquery);
    return accountCard;
}

async function updateAnmount(account, ammount) {

    const updateAmount = await BankAccount.findByIdAndUpdate({
        _id: account[0]._id
    }, {
        $set: {
            balance: ammount
        },
    }, {
        new: true
    });

    console.log(updateAmount);
}

async function amountTransaction(senderCARD, senderCVC, senderEXPIREDATE, senderHOLDER, recevierCARD, payAmount) {

    const senderData = await getAccountData({
        cardNumber: senderCARD
    }, "cvc expireDate holder balance");

    const recevierData = await getAccountData({
        cardNumber: recevierCARD
    }, "");



    if (senderData.length > 0 && recevierData.length > 0) {
        if (senderData[0].cvc == senderCVC && senderData[0].expireDate == senderEXPIREDATE && senderData[0].holder == senderHOLDER) {
            const senderTransact = parseFloat(senderData[0].balance) - parseFloat(payAmount);
            const recevierTransact = parseFloat(recevierData[0].balance) + parseFloat(payAmount);
            updateAnmount(senderData, senderTransact);
            updateAnmount(recevierData, recevierTransact);

            ///transctProccess();
        } else {
            console.log("card deatils is not correct");
        }


    } else {
        console.log("some of the cards not find in db");
        return;
    }
}

app.get("/", async (req, res) => {
    res.send("Bank API")
})

app.put('/api/transact', async (req, res) => {
    let final = await amountTransaction(req.body.sender, req.body.carcvc, req.body.date, req.body.holder, req.body.recevier, req.body.pay);
    res.send(final);
});


app.post("/api/create", async (req, res) => {

    let cardNumber = req.body.cardnumber;
    let cardCvc = req.body.cvc;
    let expireDate = req.body.date;
    let cardHolder = req.body.holder;
    let balance = 0;
    let cardCurrency = "AZN";

    let newaccount = await createAccount(cardNumber, cardHolder, expireDate, cardCvc, balance, cardCurrency);
    res.send(newaccount);

});



const serverPort = 80;
app.listen(serverPort, () => {
    console.log("Server is started");
});

//getAccount("2345-3456-6543", "777", "12.01.2021");
//getAccountData("2345-3456-6543", "");
//amountTransaction("2345-3456-6543", "", "", "", "5345-5356-3513")
//amountTransaction();

//amountTransaction("2345-3456-6543", "777", "12.01.2021", "Bahram Bayramli", "5345-5356-3513", "15")