'use strict';

let { pool } = require('workerpool');
pool = pool('./worker/worker');
const { token } = require('./private');
const { prefix } = require('./config');
const commandName = `${prefix}run`;
const { Client } = require('discord.js');
const client = new Client();
const {
	allowedLang,
	codeReg,
	transformOptions
} = require('./Constants');

client.on('ready', async () => {
	console.log('ready');
});

client.on('message', async message => {
	if (message.author.bot || !message.content.startsWith(commandName)) return;

	const { lang, code } = codeReg.exec(message.content).groups;
	if (!allowedLang.includes(lang)) return;

	pool.exec('run', [code])
	.then(result => message.channel.send(transformOptions(result)))
	.catch(e => message.channel.send(transformOptions(e)));
});

client.login(token);