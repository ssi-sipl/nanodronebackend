import { exec } from "child_process";

/**
 * Restart the MediaMTX Docker container
 * @returns {Promise<string>} Resolves with stdout on success, rejects with error message on failure
 */
export function restartMediaMTXContainer() {
  return new Promise((resolve, reject) => {
    exec("sudo docker restart mediamtx", (error, stdout, stderr) => {
      if (error) {
        console.error("Error restarting MediaMTX container:", error);
        reject(`Failed to restart MediaMTX container: ${error.message}`);
        return;
      }
      if (stderr) {
        console.warn("Docker restart stderr:", stderr);
      }
      console.log("MediaMTX container restarted successfully.");
      resolve(stdout.trim());
    });
  });
}
