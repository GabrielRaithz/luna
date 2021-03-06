/**
 * Copyright 2016-2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
var TJBot = require('tjbot');
var config = require('./config');
var nome = '';
var musica = '';
var sentimento = '';
var sentimentoIO = true;
// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
var WORKSPACEID = config.workspaceId;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['microphone', 'speaker', 'led', 'servo', 'camera'];
if (config.hasCamera == false) {
    hardware = ['microphone', 'speaker', 'led', 'servo'];
}

// set up TJBot's configuration
var tjConfig = {
    log: {
        level: 'verbose'
    },
    robot: {
        gender: 'female', // see TJBot.prototype.genders
        name: 'Luna'    
    },
    listen: {
        microphoneDeviceId: "plughw:1,0", // plugged-in USB card 1, device 0; see arecord -l for a list of recording devices
        inactivityTimeout: -1, // -1 to never timeout or break the connection. Set this to a value in seconds e.g 120 to end connection after 120 seconds of silence
        language: 'pt-BR' // see TJBot.prototype.languages.listen
    },
    speak: {
        language: 'pt-BR', // see TJBot.prototype.languages.speak
        voice: undefined, // use a specific voice; if undefined, a voice is chosen based on robot.gender and speak.language
    speakerDeviceId: "bluealsa:HCI=hci0,DEV=9D:00:18:E1:AD:24,PROFILE=a2dp" // plugged-in USB card 1, device 0; see aplay -l for a list of playback devices
    }
};

var translator = new LanguageTranslatorV3({
//apikey: 'g7KToaBfBdIAxv-gmyUsEXL_axNOYtKnZ0up-CD65V3N',
version: '2018-05-01',
iam_apikey: "296t2ueiKNrMSu4-SO800TKqEhQWow1II6jaKm-UQpiX",
url: "https://gateway.watsonplatform.net/language-translator/api"
});

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

console.log("You can ask me to introduce myself or tell you a joke.");
console.log("Try saying, \"" + tj.configuration.robot.name + ", please introduce yourself\" or \"" + tj.configuration.robot.name + ", what can you do?\"");
console.log("You can also say, \"" + tj.configuration.robot.name + ", tell me a joke!\"");

// listen for utterances with our attentionWord and send the result to
// the Assistant service
tj.listen(function(msg) {
    
    var robotName = '';
    var msgMin = msg.toLowerCase();
    // check to see if they are talking to TJBot
    if (msgMin.startsWith(tj.configuration.robot.name.toLowerCase())) {
        robotName = tj.configuration.robot.name.toLowerCase();
    } else if (msgMin.startsWith('lona')) {
        robotName = 'lona';
    } else if (msgMin.startsWith('lonas')) {
        robotName = 'lonas';
    } else if (msgMin.startsWith('coluna')) {
        robotName = 'coluna';
    } else if (msgMin.startsWith('com lona')) {
        robotName = 'com lona';
    } else if (msgMin.startsWith('com lonas')) {
        robotName = 'com lonas';
    } else if (msgMin.startsWith('dona')) {
        robotName = 'dona';
    } else if (msgMin.startsWith('aluna')) {
        robotName = 'aluna';
    } else if (msgMin.startsWith('alunas')) {
        robotName = 'alunas';
    } else if (msgMin.startsWith('bruna')) {
         robotName = 'bruna';
    } else if (msgMin.startsWith('nona')) {
         robotName = 'nona';
    }
    if (robotName != '') {
        // remove our name from the message
    var turn = msgMin.replace(robotName, '');
    console.log('text in: ' + turn);

    var utterance = msg.toLowerCase();

    // send to the assistant service
    tj.converse(WORKSPACEID, utterance, function(response) {
        var spoken = false;
        var triste = false;
        
        // check if an intent to control the bot was found
        if (response.object.intents != undefined) {
            var intent = response.object.intents[0];
            var mensagemRobo = response.description;
            console.log('ro'+mensagemRobo+'bo');
            var sayName = false;
                if (intent != undefined && intent.intent != undefined) {
                    console.log('Intent: ' + intent.intent);
                    switch (intent.intent) {
                    case "nome":
                        var n = turn.split(' ');
                        nome = n[n.length - 2];
                        console.log('nome: ' + nome);
                        console.log('turn: ' + turn);
                        break;
                    case "musica":
                        var m = turn.split(' ');
                        musica = m[m.length - 2];
                        console.log('musica ' + musica);
                        console.log('turn ' + turn);
                        break;
                    case "malEstar":
                        triste = true;
                        break;
                    case "cumprimentos":
                        sayName = true;
                        break;
                    case "despedida":
                        sayName = true;
                        break;
                }
            }
        }
        var parameters = {
            text: turn,
            model_id: 'pt-en'
        };

        translator.translate(parameters, function(err, models) {
            if (err) return console.log(err);
            else {	
                var traducao = models.translations[0].translation;
                console.log(traducao);
                tj.analyzeTone(traducao).then(function(tone) {
                    if(tone.document_tone.tones.length  > 0){
                        sentimento = tone.document_tone.tones[0].tone_id;
                    }else{
                        sentimento = '';
                    }
                    
                    if(sentimento != ''){
                        getAnalisys(traducao);
                    }
                    console.log('sentimento: ' + sentimento);
                   
                    var falarIsso = '';
                    if (sayName == false) {
                        falarIsso = mensagemRobo;
                    }else{
                        falarIsso = mensagemRobo + ' ' + nome;
                    }
                    if (triste && musica) {
                        falarIsso = falarIsso + 'Que tal ouvir um pouco de ' + musica + ' para se alegrar?';
                    }
                    console.log('A'+reactForEmotion()+'A');

                    if((mensagemRobo == 'Eu não entendi. Você pode tentar reformular a frase.' || 
                        mensagemRobo == 'Você pode reformular sua afirmação? Eu não estou entendendo.' ||
                        mensagemRobo == 'Eu não entendi o sentido.')&&
                        sentimento != ''){
                        falarIsso = reactForEmotion();
                    }
                    tj.speak(falarIsso);
                });
            };
        });
    });
}
});

function getNome(texto){
    var n = texto.split(" ");
    nome = n[n.length - 1];
}

function getAnalisys(text) {
    sentimentoIO = true;
}

function reactForEmotion() {
    switch (sentimento) {
    case 'anger':
        return("Vejo que você está bravo");
        break;
    case 'joy':
        return("Vejo que você está feliz")
        break;
    case 'fear':
        return("Vejo que você está com medo");
        break;
    case 'disgust':
        return("Vejo que você está com desgosto")
        break;
    case 'sadness':
        return("Vejo que você está triste")
        break;
    default:
        return('ei'); 
        break;
    }
    sentimentoIO = false;
} 
