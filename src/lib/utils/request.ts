import { createHmac } from "crypto";

type Primitive = string | number | boolean | null | undefined;
type JSONValue = Primitive | JSONValue[] | { [key: string]: JSONValue };
interface JSONObject {
    [key: string]: JSONValue;
}

export type APIResultValue<T> = {
    success: boolean;
    error?: string | string[];
    data?: T;
    expired?: boolean;
} | undefined;

export const STATUS_CODE_SUCCESS = 200; //request success
export const STATUS_CODE_SUBMIT_DATA_NOT_VALID = 400; //frontend submit data error
export const STATUS_CODE_UNAUTHORIZED = 401; // unauthorized
export const STATUS_CODE_NO_PERMISSION = 403; //no permission
export const STATUS_CODE_TOKEN_EXPIRED = 403; // token expired
export const STATUS_CODE_URL_NOT_VALID = 404; //url not valid
export const STATUS_CODE_ACTION_ERROR = 500; //action error
export const STATUS_CODE_INTERNAL_ERROR = 503; // internal error
export const STATUS_CODE_TIMEOUT = 522; // timeout

export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

type FetchAPIOptions<T> = {
    method?: HTTPMethod;
    token?: string;
    data?: T;
} & RequestInit;

export default async function fetchAPI<T, P>(url: string, options: FetchAPIOptions<P> = {}, skipTimeout?: boolean): Promise<APIResultValue<T>> {
    try {
        return await fetchAPIData<T, P>(url, options)
        if (skipTimeout) {
        } else {
            return await Promise.race([
                fetchAPIData<T, P>(url, options),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000))
            ]);
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

const apiUrl = process.env.API_URL!
const appId = process.env.APP_ID!
const secret = process.env.SECRET_API_KEY!

async function fetchAPIData<T, P>(url: string, options: FetchAPIOptions<P> = {}): Promise<APIResultValue<T>> {
    const { method = "GET", token, data, ...rest } = options;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "AppId": appId,
        "Type": "Web",
        "Secret": secret,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...rest.headers,
    };

    const init: RequestInit = {
        method,
        headers,
        ...rest,
    };

    if (data && method !== "GET") {
        // copy data instead of reference
        init.body = formatter_params({ ...data });
    }
    // console.log("init", init)
    console.log("url", url)
    try {
        // console.log("fetching", `${API_URL}${url}`)
        const res = await fetch(`${apiUrl}${url}`, init);
        console.log("res", res)

        const contentType = res.headers.get("content-type");

        if (res.status === STATUS_CODE_UNAUTHORIZED) {
            return { success: false, error: res.statusText };
        } else if (res.status === STATUS_CODE_TIMEOUT) {
            return { success: false, error: "timeout" };
        }

        if (!contentType?.includes("application/json")) {
            if (!res.ok) {
                return { success: false, error: res.statusText };
            }
            return { success: true };
        }

        const json = await res.json();
        if (!res.ok) {
            console.log("response error", json);
            return {
                success: false,
                error: json.message,
            };
        }

        return {
            success: true,
            data: json.result as T,
        };
    } catch (error: unknown) {
        console.error("Fetch error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

function formatter_params(params: JSONObject = {}): string {
    const cloned: JSONObject = { ...params };
    cloned.requestTimestamp = Math.floor(Date.now() / 1000);

    const sorted: JSONObject = Object.keys(cloned)
        .sort()
        .reduce<JSONObject>((acc, key) => {
            acc[key] = cloned[key];
            return acc;
        }, {});
    // TODO
    // DateTime = yyyyMMddHHmmss
    // Decimal = “0” (e.g. 2,300.05 = 2300.05, 2,300.50 = 2300.5, 2,300.00 = 2300)

    const objectValues: string[] = Object.values(sorted)
        .filter((v) => v !== null && v !== undefined)
        .map((value) => {
            if (typeof value === "object") {
                return sortSubObjectKeys(value);
            }
            return String(value);
        });

    console.log("param before hash", objectValues.join(""));

    const signature = createHmac("md5", secret)
        .update(objectValues.join(""))
        .digest("hex");

    sorted.signature = signature;
    console.log("param with hash", JSON.stringify(sorted));
    return JSON.stringify(sorted);
}

// Recursive sort function
function sortSubObjectKeys(objValue: JSONValue): string {
    if (Array.isArray(objValue)) {
        const isPrimitiveArray = objValue.every(
            (item) => ["string", "number", "boolean"].includes(typeof item)
        );
        return isPrimitiveArray
            ? objValue.map(item => String(item)).join("")
            : objValue.map(sortSubObjectKeys).join("");
    } else if (objValue !== null && typeof objValue === "object") {
        return Object.keys(objValue)
            .sort()
            .map(key => sortSubObjectKeys(objValue[key]))
            .join("");
    } else if (typeof objValue === "boolean") {
        return objValue ? "1" : "0";
    }

    return String(objValue ?? "");
}