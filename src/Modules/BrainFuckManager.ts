import {Global} from "./Global";
import {MutableRefObject} from "react";

class BrainFuckManager {
    onUpdate: (instruction: number, index: number, output: string, last: boolean) => void;
    array: Array<number> = Array(30000).fill(0);
    current: number = 0;
    outputCharacters: string = "";
    private updateInterval: MutableRefObject<number>;
    private instanceAlreadyRunning: boolean = false;
    private stop: boolean = false;

    constructor(onUpdate: (instruction: number, index: number, output: string, last: boolean) => void, updateInterval: MutableRefObject<number>) {
        this.onUpdate = onUpdate;
        this.updateInterval = updateInterval;
    }

    get getCurrentArray(): Array<number | null> {
        const value: Array<number | null> = [];
        for (let i = this.current - 5; i <= this.current + 5; i++) {
            if (i < 0 || i >= this.array.length)
                value.push(null);
             else
                value.push(this.array[i]);
        }
        return value;
    }

    stopCurrentExecution(): void {
        if (this.instanceAlreadyRunning)
            this.stop = true;
    }

    async runBrainFuck(code: string) {
        if (this.instanceAlreadyRunning || Global.hasUnclosedLoops(code) || !Global.isValidBrainfuck(code))
            return;

        this.instanceAlreadyRunning = true;

        const stack: Array<number> = [];

        for (let i = 0; i < code.length; i++) {
            if (this.stop) {
                this.stop = false;
                break;
            }

            switch (code[i]) {
                case ">":
                    this.current++;

                    if (this.current > 29999)
                        this.current = 0;

                    break;
                case "<":
                    this.current--;

                    if (this.current < 0)
                        this.current = 29999;

                    break;
                case "+":
                    this.array[this.current]++;

                    if (this.array[this.current] > 255)
                        this.array[this.current] = 0;

                    break;
                case "-":
                    this.array[this.current]--;

                    if (this.array[this.current] < 0)
                        this.array[this.current] = 255;

                    break;
                case "[":
                    if (this.array[this.current] === 0) {
                        let loopCount = 1;
                        while (loopCount > 0) {
                            i++;
                            if (code[i] === "[") {
                                loopCount++;
                            } else if (code[i] === "]") {
                                loopCount--;
                            }
                        }
                    } else {
                        stack.push(i);
                    }
                    break;
                case "]":
                    if (this.array[this.current] !== 0) {
                        i = stack[stack.length - 1];
                    } else {
                        stack.pop();
                    }
                    break;
                case ",":
                    const prompt: string | null = await Global.CustomPrompt("Introduce character", 1);
                    this.array[this.current] = prompt === null || prompt.length === 0 ? 0 : prompt.charCodeAt(0);
                    break;
                case ".":
                    this.outputCharacters += String.fromCharCode(this.array[this.current]);
                    break;
            }

            await Global.Delay(this.updateInterval.current);
            this.onUpdate(i, this.current, this.outputCharacters, i === code.length - 1);
        }

        this.instanceAlreadyRunning = false;
    }
}

export default BrainFuckManager;