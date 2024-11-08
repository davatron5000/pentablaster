import * as Tone from 'https://esm.sh/tone@next';
const synth = new Tone.PolySynth().toDestination();
const pads = document.querySelectorAll('.pad');
const transpose = document.querySelector('#transpose')
let toneStarted = false;

const notes = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
]


const noteText = ['I','II','III', 'IV', 'V'];

const scales = {
  bluesmaj: ['C','D','F','G','A'],
  bluesmin: ['C', 'Eb', 'F', 'Ab', 'Bb'],
  major: ['C', 'E', 'F', 'G', 'B'],
  minor: ['C', 'Eb', 'F', 'G', 'Bb'],
  egyptian: ['C','D','F','G','Bb']
}

const keys = 'yuiophjkl;qwertasdfgzxcvb'.split('');

function getNote(note) {
  
    const shift = parseFloat(transpose.value)
    const newNote = Tone.Frequency(note).transpose(shift).toNote()  
    return newNote
}

function updateTransposeValue() {
  transposeValue.value = notes.at(transpose.value) ?? 'C'
}

document.addEventListener('load', updateTransposeValue)
transpose.addEventListener('input', updateTransposeValue)

function setupScale(scaleKey) {
  pads.forEach((pad, index) => {
    const row = 6 - (Math.floor(index / 5) + 1)
    const newNote =  scales[scaleKey][index % 5] + row;
    
    pad.id = newNote
    pad.textContent = noteText[index % 5] + row;
  })
}

document.addEventListener('DOMContentLoaded', () => setupScale('minor'))

// setup notes on select
scale.addEventListener('change', (e) => {
    const scaleKey = e.target.value
    setupScale(scaleKey)
})

// bind event listeners for pads
pads.forEach(pad => {
  pad.addEventListener('pointerdown', async (event) => {
    event.preventDefault();
    
    if(!toneStarted) {
      await Tone.start()
      toneStarted = true;
    }
        
    if(!pad.classList.contains('pressed')) {
      const note = getNote(pad.id)
      synth.triggerAttack(note);
      pad?.classList.add('pressed');
    }
  })
  
  pad.addEventListener('pointerup', (event) => {    
      const note = getNote(pad.id)
      synth.triggerRelease(note);
      pad?.classList.remove('pressed');
  })
})

document.addEventListener('keydown', async (event) => {
    event.preventDefault();
  
    if(!toneStarted) {
      await Tone.start()
      toneStarted = true;
    }
  
    const num = keys.indexOf(event.key)
    const pad = pads[num]
    
    if(pad && !pad.classList.contains('pressed')) {
      const note = getNote(pad.id)

      // play note
      synth.triggerAttack(note);
      pad.classList.add('pressed')
    }
} )

document.addEventListener('keyup', (event) => {
  event.preventDefault();
  
    const num = keys.indexOf(event.key)
    const pad = pads[num];
    
    if(pad) {
      const note = getNote(pad.id)
      synth.triggerRelease(note);
      pad?.classList.remove('pressed');
    }
})

if(!('commandfor' in HTMLElement.prototype)) {
  document.querySelectorAll('[commandfor]').forEach(cmd => {
    cmd.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.getElementById(cmd.getAttribute('commandfor'))
      
      target[cmd.getAttribute('command')]()
    })
  })
}