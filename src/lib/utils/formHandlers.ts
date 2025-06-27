import { ChangeEvent } from "react";
import { ALPHA_NUMBER_ONLY_REGEX, ASCII_PRINTABLE, FLOAT_ONLY_REGEX, NUMBER_ONLY_REGEX, REMOVE_ZERO_PREFIX_REGEX } from "../constants/regex";
interface HandleInputProps {
    e: ChangeEvent<HTMLInputElement>,
    updateValue: (value: string) => void
}

/**
 * Handle number input
 * @param e The change event.
 * @param updateValue The function to update the value.
 * @param limit The limit of the number of characters.
 * @returns {string} The filtered value.
 */

export const handleNumberInput = ({ e, updateValue, limit }: HandleInputProps & { limit?: number }): string => {
    const { value } = e.target;
    let filteredValue = value.replace(NUMBER_ONLY_REGEX, ""); // Remove non-numeric characters
    if (limit && filteredValue.length > limit) {
        filteredValue = value.slice(0, limit); // Enforce character limit
    }
    updateValue(filteredValue);
    return filteredValue;
}

/**
 * Handle float input on change
 * @param e The change event.
 * @param updateValue The function to update the value.
 * @param precision The precision of the float.
 * @param max The max value of the float.
 * @returns {string} The filtered value.
 */

export const handleFloatInputOnChange = ({ e, updateValue, precision, max }: HandleInputProps & { precision: number, max?: number }): string => {
    // Remove non-numeric and non-decimal characters
    const { value } = e.target;
    let filteredValue = value.replace(FLOAT_ONLY_REGEX, ""); // Remove non-numeric characters

    // Prevent multiple decimal points
    const parts = value.split(".");
    if (parts.length > 2) {
        filteredValue = parts[0] + "." + parts.slice(1).join(""); // Keep only the first dot
    }

    // Remove unnecessary leading zeros (preserve "0.")
    filteredValue = filteredValue.replace(REMOVE_ZERO_PREFIX_REGEX, "");

    // Enforce decimal precision
    // if (value.includes(".")) {
    //     const [integer, decimal] = value.split(".");
    //     value = integer + "." + decimal.slice(0, precision);
    // }
    if (precision) {
        filteredValue = filteredValue.slice(0, precision + 1);
    }

    // Ensure at least "0" if empty
    if (filteredValue === "" || filteredValue === ".") {
        filteredValue = "0";
    }

    // Enforce max value if provided
    if (max !== undefined) {
        const numericValue = parseFloat(filteredValue);
        if (!isNaN(numericValue) && numericValue > max) {
            filteredValue = max.toString();
        }
    }

    // Update the form field
    updateValue(filteredValue);
    return filteredValue;
}

/**
 * Handle float input on blur
 * @param e The blur event.
 * @param updateValue The function to update the value.
 * @param min The min value of the float.
 * @returns {string} The filtered value.
 */

export const handleFloatInputOnBlur = ({ e, updateValue, min }: HandleInputProps & { min?: number }): string => {
    const { value } = e.target;
    let filteredValue = value

    // If only "." was entered, reset to "0"
    if (filteredValue === ".") {
        filteredValue = "0";
    }

    // If value starts with ".", prepend "0" (e.g., ".5" → "0.5")
    if (filteredValue.startsWith(".")) {
        filteredValue = "0" + filteredValue;
    }

    // If value ends with ".", remove it (e.g., "1." → "1")
    if (filteredValue.endsWith(".")) {
        filteredValue = filteredValue.slice(0, -1);
    }

    // Normalize small or zero-like float values (e.g., 0.00000000 → 0)
    const parsed = parseFloat(filteredValue);
    if (!isNaN(parsed) && parsed === 0 && filteredValue !== "0") {
        if (min !== undefined && parsed < min) {
            filteredValue = String(min);
        } else {
            filteredValue = "0";
        }
    }

    // Update the form field
    updateValue(filteredValue)
    return filteredValue;
}

/**
 * Handle positive number input
 * @param e The change event.
 * @param updateValue The function to update the value.
 * @param max The max value of the number.
 * @returns {string} The filtered value.
 */

export const handlePositiveNumberInput = ({ e, updateValue, max }: HandleInputProps & { max?: number }): string => {
    const { value } = e.target;
    let filteredValue = value.replace(NUMBER_ONLY_REGEX, ""); // Remove non-numeric characters
    // Ensure value isn't empty
    if (filteredValue === "") filteredValue = "0";

    // Remove unnecessary leading zeros (preserve "0.")
    filteredValue = filteredValue.replace(REMOVE_ZERO_PREFIX_REGEX, "");

    //  // Enforce max value if provided
    if (max !== undefined && Number(filteredValue) > max) {
        filteredValue = max.toString();
    }

    // Update form field
    updateValue(filteredValue)

    return filteredValue;
}

/**
 * Handle alpha numeric input
 * @param e The change event.
 * @param updateValue The function to update the value.
 * @param max The max value of the number.
 * @returns {string} The filtered value.
 */

export const handleAlphaNumericInput = ({ e, updateValue, max }: HandleInputProps & { max?: number }): string => {
    const { value } = e.target;
    let filteredValue = value.replace(ALPHA_NUMBER_ONLY_REGEX, ""); // Remove non-numeric characters
    if (max !== undefined && filteredValue.length > max) {
        filteredValue = value.slice(0, max); // Enforce character limit
    }
    updateValue(filteredValue);
    return filteredValue;
}

/**
 * Handle ASCII printable input
 * @param e The change event.
 * @param updateValue The function to update the value.
 * @param max The max value of the number.
 * @returns {string} The filtered value.
 */

export const handleASCIIPrintableInput = ({ e, updateValue, max }: HandleInputProps & { max?: number }): string => {
    const { value } = e.target;
    let filteredValue = value.replace(ASCII_PRINTABLE, ""); // Remove non-numeric characters
    if (max !== undefined && filteredValue.length > max) {
        filteredValue = value.slice(0, max); // Enforce character limit
    }
    updateValue(filteredValue);
    return filteredValue;
}

/**
 * Handle title case input
 * @param input The input value.
 * @returns {string} The filtered value.
 */

export const handleTitleCase = ({ e, updateValue }: HandleInputProps): string => {
    const { value } = e.target;
    const filteredValue = value
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    updateValue(filteredValue)
    return filteredValue
}