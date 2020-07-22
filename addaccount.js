// class Bank {

//     getAccountData = async function (cardnumber, selectquery) {
//         const accountCard = await BankAccount.find({
//             cardNumber: cardnumber
//         }).select(selectquery);
//         return accountCard;
//     }
//     updateAnmount = async function (account, ammount) {

//         const updateAmount = await BankAccount.findByIdAndUpdate({
//             _id: account[0]._id
//         }, {
//             $set: {
//                 balance: ammount
//             },
//         }, {
//             new: true
//         });

//         console.log(updateAmount);
//     }
//     amountTransaction = async function (senderCARD, senderCVC, senderEXPIREDATE, senderHOLDER, recevierCARD, payAmount) {

//         const senderData = await this.getAccountData(senderCARD, "cvc expireDate holder balance");
//         const recevierData = await this.getAccountData(recevierCARD, "");

//         if (senderData.length > 0 && recevierData.length > 0) {
//             if (senderData[0].cvc == senderCVC && senderData[0].expireDate == senderEXPIREDATE && senderData[0].holder == senderHOLDER) {
//                 const senderTransact = parseFloat(senderData[0].balance) - parseFloat(payAmount);
//                 const recevierTransact = parseFloat(senderData[0].balance) + parseFloat(payAmount);
//                 this.updateAnmount(senderData, senderTransact);
//                 this.updateAnmount(recevierData, recevierTransact);
//             } else {
//                 console.log("card deatils is not correct");
//             }


//         } else {
//             console.log("some of the cards not find in db");
//             return;
//         }
//     }
// };

// module.exports = Bank;