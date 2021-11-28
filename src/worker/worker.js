'use strict';

const { worker } = require('workerpool');
const { inspect } = require('util');
const { VM } = require('vm2');
const vm = new VM();

async function run(code) {
	let result;
	try {
		result = vm.run(code);
	} catch(e) {
		result = e;
	};

	return inspect(result);
};

worker({
	run: run
});