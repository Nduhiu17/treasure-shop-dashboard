import * as React from "react";

export function Tabs({ value, onValueChange, children, className }) {
  const [active, setActive] = React.useState(value);
  React.useEffect(() => {
    setActive(value);
  }, [value]);
  const handleChange = (val) => {
    setActive(val);
    if (onValueChange) onValueChange(val);
  };
  // Provide context for triggers/contents
  return (
    <TabsContext.Provider value={{ active, onChange: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext({ active: "", onChange: () => {} });

export function TabsList({ children, className }) {
  return <div className={`inline-flex rounded-lg p-1 ${className || ""}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className }) {
  const { active, onChange } = React.useContext(TabsContext);
  const isActive = active === value;
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
        ${isActive ? "bg-blue-700 text-white shadow" : "bg-white text-blue-900 hover:bg-blue-100"}
        ${className || ""}`}
      aria-selected={isActive}
      onClick={() => onChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  const { active } = React.useContext(TabsContext);
  if (active !== value) return null;
  return <div className="pt-4">{children}</div>;
}
