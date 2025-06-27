'use client'

import { createContext, ReactNode, useContext, useState } from "react"

type ErrorContextType = {
    errorText: ReactNode | undefined
    setErrorText: (errorText: ReactNode) => void
}

const ErrorContext = createContext<ErrorContextType>({
    errorText: undefined,
    setErrorText: () => { } // No-op default function
})

/**
 * A custom hook to access the error context.
 * This hook simplifies consuming `errorText` and `setErrorText` within components.
 * It also ensures that the hook is used within an `ErrorProvider`.
 *
 * @returns The error context values (`errorText` and `setErrorText`).
 * @throws {Error} If `useErrorContext` is used outside of an `ErrorProvider`.
 */
export const useErrorContext = () => {
    const context = useContext(ErrorContext)
    if (!context) {
        throw new Error("useErrorContext must be used within a ErrorContext");
    }
    return context;
};

/**
 * The provider component for the ErrorContext.
 * It manages the `errorText` state and provides it, along with the `setErrorText` function,
 * to all child components wrapped by this provider.
 * This component should typically wrap parts of your application (e.g., in a layout)
 * where error messages need to be displayed.
 *
 * @param children - The child components that will have access to the error context.
 * @returns A React context provider that makes error state available to children.
 */
export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [errorText, setErrorText] = useState<ReactNode | undefined>(undefined)
    return <ErrorContext.Provider value={{ errorText, setErrorText }}> {children} </ErrorContext.Provider>
}

export default ErrorContext;