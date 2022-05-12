// Получаем значение flex по значению
export function getFlex(flex: number): string{
    if (flex == 1) 
        return `${flex} 1 calc(${45*flex}px)`;
    else 
        return `${flex} 1 calc(${45*flex + 10}px)`;
}

// Проверяем входит ли индекс в строку
export function isIn(index: number, inStr: string): boolean {
    return index >= 0 && index < inStr.length;
}