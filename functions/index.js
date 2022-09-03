const functions = require('firebase-functions');
const { Webhook } = require('coinbase-commerce-node');
const {Client, resources} = require('coinbase-commerce-node');

const cors = require('cors')({origin:'*'});

Client.init('47cac6cf-d4fc-4cb9-b80f-7b13e7a7c1d3');



const { Charge } = resources;

exports.createCharge = functions.https.onRequest((req, res) => {
    
    cors(req ,res , async ()=>{
        // get real product data from database

        const chargeData = {
            name: 'Try-Fashion Payments',
            description: 'Pay the amount stated from our site. Contact Support incase of anything. ',
            pricing_type:'no_price'
        };

        const charge = await Charge.create(chargeData);
        console.log(charge);

        res.send(charge);

    });
});

exports.webhookHandler = functions.https.onRequest(async (req, res) => {
    const rawBody = req.rawBody;
    const signature = req.headers['x-cc-webhook-signature'];
    const webhookSecret = 'df34402c-7b7c-49ed-99f3-31a80e9d1a8b';

    try{
    const event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
    
    if (event.type === 'charge:pending'){
        //user paid but transaction not confirmed on blockchain yet

    }

    if (event.type === 'charge:confirmed'){
        //all good, charge confirmed
    }

    if (event.type === 'charge:failed'){
        //charge failed or expired
    }

    res.send(`success ${event.id}`);

    }catch(error){
        functions.logger.error(error);
        res.status(400).send('failed!');
    }

})