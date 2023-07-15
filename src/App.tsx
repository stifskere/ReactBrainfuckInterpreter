import './styles/App.css';
import {FormEvent, ReactElement, ClipboardEvent, useState, useEffect, useRef, MutableRefObject} from "react";
import BrainFuckList from "./components/BrainFuckList";
import {Global} from "./Modules/Global";
import "./styles/Alert.css"
import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {atomDark as theme} from "react-syntax-highlighter/dist/esm/styles/prism";

function App(): ReactElement {
    const [currentlyRunning, setCurrentlyRunning] = useState(false);
    const currentInput: MutableRefObject<string> = useRef("");

    async function InputSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const element: HTMLInputElement = document.getElementById("AppBrainFuckInput") as HTMLInputElement;

        if (!currentlyRunning && !Global.isValidBrainfuck(element.value)) {
            setCurrentlyRunning(false);
            await Global.CustomAlert("Error", "Your code seems to have invalid characters, please avoid using \"force paste\".");
            return;
        }

        if (!currentlyRunning && Global.hasUnclosedLoops(element.value)) {
            setCurrentlyRunning(false);
            await Global.CustomAlert("Error", "The code contains loops which are not closed.");
            return;
        }

        setCurrentlyRunning(!currentlyRunning);
    }

    function Reset() {
        (document.getElementById("AppBrainFuckOutput") as HTMLTextAreaElement).value = "";
    }

    function InputWriteCharacter(): void {
        const element: HTMLInputElement = document.getElementById("AppBrainFuckInput") as HTMLInputElement;
        if (!"><+-[],.".includes(element.value[element.selectionStart! - 1])) {
            const selStart = element.selectionStart! - 1;
            element.value = element.value!.slice(0, selStart) + element.value.slice(element.selectionStart!);
            element.selectionStart = selStart;
            element.selectionEnd = selStart;
        }
        currentInput.current = element.value;
    }

    function InputPasteCharacter(event: ClipboardEvent<HTMLInputElement>): void {
        event.preventDefault();

        let data: Array<string> = event.clipboardData.getData("text").split("");
        const element: HTMLInputElement = document.getElementById("AppBrainFuckInput") as HTMLInputElement;

        for (let i = 0; i < data.length; i++)
            if (!"><+-[],.".includes(data[i]))
                data.splice(i--, 1);

        element.value =  element.value.substring(0, element.selectionStart!) + data.join("") +  element.value.substring(element.selectionEnd!);
        currentInput.current = element.value;
    }

    function onUpdateBrainFuck(instruction: number, index: number, output: string, last: boolean) {
        const textArea: HTMLTextAreaElement = document.getElementById("AppBrainFuckOutput") as HTMLTextAreaElement;
        textArea.value = output;

        Global.highlightCharacter(instruction, "AppBrainFuckInput");

        if (last)
            setCurrentlyRunning(false);
    }

    const [manualContent, setManualContent] = useState("loading...");
    const manualUrl: string = "https://gist.githubusercontent.com/roachhd/dce54bec8ba55fb17d3a/raw/31683f81a80b83bee3eaf7f9e64cd2f5fc99e59e/README.md";
    (async () => {
        return await (await fetch(manualUrl)).text()
    })().then(r => setManualContent(r)).catch(() => setManualContent(`# Error while loading.\n[Navigate manually](${manualUrl})`));

    useEffect(() => {
        const runningTitles: Array<string> = ["Interpreter", "++[->+<]>", "Haha program go brr", "you said ++?", "why are you even...", "Making useful programs"];
        let i = 0;

        document.title = `Brainfuck - ${runningTitles[i++]}`;

        const interval = setInterval(() => {
            document.title = `Brainfuck - ${runningTitles[i = (i + 1) % runningTitles.length]}`;
        }, 3000);

        return () => clearInterval(interval);
    });

    const speedControlValue: MutableRefObject<number> = useRef(100);
    function onInputSpeed(): void {
        const speedControl: HTMLInputElement = document.getElementById("AppSpeedControl") as HTMLInputElement;
        speedControlValue.current = (speedControl.valueAsNumber = (speedControl.valueAsNumber !== null && speedControl.valueAsNumber >= 0 ? speedControl.valueAsNumber : speedControlValue.current));
    }

    return (<>
        <BrainFuckList className="AppBrainFuckList" resetButtonId="AppResetBrainFuck" runButtonId="AppRunOverBrainFuck" inputId="AppBrainFuckInput" onUpdate={onUpdateBrainFuck} updateIntervalId={speedControlValue}/>
        <form className="AppBrainFuckInput" onSubmit={InputSubmit}>
            {!currentlyRunning ? <input className="AppTextInput BoxLeft" id="AppBrainFuckInput" type="text" required={true}
                    onInput={InputWriteCharacter} onPaste={InputPasteCharacter} defaultValue={currentInput.current}/> :
                <div className="AppDivInput BoxLeft" id="AppBrainFuckInput">
                    {currentInput.current}
                </div>}
            <div>
                <input className="AppButton AppButtonNumberInput BoxMiddle AppDelayTooltip" id="AppSpeedControl"
                       type="number" defaultValue={speedControlValue.current} min={0} onBlur={onInputSpeed}/>
                <span className="AppTooltip">Millisecond delay</span>
            </div>
            <input className={`${currentlyRunning ? "AppDisabledButton" : "AppButton"} BoxMiddle`} id="AppResetBrainFuck" type="button" value="reset" onClick={Reset} disabled={currentlyRunning}/>
            <input className={`AppButton BoxRight ${currentlyRunning ? "AppStopButton" : ""}`} id="AppRunOverBrainFuck" type="submit" value={!currentlyRunning ? "run over" : "stop"}/>
        </form>
        <div className="AppBottom">
            <textarea id="AppBrainFuckOutput" className="AppBrainFuckOutput" readOnly={true} style={{fontSize: "4vh"}}/>
            <ReactMarkdown children={manualContent} className="AppBrainFuckOutput" components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            {...props}
                            children={String(children).replace(/\n$/, '')}
                            style={theme}
                            language={match[1]}
                            PreTag="div"
                        />
                    ) : (
                        <code {...props} className={className}>
                            {children}
                        </code>
                    )
                }
            }}/>
        </div>
    </>)
}

export default App;
