
import { SAMPLERATE } from '../environment';
import { SineOscillator } from '../synth/sineoscillator.class';
import { StereoSignal } from '../synth/stereosignal.class';
import { Envelope } from '../synth/envelope.class';
import { DelayLine } from '../fx/delayline';
import { notefreq } from '../synth/note';

export class TestInstrument {
    private _note: f32;
    readonly envelope: Envelope = new Envelope(0.02, 0.2, 0.2, 0.2);
    readonly sineoscillator: SineOscillator = new SineOscillator();
    readonly sineoscillator2: SineOscillator = new SineOscillator();
    readonly delayline: DelayLine = new DelayLine(SAMPLERATE * 0.5 as usize);
    readonly delayline2: DelayLine = new DelayLine(SAMPLERATE * 0.5 as usize);
    readonly signal: StereoSignal = new StereoSignal();

    set note(note: f32) {        
        if(note!==this.note && note > 1) {            
            this.envelope.attack();            
            this.sineoscillator.frequency = notefreq(note);
            this.sineoscillator2.frequency = notefreq(note + 12);
        } else if(note===0) {
            this.envelope.release();
        }
        this._note = note;
    }

    get note(): f32 {
        return this._note;
    }

    next(): void {                
        let env: f32 = this.envelope.next();
        if(env === 0) {
            this.signal.clear();            
        } else {
            let osc1 = env * this.sineoscillator.next();
            let osc2 = env * this.sineoscillator2.next();
            this.signal.left = osc1 * 0.8 + osc2 * 0.2;
            this.signal.right = osc1 * 0.2 + osc2 * 0.8;
        }
    } 
}
  