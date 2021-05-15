require('dotenv').config();

const winston = require('winston');

const mariadb = require('mariadb');
global.pool = mariadb.createPool({
  host: 'localhost', 
  user: process.env.DB_User,
  password: process.env.DB_PW,
  database: 'kakao',
  charset: 'utf8mb4',
  idleTimeout: 0
});

const nodeKakao = require('node-kakao');
global.client = new nodeKakao.TalkClient(process.env.TalkClientName, process.env.TalkClientUUID);


client.login(process.env.TalkClientLoginID, process.env.TalkClientLoginPW, true).then(main)
  //.catch(err => { console.error(`Login Attempt failed. status: ${err.status}, msg: ${err.message}`); });

async function main() {
  console.log('Login successful. Main client is in startup.');
  const WS = require('./modules/webServer.js'); // deploy express and socket server
  /*
  // Update friends list
  console.log(client.Auth.getLatestAccessData())
  //client.service.requestFriendList(['normal'], [], client.auth.accessData.accessToken)
  client.service.requestBlockedFriendList()
    .then((res) => { console.log(res) })
    .catch(err => { console.error(err); });
  //client.service.requestProfile().then(res => console.log(res));
  */
  
  // Incoming message event handler
  client.on('message', async chat => {
    WS.chatManager(chat);
  });
  
  // Message read event handler
  client.on('message_read', (channel, reader, readChatLogId) => {

  });
  /*
  let target = await client.userManager.map.get('267020477').createDM();
  let channel = await target.result.sendText('이런거 하는 중이야\nhttps://luftaquila.io/droppy/$/woZKQ');
  /*
  let target = await client.channelManager.map.get('174726625044834');
  let markread = await client.channelManager.markRead(target);
  target.sendText('');
  */
  // @!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! channel markread doesn't work
  
}

/*
if (process.env.NODE_ENV !== "production") {
  const chokidar = require("chokidar");
  const watcher = chokidar.watch("./modules");
  watcher.on("change", (path, stats) => {
    let relative_path = './' + path;
    delete require.cache[require.resolve(relative_path)];
    console.log(relative_path + ' reloaded.');
  });
}
*/