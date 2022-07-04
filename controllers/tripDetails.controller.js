const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
});

class TripDetails {
    constructor(detailsEntry) {
        this.tripID         =   detailsEntry[0] || '';
        this.tripName       =   detailsEntry[1] || '';
        this.departureDate  =   detailsEntry[2] || '';
        this.time           =   detailsEntry[3] || '';
        this.location       =   detailsEntry[4] || '';
        this.imagePath      =   detailsEntry[5] || '';
        this.twinSharing    =   detailsEntry[6] || '';
        this.singleSharing  =   detailsEntry[7] || '';
        this.paxAvailable   =   detailsEntry[8] || '';
        this.advanceAmount  =   detailsEntry[9] || '';
    }
}

module.exports.fetchTripDetails = async (req, res) => {

    if(req.body.tripId) {
        await doc.loadInfo();

        // Selecting Sheet Price-Inventory
        const sheet = doc.sheetsByIndex[0];

        const rows = await sheet.getRows();
        let responseValues = {};
    
        for(let index = 0; index < rows.length ; index++) {
            let row = rows[index];
            let tripId = row._rawData[0];
            if(tripId == req.body.tripId) {
                responseValues = row._rawData;
                break;
            }
        }
        let details = new TripDetails(responseValues)
        res.status(200).json({
            status: true,
            error:  null,
            data: details
        })
    } else {
        res.status(400).json({
            status: false,
            error: "No Trip ID Provided",
            data: null
        })
    }

}

