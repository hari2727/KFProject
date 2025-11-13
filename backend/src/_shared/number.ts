export const getNextNumber = ((base) => (): number => base++)(new Date().getTime());

export const clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value))
};
