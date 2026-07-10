export interface ChipOption<T extends string> {
    value: T;
    label: string;
}

export interface MultiSelectChipsProps<T extends string> {
    options: ChipOption<T>[];
    selected: T[];
    onChange: (selected: T[]) => void;
}
