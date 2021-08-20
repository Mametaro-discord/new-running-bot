require('./createServer.js');

const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client();
const { prefix , token } = require('./config.json');

client.on('ready', () => console.log('ready'));

client.on('message', async () => {
  if (message.author.bot||!message.content.startsWith(prefix)) return;
  const regexp = /^\`{3}(?<lang>[a-z]+)\n(?<code>[\s\S]+)\n\`{3}$/;
  const matches = regexp.exec(message.content);
  const groups = matches.groups;
  const langArray = ['js', 'javascript'];
  function codeBrock(lang, content) {
    return `\`\`\`${lang}\n${content}\n\`\`\``;
  };
  function returnContent(content) {
    if (content.length >= 2000) return new MessageEmbed()
    .setTitle('**Result**')
    .setDescription(codeBrock('js', content));
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
    if (!langArray.includes(groups.lang)) throw 'コードブロックの言語識別子は\'js\'か\'javascript\'である必要があります';
    const result = vm.run(groups.code);
    message.channel.send(returnContent(inspect(result)));
  } catch(e) {
    console.error(e);
    message.channel.send(new MessageEmbed()
    .setTitle('**Error**')
    .setDescription(codeBrock('js', e))
    );
  };
});

client.login(token);