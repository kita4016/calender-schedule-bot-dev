const functions = require("firebase-functions");
const express = require("express");
const app = express();
const line = require("@line/bot-sdk");
const config = {
// eslint-disable-next-line max-len
  channelAccessToken: "8UFzMklUIf9vTnhX0ZUKkHNN8yMlHWkOKyJ6Q02mufebNpfzMH2sy6Br1rWW3y+ouPIKYeSkxUR9MwIMofaUiXadK2JIEJxVhweZM+09NY7kBPT2C7Ht4DONrItSmzegxW/z9m21esdE2w3yF8nYAAdB04t89/1O/w1cDnyilFU=",
  channelSecret: "5d40123bc85c16a7c57c71c6cf2a081f",
};
const client = new line.Client(config);

app
    .post("/hook", line.middleware(config), (req, res)=> lineBot(req, res));

const lineBot = (req, res) => {
  res.status(200).end();
  const events = req.body.events;
  const promises = [];
  for (let i=0; i<events.length; i++) {
    const ev = events[i];
    console.log(ev);
    for (let i=0; i<events.length; i++) {
      const ev = events[i];
      // イベントタイプにより仕分け
      switch (ev.type) {
        // 友達登録
        case "follow":
          promises.push(handleFollowEvent(ev));
          break;
        // メッセージイベント
        case "message":
          promises.push(handleMessageEvent(ev));
          break;
        // ポストバックイベント
        // case "postback":
        // promises.push(handlePostbackEvent(ev));
        // break;
        default:
          return;
      }
    }
  }
  Promise
      .all(promises)
      .then(console.log("all promises passed"))
      .catch((e) => console.error(e.stack));
};

const handleMessageEvent = (ev) => {
  const text = ev.message.text;
  client.replyMessage(ev.replyToken, {
    type: "text",
    text,
  });
};
const handleFollowEvent = (ev) => {
  const text = ev.message.text;
  client.replyMessage(ev.replyToken, {
    type: "text",
    text: "友だち追加ありがとうございます！",
  });
};
exports.app = functions.https.onRequest(app);
