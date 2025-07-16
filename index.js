const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const axios = require('axios');

const config = {
    channelAccessToken: 'jWGRPG0S3iibmLEXcz/dvf1EmyRamZbjyd1ERQaOBSrPE7+doCYYG+OXQ65GrNY1026P8ZwRG8tNVPCcILgv+GLZK+FxpjiPdCqnUJZS/SZmkbkd+fEBwCURQl7mMaNl/6L4b8dGQcXlg+jXBkgDHwdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'c980838c29703d037193dc2ec0374505',
};

const app = express();
const lineClient = new Client(config);

app.use(middleware(config));
app.use(express.json());

app.post('/webhook', async (req, res) => {
    const events = req.body.events;
    if (!events || events.length === 0) return res.sendStatus(200);

    const event = events[0];

    if (event.type === 'message' && event.message.type === 'text') {
        const msg = event.message.text;
        console.log("收到 LINE 訊息:", msg); // 加這行

        if (msg === '開門') {
            try {
                await axios.get('http://192.168.31.98/open');
                await lineClient.replyMessage(event.replyToken, {
                    type: 'text',
                    text: '已開門 ✅',
                });
            } catch (err) {
                await lineClient.replyMessage(event.replyToken, {
                    type: 'text',
                    text: '開門失敗 ❌',
                });
            }
        } else {
            await lineClient.replyMessage(event.replyToken, {
                type: 'text',
                text: `你說的是：「${msg}」`,
            });
        }
    }

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Webhook server running on port 3000');
});
