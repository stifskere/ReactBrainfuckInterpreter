import './styles/App.css';

import {FormEvent, ReactElement, ClipboardEvent, useState} from "react";
import BrainFuckList from "./components/BrainFuckList";
import { Global } from "./Modules/Global";
import "./styles/Alert.css"
import ReactMarkdown from "react-markdown";
import highlightCharacter = Global.highlightCharacter;

function App(): ReactElement {
  async function InputSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const element: HTMLInputElement = document.getElementById("AppBrainFuckInput") as HTMLInputElement;

    if (Global.hasUnclosedLoops(element.value)) {
        await Global.CustomAlert("Error", "The code contains loops which are not closed.");
        event.stopPropagation();
        return;
    }
  }

  function Reset() {
      const element: HTMLTextAreaElement = document.getElementById("AppBrainFuckOutput") as HTMLTextAreaElement;
      element.value = "";
  }

  function InputWriteCharacter(): void {
      const element: HTMLInputElement = document.getElementById("AppBrainFuckInput") as HTMLInputElement;
      if (!"><+-[],.".includes(element.value[element.value.length - 1]))
        element.value = element.value!.slice(0, -1);
  }

  function InputPasteCharacter(event: ClipboardEvent<HTMLInputElement>): void {
      event.preventDefault();
      let data: Array<string> = event.clipboardData.getData("text").split("");

      for (let i = 0; i < data.length; i++)
          if (!"><+-[],.".includes(data[i]))
              data.splice(i--, 1);

      const element: HTMLInputElement = document.getElementById("AppBrainFuckInput") as HTMLInputElement;
      element.value += data.join("");
  }

  function onUpdateBrainFuck(instruction: number, index: number, output: string) {
      const textArea: HTMLTextAreaElement = document.getElementById("AppBrainFuckOutput") as HTMLTextAreaElement;
      textArea.value = output;

      highlightCharacter(instruction, "AppBrainFuckInput");
  }

  const [manualContent, setManualContent] = useState("loading...");
  (async () => {return await (await fetch("https://gist.githubusercontent.com/roachhd/dce54bec8ba55fb17d3a/raw/31683f81a80b83bee3eaf7f9e64cd2f5fc99e59e/README.md")).text()})().then(r => setManualContent(r)).catch(() => "Error while loading.");

  return (<>
    <BrainFuckList className="AppBrainFuckList" resetButtonId="AppResetBrainFuck" runButtonId="AppRunOverBrainFuck" inputId="AppBrainFuckInput" onUpdate={onUpdateBrainFuck} updateIntervalId="AppSpeedControl"/>
    <form className="AppBrainFuckInput" onSubmit={InputSubmit}>
        <input className="AppTextInput BoxLeft" id="AppBrainFuckInput" type="text" required={true} onInput={InputWriteCharacter} onPaste={InputPasteCharacter}/>
        <div>
            <input className="AppButton AppButtonNumberInput BoxMiddle AppDelayTooltip" id="AppSpeedControl" type="number" defaultValue={100}/>
            <span className="AppTooltip">Millisecond delay</span>
        </div>
        <input className="AppButton BoxMiddle" id="AppResetBrainFuck" type="button" value="reset" onClick={Reset}/>
        <input className="AppButton BoxRight" id="AppRunOverBrainFuck" type="submit" value="run over"/>
    </form>
      <div className="AppBottom">
          <textarea id="AppBrainFuckOutput" className="AppBrainFuckOutput" readOnly={true} style={{fontSize: "4vh"}}/>
          <ReactMarkdown children={manualContent} className="AppBrainFuckOutput"/>
      </div>
  </>)
}

export default App;
