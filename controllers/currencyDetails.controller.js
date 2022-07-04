const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
});

class AccountDetails {
    constructor (
        currency,conversion,
        field1 = '', field1Value = '',
        field2 = '', field2Value = '',
        field3 = '', field3Value = '',
        field4 = '', field4Value = '',
        field5 = '', field5Value = '',
        field6 = '', field6Value = '') {

        this.currency = currency;
        this.conversion = conversion;
        this[field1] = field1Value;
        this[field2] = field2Value;
        this[field3] = field3Value;
        this[field4] = field4Value;
        this[field5] = field5Value;
        this[field6] = field6Value;
    }
}

module.exports.fetchCurrencyList = async (req, res) => {
        await doc.loadInfo();

        // Selecting Sheet Currency
        const sheet = doc.sheetsByIndex[1];

        // Fetch Information
        const rows = await sheet.getRows();

        let details = [];

        let filter = (data) => {
            return data? data: undefined
        }

        rows.forEach(rowData => {
            let row = rowData._rawData;
            details.push(new AccountDetails(
                filter(row[1]),  filter(row[2]),
                filter(row[3]),  filter(row[4]),
                filter(row[5]),  filter(row[6]),
                filter(row[7]),  filter(row[8]),
                filter(row[9]),  filter(row[10]),
                filter(row[11]), filter(row[12]),
                filter(row[13]), filter(row[14])
                ))
        })

        // Removing blank Entry
        Object.keys(details).forEach(key => {
            Object.keys(details[key]).forEach(entry => {
                if(entry == '') {
                    delete details[key][entry];
                }
            })
        })

        res.status(200).json({
            status: true,
            error:  null,
            data: details
        })
    }

