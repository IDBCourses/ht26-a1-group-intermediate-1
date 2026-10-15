/*
 * IDB Programming: A1 Modelling — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   controls — what happens when a key goes down or comes up
 *   setup    — starts everything
 *
 * There is no loop in this assignment. Nothing happens until the player presses
 * a key, and every key event follows the same two steps:
 *   1. update: change the state, based on which key it was
 *   2. use:    make sound from the state
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which key does what, which notes you can play, the tempo.

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: which octave you're playing in, or whether a drone is on.

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // instrument 1
const synthAM = new Tone.PolySynth(Tone.AMSynth).toDestination(); // instrument 2
const synthMONO = new Tone.PolySynth(Tone.MonoSynth).toDestination(); // instrument 3
const synthFM = new Tone.PolySynth(Tone.FMSynth).toDestination(); // instrument 4

let keyboard = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
let notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
let keyboardToNotes = new Map();
for (let index = 0; index < notes.length; index++) {
  keyboardToNotes.set(keyboard[index], notes[index]);
}

//Setting the defualt to the notes of Mode1
//let Mode1 = false;
//let Mode2 = false;
//let Mode3 = false;
//let Mode4 = false;
let index = 0;
const Instruments = [synth, synthAM, synthMONO, synthFM];

// ---------- Controls ----------
// Runs every time a key goes down.
function keyDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something

  // Holding a key down sends keydown again and again. Only react to the first one.
  if (event.repeat === false) {
    let currentNote = keyboardToNotes.get(event.key);
    console.log("Key down:", event.key);
    console.log("Current Note:", currentNote);

    //Checking for the mode buttons thus enabling an instrument
    if (event.key === "1") {
      //Mode1 = true;
      //Mode2 = false;
      //Mode3 = false;
      //Mode4 = false;
      index = 0;
    } else if (event.key === "2") {
      //Mode1 = false;
      //Mode2 = true;
      //Mode3 = false;
      //Mode4 = false;
      index = 1;
    } else if (event.key === "3") {
      //Mode1 = false;
      //Mode2 = false;
      //Mode3 = true;
      //Mode4 = false;
      index = 2;
    } else if (event.key === "4") {
      //Mode1 = false;
      //Mode2 = false;
      //Mode3 = false;
      //Mode4 = true;
      index = 3;
    }

    console.log(Mode1, Mode2, Mode3, Mode4);
    //Notes for instrument 1
    if (Mode1 === true) {
      synth.triggerAttack(currentNote, Tone.now());
      //Notes for instrument 2
    }
    else if (Mode2 === true) {
      synthAM.triggerAttack(currentNote, Tone.now());
      //Notes for instrument 3
    }
    else if (Mode3 === true) {
      synthMONO.triggerAttack(currentNote, Tone.now());

      //Notes for instrument 4
    }
    else if (Mode4 === true) {
      synthFM.triggerAttack(currentNote, Tone.now());
    }
  }
}

// Runs every time a key comes up.
function keyUp(event) {
  console.log("Key up:", event.key);
  //This makes sure that the notes stop playing when lifted, and allows for swapping between instruments fluently
  // and makes sure that when a key is lifted, it will stop playing no matter the instrument it was initiated on.
  // If each instrument stopped in different ifs like they are initiatedthen swapping instruments could prevent a
  // note from stopping.
  if (event.key === "a") {
    synth.triggerRelease("C4", Tone.now());
    synthAM.triggerRelease("C4", Tone.now());
    synthMONO.triggerRelease("C4", Tone.now());
    synthFM.triggerRelease("C4", Tone.now());
  } else if (event.key === "s") {
    synth.triggerRelease("D4", Tone.now());
    synthAM.triggerRelease("D4", Tone.now());
    synthMONO.triggerRelease("D4", Tone.now());
    synthFM.triggerRelease("D4", Tone.now());
  } else if (event.key === "d") {
    synth.triggerRelease("E4", Tone.now());
    synthAM.triggerRelease("E4", Tone.now());
    synthMONO.triggerRelease("E4", Tone.now());
    synthFM.triggerRelease("E4", Tone.now());
  } else if (event.key === "f") {
    synth.triggerRelease("F4", Tone.now());
    synthAM.triggerRelease("F4", Tone.now());
    synthMONO.triggerRelease("F4", Tone.now());
    synthFM.triggerRelease("F4", Tone.now());
  } else if (event.key === "g") {
    synth.triggerRelease("G4", Tone.now());
    synthAM.triggerRelease("G4", Tone.now());
    synthMONO.triggerRelease("G4", Tone.now());
    synthFM.triggerRelease("G4", Tone.now());
  } else if (event.key === "h") {
    synth.triggerRelease("A4", Tone.now());
    synthAM.triggerRelease("A4", Tone.now());
    synthMONO.triggerRelease("A4", Tone.now());
    synthFM.triggerRelease("A4", Tone.now());
  } else if (event.key === "j") {
    synth.triggerRelease("B4", Tone.now());
    synthAM.triggerRelease("B4", Tone.now());
    synthMONO.triggerRelease("B4", Tone.now());
    synthFM.triggerRelease("B4", Tone.now());
  } else if (event.key === "k") {
    synth.triggerRelease("C5", Tone.now());
    synthAM.triggerRelease("C5", Tone.now());
    synthMONO.triggerRelease("C5", Tone.now());
    synthFM.triggerRelease("C5", Tone.now());
  }
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  // Put your event listener code here
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
}

setup(); // Always remember to call setup()!
