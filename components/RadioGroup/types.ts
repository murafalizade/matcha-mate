export interface RadioOption<T extends string> {
    value: T;
    label: string;
}

export interface RadioGroupProps<T extends string> {
    options: RadioOption<T>[];
    value: T;
    onChange: (value: T) => void;
}
