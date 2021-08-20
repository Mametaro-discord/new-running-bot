require('./createServer.js');

const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client();
const { prefix, token } = require('./config.json');

client.on('ready', () => console.log('ready'));

client.on('message', async message => {
	if (message.author.bot||!message.content.startsWith(prefix)) return;
	const regexp = /^\`{3}(?<lang>[a-z]+)\n(?<code>[\s\S]+)\n\`{3}$/;
	const matches = regexp.exec(message.content);
	interface Groups {
		lang: string,
		code: string
	};
	const groups: Groups = matches.groups;
	const langArray = ['js', 'javascript'];
	function codeBrock(lang: string, content: string): string {
		return `\`\`\`${lang}\n${content}\n\`\`\``;
	};
	function returnContent(content: string) {
		if (content.length >= 2000) return new MessageEmbed()
		.setTitle('**Result**')
		.setDescription(codeBrock(langArray[0], content))
		else return new MessageAttachment(
			Buffer.from(content),
			'result.js'
		);
	};
	const { VM } = require('vm2');
	const vm = new VM();
	const { inspect } = require('util');
	try {
		if (!groups) throw 'コードが見つかりません';
		if (!langArray.includes(groups.lang)) throw `コードブロックの言語識別子は\'${langArray[0]}\'か\'${langArray[1]}\'である必要があります`;
		const result = vm.run(groups.code);
		message.channel.send(returnContent(inspect(result)));
	} catch(e) {
		console.error(e);
		message.channel.send(new MessageEmbed()
		.setTitle('**Error**')
		.setDescription(codeBrock(langArray[0], e))
		);
	};
});

client.login(token);