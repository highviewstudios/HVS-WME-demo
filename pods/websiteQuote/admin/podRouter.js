import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

//COMPONENTS
import Controller from "./files/controller";
import EditItems from "./files/items";
import QuoteDetail from "./files/quoteDetail";

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
                        <Route path={"/"} element={<Controller />} />
                        <Route path={"/editItems"} element={<EditItems />} />
                        <Route path={"/quote/:uuid"} element={<QuoteDetail />} />
                    </Routes>
                </div>
            )}
        </div>
    );
}

export default PodRouter;
