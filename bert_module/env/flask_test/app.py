# flask에서 FLask라는 class를 import. 이 클래스가 WSGI(Web Server Gateway Interface)
from flask import Flask
from flask import request, jsonify

import tensorflow as tf
import numpy as np
# import pandas as pd
from transformers import *
import json
import numpy as np
# import pandas as pd
from tqdm import tqdm

app = Flask(__name__)  # Flask 클래스의 객체를 생성하고 인자는 __name__으로 전달
tokenizer = BertTokenizer.from_pretrained(
    'bert-base-multilingual-cased')  # 입력 문 토크나이징


@app.route('/')  # 객체의 route 설정
def hello_world():
    return 'Hello this is nlp model test'


SEQ_LEN = 128  # 문장 길이

model = TFBertModel.from_pretrained('bert-base-multilingual-cased')
# 토큰 인풋, 마스크 인풋, 세그먼트 인풋 정의
token_inputs = tf.keras.layers.Input(
    (SEQ_LEN,), dtype=tf.int32, name='input_word_ids')
mask_inputs = tf.keras.layers.Input(
    (SEQ_LEN,), dtype=tf.int32, name='input_masks')
segment_inputs = tf.keras.layers.Input(
    (SEQ_LEN,), dtype=tf.int32, name='input_segment')

# bert model
bert_outputs = model([token_inputs, mask_inputs, segment_inputs])

bert_outputs = bert_outputs[1]
sentiment_first = tf.keras.layers.Dense(
    1, activation='sigmoid', kernel_initializer=tf.keras.initializers.TruncatedNormal(stddev=0.02))(bert_outputs)
sentiment_model = tf.keras.Model(
    [token_inputs, mask_inputs, segment_inputs], sentiment_first)
sentiment_model.compile(optimizer=tf.keras.optimizers.Adam(
    lr=1.0e-5), loss=tf.keras.losses.BinaryCrossentropy(), metrics=['accuracy'])

# 사전 학습시킨 가중치 불러오기
sentiment_model.load_weights("./huggingface_bert.h5")


def sentence_convert_data(data):
    global tokenizer
    tokens, masks, segments = [], [], []
    token = tokenizer.encode(data, max_length=SEQ_LEN,
                             truncation=True, padding='max_length')
    num_zeros = token.count(0)
    mask = [1]*(SEQ_LEN-num_zeros) + [0]*num_zeros
    segment = [0]*SEQ_LEN

    tokens.append(token)
    segments.append(segment)
    masks.append(mask)

    tokens = np.array(tokens)
    masks = np.array(masks)
    segments = np.array(segments)
    return [tokens, masks, segments]


def evaluation_predict(sentence):
    data_x = sentence_convert_data(sentence)
    predict = sentiment_model.predict(data_x)
    predict_value = np.ravel(predict)
    predict_answer = np.round(predict_value, 0).item()
    positive_rate = float(predict_value[0])
    if predict_answer == 0:
        # 부정적, 확률
        return jsonify({"prediction": False, "rate": 1-positive_rate})
    elif predict_answer == 1:
        # 긍정적, 확률
        return jsonify({"prediction": True, "rate": positive_rate})


@app.route('/res_predict')
def res_predict():
    chatting_log = request.args.get('chat')
    return evaluation_predict(chatting_log)


if __name__ == '__main__':
    app.run()  # 로컬 서버로 실행
