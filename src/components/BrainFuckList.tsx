import {MutableRefObject, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from "react";
import "../styles/BrainFuckList.css"
import { Global } from "../Modules/Global";
import BrainFuckManager from "../Modules/BrainFuckManager";

interface IBrainFuckListArguments extends Global.IStyleArgument {
    resetButtonId: string;
    runButtonId: string;
    inputId: string;
    updateIntervalId: MutableRefObject<number>;
    onUpdate?: (instruction: number, index: number, output: string, last: boolean) => void;
}

function BrainFuckList({className, resetButtonId, runButtonId, inputId, updateIntervalId, onUpdate = () => {}}: IBrainFuckListArguments): ReactElement {

    const onListUpdate = useCallback((instruction: number, index: number, output: string, last: boolean) => {
        setCurrentList(bfManager.current.getCurrentArray);
        onUpdate(instruction, index, output, last);
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
                   if ((document.getElementById(runButtonId) as HTMLButtonElement).value === "stop") {
                       bfManager.current.stopCurrentExecution();
                       return;
                   }

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

    const [showAsPtr, setShowAsPtr] = useState(false);

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
                <p style={{cursor: "default"}} onClick={() => setShowAsPtr(!showAsPtr)}>
                    {!showAsPtr ?
                    <>ptr<span style={{color: "var(--secondaryItems)"}}>:</span> {bfManager.current.current + 1}</> :
                        <><span style={{color: "var(--primaryItems)"}}>char</span><span style={{color: "var(--secondaryItems)"}}>*</span> ptr <span style={{color: "var(--secondaryItems)"}}>=</span> <span style={{color: "var(--secondaryItems)"}}>(</span>addr{bfManager.current.current === 0 ? "" : <> <span style={{color: "var(--secondaryItems)"}}>+</span> <span style={{color: "var(--primaryItems)"}}>0x{(bfManager.current.current).toString(16).toUpperCase()}</span></>}<span style={{color: "var(--secondaryItems)"}}>)</span>;
                    </>}
                </p>
            </div>
        </>
    );
}

export default BrainFuckList;