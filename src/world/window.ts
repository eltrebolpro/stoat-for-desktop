import { contextBridge, ipcRenderer } from "electron";

import { version } from "../../package.json";

contextBridge.exposeInMainWorld("native", {
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    desktop: () => version,
  },

  minimise: () => ipcRenderer.send("minimise"),
  maximise: () => ipcRenderer.send("maximise"),
  close: () => ipcRenderer.send("close"),

  setBadgeCount: (count: number) => ipcRenderer.send("setBadgeCount", count),

  /**
   * Screen share picker for Electron.
   * Registers a callback invoked when the app requests screen capture sources.
   */
  onScreenPicker: (
    callback: (
      sources: { id: string; name: string; thumbnail: string }[],
    ) => void,
  ) => {
    ipcRenderer.on("show-screen-picker", (_event, sources) =>
      callback(sources),
    );
  },

  /** Send the chosen screen source id back to the main process */
  selectScreenSource: (id: string) =>
    ipcRenderer.send("screen-source-selected", id),

  /** Cancel the screen share picker */
  cancelScreenShare: () => ipcRenderer.send("screen-source-selected", null),
});
