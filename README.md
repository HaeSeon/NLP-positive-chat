# 🎠긍정 채팅 프로젝트 "정말"🎠 - Positive-chat with nlp

## [2020 상명대 제2회 SM경진대회 AI부문]

## "정말" 소개영상 (Youtube link) 👇 Image Click!!

[![정말 소개영상](http://img.youtube.com/vi/C-k522dH43o/hqdefault.jpg)](https://youtu.be/C-k522dH43o) 

"오늘 당신의 대화는 긍정적인가요?"

자연어 처리를 이용한 긍정 채팅 프로젝트 "정말"

**"정말" 이란?**
- 자연어 처리 기술을 통해 채팅 로그를 분석하여 긍정적, 혹은 부정적인지를 검사합니다.
- 실시간으로 업데이트되는 나의 언어 습관을 되돌아보며, 긍정적인 대화 습관을 함향하는 것에 목표가 있습니다. 
사용된 기술로는 Python과 BERT를 통해 자연어 처리 모델을 학습하였고, React JS, Node JS, ExpressJS, Flask 를 사용하여 웹 어플리케이션 개발 및 REST API를 구축하였습니다. 

## 시연 영상 (Youtube link) 👇 Image Click!!

[![정말 시연영상](http://img.youtube.com/vi/mhc3Qf3GtWY/hqdefault.jpg)](https://youtu.be/mhc3Qf3GtWY)

## 왜 "정말" 은 필요할까?
  1. 지인과의 대화에서 지인의 감정에 동화되는 경우가 빈번하다. 아침에 학교에 갔을 때 친구가 웃으며 인사해주면 나도 기분이 좋아진다. 이렇게 사람의 감정은 주변 사람들과 서로 영향을 미치며 이것을 “감정 전염” 이라고 한다.

  2. 거울 신경 세포 이론 : 타인의 행동을 거울처럼 반영하는 거울신경세포가 활성화되면 타인의 감정을 나의 감정이라 느끼게되고 감정의 전염이 이루어지는 원인이 된다. 특히 부정적 감정은 전염성이 강한데, 이것이 심해질경우 “이모데믹(emotion+epidemic)” 이 발생한다. 

  3. 이 감정의 전염은 특히 코로나사태로 인해, 채팅창에서 발생하는 경우가 많다. 따라서 개개인의 채팅창 말풍선이 긍정적이 된다면 이 긍정적 감정은 주변 사람들에게 전염되며, 연쇄작용을 일으킬것을 목표로 “정(正)말” 의 아이디어를 얻게 되었다. 

  4. 또한 대화 상대마다 “나”의 모습이 바뀌는 경우가 많다는 설문결과를 얻고 상호간의 악영향을 미치지 않는 채팅습관을 위한 플랫폼을 개발하고자 하였다. 대화 분위기에 휩쓸려 옳고 그름의 이치 파악은 뒤로한채 글을 읽고, 쓰고있는 경우에 대해 경각심을 주는데 도움이 될 것이라 생각한다.

## 주요 기능 
  **1. 로그인**

  <img width="700" alt="로그인창" src="https://user-images.githubusercontent.com/18053479/101400748-b1cc0880-3914-11eb-8f8e-74f94137b6f4.PNG">

  **2. 채팅방별 대화의 긍정도 실시간 분석**

  <img width="700" alt="긍정도분석" src="https://user-images.githubusercontent.com/18053479/101400759-b395cc00-3914-11eb-82dd-d0e232b361d2.PNG">

  **3. 긍정도에 따른 채팅방 배경화면 자동 변경**

  <img width="700" alt="긍정배경" src="https://user-images.githubusercontent.com/18053479/101400761-b42e6280-3914-11eb-9a40-9e23743c7f4a.PNG">
  

  <img width="700" alt="부정배경" src="https://user-images.githubusercontent.com/18053479/101400755-b2fd3580-3914-11eb-9632-9f0ed761b85e.PNG">


## 시스템 구성도

<img width="700" alt="시스템구성도" src="https://user-images.githubusercontent.com/18053479/101399021-41bc8300-3912-11eb-9e37-264a1195fca1.PNG">

  **1. 사용자가 채팅을 하면 서버에 채팅로그가 전달된다.**

  **2. 로그는 DB에 저장되며 기존 채팅과 함께 client 로 전달된다.**

  **3. 이 채팅로그는 실시간으로 Flask server에 보내진다.**

  **4. Flask server 에서는 학습된 딥러닝 모델이 사용자의 채팅로그를 분석하여 긍/부정 의 출력값을 만든뒤 서버를 거쳐 사용자가 분석결과를 볼 수 있게 된다.**


## 자연어 처리 과정

학습 모델로는 BERT를 사용. BERT는 3개의 Input(token, mask, segment)이 들어가면 긍정도 확률이 output으로 나온다. 

![Picture4](https://user-images.githubusercontent.com/18053479/101405400-5e10ed80-391b-11eb-8cb9-7421c8a68f7d.png)

1. 학습데이터셋 : 네이버 감정 분석 데이터 

* train_data : 150K

* test_data : 50K

  ```!git clone https://github.com/e9t/nsmc.git```


2. Input data 전처리

  * Token : 단어를 위치로 표현 (숫자에 mapping)

      ```tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-cased')```

  * Mask : Token input이 존재하는 부분 :1, 아닌 부분 :0

     ```mask = [1]*(SEQ_LEN-num_zeros) + [0]*num_zeros``` 

  * Segment : 문장의 순서를 구분해주는 input. 채팅로그의 경우 문장의 전후관계가 모호하여 모든 값을 0으로 두었다. 

     ```segment = [0]*SEQ_LEN```


3. 모델 학습

  150K개의 train_data 를 BERT 모형에 넣고 학습시킨 결과,

    2/1500 [..............................] - ETA: 9:15:51 - loss: 0.6895 - accuracy: 0.5450 WARNING:tensorflow:Callbacks method `on_train_batch_end` is slow compared to the batch time (batch time: 0.0110s vs `on_train_batch_end` time: 0.1476s). Check your callbacks.
    WARNING:tensorflow:Callbacks method `on_train_batch_end` is slow compared to the batch time (batch time: 0.0110s vs `on_train_batch_end` time: 0.1476s). Check your callbacks.
    1500/1500 [==============================] - ETA: 0s - loss: 0.4512 - accuracy: 0.7800WARNING:tensorflow:Callbacks method `on_test_batch_end` is slow compared to the batch time (batch time: 0.0046s vs `on_test_batch_end` time: 0.0417s). Check your callbacks.
    WARNING:tensorflow:Callbacks method `on_test_batch_end` is slow compared to the batch time (batch time: 0.0046s vs `on_test_batch_end` time: 0.0417s). Check your callbacks.
    1500/1500 [==============================] - 316s 211ms/step - loss: 0.4512 - accuracy: 0.7800 - val_loss: 0.3575 - val_accuracy: 0.8402
    Epoch 2/4
    1500/1500 [==============================] - 261s 174ms/step - loss: 0.3361 - accuracy: 0.8499 - val_loss: 0.3301 - val_accuracy: 0.8538
    Epoch 3/4
    1500/1500 [==============================] - 262s 174ms/step - loss: 0.2952 - accuracy: 0.8717 - val_loss: 0.3040 - val_accuracy: 0.8663
    Epoch 4/4
    1500/1500 [==============================] - 262s 175ms/step - loss: 0.2602 - accuracy: 0.8892 - val_loss: 0.3107 - val_accuracy: 0.8684

  **loss : 0.26, accuracy : 0.89**

  이렇게 학습된 모델의 가중치를 저장. 

4. REST API 구축

  저장된 가중치를 불러와 채팅 로그를 분석할 수 있도록 REST API를 flask에서 구축. 이제 웹서버가 요청하면 응답 가능한 형태로 가공이 완료되었다.
  
  
## 채팅 웹 어플리케이션

* 개발 언어는 TypeScript를 사용

* SPA 프레임워크로 React 사용

* Node js, Express 사용

* soket 통신으로 채팅 구현
  
  
## 기대효과

  * 실시간으로 자신의 언어습관을 웹이 보여줌으로써 사용자에게 엔터키를 누르기 전, 자신의 chat에 대해 경각심을 가질 수 있다. 
  
  
  * 자신의 언어습관 성찰을 할 수 있으며 이를 통해 긍정적 대화습관과 사고방식을 거쳐 타인에게도 긍정적 영향을 줄 것을 목표로 한다. 


## 참고자료
- [google-BERT] https://github.com/google-research/bert
- [kimwoonggon] https://github.com/kimwoonggon/publicservant_AI
- [Huggingface] https://huggingface.co/transformers/
- [nsmc] https://github.com/e9t/nsmc
