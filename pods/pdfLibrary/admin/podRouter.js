import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

//COMPONENTS
import Controller from "./files/controller";
import Uploader from "./files/pdf_Uploader";

function PodRouter() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div>
      {isLoaded && (
        <div>
          <Routes>
            <Route path="/" element={<Controller />} />
            <Route path="/upload" element={<Uploader modify={false} />} />
            <Route path="/modify/:id" element={<Uploader modify={true} />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default PodRouter;
