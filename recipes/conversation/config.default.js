/*
* User-specific configuration
* IMPORTANT NOTES:
*  Please ensure you do not interchange your username and password.
*  Your username is the longer value: 36 digits, including hyphens
*  Your password is the smaller value: 12 characters
*/

exports.workspaceId = 'd3fcf57e-f44b-4bc5-a2db-bbff8443ace0'; // replace with the workspace identifier of your conversation

// Set this to false if your TJBot does not have a camera.
exports.hasCamera = false;

// Create the credentials object for export
exports.credentials = {};

// Watson Assistant
// https://www.ibm.com/watson/services/conversation/
exports.credentials.assistant = {
	apikey:"eIBN4IKtNTNdP90Nl8oGvtVNSurXhjcSpciRA5oueObr"
};

// Watson Speech to Text
// https://www.ibm.com/watson/services/speech-to-text/
exports.credentials.speech_to_text = {
	apikey:"RawuOWDnXJ-UwS0TOzJCXcgJI2BzcnfvfZKv5jsd34Bm'
};

// Watson Text to Speech
// https://www.ibm.com/watson/services/text-to-speech/
exports.credentials.text_to_speech = {
	apikey:'94UMGs-slVnVlKlbs3Bv923tc_oUidWwT6A67MoDrq7v'
};

// Watson Visual Recognition
// https://www.ibm.com/watson/services/visual-recognition/
//exports.credentials.visual_recognition = {
//    apikey: ''
//};
