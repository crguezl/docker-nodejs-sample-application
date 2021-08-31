const db = require('../persistence');

module.exports = async (req, res) => {
    await db.updateItem(req.params.id, {
        name: req.body.name,
        completed: req.body.completed,
    });
    const item = await db.getItem(req.params.id);
    console.log(`PUT request. Updated item ${req.params.id}`);
    console.log(item);
    res.send(item);
};
