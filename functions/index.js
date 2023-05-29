const {https} = require("firebase-functions/v2");
const {fetch} = require("fetch");

exports.helloWorld = https.onRequest(async (request, response) => {
  try {
    const body = JSON.parse(request.body);
    const order = body.Order;
    const token = body.access_token;
    const catalog = JSON.parse(body.catalog);
    const items = catalog.items;
    const result = [];
    items.forEach((item) => {
      result.push({
        product_id: item.retailerId,
        price: item.price.amount,
        original_price: item.price.amount,
        quantity: item.quantity,
      });
    });

    const raw = JSON.stringify({
      "Order": {
        ...order, "ProductsSold": result},
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
      redirect: "follow",
    };
    let trayResult= await fetch(`https://octadeskchat.commercesuite.com.br/web_api/orders?access_token=${token}`, requestOptions);
    trayResult = await trayResult.text();

    response.send(trayResult);
  } catch (error) {
    response.send("deu ruim");
  }
},
);
