type interpMode = "linear" | "cos" | "cubic" ;

export function sequenceNumber(arr: number[], t: number, stop: number, transition: number, mode: interpMode = "linear"): number {
    const N = arr.length;
    const total = stop + transition;
    const i = Math.floor(t / total) % N;
    const t2 = t % total;

    if (t2 < stop) {
        return arr[i];
    } else {
        const next = arr[(i + 1) % N];
        const prev = arr[i];
        const ratio = (t2 - stop) / transition;
        const interp = (mode === "linear") ? ratio :
                       (mode === "cos") ? (1 - Math.cos(ratio * Math.PI)) / 2 :
                       (mode === "cubic") ? (3 * ratio ** 2 - 2 * ratio ** 3) :
                       ratio;
        return prev * (1 - interp) + next * interp;
    }
}