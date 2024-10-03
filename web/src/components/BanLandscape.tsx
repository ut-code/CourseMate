import { useCallback, useEffect, useState } from "react";

const BanLandscape = () => {
  const [isLandscape, setIsLandscape] = useState(false);

  const checkOrientation = useCallback(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /iPhone|Android|Mobile/i.test(userAgent);
    if (isMobile && window.matchMedia("(orientation: landscape)").matches) {
      setIsLandscape(true);
    } else {
      setIsLandscape(false); // モバイルデバイスでない場合は常に縦画面扱い
    }
  }, []);

  useEffect(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, [checkOrientation]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {isLandscape && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              textAlign: "center",
              fontSize: "20px",
              color: "#333",
            }}
          >
            このアプリは縦画面で使用してください
          </div>
        </div>
      )}
    </div>
  );
};

export default BanLandscape;
