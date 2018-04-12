const LindaClient = require('linda').Client;
const socket = require('socket.io-client').connect('http://linda-server.herokuapp.com');
const linda = new LindaClient().connect(socket);
const ts = linda.tuplespace('masuilab');

const five = require("johnny-five");
const Raspi = require("raspi-io");
const board = new five.Board({
    io: new Raspi(),
    repl: false     //デーモン化の都合上
});


board.on("ready", () => {
    const servo = new five.Servo({
        pin: 'GPIO18',
        startAt: 0,
        invert: true,
        range: [0, 360],
        pwmRange: [500, 2400]
    });

    linda.io.on('connect', () => {
        console.log('connect!!!');

        let moveServo = (callback) => {
            servo.to(270, 800);
            board.wait(2000, () => {
                servo.to(0, 800);
                callback();
            });
        }

        ts.watch({
            where: "delta",
            name: "light",
            cmd: "on"
        }, (err, tuple) => {
            console.log("> " + JSON.stringify(tuple.data) + " (from:" + tuple.from + ")");
            let responseTuple = tuple.data;

            ts.take({
                where: 'delta',
                type: 'sensor',
                name: 'light'
            }, (err, sensorTuple) => {
                if (sensorTuple.data.value > 100) {
                    console.log("すでに電気ついてる");
                } else {
                    responseTuple.response = 'success';
                    console.log('> response=' + JSON.stringify(responseTuple));
                    moveServo(() => {
                        ts.write(responseTuple);
                    });
                }
            });
        });

        ts.watch({
            where: "delta",
            name: "light",
            cmd: "off"
        }, (err, tuple) => {
            console.log("> " + JSON.stringify(tuple.data) + " (from:" + tuple.from + ")");
            let responseTuple = tuple.data;

            ts.take({
                where: 'delta',
                type: 'sensor',
                name: 'light'
            }, (err, sensorTuple) => {
                if (sensorTuple.data.value < 100) {
                    console.log("すでに消えている");
                } else {
                    responseTuple.response = 'success';
                    console.log('> response=' + JSON.stringify(responseTuple));
                    moveServo(() => {
                        ts.write(responseTuple);
                    });
                }
            });
        });

    });
});

