import { createContext, useContext } from "react";

interface AdminLayoutContextType {
  openMobileMenu: () => void;
}

export const AdminLayoutContext = createContext<AdminLayoutContextType>({
  openMobileMenu: () => {},
});

export const useAdminLayout = () => useContext(AdminLayoutContext);
