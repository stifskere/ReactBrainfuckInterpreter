import {CSSProperties} from "react";

export namespace Global {
    export interface IStyleArgument {
        className?: string | null;
        style?: CSSProperties | null;
    }

    export async function Delay(ms: number): Promise<void> {
        return await new Promise((resolve) => setTimeout(resolve, ms));
    }

    export function hasUnclosedLoops(code: string): boolean {
        const stack: Array<number> = [];

        for (let i = 0; i < code.length; i++) {
            if (code[i] === "[") {
                stack.push(i);
            } else if (code[i] === "]") {
                if (stack.length === 0) {
                    return true;
                }
                stack.pop();
            }
        }

        return stack.length > 0;
    }

    function addCustomAlertBaseElements(title: string, element: HTMLElement, resolve: () => void): [HTMLDivElement, () => void] {
        const backgroundWall = document.createElement("div");
        backgroundWall.classList.add("AppCustomAlertBackground");

        const modalContainer: HTMLDivElement = document.createElement("div");
        modalContainer.classList.add("AppCustomAlert");

        const modalTitle: HTMLHeadElement = document.createElement("h1");
        modalTitle.classList.add("AppCustomAlertTitle");
        modalTitle.textContent = title;

        const submitButton: HTMLButtonElement = document.createElement("button");
        submitButton.classList.add("AppCustomAlertButton");
        const possibleButtonText: Array<string> = ["Ok", "Yes", "Yeah", "Yup", "Mhm"];
        submitButton.innerText =  possibleButtonText[Math.floor(Math.random() * possibleButtonText.length)];

        function removeModal() {
            document.body.removeChild(modalContainer);
            document.body.removeChild(backgroundWall)
        }

        submitButton.addEventListener("click", () => {
            removeModal();
            resolve();
        });

        document.body.appendChild(backgroundWall);

        modalContainer.appendChild(modalTitle);
        modalContainer.appendChild(element);
        modalContainer.appendChild(submitButton);

        return [modalContainer, removeModal];
    }

    export async function CustomAlert(title: string, content: string): Promise<void> {
        return await new Promise(resolve => {
            const modalContent: HTMLParagraphElement = document.createElement("p");
            modalContent.classList.add("AppCustomAlertContent");
            modalContent.textContent = content;

            const modalContainer = addCustomAlertBaseElements(title, modalContent, resolve);
            document.body.appendChild(modalContainer[0]);
        });
    }

    export async function CustomPrompt(title: string, maxLength: number = 1000): Promise<string | null> {
        return await new Promise(resolve => {
            const modalContent: HTMLInputElement = document.createElement("input");
            modalContent.classList.add("AppCustomAlertInput");
            modalContent.placeholder = `max length: ${maxLength}`;

            modalContent.addEventListener("input", () => {
                if (modalContent.value.length > maxLength)
                    modalContent.value = modalContent.value!.slice(0, -1);
            });

            const cancelButton: HTMLButtonElement = document.createElement("button");
            cancelButton.classList.add("AppCustomAlertButton");
            const possibleButtonText: Array<string> = ["nuh uh!", "nop", "cancel", "no", "nah"];
            cancelButton.innerText =  possibleButtonText[Math.floor(Math.random() * possibleButtonText.length)];

            const [modalContainer, removeModal] = addCustomAlertBaseElements(title, modalContent, () => resolve(modalContent.value));
            document.body.appendChild(modalContainer);

            cancelButton.addEventListener("click", () => {
                removeModal();
                resolve(null);
            });

            modalContainer.appendChild(cancelButton);
        });
    }

    export function highlightCharacter(index: number, inputId: string): void {
        const input: HTMLElement = document.getElementById(inputId)!;
        if (input instanceof HTMLDivElement)
            input.innerHTML = `${input.textContent!.slice(0, index)}<span class="HighLightedInputCharacter">${input.textContent![index]}</span>${input.textContent!.slice(index + 1)}`;
    }

    export function isValidBrainfuck(code: string): boolean {
        for (const char of code)
            if (!("<>+-.,[]".split("")).includes(char))
                return false;
        return true;
    }
}