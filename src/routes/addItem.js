const db = require('../persistence');
const uuid = require('uuid/v4');

module.exports = async (req, res) => {
    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
    };

    console.log(`addItem. POST request`);
    // console.log(req.body);
    console.log(item);
    await db.storeItem(item);
    res.send(item);
};
