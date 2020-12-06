import express, { response } from "express";
import { Server as SocketServer, Socket } from "socket.io";

import cors from "cors";
import { filterLogs, setEventListener } from "./chat";

import fetch from 'node-fetch'
import { ProfileNameList } from "./shared/Chat";

const app = express();
app.use(cors());
const server = require("http").Server(app);
const io: SocketServer = require("socket.io")(server);
setEventListener(io);

const PREDICT_URL = "http://127.0.0.1:5000"

interface PredictResult {
  prediction: boolean
  rate: number
}


export async function getPrediction(input: string): Promise<PredictResult> {
  const url = encodeURI(`${PREDICT_URL}/res_predict?chat=${input}`)
  const response = await fetch(url)
  const result = await response.json()
  return result
}

// path : /predict?sender=해선&reciever=환진
app.get("/predict", async (req, res) => {
  const { sender, reciever } = req.query
  if (!sender || !reciever) {
    throw new Error("fill sender and reciever")
  }
  console.log(`${sender}님이 ${reciever} 님게 보낸 대화 분석`)

  const filterd = filterLogs({ sender: sender as ProfileNameList, reciever: reciever as ProfileNameList })

  // console.log(`총 대화 길이 : ${filterd.length}`)
  const PREDICTION_CURRENT_COUNT = filterd.length > 20 ? 20 : null
  // console.log(`최근 ${PREDICTION_CURRENT_COUNT}개의 대화를 분석합니다.`)
  let input: string
  if (PREDICTION_CURRENT_COUNT) {
    input = filterd.slice(filterd.length - PREDICTION_CURRENT_COUNT, filterd.length).map(c => ` ${c.content} `).join("")
  } else {
    input = filterd.map(c => ` ${c.content} `).join("")
  }
  if (input.length < 30) {
    console.log(`${sender}님께서 ${reciever}님에게 보낸 대화는 분석 데이터가 충분하지 않아요. 최근 대화 길이 : ${input.length}`)
    res.send({
      ok: false,
      error_message: `분석 데이터가 충분하지 않아요`
    })
    return
  }

  const result = await getPrediction(input)
  console.log(`${sender}님께서 ${reciever}님에게 보낸 대화는 ${result.rate} 만큼 ${result.prediction ? "긍정" : "부정"}적이에요 `)
  res.send({
    ok: true,
    isPositive: result.prediction,
    positiveRate: result.rate
  })
})



// path : /predict/{해석하고자하는문장}
app.get("/predict/:input", async (req, res) => {
  const { input } = req.params
  const result = await getPrediction(input)
  console.log(`prediction result for ${input} is ${result.prediction}, rate ${result.rate}`)

  if (result.rate > 0.7) {
    res.send({ ok: true, isPositive: result.prediction })
  } else {
    res.send({ ok: false, error_message: "애매모호" })
  }
})

const PORT = 5001;
server.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`); //포트 설정
});
