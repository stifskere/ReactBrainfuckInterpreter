import {MutableRefObject, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from "react";
import "../styles/BrainFuckList.css"
import { Global } from "../Modules/Global";
import BrainFuckManager from "../Modules/BrainFuckManager";

interface IBrainFuckListArguments extends Global.IStyleArgument {
    resetButtonId: string;
    runButtonId: string;
    inputId: string;
    updateIntervalId: string;
    onUpdate?: (instruction: number, index: number, output: string) => void;
}

function BrainFuckList({className, resetButtonId, runButtonId, inputId, updateIntervalId, onUpdate = () => {}}: IBrainFuckListArguments): ReactElement {

    const onListUpdate = useCallback((instruction: number, index: number, output: string) => {
        setCurrentList(bfManager.current.getCurrentArray);
        onUpdate(instruction, index, output);
    }, [onUpdate]);

    let bfManager: MutableRefObject<BrainFuckManager> = useRef(new BrainFuckManager(onListUpdate, updateIntervalId));

    const arrInitialState: Array<number | null> = useMemo(() => [...Array(5).fill(null), ...Array(6).fill(0)], []);
    const [getCurrentList, setCurrentList] = useState(arrInitialState);

    useEffect(() => {
       function onPageLoad(): void {
           (document.getElementById(resetButtonId) as HTMLButtonElement)
               .addEventListener('click', () => {
                   bfManager.current = new BrainFuckManager(onListUpdate, updateIntervalId);
                   setCurrentList(arrInitialState);
               });
           (document.getElementById(runButtonId) as HTMLButtonElement)
               .addEventListener('click', async () => {
                   await bfManager.current.runBrainFuck((document.getElementById(inputId) as HTMLInputElement).value);
               });
       } 
       
       if (document.readyState === "complete") {
           onPageLoad();
       } else {
           window.addEventListener('load', onPageLoad);
           return () => window.removeEventListener('load', onPageLoad);
       }
           
    }, [arrInitialState, inputId, resetButtonId, runButtonId, onListUpdate, updateIntervalId]);

    return (
        <>
            <div className={`BrainFuckListBackground ${className ?? ""}`}>
                {getCurrentList.map((value: number | null, index: number) =>
                    (<div className={`BrainFuckListItem ${index === 5 ? "BrainFuckListSelectedItem" : ""}`} key={index} style={{visibility: value === null ? "hidden" : "visible"}}>
                        {value ?? "X"}
                    </div>)
                )}
            </div>
            <div className="BrainFuckListIndex">
                <p>ptr: {bfManager.current.current + 1}</p>
            </div>
        </>
    );
}

export default BrainFuckList;