import React from 'react';
import { Input } from 'antd';

interface ContactInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // Any other props you want to forward, e.g., placeholder, maxLength, etc.
}

const ContactInput: React.FC<ContactInputProps> = ({
    value,
    onChange,
    ...rest
}) => {
    // Handler for onKeyDown to restrict input to numbers and control keys
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            !/[0-9]/.test(e.key) &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            e.key !== 'ArrowLeft' &&
            e.key !== 'ArrowRight' &&
            e.key !== 'Tab'
        ) {
            e.preventDefault();
        }
        if (rest.onKeyDown) rest.onKeyDown(e);
    };

    // Handler for onChange to sanitize the value
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const sanitized = inputValue === '' ? '' : inputValue.replace(/\D/g, '').slice(0, 11);
        if (onChange) {
            // Create a synthetic event with the sanitized value
            const event = {
                ...e,
                target: {
                    ...e.target,
                    value: sanitized,
                }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
        }
    };

    return (
        <Input
            {...rest}
            size='middle'
            value={value}
            placeholder={rest.placeholder || "Enter Contact Number"}
            maxLength={11}
            style={{ width: '100%', ...rest.style }}
            type="text"
            onKeyDown={handleKeyDown}
            onChange={handleChange}
        />
    );
};

export default ContactInput;