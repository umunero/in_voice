import clsx, { ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { parsePhoneNumberWithError } from "libphonenumber-js";

/**
 * Merge class names
 * @param inputs The class names to be merged.
 * @returns {string} The merged class names.
 */

export function classMerge(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}

/**
 * Create a URL with params and searchParams
 * @param url The base URL.
 * @param params The params to be added to the URL.
 * @param searchParams The searchParams to be added to the URL.
 * @returns {string} The URL with params and searchParams.
 */

export function createURL(
    url: string,
    params: { name: string; value: string | string[] }[],
    searchParams?: ReadonlyURLSearchParams
): string {
    const finalParams = new URLSearchParams(searchParams?.toString());

    params.forEach(param => {
        finalParams.delete(param.name); // remove existing values first

        if (Array.isArray(param.value)) {
            param.value.forEach(val => {
                if (val) finalParams.append(param.name, val);
            });
        } else if (param.value !== "") {
            finalParams.set(param.name, param.value);
        }
    });

    return `${url}?${finalParams.toString()}`;
}

/**
 * Create a URL params from an object
 * @param param The object to be converted to URL params.
 * @returns {Array<{name: string, value: string | string[]}>} The URL params.
 */

export function toCreateURLParams(
    param: { [key: string]: unknown }
): { name: string; value: string | string[] }[] {
    return Object.entries(removeEmptyStringValues(param))
        .map(([key, value]) => ({
            name: key,
            value: Array.isArray(value)
                ? value.map(v => v.toString())
                : value ? value.toString() : ""
        }));
}

/**
 * Convert a string to a number
 * @param value The string to be converted to a number.
 * @param defaultValue The default value to be returned if the string is not a number.
 * @returns {number} The converted number.
 */

// Overload 1: No defaultValue provided, can return undefined
export function toNumber(value: string | undefined): number | undefined;

// Overload 2: A defaultValue is provided, MUST return a number
export function toNumber(value: string | undefined, defaultValue: number): number;

// Implementation that serves both overloads
export function toNumber(value: string | undefined, defaultValue?: number): number | undefined {
    if (value === null || value === undefined || String(value).trim() === '') {
        return defaultValue;
    }

    const parsed = Number(value);

    if (isNaN(parsed)) {
        // If parsing fails, return the defaultValue if it exists.
        return defaultValue;
    }

    return parsed;
}

/**
 * Parse an enum value
 * @param value The value to be parsed.
 * @param enumObject The enum object.
 * @param fallback The fallback value to be returned if the value is not in the enum.
 * @returns {T[keyof T]} The parsed enum value.
 */

// Overload 1: No fallback provided, can return undefined
export function parseEnumValue<T extends Record<string, string>>(
    value: string | undefined,
    enumObject: T,
): T[keyof T] | undefined

// Overload 2: A fallback is provided, MUST return a value
export function parseEnumValue<T extends Record<string, string>>(
    value: string | undefined,
    enumObject: T,
    fallback: T[keyof T]
): T[keyof T]

export function parseEnumValue<T extends Record<string, string>>(
    value: string | undefined,
    enumObject: T,
    fallback: T[keyof T] | undefined = undefined
): T[keyof T] | undefined {
    return Object.values(enumObject).includes(value as T[keyof T])
        ? (value as T[keyof T])
        : fallback;
}

/**
 * Parse an enum array value
 * @param values The values to be parsed.
 * @param enumObject The enum object.
 * @returns {T[keyof T][] | undefined} The parsed enum array value.
 */
export function parseEnumArrayValue<T extends Record<string, string>>(
    values: (string | undefined)[] | string | null | undefined,
    enumObject: T
): T[keyof T][] | undefined {
    if (values === undefined || values == null || values.length === 0) return undefined;

    const enumValues = Object.values(enumObject);
    const filtered = Array.isArray(values) ? values.filter(
        (v): v is T[keyof T] => v !== undefined && enumValues.includes(v as T[keyof T])
    ) : values !== undefined && enumValues.includes(values as T[keyof T]) ? [values as T[keyof T]] : undefined;

    return filtered && filtered.length > 0 ? filtered : undefined;
}

/**
 * Remove empty string values from an object
 * @param obj The object to be cleaned.
 * @returns {Partial<T>} The cleaned object.
 */

export function removeEmptyStringValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj)
            // Keep if value is not null/undefined, empty string, empty array
            .filter(([, value]) => !(value === null || value === undefined || value.toString() === "" || (Array.isArray(value) && value.length === 0)))
            .sort(([a], [b]) => a.localeCompare(b)) // Sort keys alphabetically
    ) as Partial<T>;
}

/**
 * Compare two objects
 * @param obj1 The first object to be compared.
 * @param obj2 The second object to be compared.
 * @returns {boolean} True if the objects are equal, false otherwise.
 */

export function compareTwoObjects<T extends object>(
    obj1: T,
    obj2: T,
    path: string = "", // Added for tracking the location of differences
    consoleLog: boolean = true
): boolean {
    // If objects are strictly identical (same reference or same primitive value)
    if (obj1 === obj2) {
        // console.log(`${path}: Identical. No difference.`); // Too verbose for identical
        return true;
    }

    // If types are different or one is null/not an object
    if (
        typeof obj1 !== "object" ||
        obj1 === null ||
        typeof obj2 !== "object" ||
        obj2 === null
    ) {
        if (consoleLog) {
            console.log(
                `Difference at ${path || "root"}: Types or null status differ. obj1: ${obj1}, obj2: ${obj2}`
            );
        }
        return false;
    }

    // Handle Date objects
    if (obj1 instanceof Date && obj2 instanceof Date) {
        if (obj1.getTime() === obj2.getTime()) {
            return true;
        } else {
            if (consoleLog) {
                console.log(
                    `Difference at ${path || "root"}: Date values differ. obj1: ${obj1.toISOString()}, obj2: ${obj2.toISOString()}`
                );
            }
            return false;
        }
    }

    // Handle Arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            if (consoleLog) {
                console.log(
                    `Difference at ${path || "root"}: Array lengths differ. Length1: ${obj1.length}, Length2: ${obj2.length}`
                );
            }
            return false;
        }
        // Check every element recursively
        const areAllElementsEqual = obj1.every((val, i) =>
            compareTwoObjects(val, obj2[i], `${path}[${i}]`)
        );
        if (!areAllElementsEqual) {
            // The recursive call will have already logged the specific difference
            return false;
        }
        return true;
    }

    // Handle Objects (plain objects)
    const keys1 = Object.keys(obj1) as (keyof T)[];
    const keys2 = Object.keys(obj2) as (keyof T)[];

    // Check if number of keys is different
    if (keys1.length !== keys2.length) {
        const missingInObj2 = keys1.filter(key => !keys2.includes(key));
        const missingInObj1 = keys2.filter(key => !keys1.includes(key));
        if (consoleLog) {
            console.log(
                `Difference at ${path || "root"}: Key counts differ. Missing in obj2: ${missingInObj2.join(", ")}, Missing in obj1: ${missingInObj1.join(", ")}`
            );
        }
        return false;
    }

    // Iterate over keys and compare values
    return keys1.every(key => {
        const currentPath = path ? `${path}.${String(key)}` : String(key);
        const value1 = obj1[key];
        const value2 = obj2[key];

        // Check if key exists in obj2 (important if key counts were equal but keys differ)
        if (!obj2.hasOwnProperty(key)) {
            if (consoleLog) {
                console.log(`Difference at ${currentPath}: Key '${String(key)}' missing in obj2.`);
            }
            return false;
        }

        // Special handling for NaN (NaN !== NaN)
        if (typeof value1 === "number" && typeof value2 === "number") {
            if (Number.isNaN(value1) && Number.isNaN(value2)) return true; // Both NaN are considered equal
            if (value1 !== value2) {
                if (consoleLog) {
                    console.log(`Difference at ${currentPath}: Numbers differ. obj1: ${value1}, obj2: ${value2}`);
                }
                return false;
            }
            return true; // Numbers are equal
        }

        // Recursive call for nested objects/arrays
        if (
            typeof value1 === "object" &&
            typeof value2 === "object" &&
            value1 !== null && // Ensure neither is null
            value2 !== null
        ) {
            return compareTwoObjects(value1, value2, currentPath);
        } else {
            // Compare primitive values directly
            if (value1 !== value2) {
                if (consoleLog) {
                    console.log(
                        `Difference at ${currentPath}: Values differ. obj1: ${value1}, obj2: ${value2}`
                    );
                }
                return false;
            }
            return true; // Primitives are equal
        }
    });
}

/**
 * Assign a property to an object
 * @param obj The object to be assigned to.
 * @param key The key to be assigned to.
 * @param value The value to be assigned to.
 */

function assignProperty<T>(obj: Partial<T>, key: keyof T, value: unknown) {
    // We perform the cast here, where TS can often handle it better,
    // or we accept the cast is necessary due to generic limitations.
    obj[key] = value as T[keyof T];
}

/**
 * Filter an object by an enum
 * @param obj The object to be filtered.
 * @param keyEnum The enum object.
 * @returns {T} The filtered object.
 */

export function filterObjectByEnum<T extends object>(
    obj: T,
    keyEnum: object
): T {
    const enumValues = Object.values(keyEnum);
    const filteredObj: Partial<T> = {};
    const validKeys: (keyof T)[] = [];

    // 1. Filter for valid keys that exist in the input object
    enumValues.forEach(value => {
        const key = value as keyof T;
        // Ensure it's a string key and exists in the source object
        if (typeof key === 'string' && Object.prototype.hasOwnProperty.call(obj, key)) {
            validKeys.push(key);
        }
    });

    // 2. Sort the valid keys alphabetically
    validKeys.sort((a, b) => {
        // We cast to string to use localeCompare for robust sorting
        return (a as string).localeCompare(b as string);
    });

    // 3. Build the new object by adding keys in sorted order
    validKeys.forEach(key => {
        // Use the helper for type-safe assignment
        assignProperty(filteredObj, key, obj[key]);
    });

    return filteredObj as T;
}

/**
 * Split a phone number into country code and phone number
 * @param fullNumber The phone number to be split.
 * @returns {Object} The country code, phone number and validity.
 */

export function splitPhoneNumber(fullNumber: string): { countryCode: string | null; phoneNumber: string | null; isValid: boolean } {
    try {
        // Attempt to parse the number.
        // It tries to infer the country if a default region is not provided,
        // but explicit '+<country_code>' is best.
        const phoneNumber = parsePhoneNumberWithError(fullNumber);

        if (phoneNumber) {
            return {
                countryCode: `+${phoneNumber.countryCallingCode}`,
                phoneNumber: phoneNumber.nationalNumber,
                isValid: phoneNumber.isValid() // Check if the number is valid
            };
        }
    } catch (error) {
        // Will throw an error for invalid formats or unparsable numbers
        console.error(`Error parsing phone number "${fullNumber}":`, error);
    }

    return { countryCode: null, phoneNumber: null, isValid: false };
}

type NestedObject<T> = {
    [key: string]: NestedObject<T> | T;
};

export function createNestedObject<T>(keys: string[], finalValue: T): NestedObject<T> {
    // Ensure keys is an array of strings and not empty
    if (!Array.isArray(keys) || keys.length === 0) {
        return {};
    }

    // Initialize the result object.
    // We use `Record<string, any>` because the nested structure can be dynamic.
    // If you had a more specific, fixed structure, you could use a more precise type.
    const result: NestedObject<T> = {};
    let current: NestedObject<T> = result;

    // Iterate through the keys, excluding the very last one.
    // This loop builds the nested objects.
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // If the key doesn't exist or is not an object, initialize it as an empty object
        // This makes the function safer if an intermediate key somehow already existed
        // but was not an object (though in this specific use case, it shouldn't happen).
        if (typeof current[key] !== 'object' || current[key] === null) {
            current[key] = {};
        }
        current = current[key] as NestedObject<T>; // Move the pointer to the newly created (or existing) nested object
    }

    // After the loop, 'current' points to the innermost object.
    // Set the final value for the last key in the array.
    const lastKey = keys[keys.length - 1];
    current[lastKey] = finalValue;

    return result;
}