const db = require('../persistence');

module.exports = async (req, res) => {
    const items = await db.getItems();
    console.log(`GET request`);
    console.log(items);
    res.send(items);
};
