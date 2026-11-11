// Code Gate Invariant Verifier for Hà Gym PWA (v22+)
// Checks syntax + auto-save + v21->v22 state rescue + Google Sheet exact name parity + Apps Script upsert logic
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

function assert(cond, msg) {
  if (!cond) {
    console.error(`[FAIL] ${msg}`);
    process.exit(1);
  }
}

// 1. Syntax check all JS / GS files
['app.js', 'sw.js', 'google-apps-script.gs'].forEach((file) => {
  const full = path.join(root, file);
  const src = fs.readFileSync(full, 'utf8');
  try {
    new vm.Script(src, { filename: file });
  } catch (err) {
    console.error(`[SYNTAX ERROR] ${file}:`, err.message);
    process.exit(1);
  }
});

// 2. Cache version consistency gate (index.html, sw.js, app.js)
const htmlSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const swSrc = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

const appSwVer = (appSrc.match(/sw\.js\?v=(\d+)/) || [])[1];
const htmlAppVer = (htmlSrc.match(/app\.js\?v=(\d+)/) || [])[1];
const htmlCssVer = (htmlSrc.match(/styles\.css\?v=(\d+)/) || [])[1];
const swCacheVer = (swSrc.match(/ha-gym-apple-v(\d+)/) || [])[1];
assert(appSwVer && appSwVer === htmlAppVer && appSwVer === htmlCssVer && appSwVer === swCacheVer,
  `Version mismatch across files: app->sw=${appSwVer}, html->app=${htmlAppVer}, html->css=${htmlCssVer}, sw=${swCacheVer}`);

// 3. VM Runtime Simulation for app.js
function createAppEnv(initialStorage = {}) {
  const store = { ...initialStorage };
  const sandbox = {
    console,
    setTimeout: () => 1,
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    performance: { now: () => 0 },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    AudioContext: function () {},
    webkitAudioContext: function () {},
    navigator: { vibrate: () => {}, clipboard: { writeText: async () => {} } },
    fetch: async () => ({ ok: false }),
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    },
    document: {
      getElementById: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {}
    },
    window: {
      matchMedia: () => ({ matches: true }),
      addEventListener: () => {},
      location: { pathname: '/', reload: () => {}, replace: () => {} }
    }
  };
  sandbox.window.document = sandbox.document;
  vm.createContext(sandbox);
  vm.runInContext(
    appSrc + '\n;globalThis.__api = { getState: () => state, EXERCISES, REAL_GYM_PHOTOS, loadState, toggleSetDone, renderTodayTab, renderProgressTab, getTodayDateKey };',
    sandbox
  );
  return sandbox.__api;
}

const now = new Date();
const todayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

// Test A: Real gym photos exist on disk
const env0 = createAppEnv({});
Object.entries(env0.REAL_GYM_PHOTOS).forEach(([exId, photos]) => {
  photos.forEach((p) => {
    const imgPath = path.join(root, p.src);
    assert(fs.existsSync(imgPath), `Missing real gym photo for ${exId}: ${p.src}`);
  });
});

// Test B: Rescue checked sets from v21 localStorage into state.logs automatically
const v21Draft = {
  workoutMode: 'ESSENTIAL_7',
  todaySession: {
    EX08: { weight: 65, sets: [{ reps: 10, done: true }, { reps: 10, done: true }, { reps: 10, done: true }], rir: '1–2 RIR' },
    EX01: { weight: 165, sets: [{ reps: 10, done: true }, { reps: 10, done: true }, { reps: 8, done: false }], rir: '1–2 RIR' }
  }
};
const env1 = createAppEnv({ HA_GYM_PRO_STATE_V2: JSON.stringify(v21Draft) });
env1.loadState();
const rescuedRows = env1.getState().logs.filter((l) => l.date === todayStr);
assert(rescuedRows.length === 2, `Expected 2 rescued rows for ${todayStr}, got ${rescuedRows.length}`);

const todayHtml = env1.renderTodayTab();
assert(todayHtml.includes('Hôm nay: Đã lưu 2 bài ✓'), 'Today tab must display live saved counter');
assert(todayHtml.includes('Trước: 50 kg'), 'Today tab baseline must exclude today logs mid-workout');

const progressHtml = env1.renderProgressTab();
assert(progressHtml.includes('7 Bài Chuẩn'), 'Progress tab must label 7 Bài Chuẩn sessions accurately');

// Test C: Restore checkmarks if today's workout was already saved to logs earlier
const savedLogs = [
  ...env1.getState().logs.filter((l) => l.date !== todayStr),
  {
    date: todayStr,
    week: 6,
    workout: '7 Bài Chuẩn (18 Hiệp)',
    exercise: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy',
    weight: 65,
    reps: 30,
    volume: 1950,
    rir: '1–2 RIR',
    nextWeight: 70,
    note: 'Hiệp: 10/10/10',
    isLocal: true
  }
];
const env2 = createAppEnv({ HA_GYM_PRO_STATE_V2: JSON.stringify({ workoutMode: 'ESSENTIAL_7', logs: savedLogs, todaySession: {} }) });
env2.loadState();
assert(env2.getState().todaySession.EX08.sets[0].done === true && env2.getState().todaySession.EX08.weight === 65,
  'Failed to restore green checkmarks from saved today logs');

// Test D: Live toggleSetDone auto-saves & unticking removes auto-synced row
const env3 = createAppEnv({});
env3.loadState();
env3.toggleSetDone('EX11', 0);
assert(env3.getState().logs.filter((l) => l.date === todayStr).length === 1, 'toggleSetDone must auto-save immediately');
env3.toggleSetDone('EX11', 0);
assert(env3.getState().logs.filter((l) => l.date === todayStr).length === 0, 'Unticking all sets must remove auto-synced row');

// Test E: Google Apps Script upsert simulation (no duplicate rows on repeated auto-sync)
const gsSrc = fs.readFileSync(path.join(root, 'google-apps-script.gs'), 'utf8');
const sheetRows = [
  ['Ngày tập', 'Tuần', 'Buổi tập', 'Bài tập', 'Tạ (kg)', 'Số Reps', 'Tổng Volume (kg)', 'RIR', 'Tạ đề xuất (kg)', 'Ghi chú'],
  ['26/10/2026', 6, 'Workout B', 'Leg Press - Đạp đùi', 160, 8, 1280, '1 - 2 RIR', 165, '']
];
const gsSandbox = {
  SpreadsheetApp: {
    openById: () => ({
      getSheetByName: () => ({
        getDataRange: () => ({
          getDisplayValues: () => sheetRows.map((r) => r.map((c) => String(c).replace(/^'/, '')))
        }),
        getRange: (row1, col1, numR, numC) => ({
          setValues: (vals) => { sheetRows[row1 - 1] = vals[0]; }
        }),
        appendRow: (vals) => { sheetRows.push(vals); },
        getLastRow: () => sheetRows.length
      })
    })
  },
  ContentService: {
    MimeType: { JSON: 'JSON' },
    createTextOutput: (txt) => ({ setMimeType: () => txt })
  }
};
vm.createContext(gsSandbox);
vm.runInContext(gsSrc, gsSandbox);

gsSandbox.doPost({ postData: { contents: JSON.stringify({ action: 'upsertWorkout', rows: [{ date: '11/11/2026', week: 6, workout: '7 Bài Chuẩn', exercise: 'Leg Press - Đạp đùi', weight: 165, reps: 10, volume: 1650, rir: '1–2 RIR', nextWeight: 165, note: 'Hiệp: 10' }] }) } });
gsSandbox.doPost({ postData: { contents: JSON.stringify({ action: 'upsertWorkout', rows: [{ date: '11/11/2026', week: 6, workout: '7 Bài Chuẩn', exercise: 'Leg Press - Đạp đùi', weight: 165, reps: 30, volume: 4950, rir: '1–2 RIR', nextWeight: 170, note: 'Hiệp: 10/10/10' }] }) } });

assert(sheetRows.length === 3, `Expected 3 rows after upsert (no duplicates), got ${sheetRows.length}`);
assert(sheetRows[2][5] === 30 && sheetRows[2][0] === "'11/11/2026", 'Upsert failed to update reps in place or preserve string date');

console.log(`[PASS] All Hà Gym v${appSwVer} invariants verified (Auto-Save, Rescue, Hydrate, Upsert, Photos).`);
