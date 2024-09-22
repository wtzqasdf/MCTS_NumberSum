export function randNumber(numbers: number[]) {
    const idx = Math.round(Math.random() * (numbers.length - 1));
    return numbers[idx];
}
export function randFloat(min: number, max: number) {
    return (Math.random() * (max - min)) + min;
}
export function randInt(min: number, max: number): number {
    return Math.round((Math.random() * (max - min)) + min);
}