/*
*    Copyright 2019 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

// Misty Looks around when she does not see a human faces

misty.Set("faceInFOV", false, false);
misty.MoveArmDegrees("right", 70, 10);
misty.Pause(50);
misty.MoveArmDegrees("left", 70, 10);

function _look_around(repeat = true) 
{
    if (!misty.Get("faceInFOV")) misty.MoveHeadDegrees(gaussianRandom(-75, 25), gaussianRandom(-35, 35), gaussianRandom(-75, 75), 80);
    if (repeat) misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);
}
misty.RegisterTimerEvent("look_around", 10, false);

function gaussianRand() 
{
    var u = v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) return gaussianRand();
    return num;
}

function gaussianRandom(start, end) 
{
    return Math.floor(start + gaussianRand() * (end - start + 1));
}


function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --------------------- Face Detection ------------------------------

misty.Debug("Homing Head and Arms");
_timeoutToNormal();

misty.StartFaceDetection();

function registerFaceDetection() 
{
    misty.AddPropertyTest("FaceDetect", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceDetect", "FaceRecognition", 3000, true);
}

function _FaceDetect(data) 
{
    misty.Debug(JSON.stringify(data));
    misty.Set("faceInFOV", true, false);
    misty.ChangeLED(148, 0, 211);
    misty.DisplayImage("e_Joy.jpg");
    misty.PlayAudio("s_Awe.wav", 100);

    // wave
    misty.MoveArmDegrees("right", -80, 40);
    misty.Pause(50);
    misty.MoveArmDegrees("left", -80, 40);
    misty.Pause(1000);
    misty.MoveArmDegrees("right", 70, 40);
    misty.Pause(50);
    misty.MoveArmDegrees("left", 70, 40);

    misty.RegisterTimerEvent("timeoutToNormal", 6000, false);
}

registerFaceDetection();

function _timeoutToNormal() 
{
    misty.Set("faceInFOV", false, false);
    misty.Pause(100);
    // misty.MoveHeadPosition(0.1, 0.1, 0.1, 40);
    misty.ChangeLED(0, 255, 0);
    misty.DisplayImage("e_DefaultContent.jpg");
}
