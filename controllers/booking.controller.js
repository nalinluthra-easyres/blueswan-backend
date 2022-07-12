const uniqid = require('uniqid')
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);


doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
});

module.exports.bookTrip = async (req,res) => {
    try {
        // Get a unique ID to map details properly
        const bookingId = uniqid();

        // Load the Booking Sheet
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[2];

        // Setting the header for proper update of the entries
        await sheet.loadHeaderRow(2);

        let BookingDate = new Date();

        let dateArray = req.body.departureDate.split("-");
        let DepartureDate = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
        
        let responseMessage = '';

        DepartureDate.setMonth(DepartureDate.getMonth() - 3);

        if(req.body.payment.paymentType === 'Tour Deposit') {
            responseMessage = "We have recorded your intent of depositing an amount of " + 
            req.body.payment.currency + " " + req.body.payment.paidAmount + 
            " , into our bank account. We shall monitor the credit of this transaction and reach out to you on confirmation. Once the payment has been traced, it would ensure that " + 
            req.body.numberOfAdults + " seat/ seats has been reserved for you on the tour. The balance payment should be done or before " 
            + DepartureDate.toLocaleDateString() + " , i.e. 3 months before departure date. "
        } else {
            responseMessage = "We have recorded your intent of depositing an amount of " + 
            req.body.payment.currency + " " + req.body.payment.paidAmount + 
            " , into our bank account. We shall monitor the credit of this transaction and reach out to you on confirmation. Once the payment has been traced, it would confirm for " +
            req.body.numberOfAdults + " pax on the tour."
        }
        
        

        await sheet.addRow({
                "Booking ID" : bookingId, 
                "Booking Creation Date/Time": BookingDate,
                "Trip ID": req.body.tripId,
                "Trip Name": req.body.tripName,
                "Departure Date (mm-dd-yyyy)": req.body.departureDate,
                "Number of Adults": req.body.numberOfAdults,
                "Name": req.body.contact.name,
                "Email ID" : req.body.contact.email,
                "Mobile": req.body.contact.mobile,
                "Address": req.body.contact.address,
                "Currency Chosen": req.body.payment.currency,
                "Booking Type": req.body.payment.bookingType,
                "Mode of Payment": req.body.payment.modePayment,
                "Payment Type": req.body.payment.paymentType,
                "Paid Amount": req.body.payment.paidAmount
            })

        for(index = 0; index < req.body.guestList.length; index++) {
            const guestDetails = req.body.guestList[index];
            await sheet.addRow({
                "Booking ID" : bookingId,
                "First Name": guestDetails.firstName,
                "Last Name": guestDetails.lastName,
                "Date of Birth (MM-DD-YYYY)": guestDetails.dob,
                "Gender": guestDetails.gender,
                "Room Occupancy": guestDetails.roomOccupancy,
                "Sharing Room With": guestDetails.sharingRoomWith,
                "Type of Bed": guestDetails.typeOfBed,
                "Price": guestDetails.price,
                "Special Dietary Requirements": guestDetails.specialDietaryRequirements,
                "Medical Condition": guestDetails.medicalCondition            
            })
        }

        res.status(200).json({
            status: true,
            message: responseMessage
        })
    } catch(e) {
        console.log(e)
        res.status(200).json({
            status: false,
            error: e,
            message : 'Internal System Error Please try again Later'
        })
    }
    
}

module.exports.requestCallBack = async (req, res) => {

    try {
        const bookingId = uniqid();

        // Load the Booking Sheet
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[2];

        // Setting the header for proper update of the entries
        await sheet.loadHeaderRow(2);

        await sheet.addRow({
            "Booking ID" : bookingId,
            "Booking Creation Date/Time": new Date(),
            "Trip ID": req.body.tripId,
            "Trip Name": req.body.tripName,
            "Departure Date (mm-dd-yyyy)": req.body.departureDate,
            "Number of Adults": req.body.numberOfAdults,
            "Name": req.body.contact.name,
            "Email ID" : req.body.contact.email,
            "Mobile": req.body.contact.mobile,
            "Address": req.body.contact.address,
            "Booking Type": req.body.payment.bookingType
        })

        res.status(200).json({
            status: true,
            message: 'Your interest for the above trip for ' + req.body.numberOfAdults + ' has been captured, and we will revert to you shortly. The email ID noted is: ' + req.body.contact.email + ' and you can expect a call back from us on ' + req.body.contact.mobile + ' in the next 24 hrs.'
        })
    } catch (e) {
        res.status(200).json({
            status: false,
            message : 'Internal System Error Please try again Later'
        })
    }
    


}