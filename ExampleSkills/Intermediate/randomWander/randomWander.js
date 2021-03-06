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

// Misty Randomly Wanders around the space

misty.Set("inCorrecetion", false);
misty.Set("lastHazard", "NotYet");
misty.AddReturnProperty("Hazard", "DriveStopped");
misty.RegisterEvent("Hazard", "HazardNotification", 1, true);

// ------------------------ Random Drive -------------------------------------

function _drive_random() 
{
    misty.Debug("Random Drive -> Now Issuing a Drive Command");
    if (Math.random() <= 0.2) 
    {
        drive(0, 0);
        misty.Debug("Idle State Selected - wait 10-20 sec");
        misty.RegisterTimerEvent("drive_random", getRandomInt(10, 20) * 1000, false);
    } 
    else 
    {
        switch (misty.Get("lastHazard")) 
        {
            case "LEFT":
                drive(getRandomInt(15, 30), getRandomInt(-15, 0));
                misty.Set("lastHazard", "NotYet");
                break;
            case "RIGHT":
                drive(getRandomInt(15, 30), getRandomInt(0, 15));
                misty.Set("lastHazard", "NotYet");
                break;
            default:
                drive(getRandomInt(15, 30), getRandomInt(-15, 15));
        }
        misty.RegisterTimerEvent("drive_random", getRandomInt(4, 9) * 1000, false);
    }
}
misty.RegisterTimerEvent("drive_random", 10, false); 

function drive(lin, ang) 
{
    if (!misty.Get("inCorrecetion")) 
    {
        if (lin === 0 && ang === 0) misty.Stop();
        else misty.Drive(lin, ang);
    }
    else
    {
        misty.Debug("Drive command ignored as Misty is in correction mode");
    }
}

// --------- Misty detects hazards - based of Time of Flight Sensors (both range and edge) and bump sensors -------

function _Hazard(data) 
{
    // misty.Debug(JSON.stringify(data));
    // misty.Debug(JSON.stringify(data.AdditionalResults));
    const dataIn = data.AdditionalResults;

    var triggers = [];
    dataIn.forEach(sensor => {
        sensor.forEach(sensorData => {
            sensorData.InHazard ? triggers.push(sensorData.SensorName) : {}
        });
    });

    if (triggers.length && !misty.Get("inCorrecetion")) {
        misty.Set("inCorrecetion", true);
        misty.Set("inCorrecetion", true);
        misty.Set("inCorrecetion", true);
        misty.Debug(triggers);
        if (triggers[0] == "Back center hazard") BackCorrection();
        else if (triggers[0] == "Front right hazard") RightCorrection();
        else if (triggers[0] == "Front left hazard") LeftCorrection();
        else if (triggers[0] == "Front center hazard") FrontCorrection();
        else if (triggers[0] == "Back left hazard") BackCorrection("LEFT");
        else if (triggers[0] == "Back right hazard") BackCorrection("RIGHT");
        else {}
    }
}

// --------- Misty gets into programmed sequence of corrective action to move away from the Hazard -----

function FrontCorrection() 
{
    misty.Debug("FRONT-CORRECTION");
    misty.ChangeLED(255, 0, 0);
    misty.MoveArmDegrees("both", -80, 30);
    misty.Pause(2000);
    misty.DriveTime(-20, 0, 600);
    misty.Pause(600);
    misty.DriveTime(-20, -20, 5500);
    misty.Pause(5500)
    misty.ChangeLED(0, 255, 0);
    misty.Set("inCorrecetion", false);
    misty.Set("inCorrecetion", false);
}

function BackCorrection(preferredDrive = "NotYet") 
{
    misty.Debug("BACK-CORRECTION");
    misty.Set("lastHazard", preferredDrive);
    misty.ChangeLED(255, 0, 0);
    misty.MoveArmDegrees("both", -80, 30);
    misty.Pause(2000);
    misty.DriveTime(20, 0, 5500);
    misty.Pause(5500)
    misty.ChangeLED(0, 255, 0);
    misty.Set("inCorrecetion", false);
    misty.Set("inCorrecetion", false);
}

function LeftCorrection() 
{
    misty.Debug("LEFT-CORRECTION");
    misty.Set("lastHazard", "LEFT");
    misty.ChangeLED(255, 0, 0);
    misty.MoveArmDegrees("both", -80, 30);
    misty.Pause(2000);
    misty.DriveTime(-20, 0, 600);
    misty.Pause(600);
    misty.DriveTime(-20, -15, 5000);
    misty.Pause(5000);
    misty.ChangeLED(0, 255, 0);
    misty.Set("inCorrecetion", false);
    misty.Set("inCorrecetion", false);
}

function RightCorrection() 
{
    misty.Debug("RIGHT-CORRECTION");
    misty.Set("lastHazard", "RIGHT");
    misty.ChangeLED(255, 0, 0);
    misty.MoveArmDegrees("both", -80, 30);
    misty.Pause(2000);
    misty.DriveTime(-20, 0, 600);
    misty.Pause(600);
    misty.DriveTime(-20, 15, 5000);
    misty.Pause(5000);
    misty.ChangeLED(0, 255, 0);
    misty.Set("inCorrecetion", false);
    misty.Set("inCorrecetion", false);
}

//------------------------- Random Hand Movements--------------------------------------------

function _move_hands() 
{
    misty.MoveArmDegrees("left", getRandomInt(-80, 80), getRandomInt(5, 30));
    misty.MoveArmDegrees("right", getRandomInt(-80, 80), getRandomInt(5, 30));
    misty.RegisterTimerEvent("move_hands", getRandomInt(5, 10) * 1000, false);
}
misty.RegisterTimerEvent("move_hands", 100, false);

//------------------------- Random Head Movements-------------------------------------------------

function _look_around() 
{
    misty.MoveHeadDegrees(getRandomInt(-40, 20), getRandomInt(-35, 35), getRandomInt(-45, 45), 40);
    misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);
}
misty.RegisterTimerEvent("look_around", 100, false);

// -------------------------- Support Function------------------------------------------------

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
