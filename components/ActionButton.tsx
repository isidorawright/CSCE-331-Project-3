import { Fab } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../models/store";

import SyncIcon from "@mui/icons-material/Sync";


export enum ActionButtonType {
  updateManager = 'updateManager',
}

function UpdateManagerButton() {
  const dispatch = useDispatch<Dispatch>();

  return <Fab
  color="secondary"
  aria-label="sync"
  sx={{
    position: "fixed",
    right: 0,
    bottom: 0,
    transform: "translate(-50%, -50%)",
  }}
  onClick={() => dispatch.manager.fetch()}
>
  <SyncIcon />
</Fab>
}

export default function ActionButton() {
  const state = useSelector((state: RootState) => state.actionButton);

  return <>
    {
      state.open &&
      {
        [ActionButtonType.updateManager]: <UpdateManagerButton />,
      }[state.type]
    }
  </>
}