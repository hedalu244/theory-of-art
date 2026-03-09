interface range {
    label: string;
    min: number;
    max: number;
    value?: number;
    type: "int" | "float";
    step?: number;
    width: number;

    hideFeedback?: boolean;
    unit?: string;
}

function wrap(tagName: string, ...elelemts: (HTMLElement | Text)[]) {
    const wrapper = document.createElement(tagName);
    for (const elem of elelemts) {
        wrapper.appendChild(elem);
    }
    return wrapper;
}

export class InputTable {
    table: HTMLTableElement;

    constructor(parent: HTMLDivElement) {
        this.table = document.createElement("table");
        this.table.style.borderCollapse = "separate";
        this.table.style.borderSpacing = "8px 0px";

        parent.appendChild(this.table);
    }

    createRangeInput(range: range): HTMLInputElement {
        const label = document.createTextNode(range.label);
        if (range.step === undefined) {
            range.step = range.type === "int" ? 1 : 0.01;
        }
        if (range.value === undefined) {
            range.value = Math.round((range.min + range.max) / range.step / 2) * range.step;
        }

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = range.min.toString();
        slider.max = range.max.toString();
        slider.style.width = `${range.width}px`;
        slider.value = range.value.toString();
        slider.step = range.step.toString();
        slider.value = range.value.toString();

        if (range.hideFeedback) {
            const dummy = document.createElement("span");
            this.table.appendChild(wrap("tr", wrap("td", label), wrap("td", dummy), wrap("td", slider)));

            label.parentElement!.style.textAlign = "right";
        }
        else {
            const feedback = document.createElement("span");
            feedback.textContent = `${range.value}${range.unit ?? ""}`;
            slider.addEventListener("input", () => {
                feedback.textContent = `${slider.value}${range.unit ?? ""}`;
            });

            this.table.appendChild(wrap("tr", wrap("td", label), wrap("td", feedback), wrap("td", slider)));

            label.parentElement!.style.textAlign = "right";
            feedback.parentElement!.style.textAlign = "right";
        }


        return slider;
    }
}