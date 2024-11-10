"use client";

import { type ReactNode, createContext, useContext, useState } from "react";

export type Alert = {
  AlertMessage: string;
  subAlertMessage?: string;
  yesMessage: string;
  clickYes?: () => void;
};

export type AlertContextType = {
  showAlert: (alertProps: Alert) => void;
};

type AlertProviderProps = {
  children: ReactNode;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alertProps, setAlertProps] = useState<Alert | null>(null);

  const showAlert = (props: Alert) => {
    setAlertProps(props);
  };

  const handleClose = () => {
    setAlertProps(null);
  };

  const handleYesClick = () => {
    if (alertProps?.clickYes) {
      alertProps.clickYes();
    }
    handleClose();
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertProps && (
        // https://daisyui.com/components/modal/#method-1-using-dialog-element-recommended
        // TODO: 挙動を修正 (外をクリックしたり ESC を押したときに閉じるようにする)
        <dialog
          id="alert-dialog"
          className="modal modal-open"
          onClose={handleClose}
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">{alertProps.AlertMessage}</h3>
            <p className="py-4">{alertProps.subAlertMessage}</p>
            <div className="modal-action">
              <form method="dialog">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="btn text-red-500"
                    onClick={handleYesClick}
                  >
                    {alertProps.yesMessage}
                  </button>
                  <button type="button" className="btn" onClick={handleClose}>
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </AlertContext.Provider>
  );
};

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
