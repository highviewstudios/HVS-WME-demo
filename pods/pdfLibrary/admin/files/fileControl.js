import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

//ACTIONS
import * as GS_navSettingsActions from "../../../../../store/actions/globalSettings/GS_navSettings";

//COMPONENTS
import PDF_Uploader from "./pdf_Uploader";

function FileControl() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GS_navSettingsActions.UpdateTitle("PDF Library"));
    dispatch(GS_navSettingsActions.UpdateSelected("Features"));
    dispatch(GS_navSettingsActions.UpdateSubSelected("Download Library"));
  }, []);

  return (
    <div>
      <PDF_Uploader />
    </div>
  );
}

export default FileControl;
