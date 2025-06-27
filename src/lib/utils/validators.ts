import { PASSWORD_MIN } from "../constants/config";
import { PASSWORD_REGEX } from "../constants/regex";

interface validatorProps {
    value: string,
    errorFormatMsg: string | { [key: string]: string }
}

/**
 * Password format validator
 * @param value The value to be validated.
 * @param errorFormatMsg The error message to be returned if the value is not valid.
 * @returns {Promise<void>} A promise that resolves if the value is valid, or rejects with an error if it is not.
 */

export function passwordFormatValidator({ value, errorFormatMsg }: validatorProps): Promise<void> {
    if (!value) return Promise.resolve(); // Allow empty values for optional fields

    if (typeof errorFormatMsg === "object") {
        // min
        if (value.length < PASSWORD_MIN) {
            return Promise.reject(new Error(errorFormatMsg["error_length"]));
        }

        // password format
        if (!PASSWORD_REGEX.test(value)) {
            return Promise.reject(new Error(errorFormatMsg["error_format"]));
        }
    }

    return Promise.resolve();
}