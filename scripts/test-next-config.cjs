const { loadConfig } = require('next/dist/server/config');
const { PHASE_PRODUCTION_BUILD } = require('next/constants');

async function check() {
  try {
    const conf = await loadConfig(PHASE_PRODUCTION_BUILD, process.cwd());
    console.log("Config loaded successfully!");
    console.log("Remote patterns:", conf.images.remotePatterns);
  } catch (err) {
    console.error("Config error:", err);
  }
}
check();
