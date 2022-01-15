const fs = require('fs');
const stdin = process.stdin;

let data = '';
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
	data += chunk;
});

const prependToFile = (filename, str) => {
	const data = fs.readFileSync(filename);
	const fd = fs.openSync(filename, 'w+');
	const insert = Buffer.from(str);
	fs.writeSync(fd, insert, 0, insert.length, 0)
	fs.writeSync(fd, data, 0, data.length, insert.length)
	fs.close(fd, (err) => {
		if (err) throw err;
	});
}

stdin.on('end', function () {
	const rows = data.split('\n');

	const filemap = {};
	rows.forEach((row) => {
		const sections = row.split(':');
		if (sections.length < 2) {
			return;
		}

		// check the first array item is a valid filename string of the following format:
		//      'src/folder/subfolder/filename.ts(1,41)'
		if (!(/.*\(\d+,\d+\)$/.test(sections[0]))) {
			return;
		}

		const filename = sections[0].replace(/\(\d+,\d+\)$/, '');

		// ignore anything in the node_modules folder
		if (/node_modules/.test(filename)) {
			return;
		}

		// now check it's a valid file
		if (!fs.existsSync(filename)) {
			return;
		}

		const tsError = sections[1].match(/TS\d+/);
		if (!tsError) {
			return;
		}

		if (!filename[filename]) {
			filemap[filename] = [];
		}

		filemap[filename].push(tsError[0]);
	});

	Object.keys(filemap).forEach((filename) => {
		const str = `// TODO remove error suppression in this file\n// @ts-nocheck - ${filemap[filename].join(' ')}\n`;
		prependToFile(filename, str);
	});

	console.info(`${Object.keys(filemap).length} files updated.`);
});

stdin.on('error', console.error);

