/*色々読み込み*/
require('./createServer.js'); 
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client();
const { prefix , token } = require('./config.json');

/*readyイベント-botが準備できたらコンソールに'ready'と出力する*/
client.on('ready', () => console.log('ready'));

/*messageイベント*/
client.on('message', async () => {

  /*送信者がボットもしくはメッセージがprefixで始まらないとき処理を終了*/
  if (message.author.bot||!message.content.startsWith(prefix)) return;

  /*メッセージから言語識別子とソースコードを取得するための正規表現*/
  const regexp = /^\`{3}(?<lang>[a-z]+)\n(?<code>[\s\S]+)\n\`{3}$/;

  /*matchを取得さらにその中のグループ(lang, code)を取得*/
  const matches = regexp.exec(message.content);
  const groups = matches.groups;
  const langArray = ['js', 'javascript'];

  /*コードブロックに就職する関数*/
  function codeBrock(lang, content) {
    return `\`\`\`${lang}\n${content}\n\`\`\``;
  };

  /*実行結果を埋め込むor文字数多すぎたらファイルにして返す関数*/
  function returnContent(content) {

    /*embedのDescriptionは2048かなんかだったけどわかりやすいから2000で判定*/
    if (content.length >= 2000) return new MessageEmbed()
    .setTitle('**Result**')
    .setDescription(codeBrock('js', content));

    /*引数contentを'result.js'として返す*/
    else return new MessageAttachment(
      Buffer.from(content),
      'result.js'
    );
  };

  /*色々読み込み*/
  const { VM } = require('vm2');
  const vm = new VM();
  const { inspect } = require('util');
  try {

    /*正規表現とマッチしてもlang, codeがないor言語識別子がlangArrayに含まれなければエラーを投げる -> catchブロックで送信される*/
    if (!groups) throw 'コードが見つかりません';
    if (!langArray.includes(groups.lang)) throw 'コードブロックの言語識別子は\'js\'か\'javascript\'である必要があります';

    /*vmで実行して結果をresultに代入*/
    const result = vm.run(groups.code);

    /*resultはオブジェクトだからinspect()で文字列化する*/
    message.channel.send(returnContent(inspect(result)));
  } catch(e) {
    console.error(e);
    message.channel.send(new MessageEmbed()
    .setTitle('**Error**')
    .setDescription(codeBrock('js', e))
    );
  };
});

/*tokenでログイン*/
client.login(token);