function createElement(tagName: string, children: (HTMLElement | Text | string)[], options?:
    {
        id?: string,
        class?: string | string[],
        attributes?: { [key: string]: string },
        style?: Partial<CSSStyleDeclaration>
    }): HTMLElement {
    const wrapper = document.createElement(tagName);

    if (options?.id) {
        wrapper.id = options.id;
    }
    if (options?.class) {
        const classList = typeof options.class === "string" ? options.class.split(" ") : options.class;
        for (const cls of classList) {
            wrapper.classList.add(cls);
        }
    }
    for (const elem of children) {
        if (typeof elem === "string")
            wrapper.appendChild(document.createTextNode(elem));
        else
            wrapper.appendChild(elem);
    }
    if (options?.attributes) {
        for (const key in options.attributes) {
            wrapper.setAttribute(key, options.attributes[key]);
        }
    }
    if (options?.style) {
        for (const key in options?.style) {
            wrapper.style[key as any] = options?.style[key as any]!;
        }
    }
    return wrapper;
}

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

export class InputTable {
    table: HTMLTableElement;

    constructor(parent: HTMLDivElement) {
        this.table = createElement("table", [], {
            style: {
                borderCollapse: "separate",
                borderSpacing: "8px 0px"
            }
        }) as HTMLTableElement;

        parent.appendChild(this.table);
    }

    createRangeInput(range: range): HTMLInputElement {
        if (range.step === undefined) {
            range.step = range.type === "int" ? 1 : 0.01;
        }
        if (range.value === undefined) {
            range.value = Math.round((range.min + range.max) / range.step / 2) * range.step;
        }

        const slider = createElement("input", [],
            {
                attributes: {
                    type: "range",
                    min: range.min.toString(),
                    max: range.max.toString(),
                    value: range.value.toString(),
                    step: range.step.toString()
                }, style: {
                    width: `${range.width}px`
                }
            }) as HTMLInputElement;

        if (range.hideFeedback) {
            this.table.appendChild(
                createElement("tr", [
                    createElement("td", [range.label], { style: { textAlign: "right" } }),
                    createElement("td", [createElement("span", [])]),
                    createElement("td", [slider])
                ])
            );
        }
        else {
            const feedback = createElement("span", [`${range.value}${range.unit ?? ""}`]);

            slider.addEventListener("input", () => {
                feedback.textContent = `${slider.value}${range.unit ?? ""}`;
            });

            this.table.appendChild(
                createElement("tr", [
                    createElement("td", [range.label], { style: { textAlign: "right" } }),
                    createElement("td", [feedback], { style: { textAlign: "right" } }),
                    createElement("td", [slider])
                ])
            );
        }


        return slider;
    }
}