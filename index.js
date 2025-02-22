// hey.jsのmodule.exportsを呼び出します。
const helpFile=require('./commands/help.js');
const joinFile=require('./commands/join.js')
const closeFile=require('./commands/close')

require('dotenv').config();
token=process.env.TOKEN
applicationId=process.env.APP_ID
guildId=process.env.guildId
guildId2=process.env.guildId2

const { REST, Routes } = require('discord.js');

// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const { Client, Events, GatewayIntentBits } = require('discord.js');

// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ] 
});

// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, c => {
	console.log(`準備OKです! ${c.user.tag}がログインします。`);
    // 登録コマンドを呼び出してリスト形式で登録
    const commands = [];

    commands.push(helpFile.data.toJSON())
    commands.push(joinFile.data.toJSON())
    commands.push(closeFile.data.toJSON())

    // DiscordのAPIには現在最新のversion10を指定
    const rest = new REST({ version: '10' }).setToken(token);

    // Discordサーバーにコマンドを登録
    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(applicationId, guildId),
                { body: commands },
            );
            await rest.put(
                Routes.applicationGuildCommands(applicationId, guildId2),
                { body: commands },
            );
            console.log('サーバー固有のコマンドが登録されました！');
        } catch (error) {
            console.error('コマンドの登録中にエラーが発生しました:', error);
        }
    })();
});

const lastSendTime={}
//スラッシュコマンドに応答するには、interactionCreateのイベントリスナーを使う必要があります
client.on(Events.InteractionCreate, async interaction => {
    // スラッシュ以外のコマンドの場合は対象外なので早期リターンさせて終了します
    // コマンドにスラッシュが使われているかどうかはisChatInputCommand()で判断しています
    try{
    if (interaction.isChatInputCommand()){
        // heyコマンドに対する処理
        if (interaction.commandName === joinFile.data.name){
            try {
                await joinFile.execute(interaction,client);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                }
            }
        }else if (interaction.commandName === closeFile.data.name){
            try {
                await closeFile.execute(interaction,client);
                await client.login(token);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                }
            }
        }else if (interaction.commandName === helpFile.data.name){
            try {
                await helpFile.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                }
            }
        }
    }else{
        console.error(`${interaction.commandName}というコマンドには対応していません。`);
    }
}catch (error){
    console.log(error)
}
});

// ログインします
client.login(token);