import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type CalProviderProps = {
  apiKey: string;
  children: ReactNode;
};

const ApiKeyContext = createContext({ key: "", error: "" });

export const useApiKey = () => useContext(ApiKeyContext);

export function CalProvider({ apiKey, children }: CalProviderProps) {
  const [key, setKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <ApiKeyContext.Provider value={{ key: key, error: errorMessage }}>{children}</ApiKeyContext.Provider>
  );
}
