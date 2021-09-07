const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';

let db, dbAll, dbRun;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((res, rej) => {
        db = new sqlite3.Database(location, err => {
            if (err) return rej(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            db.run(
                'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
                (err, result) => {
                    if (err) return rej(err);
                    res();
                },
            );
        });
    });
}

async function teardown() {
    return new Promise((res, rej) => {
        db.close(err => {
            if (err) rej(err);
            else res();
        });
    });
}

async function getItems() {
    return new Promise((res, rej) => {
        db.all('SELECT * FROM todo_items', (err, rows) => {
            if (err) return rej(err);
            res(
                rows.map(item => // https://stackoverflow.com/questions/843780/store-boolean-value-in-sqlite
                    Object.assign({}, item, { //SQLite does not have a separate Boolean storage class. Instead, Boolean values are stored as integers 0 (false) and 1 (true).
                        completed: item.completed === 1,
                    }),
                ),
            );
        });
    });
}

async function getItem(id) {
    return new Promise((res, rej) => {
        db.all('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            res(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                )[0],
            );
        });
    });
}

async function storeItem(item) {
    return new Promise((res, rej) => {
        db.run(
            'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0],
            err => {
                if (err) return rej(err);
                res();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((res, rej) => {
        db.run(
            'UPDATE todo_items SET name=?, completed=? WHERE id = ?',
            [item.name, item.completed ? 1 : 0, id],
            err => {
                if (err) return rej(err);
                res();
            },
        );
    });
} 

async function removeItem(id) {
    return new Promise((res, rej) => {
        db.run('DELETE FROM todo_items WHERE id = ?', [id], err => {
            if (err) return rej(err);
            res();
        });
    });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};
