const fs = require('fs-extra');
const path = require('path');

async function _copy(source, target) {
    try {
        console.log(`Copying ${source} -> ${target}`);
        await fs.copy(source, target, {
            overwrite: true,
        });
    } catch (e) {
        console.log('Failed');
    }
}

async function _move(source, target) {
    try {
        console.log(`Moving ${source} -> ${target}`);
        await fs.move(source, target, {
            overwrite: true,
        });
    } catch (e) {
        console.log('Failed');
    }
}

async function copy(source, target) {
    await _copy(source, path.join(target, path.basename(source)));
}

async function move(source, target) {
    await _move(source, path.join(target, path.basename(source)));
}

module.exports = {
    copy,
    move,
};
