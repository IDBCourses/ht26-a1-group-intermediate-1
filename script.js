// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which key does what, which notes you can play, the tempo.
let keyboardToNotesSettings = new Map([
  ["a", "C4"],
  ["s", "D4"],
  ["d", "E4"],
  ["f", "F4"],
  ["g", "G4"],
  ["h", "A4"],
  ["j", "B4"],
]);
// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: which octave you're playing in, or whether a drone is on.
let instrumentsIndex = 0;

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
//
const newPoly = (synth) => {
  return new Tone.PolySynth(synth).toDestination();
};

const Instruments = [
  newPoly(Tone.Synth),
  newPoly(Tone.AMSynth),
  newPoly(Tone.MonoSynth),
  newPoly(Tone.FMSynth),
];

//Setting the defualt to the notes of Mode1
// ---------- Controls ----------
// Runs every time a key goes down.

const octaveUpdate = function (octaveEvent) {
  const octaveAddSub = (command) => {
    switch (command) {
      case "o":
        return -1;
      case "i":
        return +1;
      default:
        return 0;
    }
  };

  // % by 5 because we allow 4 octaves only (1..4)
  let octaveState =
    (octaveAddSub(octaveEvent) +
      Number(keyboardToNotesSettings.get("a").slice(1, 2))) %
    5;

  keyboardToNotesSettings.forEach((note, kKey) => {
    keyboardToNotesSettings.set(
      kKey,
      note.slice(0, -1) + (octaveState + !octaveState),
    );
  });
};

function keyDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
  //Checking for the octave buttons thus enabling an octave change

  // Holding a key down sends keydown again and again. Only react to the first one.
  if (event.repeat === false) {
    let currentNote = keyboardToNotesSettings.get(event.key);
    console.log("Key down:", event.key);
    console.log("Current Note:", currentNote);
    octaveUpdate(event.key);

    instrumentsIndex =
      parseInt(event.key) >= 1 && parseInt(event.key) <= 4
        ? parseInt(event.key) - 1
        : instrumentsIndex;

    if (currentNote) {
      Instruments.at(instrumentsIndex).triggerAttack(currentNote, Tone.now());
    }
  }
}

// Runs every time a key comes up.
function keyUp(event) {
  let keyNote = keyboardToNotesSettings.get(event.key);
  console.log("Current Note:", keyNote);
  console.log("Key up:", event.key);
  //This makes sure that the notes stop playing when lifted, and allows for swapping between instruments fluently
  // and makes sure that when a key is lifted, it will stop playing no matter the instrument it was initiated on.
  // If each instrument stopped in different ifs like they are initiatedthen swapping instruments could prevent a
  // note from stopping.

  // it returns in the browser console some weird dumb error of keyNote
  // not being defined
  if (typeof keyNote != "undefined") {
    for (const instrument of Instruments) {
      for (let i = 1; i <= 4; i++) {
        instrument.triggerRelease(
          keyNote.toString().slice(0, -1) + i,
          Tone.now(),
        );
      }
    }
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
