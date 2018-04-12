# linda-delta-door-raspi
lindaサーバのタプルを監視し、それに合わせてdeltaの明かりののサーボをコントロールするプログラム。

# 起動
`$ npm install`

`$ node app.js`

# 機材
- Raspberry Pi 3
- (サーボモーター)


# 注意
`raspi-io`はRaspberry Pi上でしかインストールできません。<br>
(その他の環境で`npm install`するとエラーになります)

# 参考
- [ドアサーバー](https://github.com/saji-ryu/linda-delta-door-raspi)とほぼ同じになります
- [Node Lindaについて](https://github.com/node-linda/linda)