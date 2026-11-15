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
function createAppEnv(initialStorage = {}, mockInputs = {}) {
  const store = { ...initialStorage };
  const domElements = {};
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
      getElementById: (id) => {
        if (id in mockInputs) {
          return { value: mockInputs[id], innerHTML: '', textContent: '', style: {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} } };
        }
        if (!domElements[id]) {
          domElements[id] = { value: '', innerHTML: '', textContent: '', style: {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} } };
        }
        return domElements[id];
      },
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
    appSrc + '\n;globalThis.__api = { getState: () => state, EXERCISES, REAL_GYM_PHOTOS, GOLDEN_40_TARGETS, getCurrentBodyProfile, onBlueprintSlide, submitBodyMeasurement, getTodayExercises, getTargetSetsCount, getExerciseCalorieInfo, calculateEnergyStats, calculateStreakStats, openStreakSheet, startExerciseTimer, setWorkoutMode, loadState, toggleSetDone, renderTodayTab, renderProgressTab, renderCardioBodyTab, getTodayDateKey };',
    sandbox
  );
  return { ...sandbox.__api, domElements: () => domElements };
}

const now = new Date();
const todayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

// Test A: Real gym photos exist, EX04 locked on T2 MULTI PRESS, EX14 Farmer Hold card active (22 sets), monotonic floors (2 -> 1)
const env0 = createAppEnv({});
env0.loadState();
assert(env0.EXERCISES.length === 14, `Expected 14 canonical exercises, got ${env0.EXERCISES.length}`);
const ex01 = env0.EXERCISES.find((e) => e.id === 'EX01');
assert(ex01 && ex01.inc === 10 && env0.getState().todaySession.EX01.weight === 180 && env0.getState().exTargets3M.EX01 === 240,
  'EX01 Leg Press must default to +10kg step, 180kg next working weight, and 240kg 3M target');

const ex04 = env0.EXERCISES.find((e) => e.id === 'EX04');
assert(ex04 && ex04.floor === 2 && env0.REAL_GYM_PHOTOS.EX04[0].src.includes('t2_multi_press'),
  'EX04 Shoulder Press must be locked onto Floor 2 MULTI PRESS');

const ex14 = env0.EXERCISES.find((e) => e.id === 'EX14');
assert(ex14 && ex14.floor === 1 && ex14.unit === 'giây' && ex14.repMax === 45,
  'EX14 Farmer Hold must be configured on Floor 1 with 45 giây target');

const defaultRoutine = env0.getTodayExercises();
assert(defaultRoutine.some((e) => e.id === 'EX10'), 'Default routine must include EX10 Lateral Raise');
assert(defaultRoutine[defaultRoutine.length - 1].id === 'EX14', 'Default routine must finish with EX14 Farmer Hold on Floor 1');
const totalDefaultSets = defaultRoutine.reduce((sum, e) => sum + env0.getTargetSetsCount(e), 0);
assert(totalDefaultSets === 22, `Expected 22 sets in 9 Bài Chuẩn, got ${totalDefaultSets}`);

// Ensure every workout mode flows monotonically Floor 2 -> Floor 1 (zero stair back-and-forth)
['ESSENTIAL_7', 'WORKOUT_A', 'WORKOUT_B'].forEach((mode) => {
  env0.setWorkoutMode(mode);
  const list = env0.getTodayExercises();
  for (let i = 1; i < list.length; i++) {
    assert(list[i].floor <= list[i - 1].floor,
      `Broken floor sequence in ${mode}: ${list[i - 1].id} (F${list[i - 1].floor}) -> ${list[i].id} (F${list[i].floor})`);
  }
});
env0.setWorkoutMode('ESSENTIAL_7');

Object.entries(env0.REAL_GYM_PHOTOS).forEach(([exId, photos]) => {
  photos.forEach((p) => {
    const imgPath = path.join(root, p.src);
    assert(fs.existsSync(imgPath), `Missing real gym photo for ${exId}: ${p.src}`);
  });
});

// Test B: Rescue checked sets from v21 localStorage into state.logs automatically
const v21Draft = {
  workoutMode: 'ESSENTIAL_7',
  exTargets3M: { EX01: 200 },
  todaySession: {
    EX08: { weight: 65, sets: [{ reps: 10, done: true }, { reps: 10, done: true }, { reps: 10, done: true }], rir: '1–2 RIR' },
    EX01: { weight: 165, sets: [{ reps: 10, done: true }, { reps: 10, done: true }, { reps: 8, done: false }], rir: '1–2 RIR' }
  }
};
const env1 = createAppEnv({ HA_GYM_PRO_STATE_V2: JSON.stringify(v21Draft) });
env1.loadState();
const rescuedRows = env1.getState().logs.filter((l) => l.date === todayStr);
assert(rescuedRows.length === 2, `Expected 2 rescued rows for ${todayStr}, got ${rescuedRows.length}`);
assert(env1.getState().exTargets3M.EX01 === 240, 'Cached EX01 200kg target must auto-upgrade to 240kg');

const todayHtml = env1.renderTodayTab();
assert(todayHtml.includes('Hôm nay: Đã lưu 2 bài ✓'), 'Today tab must display live saved counter');
assert(todayHtml.includes('Trước: 50 kg'), 'Today tab baseline must exclude today logs mid-workout');
assert(todayHtml.includes('Lateral Raise'), 'Today tab must render Lateral Raise card');
assert(todayHtml.includes('Farmer Hold') && todayHtml.includes('30–45 giây') && todayHtml.includes('45s'),
  'Today tab must render Farmer Hold card with giây unit and 45s timer pill');
assert(todayHtml.includes('<span class="weight-unit">kg/tay</span>') && todayHtml.includes('Đề xuất: 20 kg/tay'),
  'Dumbbell cards must explicitly display kg/tay unit so single-hand load is unmistakable');
assert(!todayHtml.includes('Xách tạ 45s'), 'Top addon strip must hide duplicate Xách tạ 45s pill when EX14 card is active');

const progressHtml = env1.renderProgressTab();
assert(progressHtml.includes('9 Bài Chuẩn'), 'Progress tab must label 9 Bài Chuẩn sessions accurately');

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
    note: 'Hiệp: 10/10/10 · 5p15s · 44 kcal',
    isLocal: true
  }
];
const env2 = createAppEnv({ HA_GYM_PRO_STATE_V2: JSON.stringify({ workoutMode: 'ESSENTIAL_7', logs: savedLogs, todaySession: {} }) });
env2.loadState();
assert(env2.getState().todaySession.EX08.sets[0].done === true && env2.getState().todaySession.EX08.weight === 65,
  'Failed to restore green checkmarks from saved today logs');
assert(env2.getState().todaySession.EX08.durationSec === 315,
  'Failed to hydrate 5p15s (315s) exercise duration from Sheet log note');

// Test D: Live toggleSetDone auto-saves & unticking removes auto-synced row
const env3 = createAppEnv({});
env3.loadState();
env3.toggleSetDone('EX11', 0);
assert(env3.getState().logs.filter((l) => l.date === todayStr).length === 1, 'toggleSetDone must auto-save immediately');
env3.toggleSetDone('EX11', 0);
assert(env3.getState().logs.filter((l) => l.date === todayStr).length === 0, 'Unticking all sets must remove auto-synced row');
assert(env3.getState().todaySession.EX11.startedAt === null, 'Unticking accidental auto-started set must reset timer cleanly');

// Test D2: Per-Exercise Start -> Final Set Auto-Stop Duration & Honest MET Calorie Cap
const env4 = createAppEnv({});
env4.loadState();
env4.startExerciseTimer('EX04'); // 2-set Shoulder Press
assert(env4.getState().todaySession.EX04.startedAt > 0 && env4.getState().todaySession.EX04.endedAt === null,
  'startExerciseTimer must start live stopwatch');
assert(env4.renderTodayTab().includes('ex-timer-pill running'), 'Running exercise must render live orange stopwatch pill');

// Backdate startedAt by 240s (4 minutes) and complete Set 1 (still 1 set remaining -> keep running)
env4.getState().todaySession.EX04.startedAt = Date.now() - 240 * 1000;
env4.toggleSetDone('EX04', 0);
assert(env4.getState().todaySession.EX04.endedAt === null, 'Stopwatch must keep running until final set is checked');

// Complete Final Set (Set 2 of 2) -> must auto-stop & persist duration + kcal into logs
env4.toggleSetDone('EX04', 1);
const ex04Sess = env4.getState().todaySession.EX04;
assert(ex04Sess.endedAt !== null && ex04Sess.durationSec >= 239 && ex04Sess.durationSec <= 242,
  `Expected auto-stopped duration ~240s on final set, got ${ex04Sess.durationSec}`);
const ex04Log = env4.getState().logs.find((l) => l.date === todayStr && l.exercise.includes('Machine Shoulder Press'));
assert(ex04Log && ex04Log.note.includes('4p') && ex04Log.note.includes('kcal') && ex04Log.kcal > 10,
  `Expected logged note with duration & kcal, got: ${ex04Log && ex04Log.note}`);

// Physiological anti-inflation cap check: 30-min phone call (1800s) must cap at 2 sets * 210s = 420s
const ex04Def = env4.EXERCISES.find((e) => e.id === 'EX04');
const cal7Min = env4.getExerciseCalorieInfo(ex04Def, 60, ex04Sess.sets, 2, 74, { durationSec: 420 });
const cal30Min = env4.getExerciseCalorieInfo(ex04Def, 60, ex04Sess.sets, 2, 74, { durationSec: 1800 });
assert(cal30Min.burnedKcal === cal7Min.burnedKcal,
  `Anti-inflation MET cap failed: 30min=${cal30Min.burnedKcal} vs 7min=${cal7Min.burnedKcal}`);

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

// Test F: Age-40 Golden Ratio Body Blueprint (1m63), Live Slider, Circumference Measurement & Apps Script Body Upsert
const envBp = createAppEnv({}, {
  bmWeight: '',
  bmWaist: '85.5',
  bmShoulder: '113.5',
  bmChest: '99',
  bmForearm: '30.5',
  bmArm: '35',
  bmThigh: '57',
  bmBf: '22',
  bmNote: 'Đo sáng'
});
envBp.loadState();
const profBefore = envBp.getCurrentBodyProfile();
assert(profBefore.weight === 74 && profBefore.measured.weight === true && profBefore.measured.waist === false,
  'Initial profile must mark weight=true and unmeasured waist=false');

const cardioHtmlBefore = envBp.renderCardioBodyTab();
assert(cardioHtmlBefore.includes('CHUẨN FORM TRƯỚC 40 TUỔI · NAM 1M63') && cardioHtmlBefore.includes('id="bpSvg"') && cardioHtmlBefore.includes('Chặng 1') && cardioHtmlBefore.includes('Chặng 3'),
  'Mục tiêu tab must render interactive Age-40 Golden Ratio SVG blueprint and 3-Stage Roadmap');
assert(cardioHtmlBefore.includes('Ước tính') && cardioHtmlBefore.includes('1.57×'),
  'Unmeasured circumferences must explicitly render Ước tính badge alongside 1.57× Adonis target');

// Live slider update at 50%
envBp.onBlueprintSlide(50);
assert(envBp.domElements().bpStageBadge.textContent.includes('50% · 68.5kg'),
  `Expected live slider 50% · 68.5kg, got: ${envBp.domElements().bpStageBadge.textContent}`);

// Submit tape measurements (even when leaving weight blank -> must inherit 74kg & flip badges to ✓ Đã đo)
envBp.submitBodyMeasurement();
const profAfter = envBp.getCurrentBodyProfile();
assert(profAfter.measured.waist === true && profAfter.waist === 85.5 && profAfter.measured.shoulder === true && profAfter.shoulder === 113.5 && profAfter.measuredCount === 7,
  `Expected all 7 body metrics marked measured after submitBodyMeasurement, got count=${profAfter.measuredCount}`);
const latestSavedBody = envBp.getState().body[envBp.getState().body.length - 1];
assert(latestSavedBody.note.includes('Vai: 113.5cm'), `Expected Vai persisted into Sheet note, got: ${latestSavedBody.note}`);

// Apps Script appendBody same-day upsert test
const bodySheetRows = [
  ['Ngày đo', 'Cân nặng', 'Eo', 'Ngực', 'Bắp tay', 'Cẳng tay', 'Đùi', '% Mỡ', 'Ghi chú'],
  ['06/11/2026', 74, '', '', '', '', '', '', '']
];
const gsBodySandbox = {
  SpreadsheetApp: {
    openById: () => ({
      getSheetByName: () => ({
        getDataRange: () => ({
          getDisplayValues: () => bodySheetRows.map((r) => r.map((c) => String(c).replace(/^'/, '')))
        }),
        getRange: (row1) => ({
          setValues: (vals) => { bodySheetRows[row1 - 1] = vals[0]; }
        }),
        appendRow: (vals) => { bodySheetRows.push(vals); }
      })
    })
  },
  ContentService: {
    MimeType: { JSON: 'JSON' },
    createTextOutput: (txt) => ({ setMimeType: () => txt })
  }
};
vm.createContext(gsBodySandbox);
vm.runInContext(gsSrc, gsBodySandbox);
gsBodySandbox.doPost({ postData: { contents: JSON.stringify({ action: 'appendBody', data: { date: '15/11/2026', weight: 73.5, waist: '85', note: 'Vai: 113.5cm' } }) } });
gsBodySandbox.doPost({ postData: { contents: JSON.stringify({ action: 'appendBody', data: { date: '15/11/2026', weight: 73.5, forearm: '30.5', note: 'Vai: 113.5cm' } }) } });
assert(bodySheetRows.length === 3 && bodySheetRows[2][2] === '85' && bodySheetRows[2][5] === '30.5',
  `Expected appendBody same-day merge into 1 row, got length=${bodySheetRows.length}: ${JSON.stringify(bodySheetRows[2])}`);

// Test G: Weekly Discipline Streak Engine (Min 3 Sessions/Week × Min 3 Exercises/Session)
const mkSessionLogs = (dateStr, count) => {
  const names = [
    'Leg Press - Đạp đùi',
    'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy',
    'Lat Pulldown - Kéo xô rộng tay',
    'Machine Shoulder Press - Đẩy vai máy'
  ];
  return names.slice(0, count).map((ex) => ({
    date: dateStr,
    week: 8,
    workout: '9 Bài Chuẩn (22 Hiệp)',
    exercise: ex,
    weight: 60,
    reps: 30,
    volume: 1800
  }));
};

const envSt = createAppEnv({});
envSt.loadState();

// G1 & G2: Partial day (<3 exercises) must NOT count as a valid session; 3rd exercise unlocks session
envSt.getState().logs = mkSessionLogs('11/11/2026', 2); // Wed 11/11/2026 (2 exercises)
const stPartial = envSt.calculateStreakStats('11/11/2026');
assert(stPartial.todayExCount === 2 && stPartial.todayIsValid === false && stPartial.thisWeek.validSessions === 0,
  `Anti-cheat failed: 2 exercises should NOT count as valid session (${JSON.stringify(stPartial.thisWeek)})`);

envSt.getState().logs = mkSessionLogs('11/11/2026', 3); // 3 distinct exercises
const stValid1 = envSt.calculateStreakStats('11/11/2026');
assert(stValid1.todayExCount === 3 && stValid1.todayIsValid === true && stValid1.thisWeek.validSessions === 1,
  `3 distinct exercises must count as 1 valid session, got ${stValid1.thisWeek.validSessions}`);

// G3 & G4: Multi-week consecutive streak (Week -1 qualified + Week 0 in progress -> LOCKED at 3/3)
envSt.getState().logs = [
  ...mkSessionLogs('02/11/2026', 3), // Mon W-1
  ...mkSessionLogs('04/11/2026', 3), // Wed W-1
  ...mkSessionLogs('06/11/2026', 3), // Fri W-1 -> W-1 qualified (3/3)
  ...mkSessionLogs('11/11/2026', 3)  // Wed W0 (1/3 so far)
];
const stPending = envSt.calculateStreakStats('11/11/2026');
assert(stPending.currentStreakWeeks === 1 && stPending.streakState === 'ACTIVE_PENDING',
  `Expected ACTIVE_PENDING 1-week streak mid-week, got state=${stPending.streakState}, weeks=${stPending.currentStreakWeeks}`);

// Sunday 15/11/2026 with only 1/3 sessions -> mathematically impossible to reach 3/3 -> BROKEN_THIS_WEEK
const stSunBroken = envSt.calculateStreakStats('15/11/2026');
assert(!stSunBroken.canStillQualifyThisWeek && stSunBroken.currentStreakWeeks === 0 && stSunBroken.streakState === 'BROKEN_THIS_WEEK',
  `Sunday with 1/3 sessions must report BROKEN_THIS_WEEK & 0 active streak, got ${stSunBroken.streakState}/${stSunBroken.currentStreakWeeks}`);

// Sunday 15/11/2026 with 2/3 sessions completed earlier in the week & 0 today -> URGENT (can still save today!)
envSt.getState().logs.push(...mkSessionLogs('13/11/2026', 3)); // Fri W0 -> now 2/3
const stSunUrgent = envSt.calculateStreakStats('15/11/2026');
assert(stSunUrgent.canStillQualifyThisWeek && stSunUrgent.currentStreakWeeks === 1 && stSunUrgent.streakState === 'URGENT',
  `Sunday with 2/3 sessions must report URGENT & keep 1-week streak alive, got ${stSunUrgent.streakState}/${stSunUrgent.currentStreakWeeks}`);

// Complete Sunday session -> 3/3 -> LOCKED 2 consecutive weeks!
envSt.getState().logs.push(...mkSessionLogs('15/11/2026', 3)); // Sun W0 -> 3/3
const stLocked2 = envSt.calculateStreakStats('15/11/2026');
assert(stLocked2.currentStreakWeeks === 2 && stLocked2.bestStreakWeeks === 2 && stLocked2.streakState === 'LOCKED',
  `Expected LOCKED 2-week streak after 3/3 in W0, got ${stLocked2.streakState}/${stLocked2.currentStreakWeeks}`);

// G5: Skipped empty week in between must reset consecutive count
envSt.getState().logs = [
  ...mkSessionLogs('19/10/2026', 3),
  ...mkSessionLogs('21/10/2026', 3),
  ...mkSessionLogs('23/10/2026', 3), // Qualified week in Oct, then skipped week of 26/10 & 02/11
  ...mkSessionLogs('09/11/2026', 3),
  ...mkSessionLogs('11/11/2026', 3),
  ...mkSessionLogs('13/11/2026', 3)  // Qualified W0
];
const stGap = envSt.calculateStreakStats('15/11/2026');
assert(stGap.currentStreakWeeks === 1 && stGap.bestStreakWeeks === 1,
  `Skipped weeks must break streak (expected 1, got current=${stGap.currentStreakWeeks}, best=${stGap.bestStreakWeeks})`);

// G6: UI rendering across all 3 main tabs + Streak Sheet
const todayStreakHtml = envSt.renderTodayTab();
const progStreakHtml = envSt.renderProgressTab();
const cardioStreakHtml = envSt.renderCardioBodyTab();
assert(todayStreakHtml.includes('af-streak-card') && todayStreakHtml.includes('openStreakSheet()'),
  'Today tab must render clickable Streak banner');
assert(progStreakHtml.includes('STREAK LIÊN TỤC · TỐI THIỂU 3 BUỔI × 3 BÀI/TUẦN') && progStreakHtml.includes('✓ Tính Streak'),
  'Progress tab must render 8-week Streak card and ✓ Tính Streak session badges');
assert(cardioStreakHtml.includes('Chuỗi Streak kỷ luật tuần'),
  'Mục tiêu tab must render Chuỗi Streak kỷ luật tuần row');
envSt.openStreakSheet();
assert(envSt.domElements().sheetBody.innerHTML.includes('Quy tắc khóa Streak'),
  'openStreakSheet() must populate Streak rules & daily breakdown into sheetBody');

console.log(`[PASS] All Hà Gym v${appSwVer} invariants verified (Auto-Save, Rescue, Hydrate, Upsert, Photos, Age-40 Blueprint, Weekly Streak Engine).`);
