// src/components/ui/tabs.tsx
import React, { createContext, useContext, useState, ReactNode, FC } from "react";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export const Tabs: FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export const TabsList: FC<TabsListProps> = ({ children, className }) => {
  return <div role="tablist" className={className}>{children}</div>;
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsTrigger: FC<TabsTriggerProps> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within a Tabs");

  const { value: selectedValue, setValue } = context;
  const isActive = selectedValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setValue(value)}
      className={`${className ?? ""} ${isActive ? "data-[state=active]:bg-primary" : ""}`}
      data-state={isActive ? "active" : "inactive"}
      type="button"
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent: FC<TabsContentProps> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within a Tabs");

  const { value: selectedValue } = context;

  if (selectedValue !== value) return null;

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
};
