'use strict';

const { APIMessage, MessageAttachment } = require('discord.js');

exports.allowedLang = ['js', 'javascript'];

exports.codeReg = /^`{3}(?<lang>[a-z]+)\n(?<code>[\s\S]+)\n`{3}$/;

exports.transformOptions = content => {
	if (content.length >= 2000) {
		const file = new MessageAttachment(
				Buffer.from(content),
				'result.js'
			);

		const message = '実行結果が2000文字を超えたのでファイルにして送信しました';

		data = [file, message];
	} else {
		const options = {
			code: 'js'
		};

		data = [content, options];
	};

	return APIMessage.transformOptions(...data);
};