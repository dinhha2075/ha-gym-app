// HÀ GYM — Minimalist Apple Design Edition (WWDC Fluid Interface Principles)
const SHEET_ID = '1pPayEETE_yoW9lzxYy3Qdd2GV5yEqp1uQZq285eK-wQ';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?usp=sharing`;
const STORAGE_KEY = 'HA_GYM_PRO_STATE_V2';

// ============================================================================
// 1. APPLE FLUID SPRING ENGINE (Damping Ratio + Response, Velocity-Preserving)
// ============================================================================
const activeSprings = new Map();

function animateSpring(key, {
  from,
  to,
  velocity = 0,
  damping = 1.0,
  response = 0.32,
  onUpdate,
  onComplete
}) {
  const prev = activeSprings.get(key);
  let currentPos = prev ? prev.pos : from;
  let currentVel = prev ? prev.vel + velocity : velocity;
  if (prev && prev.raf) cancelAnimationFrame(prev.raf);

  // Reduced motion fallback
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onUpdate(to);
    if (onComplete) onComplete();
    return;
  }

  const omega = (2 * Math.PI) / Math.max(0.05, response);
  let lastTime = performance.now();

  const stateObj = { pos: currentPos, vel: currentVel, raf: null };
  activeSprings.set(key, stateObj);

  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.032);
    lastTime = now;

    const displacement = stateObj.pos - to;
    const springForce = -omega * omega * displacement;
    const dampingForce = -2 * damping * omega * stateObj.vel;
    const accel = springForce + dampingForce;

    stateObj.vel += accel * dt;
    stateObj.pos += stateObj.vel * dt;

    onUpdate(stateObj.pos);

    if (Math.abs(to - stateObj.pos) < 0.35 && Math.abs(stateObj.vel) < 2) {
      stateObj.pos = to;
      stateObj.vel = 0;
      onUpdate(to);
      activeSprings.delete(key);
      if (onComplete) onComplete();
      return;
    }
    stateObj.raf = requestAnimationFrame(tick);
  }

  stateObj.raf = requestAnimationFrame(tick);
}

// Apple WWDC 2018 Momentum Projection & Rubber-Banding
function projectMomentum(initialVelocity, decelerationRate = 0.998) {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

// ============================================================================
// 2. CANONICAL EXERCISE DATA (13 Exercises from Live Google Sheet)
// ============================================================================
const EXERCISES = [
  {
    id: 'EX01',
    name: 'Leg Press - Đạp đùi',
    title: 'Leg Press',
    vnSub: 'Đạp đùi · Máy Tầng 1 (+5kg)',
    floor: 1,
    slotE7: 'T1-4',
    slot2F: 'T1-5',
    slotA: 'A-3',
    slotB: null,
    muscle: 'Đùi trước, Mông',
    equip: 'Máy Đạp đùi / Smith Squat (Tầng 1)',
    sets: 3,
    repMin: 8,
    repMax: 10,
    rir: '1–2 RIR',
    restSec: 105,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    image: 'https://www.muscleandstrength.com/exercises/45-degree-leg-press.html',
    cues: 'Ở mức tạ 160kg+, bước nhảy +5kg chỉ bằng 3% tải nên chỉ cần tích lũy từ 8 lên 10 lần (24–30 cái/buổi) là đủ nhảy +5kg.',
    mistakes: 'Khóa cứng đầu gối; nhấc mông khỏi đệm; đầu gối sụp vào trong.',
    alt: 'Smith Squat / Hack Squat'
  },
  {
    id: 'EX02',
    name: 'Seated Machine Chest Press - Ngồi thẳng đẩy ngực máy',
    title: 'Seated Chest Press',
    vnSub: 'Ngực giữa · Máy 90° Tầng 2 (+5kg)',
    floor: 2,
    slot2F: 'T2-4',
    slotA: 'A-1',
    slotB: null,
    muscle: 'Ngực giữa, Tay sau',
    equip: 'Máy ngồi đẩy ngực 90 độ (Tầng 2)',
    sets: 2,
    setsA: 3,
    repMin: 8,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=jrBo8-VSR9M',
    image: 'https://www.muscleandstrength.com/exercises/chest',
    cues: 'Tiến trình Hypertrophy 8–12 lần (24–36 cái/buổi): Đạt đủ 12 lần/hiệp thì buổi sau nhảy +5kg và bắt đầu lại ở đúng 8 lần.',
    mistakes: 'Nhô vai về trước; cùi chỏ mở ngang 90° gây đau vai.',
    alt: 'Smith Flat Press'
  },
  {
    id: 'EX03',
    name: 'Lat Pulldown - Kéo xô máy',
    title: 'Lat Pulldown',
    vnSub: 'Kéo xô chữ V · Cáp Smith Tầng 1 (+5kg)',
    floor: 1,
    slotE7: 'T1-5',
    slot2F: 'T1-6',
    slotA: 'A-4',
    slotB: null,
    muscle: 'Cơ xô (Lats), Tay trước',
    equip: 'Cáp kéo xô tại máy Smith (Tầng 1)',
    sets: 2,
    setsA: 3,
    repMin: 8,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=SALxEARiMkw',
    image: 'https://www.muscleandstrength.com/exercises/lat-pull-down.html',
    cues: '2 hiệp chuẩn (8 → 10 → 12 lần): Đạt đủ 12/12 lần cả 2 hiệp thì buổi sau cắm chốt +5kg và bắt đầu lại ở 8/8 lần.',
    mistakes: 'Ngả người ra sau quá sâu lấy đà; kéo thanh ra sau gáy.',
    alt: 'Assisted Pull-up'
  },
  {
    id: 'EX04',
    name: 'Machine Shoulder Press - Đẩy vai máy',
    title: 'Machine Shoulder Press',
    vnSub: 'Đẩy vai · Máy ngồi Tầng 1 (+5kg)',
    floor: 1,
    slotE7: 'T1-7A',
    slot2F: 'T1-8',
    slotA: 'A-5',
    slotB: null,
    muscle: 'Cơ vai (Deltoids), Tay sau',
    equip: 'Máy đẩy vai ngồi (Tầng 1)',
    sets: 2,
    setsA: 3,
    repMin: 8,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=Lo6dnolXt3E',
    image: 'https://www.muscleandstrength.com/exercises/shoulders',
    cues: '2 hiệp chuẩn (8 → 10 → 12 lần): Đạt đủ 12/12 lần cả 2 hiệp thì buổi sau tăng +5kg × 8/8 lần.',
    mistakes: 'Ưỡn võng thắt lưng quá mức; thả rơi tạ tự do.',
    alt: 'Dumbbell Shoulder Press'
  },
  {
    id: 'EX05',
    name: 'Triceps Pushdown - Kéo cáp tay sau',
    title: 'Triceps Pushdown',
    vnSub: 'Kéo cáp tay sau · Máy Smith Tầng 1',
    floor: 1,
    slot2F: 'T1-9B',
    slotA: 'A-6',
    slotB: null,
    muscle: 'Cơ tay sau (Triceps)',
    equip: 'Cáp kéo tay sau tại máy Smith Tầng 1 (+5kg/nấc)',
    sets: 2,
    repMin: 10,
    repMax: 15,
    rir: '1–2 RIR',
    restSec: 60,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
    image: 'https://www.muscleandstrength.com/exercises/triceps',
    cues: 'Chốt cáp nhảy +5kg/nấc: Tích lũy 2 hiệp theo mốc 10 → 12 → 15 lần. Đạt đủ 15/15 lần mới tăng +5kg và quay lại 10 lần.',
    mistakes: 'Vung vẩy khuỷu tay; dùng sức nặng cơ thể đè lên cáp.',
    alt: 'Overhead Cable Extension'
  },
  {
    id: 'EX06',
    name: 'Wrist Curl - Cuộn cổ tay',
    title: 'Wrist Curl (Finger-Roll)',
    vnSub: 'Cuộn cổ tay · Cáp/Máy Tầng 1 (+5kg)',
    floor: 1,
    slotE7: 'T1-7B',
    slot2F: 'T1-9C',
    slotA: 'A-7',
    slotB: null,
    muscle: 'Cơ gập cổ tay, Sức nắm (Grip)',
    equip: 'Cáp Smith / Máy Tầng 1 (+5kg/nấc) + 45s Farmer Hold',
    sets: 2,
    repMin: 10,
    repMax: 15,
    rir: '0–1 RIR',
    restSec: 45,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=1-55N7Qlu_U',
    image: 'https://www.muscleandstrength.com/exercises/barbell-wrist-curl.html',
    cues: 'Tập Cáp/Máy nhảy +5kg/nấc: Tích lũy 2 hiệp từ 10 → 12 → 15 lần (đạt 15/15 lần mới lên +5kg). Nếu cầm Tạ đơn từng tay thì nhảy +2.5kg ở mốc 15 lần. Cuối buổi xách tạ 45s.',
    mistakes: 'Nhấc cả cẳng tay khỏi đùi; giật cổ tay theo quán tính.',
    alt: 'Dumbbell Finger-Roll (+2.5kg)'
  },
  {
    id: 'EX07',
    name: 'Seated Leg Curl - Cuộn đùi sau máy',
    title: 'Seated Leg Curl',
    vnSub: 'Cuộn đùi sau · Tầng 1',
    floor: 1,
    slot2F: null,
    slotA: null,
    slotB: 'B-4',
    muscle: 'Cơ đùi sau (Hamstrings)',
    equip: 'Máy đùi sau / RDL (Tầng 1)',
    sets: 3,
    repMin: 10,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=Orxowest56U',
    image: 'https://www.muscleandstrength.com/exercises/leg-curl.html',
    cues: 'Khóa chặt đệm đùi; gập gót chân về sau hết biên độ siết đùi sau 1 giây; trả chậm 2–3 giây.',
    mistakes: 'Nhấc mông khỏi ghế; dùng đà giật gót.',
    alt: 'Dumbbell Romanian Deadlift'
  },
  {
    id: 'EX08',
    name: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy',
    title: 'Incline Chest Press',
    vnSub: 'Ngực trên · Máy ghế xéo Tầng 2 (+5kg)',
    floor: 2,
    slotE7: 'T2-1',
    slot2F: 'T2-1',
    slotA: null,
    slotB: 'B-1',
    muscle: 'Cơ ngực trên (Upper Chest)',
    equip: 'Máy Incline ghế xéo đẩy từng bên (Tầng 2)',
    sets: 3,
    repMin: 8,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    image: 'https://www.muscleandstrength.com/exercises/incline-bench-press.html',
    cues: 'Tiến trình Hypertrophy 8–12 lần (24–36 cái/buổi): Đạt đủ 12 lần/hiệp thì buổi sau nhảy +5kg và bắt đầu lại ở đúng 8 lần.',
    mistakes: 'Nhấc vai khỏi ghế; đẩy bằng cơ vai trước thay vì ngực trên.',
    alt: 'Seated Chest Press 90°'
  },
  {
    id: 'EX09',
    name: 'Seated Row Machine - Kéo lưng ngồi máy',
    title: 'Seated Row Machine',
    vnSub: 'Kéo lưng dày & Vai sau · Tầng 1 (+5kg)',
    floor: 1,
    slotE7: 'T1-6',
    slot2F: 'T1-7',
    slotA: null,
    slotB: 'B-5',
    muscle: 'Cơ lưng giữa, Vai sau (Rear Delts)',
    equip: 'Máy ngồi Row Machine (Tầng 1)',
    sets: 2,
    setsB: 3,
    repMin: 8,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=3EP5HpKtJG0',
    image: 'https://www.muscleandstrength.com/exercises/middle-back',
    cues: 'Hiệp 1 khép khuỷu tay kéo vào bụng ăn Lưng giữa; Hiệp 2 cầm ngang mở khuỷu tay 70° kéo về ngực trên ăn Vai sau (chống gù vai). Đủ 12/12 lần lên +5kg.',
    mistakes: 'Dùng đà giật thân người rời khỏi đệm; nhún vai co cổ.',
    alt: 'Seated Cable Row'
  },
  {
    id: 'EX10',
    name: 'Lateral Raise - Nâng vai ngang',
    title: 'Lateral Raise',
    vnSub: 'Nâng vai ngang · Tạ đơn Tầng 1',
    floor: 1,
    slot2F: 'T1-9A',
    slotA: null,
    slotB: 'B-6',
    muscle: 'Cơ vai giữa (Lateral Deltoid)',
    equip: 'Tạ đơn (Tầng 1)',
    sets: 2,
    setsB: 3,
    repMin: 12,
    repMax: 15,
    rir: '1–2 RIR',
    restSec: 60,
    inc: 2.5,
    video: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    image: 'https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html',
    cues: 'Hơi đổ nhẹ người về trước 10°, dẫn hướng bằng cùi chỏ nâng ngang tầm vai; hạ chậm 2–3 giây.',
    mistakes: 'Dùng đà nhún người; nâng quá cao làm co cầu vai.',
    alt: 'Cable Lateral Raise'
  },
  {
    id: 'EX11',
    name: 'Hammer Curl - Cuộn tay trước búa',
    title: 'Hammer & Reverse Curl',
    vnSub: 'Tay trước & Cẳng tay · Máy Tầng 2 (+5kg)',
    floor: 2,
    slotE7: 'T2-2',
    slot2F: 'T2-2',
    slotA: null,
    slotB: 'B-2',
    muscle: 'Brachioradialis (Cẳng tay), Biceps',
    equip: 'Máy cuộn bắp tay Tầng 2 (+5kg/nấc) / Tạ đơn',
    sets: 2,
    repMin: 10,
    repMax: 15,
    rir: '0–1 RIR',
    restSec: 60,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=HfSzuZPVlnA',
    image: 'https://www.muscleandstrength.com/exercises/biceps',
    cues: 'Tập Máy Tầng 2 nhảy +5kg/nấc: Tích lũy 2 hiệp từ 10 → 12 → 15 lần (đạt 15/15 lần mới nhảy +5kg về 10 lần). Hiệp 1 nắm Búa (Hammer), Hiệp 2 nắm Sấp tay (Reverse). Nếu dùng Tạ đơn thì nhảy +2.5kg.',
    mistakes: 'Đung đưa khuỷu tay lấy đà; thả tạ rơi mất sức căng.',
    alt: 'Dumbbell Hammer Curl (+2.5kg)'
  },
  {
    id: 'EX12',
    name: 'Ab Crunch Machine - Gập bụng với máy',
    title: 'Ab Crunch Machine',
    vnSub: 'Gập bụng · Máy Tầng 2 (+5kg)',
    floor: 2,
    slotE7: 'T2-3',
    slot2F: 'T2-3',
    slotA: 'A-2',
    slotB: 'B-3',
    muscle: 'Cơ bụng (Rectus Abdominis)',
    equip: 'Máy gập bụng Tầng 2 (+5kg/nấc)',
    sets: 2,
    repMin: 12,
    repMax: 15,
    rir: '1–2 RIR',
    restSec: 60,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=_O1xunCfYEM',
    image: 'https://www.muscleandstrength.com/exercises/ab-crunch-machine.html',
    cues: '2 hiệp × 12–15 lần: Cố định hông, thở hết hơi ra khi cuộn tròn đốt sống ngực ép xuống, đạt 15/15 lần thì tăng +5kg.',
    mistakes: 'Dùng lực tay kéo máy hoặc gập hông mà không cuộn cột sống.',
    alt: 'Cable Kneeling Crunch'
  },
  {
    id: 'EX13',
    name: 'Reverse Wrist Curl - Cuộn cổ tay ngược',
    title: 'Reverse Wrist Curl',
    vnSub: 'Cuộn cổ tay sấp · Tạ đơn Tầng 1',
    floor: 1,
    slot2F: 'Opt',
    slotA: null,
    slotB: 'B-7',
    muscle: 'Cơ duỗi cổ tay (Mặt trên cẳng tay)',
    equip: 'Tạ đơn (Tầng 1) + 45s Farmer Hold',
    sets: 2,
    repMin: 12,
    repMax: 20,
    rir: '0–1 RIR',
    restSec: 45,
    inc: 2.5,
    video: 'https://www.youtube.com/watch?v=hCMC4Vh2g_s',
    image: 'https://www.muscleandstrength.com/exercises/forearms',
    cues: 'Úp sấp lòng bàn tay, tì cố định cẳng tay, vểnh mu bàn tay lên cao hết cỡ giữ 1 giây để nổi rõ đường gân mặt ngoài.',
    mistakes: 'Dùng tạ quá nặng gây mỏi khớp cổ tay.',
    alt: 'Overhand Wrist Roller'
  }
];

const INITIAL_LOGS = [
  { date: '23/09/2026', week: 1, workout: 'Workout B', exercise: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy', weight: 60, reps: 24, volume: 1440, rir: '1 - 2 RIR', nextWeight: 65, note: '' },
  { date: '23/09/2026', week: 1, workout: 'Workout A', exercise: 'Leg Press - Đạp đùi', weight: 100, reps: 24, volume: 2400, rir: '1 - 2 RIR', nextWeight: 105, note: '' },
  { date: '23/09/2026', week: 1, workout: 'Workout B', exercise: 'Machine Shoulder Press - Đẩy vai máy', weight: 10, reps: 24, volume: 240, rir: '1 - 2 RIR', nextWeight: 15, note: '' },
  { date: '23/09/2026', week: 1, workout: 'Workout B', exercise: 'Lat Pulldown - Kéo xô máy', weight: 40, reps: 24, volume: 960, rir: '1 - 2 RIR', nextWeight: 45, note: '' },
  { date: '23/09/2026', week: 1, workout: 'Workout B', exercise: 'Lateral Raise - Nâng vai ngang', weight: 5, reps: 30, volume: 150, rir: '1 - 2 RIR', nextWeight: 7.5, note: '' },
  { date: '23/09/2026', week: 1, workout: 'Workout B', exercise: 'Hammer Curl - Cuộn tay trước búa', weight: 15, reps: 20, volume: 300, rir: '1 - 2 RIR', nextWeight: 17.5, note: '' },
  { date: '26/09/2026', week: 1, workout: 'Workout A', exercise: 'Seated Machine Chest Press - Ngồi thẳng đẩy ngực máy', weight: 45, reps: 24, volume: 1080, rir: '1 - 2 RIR', nextWeight: 50, note: '' },
  { date: '26/09/2026', week: 1, workout: 'Workout A', exercise: 'Seated Row Machine - Kéo lưng ngồi máy', weight: 15, reps: 24, volume: 360, rir: '1 - 2 RIR', nextWeight: 20, note: '' },
  { date: '26/09/2026', week: 1, workout: 'Workout A', exercise: 'Wrist Curl - Cuộn cổ tay', weight: 15, reps: 30, volume: 450, rir: '1 - 2 RIR', nextWeight: 17.5, note: '' },
  { date: '01/10/2026', week: 2, workout: 'Workout A', exercise: 'Seated Machine Chest Press - Ngồi thẳng đẩy ngực máy', weight: 40, reps: 24, volume: 960, rir: '1 - 2 RIR', nextWeight: 45, note: '' },
  { date: '22/10/2026', week: 5, workout: 'Workout A', exercise: 'Leg Press - Đạp đùi', weight: 160, reps: 24, volume: 3840, rir: '1 - 2 RIR', nextWeight: 165, note: '' },
  { date: '22/10/2026', week: 5, workout: 'Workout A', exercise: 'Seated Machine Chest Press - Ngồi thẳng đẩy ngực máy', weight: 55, reps: 24, volume: 1320, rir: '1 - 2 RIR', nextWeight: 60, note: '' },
  { date: '22/10/2026', week: 5, workout: 'Workout A', exercise: 'Wrist Curl - Cuộn cổ tay', weight: 30, reps: 30, volume: 900, rir: '1 - 2 RIR', nextWeight: 32.5, note: '' },
  { date: '22/10/2026', week: 5, workout: 'Workout A', exercise: 'Machine Shoulder Press - Đẩy vai máy', weight: 60, reps: 24, volume: 1440, rir: '1 - 2 RIR', nextWeight: 65, note: '' },
  { date: '22/10/2026', week: 5, workout: 'Workout A', exercise: 'Ab Crunch Machine - Gập bụng với máy', weight: 50, reps: 30, volume: 1500, rir: '1 - 2 RIR', nextWeight: 55, note: '' },
  { date: '22/10/2026', week: 5, workout: 'Workout B', exercise: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy', weight: 60, reps: 24, volume: 1440, rir: '1 - 2 RIR', nextWeight: 65, note: '' },
  { date: '22/10/2026', week: 5, workout: 'Workout A', exercise: 'Seated Row Machine - Kéo lưng ngồi máy', weight: 60, reps: 24, volume: 1440, rir: '1 - 2 RIR', nextWeight: 65, note: '' },
  { date: '26/10/2026', week: 6, workout: 'Workout B', exercise: 'Leg Press - Đạp đùi', weight: 160, reps: 8, volume: 1280, rir: '1 - 2 RIR', nextWeight: 165, note: '' },
  { date: '26/10/2026', week: 6, workout: 'Workout A', exercise: 'Seated Machine Chest Press - Ngồi thẳng đẩy ngực máy', weight: 55, reps: 8, volume: 440, rir: '1 - 2 RIR', nextWeight: 60, note: '' },
  { date: '26/10/2026', week: 6, workout: 'Workout B', exercise: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy', weight: 50, reps: 8, volume: 400, rir: '1 - 2 RIR', nextWeight: 55, note: '' }
];

const INITIAL_BODY = [
  { date: '23/09/2026', weight: 75.0, waist: '', forearm: '', note: 'Khởi đầu tuần 1' },
  { date: '01/10/2026', weight: 73.0, waist: '', forearm: '', note: 'Tăng cơ nạc, eo gọn hơn' },
  { date: '14/10/2026', weight: 75.0, waist: '', forearm: '', note: 'Grip & cẳng tay khỏe rõ rệt' },
  { date: '22/10/2026', weight: 73.0, waist: '', forearm: '', note: '' },
  { date: '06/11/2026', weight: 74.0, waist: '', forearm: '', note: 'Cập nhật từ Sheet' }
];

const ZONE2_PLAN = [
  { week: 'Tuần 1', structure: 'Đi bộ nhanh 2p + Chạy chậm 1p × 7', duration: '21p', dist: '2.0–2.5 km' },
  { week: 'Tuần 2', structure: 'Đi bộ nhanh 1.5p + Chạy chậm 1.5p × 8', duration: '24p', dist: '2.5–2.8 km' },
  { week: 'Tuần 3', structure: 'Đi bộ nhanh 1p + Chạy chậm 2p × 8', duration: '25p', dist: '2.8–3.2 km' },
  { week: 'Tuần 4', structure: 'Đi bộ nhanh 1p + Chạy chậm 3p × 7', duration: '28p', dist: '3.2–3.5 km' },
  { week: 'Tuần 5', structure: 'Đi bộ 3p + Chạy liên tục 22p + Hạ nhiệt 2p', duration: '27p', dist: '3.5–3.8 km' },
  { week: 'Tuần 6', structure: 'Đi bộ 3p + Chạy liên tục 25p + Hạ nhiệt 2p', duration: '30p', dist: '4.0 km' },
  { week: 'Tuần 7', structure: 'Đi bộ 2p + Chạy liên tục 30p + Hạ nhiệt 2p', duration: '34p', dist: '4.5 km' },
  { week: 'Tuần 8', structure: 'Khởi động 2p + Chạy 5 km liên tục Zone 2', duration: '36p', dist: '5.0 km' }
];

const INITIAL_CARDIO_LOGS = [
  { date: '24/09/2026', day: 'Thứ 5', week: 'Tuần 1', duration: 21, dist: 2.2, hr: '128 bpm', status: 'Hoàn thành' },
  { date: '26/09/2026', day: 'Thứ 7', week: 'Tuần 1', duration: 21, dist: 2.4, hr: '130 bpm', status: 'Hoàn thành' }
];

// Default 3-Month (12-Week) Strength Targets (kg) for each exercise
const DEFAULT_EX_TARGETS_3M = {
  EX01: 200,   // Leg Press: 160kg -> 200kg
  EX02: 75,    // Seated Chest Press: 55kg -> 75kg
  EX03: 65,    // Lat Pulldown: 40kg -> 65kg
  EX04: 75,    // Machine Shoulder Press: 60kg -> 75kg
  EX05: 35,    // Triceps Pushdown: 20kg -> 35kg
  EX06: 45,    // Wrist Curl (Máy +5kg): 30kg -> 45kg
  EX07: 55,    // Seated Leg Curl: 35kg -> 55kg
  EX08: 80,    // Incline Chest Press: 60kg -> 80kg
  EX09: 80,    // Seated Row Machine: 60kg -> 80kg
  EX10: 12.5,  // Lateral Raise: 5kg -> 12.5kg
  EX11: 25,    // Hammer & Reverse Curl (Máy +5kg): 15kg -> 25kg
  EX12: 70,    // Ab Crunch Machine: 50kg -> 70kg
  EX13: 20     // Reverse Wrist Curl: 10kg -> 20kg
};

const DEFAULT_BODY_TARGETS_3M = {
  startWeight: 78.0,
  month1Weight: 71.0,
  month2Weight: 68.0,
  month3Weight: 65.0,
  finalWeight: 62.0,
  targetWaist: 78.0,
  targetForearm: 33.0,
  targetRunKm: 5.0,
  stepGoal: 8000
};

let state = {
  activeTab: 'today',
  workoutMode: 'ESSENTIAL_7', // 'ESSENTIAL_7' | 'WORKOUT_A' | 'WORKOUT_B'
  userManuallySelectedMode: false,
  warmupDone: false,
  todaySession: {},
  dailyActivity: {},
  logs: [...INITIAL_LOGS],
  body: [...INITIAL_BODY],
  cardioLogs: [...INITIAL_CARDIO_LOGS],
  exTargets3M: { ...DEFAULT_EX_TARGETS_3M },
  bodyTargets3M: { ...DEFAULT_BODY_TARGETS_3M },
  webhookUrl: '',
  lastSync: 'Đã đồng bộ Sheet',
  libFilter: 'ALL'
};

// Analyze last completed workout session from logs & recommend Unified Essential 7 routine
function getLastSessionInfo() {
  if (!state.logs || state.logs.length === 0) {
    return {
      lastDate: 'Chưa có',
      lastLabel: 'Chưa tập',
      lastCode: 'NONE',
      exCount: 0,
      totalVol: 0,
      nextMode: 'ESSENTIAL_7',
      nextLabel: '7 Bài Chuẩn · 18 Hiệp (Tầng 2 → Tầng 1)'
    };
  }
  const lastEntry = state.logs[state.logs.length - 1];
  const lastDate = lastEntry.date;
  const sameDayLogs = state.logs.filter(l => l.date === lastDate);
  const totalVol = sameDayLogs.reduce((acc, l) => acc + (Number(l.volume) || 0), 0);

  let countA = 0;
  let countB = 0;
  let isEssential7 = false;
  sameDayLogs.forEach(l => {
    const wStr = String(l.workout || '').toUpperCase();
    if (wStr.includes('7 BÀI') || wStr.includes('2 TẦNG') || wStr.includes('FULL')) isEssential7 = true;
    else if (wStr.includes('B')) countB++;
    else if (wStr.includes('A')) countA++;
  });

  const lastWTag = String(lastEntry.workout || '').toUpperCase();
  let lastCode = 'ESSENTIAL_7';
  let lastLabel = '7 Bài Chuẩn';

  if (isEssential7) {
    lastCode = 'ESSENTIAL_7';
    lastLabel = '7 Bài Chuẩn';
  } else if (lastWTag.includes('B') || countB > countA) {
    lastCode = 'WORKOUT_B';
    lastLabel = 'Buổi B';
  } else {
    lastCode = 'WORKOUT_A';
    lastLabel = 'Buổi A';
  }

  return {
    lastDate,
    lastLabel,
    lastCode,
    exCount: sameDayLogs.length,
    totalVol,
    nextMode: 'ESSENTIAL_7',
    nextLabel: '7 Bài Chuẩn · 18 Hiệp (Tầng 2 → Tầng 1)'
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = {
        ...state,
        ...parsed,
        logs: parsed.logs && parsed.logs.length >= INITIAL_LOGS.length ? parsed.logs : [...INITIAL_LOGS],
        body: parsed.body && parsed.body.length >= INITIAL_BODY.length ? parsed.body : [...INITIAL_BODY],
        cardioLogs: parsed.cardioLogs && parsed.cardioLogs.length ? parsed.cardioLogs : [...INITIAL_CARDIO_LOGS],
        exTargets3M: { ...DEFAULT_EX_TARGETS_3M, ...(parsed.exTargets3M || {}) },
        bodyTargets3M: { ...DEFAULT_BODY_TARGETS_3M, ...(parsed.bodyTargets3M || {}) },
        dailyActivity: parsed.dailyActivity || {}
      };
    }
  } catch (e) {}
  // Default to the unified Essential 7 routine so all 7 core lifts progress every week
  if (!state.userManuallySelectedMode || state.workoutMode === '2FLOOR') {
    state.workoutMode = 'ESSENTIAL_7';
  }
  initTodayDefaults();
  getTodayActivity();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function getExerciseStats(ex) {
  const matches = state.logs.filter(l => l.exercise === ex.name && Number(l.weight) > 0);
  if (matches.length === 0) {
    const defaultStart = ex.id === 'EX05' ? 20 : ex.id === 'EX07' ? 35 : 10;
    return {
      firstWeight: 0,
      lastWeight: 0,
      prWeight: 0,
      lastReps: 0,
      recWeight: defaultStart,
      recReps: ex.repMin,
      recHint: `Đề xuất: ${defaultStart} kg × ${ex.repMin}–${ex.repMax} lần`,
      sessions: 0,
      lastDate: '—',
      status: 'Mới'
    };
  }
  const first = matches[0];
  const last = matches[matches.length - 1];
  const prWeight = Math.max(...matches.map(m => Number(m.weight) || 0));
  const firstW = Number(first.weight) || 0;
  const lastW = Number(last.weight) || 0;
  const lastTotalReps = Number(last.reps) || 0;

  // Determine average reps per set accurately (supports both 2-set and 3-set logs)
  let lastAvgReps = ex.repMin;
  const noteStr = String(last.note || '');
  if (noteStr.includes('Hiệp:')) {
    const parts = noteStr.replace('Hiệp:', '').trim().split('/').map(n => parseInt(n, 10)).filter(n => !isNaN(n) && n > 0);
    if (parts.length > 0) {
      lastAvgReps = Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
    }
  } else if (lastTotalReps <= 15) {
    lastAvgReps = lastTotalReps;
  } else {
    // Historical sheet logs had 3 sets for compound lifts (24 reps = 3x8) and 2 sets for isolation (20 or 30 reps)
    const histSets = (ex.setsA || ex.setsB || ex.sets || 3);
    lastAvgReps = Math.round(lastTotalReps / histSets);
  }

  let recWeight = lastW;
  let recReps = ex.repMax;
  let recHint = '';

  // Double Progression: Step up weight (+5kg machine / +2.5kg DB) when hitting repMax!
  if (lastAvgReps >= ex.repMax) {
    recWeight = lastW + ex.inc;
    recReps = ex.repMin;
    recHint = `Đủ ${ex.repMax} lần → Lên ${recWeight} kg × ${ex.repMin} lần`;
  } else {
    recWeight = lastW;
    const stepRep = (ex.repMax - ex.repMin >= 5 && lastAvgReps >= 12) ? 3 : 2;
    recReps = Math.min(ex.repMax, Math.max(ex.repMin, lastAvgReps + stepRep));
    recHint = `Giữ ${lastW} kg · Đẩy lên ${recReps} lần`;
  }

  let status = 'Ép lên ' + ex.repMax + ' lần';
  if (recWeight > lastW) {
    status = `Lên tạ → ${recWeight} kg`;
  } else if (lastW > firstW || Number(last.volume) > Number(first.volume)) {
    status = 'Tăng tải';
  }

  return {
    firstWeight: firstW,
    lastWeight: lastW,
    prWeight,
    lastReps: last.reps,
    lastAvgReps,
    recWeight,
    recReps,
    recHint,
    sessions: matches.length,
    lastDate: last.date,
    status
  };
}

function getTargetSetsCount(ex) {
  if (state.workoutMode === 'WORKOUT_A' && ex.setsA) return ex.setsA;
  if (state.workoutMode === 'WORKOUT_B' && ex.setsB) return ex.setsB;
  return ex.sets;
}

function initTodayDefaults() {
  EXERCISES.forEach(ex => {
    const stats = getExerciseStats(ex);
    const numSets = getTargetSetsCount(ex);
    const defaultRep = stats.recReps || ex.repMax;
    if (!state.todaySession[ex.id]) {
      state.todaySession[ex.id] = {
        weight: stats.recWeight,
        sets: Array.from({ length: 3 }, () => ({ reps: defaultRep, done: false })),
        rir: ex.rir
      };
    } else {
      while (state.todaySession[ex.id].sets.length < numSets) {
        state.todaySession[ex.id].sets.push({ reps: defaultRep, done: false });
      }
    }
  });
}

function getTodayExercises() {
  // Default: Tinh Nhuệ 7 Bài Chuẩn (18 hiệp · Tầng 2 -> Tầng 1 · 100% Máy +5kg)
  if (state.workoutMode === 'ESSENTIAL_7') {
    // Chặng 1 Tầng 2: EX08 Ngực trên (3h), EX11 Hammer/Reverse Curl (2h), EX12 Gập bụng (2h) = 7 hiệp
    // Chặng 2 Tầng 1: EX01 Đạp đùi (3h), EX03 Kéo xô (2h), EX09 Kéo lưng/Vai sau (2h), EX04 Đẩy vai (2h) + EX06 Cuộn cổ tay (2h) = 11 hiệp
    const order = ['EX08', 'EX11', 'EX12', 'EX01', 'EX03', 'EX09', 'EX04', 'EX06'];
    return order.map(id => EXERCISES.find(e => e.id === id)).filter(Boolean);
  }
  if (state.workoutMode === 'WORKOUT_A') {
    const order = ['EX02', 'EX12', 'EX01', 'EX03', 'EX04', 'EX05', 'EX06'];
    return order.map(id => EXERCISES.find(e => e.id === id)).filter(Boolean);
  }
  if (state.workoutMode === 'WORKOUT_B') {
    const order = ['EX08', 'EX11', 'EX12', 'EX07', 'EX09', 'EX10', 'EX13'];
    return order.map(id => EXERCISES.find(e => e.id === id)).filter(Boolean);
  }
  return EXERCISES;
}

function getSlotLabel(ex) {
  if (state.workoutMode === 'ESSENTIAL_7') return ex.slotE7 || ex.slot2F || ex.id;
  if (state.workoutMode === 'WORKOUT_A') return ex.slotA || 'Tùy chọn';
  if (state.workoutMode === 'WORKOUT_B') return ex.slotB || 'Tùy chọn';
  return ex.id;
}

// ============================================================================
// 2B. DAILY STEPS, LIVE PEDOMETER & MET CALORIE ENGINE
// ============================================================================
let pedometerActive = false;
let lastStepTime = 0;

function getTodayDateKey() {
  return new Date().toLocaleDateString('vi-VN');
}

function getTodayActivity() {
  const key = getTodayDateKey();
  if (!state.dailyActivity) state.dailyActivity = {};
  if (!state.dailyActivity[key]) {
    state.dailyActivity[key] = {
      steps: 0,
      bikeDone: false,
      farmerDone: false,
      inclineDone: false,
      bagDone: false
    };
  }
  return state.dailyActivity[key];
}

// Estimate & calculate burned kcal for a single exercise based on MET + mechanical volume
function getExerciseCalorieInfo(ex, weight, setsArr, numSets, bodyW) {
  const compoundIds = ['EX01', 'EX02', 'EX03', 'EX04', 'EX07', 'EX08', 'EX09'];
  const isCompound = compoundIds.includes(ex.id);
  const met = isCompound ? 5.6 : 4.3;
  const minPerSet = isCompound ? 2.0 : 1.55;
  const volFactor = isCompound ? 0.005 : 0.004;
  const basePerSet = met * 3.5 * (bodyW / 200) * minPerSet;

  const w = Number(weight) || 0;
  let estKcal = 0;
  let burnedKcal = 0;

  for (let i = 0; i < numSets; i++) {
    const st = (setsArr && setsArr[i]) ? setsArr[i] : { reps: ex.repMax, done: false };
    const estReps = Number(st.reps) || ex.repMax;
    const setKcal = basePerSet + (w * estReps * volFactor);
    estKcal += setKcal;
    if (st.done) {
      burnedKcal += setKcal;
    }
  }

  return {
    estKcal: Math.round(estKcal),
    burnedKcal: Math.round(burnedKcal)
  };
}

function calculateEnergyStats() {
  const latestBody = state.body[state.body.length - 1] || { weight: 74.0 };
  const bodyW = Number(latestBody.weight) || 74.0;
  const act = getTodayActivity();
  const todayKey = getTodayDateKey();
  const exList = getTodayExercises();

  // 1. Add-on activities kcal (MET formula: MET * 3.5 * bodyW / 200 * minutes)
  const bikeKcal = Math.round(5.5 * 3.5 * (bodyW / 200) * 3);       // ~21 kcal (3p bike)
  const farmerKcal = Math.round(6.5 * 3.5 * (bodyW / 200) * 1.2);   // ~10 kcal (45s hold)
  const inclineKcal = Math.round(6.8 * 3.5 * (bodyW / 200) * 10);   // ~88 kcal (10p incline 10% @ 5.0km/h)
  const bagKcal = Math.round(7.8 * 3.5 * (bodyW / 200) * 2);        // ~20 kcal (2p heavy bag)

  // 2. Strength sets estimated & burned kcal
  let setsEstKcal = 0;
  let setsBurnedKcal = 0;

  exList.forEach(ex => {
    const numSets = getTargetSetsCount(ex);
    const stats = getExerciseStats(ex);
    const s = state.todaySession[ex.id] || { weight: stats.recWeight, sets: [] };
    const info = getExerciseCalorieInfo(ex, s.weight, s.sets, numSets, bodyW);
    setsEstKcal += info.estKcal;
    setsBurnedKcal += info.burnedKcal;
  });

  // Also check if user already saved a workout earlier today in state.logs
  const savedTodayLogs = state.logs.filter(l => l.date === todayKey && l.isLocal);
  let savedLogKcal = 0;
  if (savedTodayLogs.length > 0 && setsBurnedKcal === 0) {
    savedTodayLogs.forEach(l => {
      const ex = EXERCISES.find(e => e.name === l.exercise);
      const numSets = ex ? getTargetSetsCount(ex) : 3;
      const compoundIds = ['EX01', 'EX02', 'EX03', 'EX04', 'EX07', 'EX08', 'EX09'];
      const isCompound = ex ? compoundIds.includes(ex.id) : true;
      const met = isCompound ? 5.6 : 4.3;
      const minPerSet = isCompound ? 2.0 : 1.55;
      const volFactor = isCompound ? 0.005 : 0.004;
      savedLogKcal += Math.round((met * 3.5 * (bodyW / 200) * minPerSet * numSets) + ((Number(l.volume) || 0) * volFactor));
    });
  }

  const effectiveSetsBurned = Math.max(setsBurnedKcal, savedLogKcal);
  const addonsBurnedKcal =
    (act.bikeDone ? bikeKcal : 0) +
    (act.farmerDone ? farmerKcal : 0) +
    (act.inclineDone ? inclineKcal : 0) +
    (act.bagDone ? bagKcal : 0);

  // Standard session includes: 3p Bike + Strength Sets + 45s Farmer Hold + 10p Incline Walk
  const workoutEstKcal = setsEstKcal + bikeKcal + farmerKcal + inclineKcal;
  const workoutBurnedKcal = effectiveSetsBurned + addonsBurnedKcal;
  const workoutPct = workoutEstKcal > 0 ? Math.min(100, Math.round((workoutBurnedKcal / workoutEstKcal) * 100)) : 0;

  // 3. Daily Steps & Step Calories (Stride for 1m63 height = 0.676m; ~0.55 kcal/kg per 1,000 steps)
  const steps = Math.max(0, Number(act.steps) || 0);
  const stepGoal = Math.max(1000, Number(state.bodyTargets3M?.stepGoal) || 8000);
  const stepKm = ((steps * 0.676) / 1000).toFixed(2);
  const kcalPer1kSteps = 0.55 * bodyW; // ~40.7 kcal / 1,000 steps at 74kg
  const stepBurnedKcal = Math.round((steps / 1000) * kcalPer1kSteps);
  const stepEstKcal = Math.round((stepGoal / 1000) * kcalPer1kSteps);
  const stepPct = Math.min(100, Math.round((steps / stepGoal) * 100));

  // 4. Morning Zone 2 Run logged today (if any)
  const todayRuns = state.cardioLogs.filter(c => c.date === todayKey && c.isLocal);
  const runKcalToday = todayRuns.reduce((sum, r) => sum + Math.round((Number(r.dist) || 0) * bodyW * 1.03), 0);

  // 5. Total Daily Active Calories & Total Daily TDEE (Mifflin-St Jeor BMR: 1989 -> 37yo, 163cm, Male)
  const dailyActiveBurned = workoutBurnedKcal + stepBurnedKcal + runKcalToday;
  const dailyActiveEst = workoutEstKcal + stepEstKcal + runKcalToday;
  const dailyActivePct = dailyActiveEst > 0 ? Math.min(100, Math.round((dailyActiveBurned / dailyActiveEst) * 100)) : 0;

  const bmr = Math.round(10 * bodyW + 6.25 * 163 - 5 * 37 + 5); // ~1,579 kcal at 74kg
  const baseRestDayKcal = Math.round(bmr * 1.15);               // BMR + TEF/desk resting (~1,816 kcal)
  const dailyTotalBurnedTDEE = baseRestDayKcal + dailyActiveBurned;
  const dailyTotalEstTDEE = baseRestDayKcal + dailyActiveEst;
  const recIntakeForCut = Math.max(1500, dailyTotalEstTDEE - 550); // ~550 kcal deficit for -0.5kg/week

  return {
    bodyW,
    act,
    bikeKcal,
    farmerKcal,
    inclineKcal,
    bagKcal,
    setsEstKcal,
    setsBurnedKcal: effectiveSetsBurned,
    addonsBurnedKcal,
    workoutEstKcal,
    workoutBurnedKcal,
    workoutPct,
    steps,
    stepGoal,
    stepKm,
    stepBurnedKcal,
    stepEstKcal,
    stepPct,
    runKcalToday,
    dailyActiveBurned,
    dailyActiveEst,
    dailyActivePct,
    bmr,
    baseRestDayKcal,
    dailyTotalBurnedTDEE,
    dailyTotalEstTDEE,
    recIntakeForCut
  };
}

function addSteps(delta) {
  hapticTap(10);
  const act = getTodayActivity();
  act.steps = Math.max(0, (Number(act.steps) || 0) + delta);
  saveState();
  render();
  showToast(`Đã cộng +${delta.toLocaleString('vi-VN')} bước (${act.steps.toLocaleString('vi-VN')} bước)`);
}

function setStepsInput(val) {
  const num = parseInt(String(val).replace(/[^0-9]/g, ''), 10);
  const act = getTodayActivity();
  act.steps = isNaN(num) ? 0 : Math.max(0, num);
  saveState();
  render();
  showToast(`Đã cập nhật ${act.steps.toLocaleString('vi-VN')} bước hôm nay`);
}

function triggerAddonActivity(key, seconds, label, kcal) {
  const act = getTodayActivity();
  if (!act[key]) {
    act[key] = true;
    saveState();
    render();
    startRestTimer(seconds, `${label} (+${kcal} kcal)`);
  } else {
    startRestTimer(seconds, label);
  }
}

function toggleAddonCheck(event, key, label, kcal) {
  event.stopPropagation();
  hapticTap(12);
  const act = getTodayActivity();
  act[key] = !act[key];
  saveState();
  render();
  showToast(act[key] ? `✓ Đã tính +${kcal} kcal (${label})` : `Đã bỏ tính ${label}`);
}

function handleMotionStep(event) {
  if (!pedometerActive) return;
  const acc = event.accelerationIncludingGravity;
  if (!acc) return;
  const mag = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
  const now = performance.now();
  // Walking peak threshold (> 12.4 m/s^2 vs 9.8g baseline) with 330ms debounce
  if (mag > 12.4 && now - lastStepTime > 330) {
    lastStepTime = now;
    const act = getTodayActivity();
    act.steps = (Number(act.steps) || 0) + 1;
    saveState();
    const stepNumEl = document.getElementById('liveStepCountNum');
    const stepInputEl = document.getElementById('todayStepsInput');
    if (stepNumEl) stepNumEl.textContent = act.steps.toLocaleString('vi-VN');
    if (stepInputEl && document.activeElement !== stepInputEl) stepInputEl.value = act.steps;
  }
}

async function toggleLivePedometer() {
  hapticTap(12);
  if (pedometerActive) {
    pedometerActive = false;
    window.removeEventListener('devicemotion', handleMotionStep);
    render();
    showToast('Đã tạm dừng cảm biến đếm bước');
    return;
  }

  try {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      const perm = await DeviceMotionEvent.requestPermission();
      if (perm !== 'granted') {
        showToast('Cần cấp quyền Chuyển động trên iPhone để tự đếm bước');
        return;
      }
    }
    pedometerActive = true;
    window.addEventListener('devicemotion', handleMotionStep, true);
    render();
    showToast('Đang đếm bước trực tiếp khi anh đi bộ...');
  } catch (e) {
    showToast('Thiết bị không hỗ trợ cảm biến, anh dùng nút +Bước nhé');
  }
}

// ============================================================================
// 3. MULTIMODAL FEEDBACK (Audio + Haptic + Dynamic Island Spring Timer)
// ============================================================================
let timerInterval = null;
let timerRemaining = 0;
let timerContextLabel = 'Nghỉ giữa hiệp';
let timerVisible = false;

function hapticTap(ms = 12) {
  if (navigator.vibrate) {
    try { navigator.vibrate(ms); } catch (e) {}
  }
}

function playBell() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.18].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 784 : 1046.5, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.28, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
  } catch (e) {}
  if (navigator.vibrate) {
    try { navigator.vibrate([180, 90, 240]); } catch (e) {}
  }
}

function showDynamicTimerBar() {
  const bar = document.getElementById('restTimerBar');
  if (!bar) return;
  bar.classList.add('visible');
  if (!timerVisible) {
    timerVisible = true;
    animateSpring('dynamicTimer', {
      from: 0,
      to: 1,
      damping: 0.85,
      response: 0.32,
      onUpdate: (p) => {
        const y = (1 - p) * 24;
        const sc = 0.9 + p * 0.1;
        bar.style.transform = `translateX(-50%) translateY(${y}px) scale(${sc})`;
        bar.style.opacity = String(Math.max(0, Math.min(1, p)));
      }
    });
  }
}

function hideDynamicTimerBar() {
  const bar = document.getElementById('restTimerBar');
  if (!bar || !timerVisible) return;
  timerVisible = false;
  animateSpring('dynamicTimer', {
    from: 1,
    to: 0,
    damping: 1.0,
    response: 0.25,
    onUpdate: (p) => {
      const y = (1 - p) * 20;
      const sc = 0.92 + p * 0.08;
      bar.style.transform = `translateX(-50%) translateY(${y}px) scale(${sc})`;
      bar.style.opacity = String(Math.max(0, Math.min(1, p)));
    },
    onComplete: () => {
      bar.classList.remove('visible');
    }
  });
}

function startRestTimer(seconds, label = 'Nghỉ giữa hiệp') {
  hapticTap(15);
  clearInterval(timerInterval);
  timerRemaining = seconds;
  timerContextLabel = label;
  updateTimerUI();
  showDynamicTimerBar();

  timerInterval = setInterval(() => {
    timerRemaining--;
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRemaining = 0;
      updateTimerUI();
      playBell();
      showToast(`Hết giờ nghỉ · ${timerContextLabel}`);
      setTimeout(() => hideDynamicTimerBar(), 1800);
    } else {
      updateTimerUI();
    }
  }, 1000);
}

function adjustTimer(delta) {
  hapticTap(10);
  timerRemaining = Math.max(0, timerRemaining + delta);
  updateTimerUI();
}

function stopTimer() {
  hapticTap(10);
  clearInterval(timerInterval);
  hideDynamicTimerBar();
}

function updateTimerUI() {
  const m = String(Math.floor(timerRemaining / 60)).padStart(2, '0');
  const s = String(timerRemaining % 60).padStart(2, '0');
  const timeEl = document.getElementById('timerTime');
  const lblEl = document.getElementById('timerLabel');
  if (timeEl) timeEl.textContent = `${m}:${s}`;
  if (lblEl) lblEl.textContent = timerContextLabel;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// ============================================================================
// 4. INTERACTIVE 1:1 DRAGGABLE BOTTOM SHEET (Apple WWDC Fluid Sheet)
// ============================================================================
let sheetOpen = false;
let currentSheetY = 400;

const EX_IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const EX_PHOTOS = {
  EX01: [{ label: '1. Hạ tạ sâu', url: 'Leg_Press/0.jpg' }, { label: '2. Đạp lên (không khóa gối)', url: 'Leg_Press/1.jpg' }],
  EX02: [{ label: '1. Mở ngực 90°', url: 'Leverage_Chest_Press/0.jpg' }, { label: '2. Đẩy ép ngực', url: 'Leverage_Chest_Press/1.jpg' }],
  EX03: [{ label: '1. Giãn xô trên đỉnh', url: 'Wide-Grip_Lat_Pulldown/0.jpg' }, { label: '2. Kéo xuống ngang cằm', url: 'Wide-Grip_Lat_Pulldown/1.jpg' }],
  EX04: [{ label: '1. Hạ ngang cằm', url: 'Leverage_Shoulder_Press/0.jpg' }, { label: '2. Đẩy thẳng qua đầu', url: 'Leverage_Shoulder_Press/1.jpg' }],
  EX05: [{ label: '1. Khóa khuỷu tay sát sườn', url: 'Triceps_Pushdown/0.jpg' }, { label: '2. Duỗi thẳng siết tay sau', url: 'Triceps_Pushdown/1.jpg' }],
  EX06: [{ label: '1. Cáp / Máy Cuộn cổ tay', url: 'Cable_Wrist_Curl/0.jpg' }, { label: '2. Gập cổ tay kịch trần', url: 'Cable_Wrist_Curl/1.jpg' }],
  EX07: [{ label: '1. Duỗi chân có kiểm soát', url: 'Seated_Leg_Curl/0.jpg' }, { label: '2. Gập gót siết đùi sau', url: 'Seated_Leg_Curl/1.jpg' }],
  EX08: [{ label: '1. Hạ sâu mở ngực trên', url: 'Leverage_Incline_Chest_Press/0.jpg' }, { label: '2. Đẩy chéo lên đỉnh', url: 'Leverage_Incline_Chest_Press/1.jpg' }],
  EX09: [
    { label: 'Hiệp 1 · Cầm dọc (Duỗi bả vai)', url: 'Leverage_Iso_Row/0.jpg' },
    { label: 'Hiệp 1 · Kéo sát sườn (Lưng giữa)', url: 'Leverage_Iso_Row/1.jpg' },
    { label: 'Hiệp 2 · Cầm ngang mở 70° (Duỗi)', url: 'Cable_Rope_Rear-Delt_Rows/0.jpg' },
    { label: 'Hiệp 2 · Mở cùi chỏ 70° (Vai sau)', url: 'Cable_Rope_Rear-Delt_Rows/1.jpg' }
  ],
  EX10: [{ label: '1. Chuẩn bị nâng ngang', url: 'Side_Lateral_Raise/0.jpg' }, { label: '2. Nâng ngang tầm vai', url: 'Side_Lateral_Raise/1.jpg' }],
  EX11: [
    { label: 'Hiệp 1 · Hammer Grip (Cầm búa)', url: 'Hammer_Curls/1.jpg' },
    { label: 'Hiệp 2 · Reverse Grip (Cầm sấp)', url: 'Standing_Dumbbell_Reverse_Curl/1.jpg' },
    { label: 'Máy cuộn tay Tầng 2 · Duỗi', url: 'Machine_Preacher_Curls/0.jpg' },
    { label: 'Máy cuộn tay Tầng 2 · Cuộn', url: 'Machine_Preacher_Curls/1.jpg' }
  ],
  EX12: [{ label: '1. Cố định hông', url: 'Ab_Crunch_Machine/0.jpg' }, { label: '2. Cuộn đốt sống ngực ép bụng', url: 'Ab_Crunch_Machine/1.jpg' }],
  EX13: [{ label: '1. Úp sấp lòng bàn tay', url: 'Seated_Dumbbell_Palms-Down_Wrist_Curl/0.jpg' }, { label: '2. Vểnh mu bàn tay lên', url: 'Seated_Dumbbell_Palms-Down_Wrist_Curl/1.jpg' }]
};

function openDetailSheet(exId) {
  const ex = EXERCISES.find(e => e.id === exId);
  if (!ex) return;
  hapticTap(12);

  const stats = getExerciseStats(ex);
  const photos = EX_PHOTOS[ex.id] || [];
  const photosHtml = photos.length > 0 ? `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
      ${photos.map(p => `
        <div style="background:var(--bg-tertiary);border-radius:12px;overflow:hidden;border:1px solid var(--separator);">
          <img src="${EX_IMG_BASE}${p.url}" alt="${p.label}" loading="lazy" style="width:100%;height:132px;object-fit:cover;display:block;">
          <div style="padding:6px 8px;font-size:11px;font-weight:600;color:var(--label-primary);text-align:center;">${p.label}</div>
        </div>
      `).join('')}
    </div>
  ` : '';
  const body = document.getElementById('sheetBody');
  const scrim = document.getElementById('sheetScrim');
  const panel = document.getElementById('sheetPanel');
  if (!body || !scrim || !panel) return;

  body.innerHTML = `
    <div style="margin-bottom:12px;">
      <div class="ex-slot-tag">TẦNG ${ex.floor} · ${ex.muscle.toUpperCase()}</div>
      <div style="font-size:20px;font-weight:700;letter-spacing:-0.02em;line-height:1.2;">${ex.name}</div>
      <div style="font-size:13px;color:var(--label-secondary);margin-top:4px;">${ex.equip}</div>
    </div>

    ${photosHtml}

    <div class="ios-list" style="background:var(--bg-tertiary);margin-bottom:14px;">
      <div class="ios-row">
        <span style="color:var(--label-secondary);font-size:14px;">Cấu trúc chuẩn</span>
        <span style="font-weight:600;font-size:14px;" class="tabular">${ex.sets} hiệp × ${ex.repMin}–${ex.repMax} reps (${ex.rir})</span>
      </div>
      <div class="ios-row">
        <span style="color:var(--label-secondary);font-size:14px;">Kỷ lục cá nhân (PR)</span>
        <span style="font-weight:600;font-size:14px;color:var(--green);" class="tabular">${stats.prWeight > 0 ? `${stats.prWeight} kg` : 'Chưa ghi nhận'}</span>
      </div>
      <div class="ios-row">
        <span style="color:var(--label-secondary);font-size:14px;">Bài thay thế</span>
        <span style="font-weight:500;font-size:14px;">${ex.alt}</span>
      </div>
    </div>

    <div style="background:var(--bg-tertiary);border-radius:14px;padding:14px;margin-bottom:14px;font-size:14px;line-height:1.5;">
      <div style="font-weight:600;color:var(--label-primary);margin-bottom:4px;">Kỹ thuật thực hiện</div>
      <div style="color:var(--label-secondary);">${ex.cues}</div>
      <div style="font-weight:600;color:var(--orange);margin-top:10px;margin-bottom:3px;">Lưu ý tránh chấn thương</div>
      <div style="color:var(--label-secondary);">${ex.mistakes}</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <a href="${ex.video}" target="_blank" rel="noopener" class="btn-secondary-apple">
        Xem Video Mẫu
      </a>
      <a href="${ex.image}" target="_blank" rel="noopener" class="btn-secondary-apple">
        Giải Phẫu Cơ
      </a>
    </div>
  `;

  scrim.classList.add('open');
  sheetOpen = true;
  const h = panel.offsetHeight || 380;
  currentSheetY = h;

  animateSpring('detailSheet', {
    from: currentSheetY,
    to: 0,
    damping: 0.86,
    response: 0.34,
    onUpdate: (y) => {
      currentSheetY = y;
      panel.style.transform = `translateY(${Math.max(-20, y)}px)`;
    }
  });
}

function openActivitySheet() {
  hapticTap(12);
  const energy = calculateEnergyStats();
  const body = document.getElementById('sheetBody');
  const scrim = document.getElementById('sheetScrim');
  const panel = document.getElementById('sheetPanel');
  if (!body || !scrim || !panel) return;

  body.innerHTML = `
    <div style="margin-bottom:14px;">
      <div class="ex-slot-tag" style="color:var(--blue);">NĂNG LƯỢNG & BƯỚC CHÂN HÔM NAY</div>
      <div style="font-size:20px;font-weight:700;letter-spacing:-0.02em;">Chi tiết Calo & Bước chân</div>
    </div>

    <div class="ios-list" style="background:var(--bg-tertiary);margin-bottom:14px;">
      <div class="ios-input-row">
        <label for="sheetStepsInput">Tổng bước hôm nay</label>
        <input type="text" inputmode="numeric" id="sheetStepsInput" class="tabular" value="${energy.steps}"
          onfocus="this.select()" onchange="setStepsInput(this.value);openActivitySheet();">
      </div>
      <div class="ios-input-row">
        <label for="sheetStepGoalInput">Mục tiêu bước / ngày</label>
        <input type="text" inputmode="numeric" id="sheetStepGoalInput" class="tabular" value="${energy.stepGoal}"
          onfocus="this.select()" onchange="updateBodyTarget3M('stepGoal', this.value);openActivitySheet();">
      </div>
      <div class="ios-row tabular">
        <span style="color:var(--label-secondary);font-size:14px;">Quãng đường & Calo bước</span>
        <span style="font-weight:600;font-size:14px;color:var(--blue);">${energy.stepKm} km · ${energy.stepBurnedKcal} / ${energy.stepEstKcal} kcal</span>
      </div>
    </div>

    <div class="ios-list" style="background:var(--bg-tertiary);margin-bottom:14px;">
      <div class="ios-row tabular">
        <span style="color:var(--label-secondary);font-size:14px;">Calo buổi tập (Tạ + Cardio)</span>
        <span style="font-weight:600;font-size:14px;color:var(--orange);">${energy.workoutBurnedKcal} / ${energy.workoutEstKcal} kcal</span>
      </div>
      <div class="ios-row tabular">
        <span style="color:var(--label-secondary);font-size:14px;">Calo vận động chủ động (Active)</span>
        <span style="font-weight:600;font-size:14px;color:var(--red);">${energy.dailyActiveBurned} / ${energy.dailyActiveEst} kcal</span>
      </div>
      <div class="ios-row tabular">
        <span style="color:var(--label-secondary);font-size:14px;">Chuyển hóa nền (BMR + Sinh hoạt)</span>
        <span style="font-weight:600;font-size:14px;">${energy.baseRestDayKcal.toLocaleString('vi-VN')} kcal</span>
      </div>
      <div class="ios-row tabular">
        <span style="color:var(--label-secondary);font-size:14px;">Tổng tiêu hao cả ngày (TDEE)</span>
        <span style="font-weight:700;font-size:14px;color:var(--green);">${energy.dailyTotalBurnedTDEE.toLocaleString('vi-VN')} / ${energy.dailyTotalEstTDEE.toLocaleString('vi-VN')} kcal</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:8px;">
      <button class="btn-secondary-apple" style="color:${pedometerActive ? 'var(--green)' : 'var(--label-primary)'};" onclick="toggleLivePedometer();closeDetailSheet();">
        ${pedometerActive ? 'Dừng đếm bước' : 'Bật tự đếm bước'}
      </button>
      <button class="btn-secondary-apple tabular" onclick="addSteps(500);openActivitySheet();">+500 bước</button>
      <button class="btn-secondary-apple tabular" onclick="addSteps(1000);openActivitySheet();">+1.000 bước</button>
    </div>
  `;

  scrim.classList.add('open');
  sheetOpen = true;
  const h = panel.offsetHeight || 380;
  currentSheetY = h;

  animateSpring('detailSheet', {
    from: currentSheetY,
    to: 0,
    damping: 0.86,
    response: 0.34,
    onUpdate: (y) => {
      currentSheetY = y;
      panel.style.transform = `translateY(${Math.max(-20, y)}px)`;
    }
  });
}

function closeDetailSheet(releaseVelocity = 0) {
  const scrim = document.getElementById('sheetScrim');
  const panel = document.getElementById('sheetPanel');
  if (!scrim || !panel || !sheetOpen) return;
  sheetOpen = false;
  scrim.classList.remove('open');

  const h = (panel.offsetHeight || 400) + 40;
  animateSpring('detailSheet', {
    from: currentSheetY,
    to: h,
    velocity: releaseVelocity,
    damping: 1.0,
    response: 0.3,
    onUpdate: (y) => {
      currentSheetY = y;
      panel.style.transform = `translateY(${Math.max(0, y)}px)`;
    }
  });
}

function setupSheetGesture() {
  const panel = document.getElementById('sheetPanel');
  if (!panel) return;

  let dragging = false;
  let startPointerY = 0;
  let startSheetY = 0;
  let history = [];

  panel.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    dragging = true;
    panel.setPointerCapture(e.pointerId);
    startPointerY = e.clientY;
    startSheetY = currentSheetY;
    history = [{ y: e.clientY, t: performance.now() }];
  });

  panel.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dy = e.clientY - startPointerY;
    const rawY = startSheetY + dy;
    // Rubber-band when dragging upward past 0
    const nextY = rawY < 0 ? -rubberband(-rawY, 180, 0.45) : rawY;
    currentSheetY = nextY;
    panel.style.transform = `translateY(${nextY}px)`;

    const now = performance.now();
    history.push({ y: e.clientY, t: now });
    while (history.length > 5 && now - history[0].t > 100) {
      history.shift();
    }
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    try { panel.releasePointerCapture(e.pointerId); } catch (err) {}

    let vel = 0;
    if (history.length >= 2) {
      const first = history[0];
      const last = history[history.length - 1];
      const dt = Math.max(1, last.t - first.t);
      vel = ((last.y - first.y) / dt) * 1000; // px/s
    }

    const projected = currentSheetY + projectMomentum(vel, 0.996);
    const threshold = (panel.offsetHeight || 360) * 0.32;

    if (projected > threshold || vel > 650) {
      closeDetailSheet(vel);
    } else {
      animateSpring('detailSheet', {
        from: currentSheetY,
        to: 0,
        velocity: vel,
        damping: 0.85,
        response: 0.32,
        onUpdate: (y) => {
          currentSheetY = y;
          panel.style.transform = `translateY(${y}px)`;
        }
      });
    }
  }

  panel.addEventListener('pointerup', endDrag);
  panel.addEventListener('pointercancel', endDrag);
}

// ============================================================================
// 5. GOOGLE SHEET LIVE SYNC
// ============================================================================
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cur += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(cur.trim()); cur = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && next === '\n') i++;
        row.push(cur.trim());
        rows.push(row);
        row = [];
        cur = '';
      } else cur += ch;
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur.trim());
    rows.push(row);
  }
  return rows;
}

async function syncFromGoogleSheet(silent = false) {
  if (!silent) {
    showToast('Đang đồng bộ & kiểm tra bản mới...');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.update())).catch(() => {});
    }
  }
  try {
    const logUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('Workout Log')}&t=${Date.now()}`;
    const resLog = await fetch(logUrl);
    if (resLog.ok) {
      const rows = parseCSV(await resLog.text());
      const sheetLogs = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r || !r[3] || !r[4]) continue;
        const w = parseFloat(String(r[4]).replace(/,/g, '')) || 0;
        const reps = parseInt(String(r[5]).replace(/,/g, ''), 10) || 0;
        if (w <= 0) continue;
        sheetLogs.push({
          date: r[0] || '',
          week: r[1] || '',
          workout: r[2] || '',
          exercise: r[3] || '',
          weight: w,
          reps: reps,
          volume: w * reps,
          rir: r[7] || '1 - 2 RIR',
          nextWeight: parseFloat(String(r[8]).replace(/,/g, '')) || (w + 5),
          note: r[9] || ''
        });
      }
      if (sheetLogs.length > 0) {
        const keySet = new Set(sheetLogs.map(l => `${l.date}|${l.exercise}|${l.weight}|${l.reps}`));
        const localExtra = state.logs.filter(l => l.isLocal && !keySet.has(`${l.date}|${l.exercise}|${l.weight}|${l.reps}`));
        state.logs = [...sheetLogs, ...localExtra];
      }
    }

    const bodyUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('Body Measurements')}&t=${Date.now()}`;
    const resBody = await fetch(bodyUrl);
    if (resBody.ok) {
      const rows = parseCSV(await resBody.text());
      const sheetBody = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r || !r[1]) continue;
        const w = parseFloat(String(r[1]).replace(/,/g, ''));
        if (!w || isNaN(w)) continue;
        let d = r[0] || '06/11/2026';
        if (d === '2026-06-11') d = '06/11/2026';
        sheetBody.push({
          date: d,
          weight: w,
          waist: r[2] || '',
          forearm: r[5] || '',
          note: r[8] || ''
        });
      }
      if (sheetBody.length > 0) {
        const localBodyExtra = state.body.filter(b => b.isLocal);
        state.body = [...sheetBody, ...localBodyExtra];
      }
    }

    const now = new Date();
    state.lastSync = `Đồng bộ ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (!state.userManuallySelectedMode) {
      state.workoutMode = getLastSessionInfo().nextMode;
      initTodayDefaults();
    }
    saveState();
    render();
    if (!silent) showToast('Đã cập nhật dữ liệu mới nhất');
  } catch (err) {
    if (!silent) showToast('Đang dùng dữ liệu lưu trên máy');
  }
}

// ============================================================================
// 6. WORKOUT INTERACTIONS
// ============================================================================
let segPillPos = 0;

function getModeIndex(mode) {
  if (mode === 'ESSENTIAL_7') return 0;
  if (mode === 'WORKOUT_A') return 1;
  return 2; // 'WORKOUT_B'
}

function setWorkoutMode(mode) {
  hapticTap(10);
  const modeIdx = getModeIndex(mode);
  const prevIdx = getModeIndex(state.workoutMode);
  state.workoutMode = mode;
  state.userManuallySelectedMode = true;
  initTodayDefaults();
  saveState();
  render();

  const pill = document.getElementById('segPill');
  if (pill) {
    animateSpring('segPill', {
      from: prevIdx * 100,
      to: modeIdx * 100,
      damping: 1.0,
      response: 0.28,
      onUpdate: (val) => {
        segPillPos = val;
        pill.style.transform = `translateX(${val}%)`;
      }
    });
  }
}

function stepWeight(exId, delta) {
  hapticTap(8);
  const s = state.todaySession[exId];
  if (!s) return;
  s.weight = Math.max(0, Number((Number(s.weight || 0) + delta).toFixed(1)));
  saveState();
  render();
}

function updateWeightInput(exId, val) {
  const s = state.todaySession[exId];
  if (!s) return;
  s.weight = Math.max(0, parseFloat(val) || 0);
  saveState();
}

function applyRecWeight(exId, recVal) {
  hapticTap(12);
  const s = state.todaySession[exId];
  if (!s) return;
  s.weight = recVal;
  saveState();
  render();
  showToast(`Đã đặt mức đề xuất ${recVal} kg`);
}

function updateSetReps(exId, setIdx, val) {
  const s = state.todaySession[exId];
  if (!s || !s.sets[setIdx]) return;
  s.sets[setIdx].reps = Math.max(0, parseInt(val, 10) || 0);
  saveState();
}

function toggleSetDone(exId, setIdx) {
  const ex = EXERCISES.find(e => e.id === exId);
  const s = state.todaySession[exId];
  if (!ex || !s || !s.sets[setIdx]) return;

  const targetSet = s.sets[setIdx];
  targetSet.done = !targetSet.done;
  if (targetSet.done && (!targetSet.reps || targetSet.reps <= 0)) {
    targetSet.reps = ex.repMax;
  }
  saveState();
  render();

  if (targetSet.done) {
    startRestTimer(ex.restSec, `${ex.title} · Hiệp ${setIdx + 1}`);
  } else {
    hapticTap(8);
  }
}

async function saveTodayWorkout() {
  const list = getTodayExercises();
  const todayStr = new Date().toLocaleDateString('vi-VN');
  const newRows = [];

  list.forEach(ex => {
    const s = state.todaySession[ex.id];
    if (!s) return;
    const numSets = getTargetSetsCount(ex);
    const activeSets = s.sets.slice(0, numSets).filter(st => st.done && Number(st.reps) > 0);
    if (activeSets.length === 0) return;

    const totalReps = activeSets.reduce((acc, st) => acc + Number(st.reps), 0);
    const w = Number(s.weight) || 0;
    const vol = w * totalReps;
    // Double Progression: Only step up weight (+5kg machine / +2.5kg DB) when all sets hit repMax!
    const allHitMax = activeSets.length >= numSets && activeSets.every(st => Number(st.reps) >= ex.repMax);
    const nextW = allHitMax ? w + ex.inc : w;

    newRows.push({
      date: todayStr,
      week: Math.max(6, Math.ceil((state.logs.length + 1) / 6)),
      workout: state.workoutMode === 'ESSENTIAL_7' ? '7 Bài Chuẩn (18 Hiệp)' : state.workoutMode === 'WORKOUT_A' ? 'Workout A' : 'Workout B',
      exercise: ex.name,
      weight: w,
      reps: totalReps,
      volume: vol,
      rir: s.rir || ex.rir,
      nextWeight: nextW,
      note: `Hiệp: ${activeSets.map(x => x.reps).join('/')}`,
      isLocal: true
    });
  });

  if (newRows.length === 0) {
    showToast('Chạm vòng tròn tích ít nhất 1 hiệp để lưu');
    return;
  }

  playBell();
  state.logs.push(...newRows);
  newRows.forEach(r => {
    const ex = EXERCISES.find(e => e.name === r.exercise);
    if (ex && state.todaySession[ex.id]) {
      state.todaySession[ex.id].weight = r.nextWeight;
      state.todaySession[ex.id].sets.forEach(st => { st.done = false; });
    }
  });
  initTodayDefaults();
  saveState();
  render();

  if (state.webhookUrl) {
    try {
      await fetch(state.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'appendWorkout', rows: newRows })
      });
      showToast(`Đã lưu ${newRows.length} bài & đồng bộ Sheet`);
      return;
    } catch (e) {}
  }
  showToast(`Đã lưu ${newRows.length} bài vào Nhật ký`);
}

function copyLogsTSV() {
  const recent = state.logs.slice(-12);
  const tsv = recent.map(r => [
    r.date, r.week, r.workout, r.exercise, r.weight, r.reps, r.volume, r.rir, r.nextWeight, r.note || ''
  ].join('\t')).join('\n');
  navigator.clipboard.writeText(tsv).then(() => {
    showToast('Đã sao chép định dạng bảng tính');
  });
}

async function submitBodyMeasurement() {
  const w = parseFloat(document.getElementById('bmWeight')?.value);
  if (!w || isNaN(w)) {
    showToast('Vui lòng nhập cân nặng (kg)');
    return;
  }
  const entry = {
    date: new Date().toLocaleDateString('vi-VN'),
    weight: w,
    waist: document.getElementById('bmWaist')?.value || '',
    forearm: document.getElementById('bmForearm')?.value || '',
    note: document.getElementById('bmNote')?.value || '',
    isLocal: true
  };
  state.body.push(entry);
  saveState();
  render();

  if (state.webhookUrl) {
    try {
      await fetch(state.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'appendBody', data: entry })
      });
    } catch (e) {}
  }
  showToast(`Đã lưu cân nặng ${w} kg`);
}

async function submitCardioLog() {
  const dur = parseFloat(document.getElementById('cdDur')?.value) || 25;
  const dist = parseFloat(document.getElementById('cdDist')?.value) || 3.0;
  const week = document.getElementById('cdWeek')?.value || 'Tuần 3';
  const days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const now = new Date();
  const entry = {
    date: now.toLocaleDateString('vi-VN'),
    day: days[now.getDay()],
    week,
    duration: dur,
    dist,
    hr: 'Zone 2',
    status: 'Hoàn thành',
    isLocal: true
  };
  state.cardioLogs.push(entry);
  saveState();
  render();
  showToast(`Đã lưu buổi chạy ${dist} km`);
}

// ============================================================================
// 7. APPLE MINIMALIST VIEWS
// ============================================================================
function renderTodayTab() {
  const exList = getTodayExercises();
  const latestBody = state.body[state.body.length - 1] || { weight: 74.0 };
  const bodyW = Number(latestBody.weight) || 74.0;
  const lastSession = getLastSessionInfo();
  const energy = calculateEnergyStats();
  let doneSets = 0;
  let totalSets = 0;
  let todayVolume = 0;

  exList.forEach(ex => {
    const numSets = getTargetSetsCount(ex);
    totalSets += numSets;
    const s = state.todaySession[ex.id];
    if (s) {
      s.sets.slice(0, numSets).forEach(st => {
        if (st.done) {
          doneSets++;
          todayVolume += (Number(s.weight) || 0) * (Number(st.reps) || 0);
        }
      });
    }
  });

  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;
  const radius = 26;
  const circum = 2 * Math.PI * radius;
  const dashOffset = circum - (pct / 100) * circum;
  const modeIdx = getModeIndex(state.workoutMode);
  const isOnRecommendedMode = state.workoutMode === lastSession.nextMode;

  let listHtml = '';
  let currentFloor = null;

  exList.forEach(ex => {
    if (ex.floor !== currentFloor) {
      currentFloor = ex.floor;
      const floorTitle = currentFloor === 2
        ? 'Chặng 1 · Tầng 2 (Khởi động & Tập máy Tầng 2 trước)'
        : 'Chặng 2 · Đi xuống Tầng 1 (Tập xong về luôn)';
      const floorMeta = currentFloor === 2
        ? (state.workoutMode === 'ESSENTIAL_7' ? '3 trạm · 7 hiệp · ~14p' : state.workoutMode === 'WORKOUT_A' ? '2 bài · ~12 phút' : '3 bài · ~16 phút')
        : (state.workoutMode === 'ESSENTIAL_7' ? '4 trạm + Cổ tay · 11 hiệp · ~22p' : state.workoutMode === 'WORKOUT_A' ? '5 bài · ~30 phút' : '4 bài · ~26 phút');
      listHtml += `
        <div class="section-header">
          <span class="section-title">${floorTitle}</span>
          <span class="section-meta">${floorMeta}</span>
        </div>
      `;
    }

    const stats = getExerciseStats(ex);
    const numSets = getTargetSetsCount(ex);
    const s = state.todaySession[ex.id] || { weight: stats.recWeight, sets: [] };
    const exCal = getExerciseCalorieInfo(ex, s.weight, s.sets, numSets, bodyW);
    const exDoneCount = s.sets.slice(0, numSets).filter(st => st.done).length;
    const isCompleted = exDoneCount >= numSets;
    const slotLabel = getSlotLabel(ex);

    let setRowsHtml = '';
    for (let i = 0; i < numSets; i++) {
      const st = s.sets[i] || { reps: ex.repMax, done: false };
      setRowsHtml += `
        <div class="set-row ${st.done ? 'done' : ''}">
          <span class="set-index">Hiệp ${i + 1}</span>
          <span class="set-target tabular">${ex.repMin}–${ex.repMax} lần · ${ex.rir}</span>
          <div class="set-reps-box">
            <input type="text" inputmode="numeric" pattern="[0-9]*" class="set-reps-field tabular" value="${st.reps}"
              onfocus="this.select()" onchange="updateSetReps('${ex.id}', ${i}, this.value)" aria-label="Số lần lặp hiệp ${i + 1}">
            <span class="set-reps-lbl">lần</span>
          </div>
          <button class="check-ring" onclick="toggleSetDone('${ex.id}', ${i})" aria-label="Hoàn thành hiệp ${i + 1}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      `;
    }

    listHtml += `
      <div class="apple-card ${isCompleted ? 'completed' : ''}">
        <div class="card-top">
          <div onclick="openDetailSheet('${ex.id}')" style="cursor:pointer;flex:1;">
            <div class="ex-slot-tag tabular">${slotLabel} · TẦNG ${ex.floor} · ${exCal.burnedKcal}/${exCal.estKcal} KCAL</div>
            <div class="ex-name">${ex.title}</div>
            <div class="ex-sub">${ex.vnSub}</div>
          </div>
          <button class="icon-circle-btn" onclick="openDetailSheet('${ex.id}')" aria-label="Chi tiết kỹ thuật & video">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </button>
        </div>

        <div class="weight-bar">
          <div class="weight-hint" onclick="applyRecWeight('${ex.id}', ${stats.recWeight})" style="cursor:pointer;">
            <span class="weight-hint-top tabular">Trước: ${stats.lastWeight > 0 ? `${stats.lastWeight} kg` : '—'}</span>
            <span class="weight-hint-rec tabular">${stats.recHint || `Đề xuất: ${stats.recWeight} kg`}</span>
          </div>
          <div class="weight-stepper">
            <button class="stepper-circle" onclick="stepWeight('${ex.id}', -${ex.inc})" aria-label="Giảm tạ">−</button>
            <div class="weight-val-wrap">
              <input type="text" inputmode="decimal" class="weight-val-input tabular" value="${s.weight}"
                onfocus="this.select()" onchange="updateWeightInput('${ex.id}', this.value)" aria-label="Mức tạ kg">
              <span class="weight-unit">kg</span>
            </div>
            <button class="stepper-circle" onclick="stepWeight('${ex.id}', ${ex.inc})" aria-label="Tăng tạ">+</button>
          </div>
        </div>

        <div class="set-list">
          ${setRowsHtml}
        </div>
      </div>
    `;
  });

  // Concentric 3-ring geometry (Outer: Workout Calo, Middle: Sets, Inner: Steps)
  const r1 = 29, c1 = 2 * Math.PI * r1, off1 = c1 - (Math.min(100, energy.workoutPct) / 100) * c1;
  const r2 = 21.5, c2 = 2 * Math.PI * r2, off2 = c2 - (Math.min(100, pct) / 100) * c2;
  const r3 = 14, c3 = 2 * Math.PI * r3, off3 = c3 - (Math.min(100, energy.stepPct) / 100) * c3;

  return `
    <!-- 1-Line Subtle Session Context -->
    <div class="session-caption tabular" onclick="setWorkoutMode('ESSENTIAL_7')" style="cursor:pointer;">
      <span>Trước: ${lastSession.lastLabel} (${lastSession.lastDate})</span>
      <span>Chế độ: <strong>7 Bài Chuẩn · 18 Hiệp (+5kg/tuần)</strong> ${state.workoutMode === 'ESSENTIAL_7' ? '✓' : '→'}</span>
    </div>

    <!-- Sliding Segmented Control (7 Bài Chuẩn | Buổi A | Buổi B) -->
    <div class="segmented-control">
      <div id="segPill" class="segmented-pill" style="transform:translateX(${modeIdx * 100}%);"></div>
      <button class="seg-btn ${state.workoutMode === 'ESSENTIAL_7' ? 'active' : ''}" onclick="setWorkoutMode('ESSENTIAL_7')">7 Bài Chuẩn</button>
      <button class="seg-btn ${state.workoutMode === 'WORKOUT_A' ? 'active' : ''}" onclick="setWorkoutMode('WORKOUT_A')">Buổi A</button>
      <button class="seg-btn ${state.workoutMode === 'WORKOUT_B' ? 'active' : ''}" onclick="setWorkoutMode('WORKOUT_B')">Buổi B</button>
    </div>

    <!-- Unified Apple Fitness Activity Card (Rings + Workout/Daily Calo + Steps in ONE card) -->
    <div class="af-summary-card tabular">
      <div class="af-top-row" onclick="openActivitySheet()">
        <div class="af-rings-wrap" title="Chạm xem chi tiết Năng lượng & Bước chân">
          <svg viewBox="0 0 68 68">
            <circle cx="34" cy="34" r="${r1}" fill="none" stroke="rgba(255, 69, 58, 0.18)" stroke-width="5.5"/>
            <circle cx="34" cy="34" r="${r1}" fill="none" stroke="#FF453A" stroke-width="5.5"
              stroke-linecap="round" stroke-dasharray="${c1}" stroke-dashoffset="${off1}"
              style="transition:stroke-dashoffset 400ms cubic-bezier(0.22, 1, 0.36, 1);"/>
            <circle cx="34" cy="34" r="${r2}" fill="none" stroke="rgba(48, 209, 88, 0.18)" stroke-width="5.5"/>
            <circle cx="34" cy="34" r="${r2}" fill="none" stroke="#30D158" stroke-width="5.5"
              stroke-linecap="round" stroke-dasharray="${c2}" stroke-dashoffset="${off2}"
              style="transition:stroke-dashoffset 400ms cubic-bezier(0.22, 1, 0.36, 1);"/>
            <circle cx="34" cy="34" r="${r3}" fill="none" stroke="rgba(10, 132, 255, 0.18)" stroke-width="5.5"/>
            <circle cx="34" cy="34" r="${r3}" fill="none" stroke="#0A84FF" stroke-width="5.5"
              stroke-linecap="round" stroke-dasharray="${c3}" stroke-dashoffset="${off3}"
              style="transition:stroke-dashoffset 400ms cubic-bezier(0.22, 1, 0.36, 1);"/>
          </svg>
        </div>

        <div class="af-metrics-2x2">
          <div>
            <div class="af-m-label">Calo buổi tập</div>
            <div class="af-m-val" style="color:var(--red);">${energy.workoutBurnedKcal} <span class="af-m-sub">/ ${energy.workoutEstKcal}</span></div>
          </div>
          <div>
            <div class="af-m-label">Calo trong ngày</div>
            <div class="af-m-val" style="color:var(--orange);">${energy.dailyTotalBurnedTDEE.toLocaleString('vi-VN')} <span class="af-m-sub">/ ${energy.dailyTotalEstTDEE.toLocaleString('vi-VN')}</span></div>
          </div>
          <div>
            <div class="af-m-label">Hiệp tập · Tải</div>
            <div class="af-m-val" style="color:var(--green);">${doneSets}/${totalSets} <span class="af-m-sub">· ${todayVolume.toLocaleString('vi-VN')}kg</span></div>
          </div>
          <div>
            <div class="af-m-label">Bước chân (${energy.stepKm}km)</div>
            <div class="af-m-val" style="color:var(--blue);"><span id="liveStepCountNum">${energy.steps.toLocaleString('vi-VN')}</span> <span class="af-m-sub">/ ${(energy.stepGoal / 1000).toFixed(0)}k</span></div>
          </div>
        </div>
      </div>

      <!-- Compact 1-Line Step Actions inside the same card -->
      <div class="af-divider-row">
        <button class="af-pill ${pedometerActive ? 'active-green' : ''}" onclick="toggleLivePedometer()">
          ${pedometerActive ? '● Đang đếm bước' : 'Tự đếm bước'}
        </button>
        <div style="display:flex;gap:6px;">
          <button class="af-pill" onclick="addSteps(500)">+500</button>
          <button class="af-pill" onclick="addSteps(1000)">+1.000</button>
          <button class="af-pill active-blue" onclick="openActivitySheet()">Nhập</button>
        </div>
      </div>
    </div>

    <!-- Minimalist 1-Line Quick Timer Pill Strip -->
    <div class="af-timer-strip tabular">
      <button class="af-timer-pill ${energy.act.bikeDone ? 'done' : ''}"
        onclick="triggerAddonActivity('bikeDone', 180, 'Đạp xe khởi động', ${energy.bikeKcal})">
        ${energy.act.bikeDone ? '✓ ' : ''}Đạp xe 3p
      </button>
      <button class="af-timer-pill ${energy.act.farmerDone ? 'done' : ''}"
        onclick="triggerAddonActivity('farmerDone', 45, 'Xách tạ Farmer Hold', ${energy.farmerKcal})">
        ${energy.act.farmerDone ? '✓ ' : ''}Xách tạ 45s
      </button>
      <button class="af-timer-pill ${energy.act.inclineDone ? 'done' : ''}"
        onclick="triggerAddonActivity('inclineDone', 600, 'Đi bộ dốc 10%', ${energy.inclineKcal})">
        ${energy.act.inclineDone ? '✓ ' : ''}Đi bộ dốc 10p
      </button>
      <button class="af-timer-pill ${energy.act.bagDone ? 'done' : ''}"
        onclick="triggerAddonActivity('bagDone', 120, 'Đấm bao cát', ${energy.bagKcal})">
        ${energy.act.bagDone ? '✓ ' : ''}Bao cát 2p
      </button>
    </div>

    <!-- Exercise Cards -->
    ${listHtml}

    <!-- Commit Workout -->
    <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;">
      <button class="btn-primary-apple" onclick="saveTodayWorkout()">
        Hoàn thành & Lưu buổi tập
      </button>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <button class="btn-secondary-apple" onclick="copyLogsTSV()">Sao chép dòng Sheet</button>
        <a href="${SHEET_URL}" target="_blank" rel="noopener" class="btn-secondary-apple">Mở Google Sheet</a>
      </div>
    </div>
  `;
}

function renderProgressTab() {
  const startWeight = 78.0;
  const targetWeight = 62.0;
  const latestBody = state.body[state.body.length - 1] || { weight: 74.0 };
  const currentW = Number(latestBody.weight) || 74.0;
  const lost = Math.max(0, startWeight - currentW);
  const pct = Math.min(100, Math.max(5, Math.round((lost / (startWeight - targetWeight)) * 100)));
  const bmi = (currentW / (1.63 * 1.63)).toFixed(1);
  const totalVol = state.logs.reduce((a, b) => a + (Number(b.volume) || 0), 0);
  const sessionsCount = new Set(state.logs.map(l => l.date)).size;

  const exRows = EXERCISES.map(ex => {
    const st = getExerciseStats(ex);
    const statusColor = st.status === 'Tăng tải' ? 'var(--green)' : st.status === 'Chững tạ' ? 'var(--orange)' : 'var(--label-secondary)';
    return `
      <div class="ios-row" onclick="openDetailSheet('${ex.id}')" style="cursor:pointer;">
        <div style="flex:1;">
          <div style="font-size:15px;font-weight:600;letter-spacing:-0.01em;">${ex.title}</div>
          <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;">
            Khởi điểm ${st.firstWeight || '—'} kg · Kỷ lục ${st.prWeight || '—'} kg
          </div>
        </div>
        <div style="text-align:right;">
          <div class="tabular" style="font-size:16px;font-weight:700;">${st.lastWeight > 0 ? `${st.lastWeight} kg` : '—'}</div>
          <div style="font-size:11px;font-weight:600;color:${statusColor};margin-top:2px;">
            ${st.status} → ${st.recWeight} kg
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Group logs by date to show Session-by-Session A/B history
  const sessionMap = new Map();
  state.logs.forEach(l => {
    if (!sessionMap.has(l.date)) {
      sessionMap.set(l.date, { date: l.date, countA: 0, countB: 0, full: false, exCount: 0, vol: 0, lastTag: l.workout });
    }
    const item = sessionMap.get(l.date);
    item.exCount++;
    item.vol += Number(l.volume) || 0;
    item.lastTag = l.workout;
    const wStr = String(l.workout || '').toUpperCase();
    if (wStr.includes('2 TẦNG') || wStr.includes('FULL')) item.full = true;
    else if (wStr.includes('B')) item.countB++;
    else if (wStr.includes('A')) item.countA++;
  });

  const sessionRows = Array.from(sessionMap.values()).reverse().map(s => {
    let label = 'Buổi A';
    let color = 'var(--green)';
    if (s.full && s.exCount >= 8) {
      label = 'Gộp A+B (2 Tầng)';
      color = 'var(--blue)';
    } else if (String(s.lastTag || '').toUpperCase().includes('B') || s.countB > s.countA) {
      label = 'Buổi B';
      color = 'var(--orange)';
    }
    return `
      <div class="ios-row">
        <div>
          <div style="font-size:15px;font-weight:600;" class="tabular">${s.date}</div>
          <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;">Đã hoàn thành ${s.exCount} bài tập</div>
        </div>
        <div style="text-align:right;" class="tabular">
          <div style="font-size:14px;font-weight:700;color:${color};">${label}</div>
          <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;">${s.vol.toLocaleString('vi-VN')} kg</div>
        </div>
      </div>
    `;
  }).join('');

  const historyRows = [...state.logs].reverse().slice(0, 18).map(l => `
    <div class="ios-row">
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:600;">${l.exercise.split(' - ')[0]}</div>
        <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;" class="tabular">${l.date} · ${l.workout}</div>
      </div>
      <div style="text-align:right;" class="tabular">
        <div style="font-size:15px;font-weight:600;color:var(--green);">${l.weight} kg × ${l.reps}</div>
        <div style="font-size:11px;color:var(--label-secondary);">${Number(l.volume).toLocaleString('vi-VN')} kg</div>
      </div>
    </div>
  `).join('');

  return `
    <div class="apple-card">
      <div class="ex-slot-tag">MỤC TIÊU HÌNH THỂ · 1M63 · BMI ${bmi}</div>
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-top:4px;">
        <div style="font-size:28px;font-weight:700;letter-spacing:-0.025em;" class="tabular">${currentW} <span style="font-size:16px;font-weight:500;color:var(--label-secondary);">kg</span></div>
        <div style="font-size:13px;color:var(--green);font-weight:600;" class="tabular">Đích: ${targetWeight} kg (−${(currentW - targetWeight).toFixed(1)} kg)</div>
      </div>
      <div class="apple-progress-track">
        <div class="apple-progress-fill" style="width:${pct}%;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--label-secondary);" class="tabular">
        <span>Khởi điểm: ${startWeight} kg</span>
        <span>Đã tập: ${sessionsCount} buổi · ${totalVol.toLocaleString('vi-VN')} kg tạ</span>
      </div>
    </div>

    <div class="section-header">
      <span class="section-title">Lịch sử chu kỳ Buổi A / Buổi B</span>
      <span class="section-meta">${sessionMap.size} buổi</span>
    </div>
    <div class="ios-list">
      ${sessionRows}
    </div>

    <div class="section-header">
      <span class="section-title">Sức mạnh 13 bài tập</span>
      <span class="section-meta">Chạm để xem kỹ thuật</span>
    </div>
    <div class="ios-list">
      ${exRows}
    </div>

    <div class="section-header">
      <span class="section-title">Nhật ký gần đây</span>
      <span class="section-meta">${state.logs.length} bản ghi</span>
    </div>
    <div class="ios-list">
      ${historyRows}
    </div>
  `;
}

function updateExTarget3M(exId, val) {
  const num = parseFloat(val);
  if (!num || isNaN(num) || num <= 0) return;
  if (!state.exTargets3M) state.exTargets3M = { ...DEFAULT_EX_TARGETS_3M };
  state.exTargets3M[exId] = num;
  saveState();
  render();
  showToast(`Đã đặt Target 3 tháng: ${num} kg`);
}

function updateBodyTarget3M(key, val) {
  const num = parseFloat(val);
  if (!num || isNaN(num) || num <= 0) return;
  if (!state.bodyTargets3M) state.bodyTargets3M = { ...DEFAULT_BODY_TARGETS_3M };
  state.bodyTargets3M[key] = num;
  saveState();
  render();
  showToast('Đã cập nhật mục tiêu cơ thể');
}

function renderCardioBodyTab() {
  const bt = { ...DEFAULT_BODY_TARGETS_3M, ...(state.bodyTargets3M || {}) };
  const et = { ...DEFAULT_EX_TARGETS_3M, ...(state.exTargets3M || {}) };
  const energy = calculateEnergyStats();

  const latestBody = state.body[state.body.length - 1] || { weight: 74.0, waist: '', forearm: '' };
  const currentW = Number(latestBody.weight) || 74.0;
  const startW = bt.startWeight || 78.0;
  const target3MW = bt.month3Weight || 65.0;
  const finalW = bt.finalWeight || 62.0;

  // Progress toward 3-Month Weight Target (78kg -> 65kg)
  const lostSoFar = Math.max(0, startW - currentW);
  const total3MLoss = Math.max(0.5, startW - target3MW);
  const weight3MPct = Math.min(100, Math.max(5, Math.round((lostSoFar / total3MLoss) * 100)));
  const remain3MW = Math.max(0, (currentW - target3MW)).toFixed(1);

  // Latest logged waist & forearm & max run distance
  const latestWithWaist = [...state.body].reverse().find(b => Number(b.waist) > 0);
  const currentWaist = latestWithWaist ? Number(latestWithWaist.waist) : null;
  const latestWithForearm = [...state.body].reverse().find(b => Number(b.forearm) > 0);
  const currentForearm = latestWithForearm ? Number(latestWithForearm.forearm) : null;
  const maxRunKm = state.cardioLogs.reduce((m, c) => Math.max(m, Number(c.dist) || 0), 0);
  const runPct = Math.min(100, Math.round((maxRunKm / (bt.targetRunKm || 5.0)) * 100));

  // Calculate overall 3-month strength target completion across 13 exercises
  let sumStrengthPct = 0;
  const exTargetRows = EXERCISES.map(ex => {
    const st = getExerciseStats(ex);
    const curPR = st.prWeight || st.lastWeight || 0;
    const tWeight = Number(et[ex.id]) || DEFAULT_EX_TARGETS_3M[ex.id] || 50;
    const pct = tWeight > 0 ? Math.min(100, Math.round((curPR / tWeight) * 100)) : 0;
    sumStrengthPct += pct;
    const barColor = pct >= 100 ? 'var(--green)' : 'var(--blue)';

    return `
      <div class="ios-row" style="padding:11px 16px;">
        <div onclick="openDetailSheet('${ex.id}')" style="cursor:pointer;flex:1;padding-right:8px;">
          <div style="font-size:15px;font-weight:600;">${ex.title}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
            <div style="flex:1;max-width:110px;height:3.5px;background:var(--bg-tertiary);border-radius:999px;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:${barColor};"></div>
            </div>
            <span style="font-size:12px;color:var(--label-secondary);" class="tabular">${curPR > 0 ? `${curPR} kg` : '—'} (${pct}%)</span>
          </div>
        </div>
        <div class="set-reps-box" style="margin-right:0;min-width:78px;padding:4px 10px;">
          <input type="text" inputmode="decimal" class="set-reps-field tabular" style="width:46px;color:var(--green);"
            value="${tWeight}" onfocus="this.select()" onchange="updateExTarget3M('${ex.id}', this.value)" aria-label="Target 3 tháng ${ex.title}">
          <span class="set-reps-lbl">kg</span>
        </div>
      </div>
    `;
  }).join('');

  const avgStrengthPct = Math.round(sumStrengthPct / EXERCISES.length);

  const bodyRows = [...state.body].reverse().slice(0, 5).map(b => `
    <div class="ios-row">
      <div>
        <div style="font-size:15px;font-weight:600;" class="tabular">${b.date}</div>
        <div style="font-size:12px;color:var(--label-secondary);">${b.note || 'Đo định kỳ'}</div>
      </div>
      <div style="text-align:right;" class="tabular">
        <div style="font-size:16px;font-weight:700;color:var(--green);">${b.weight} kg</div>
        ${b.waist || b.forearm ? `<div style="font-size:11px;color:var(--label-secondary);">${b.waist ? `Eo ${b.waist}cm ` : ''}${b.forearm ? `Cẳng tay ${b.forearm}cm` : ''}</div>` : ''}
      </div>
    </div>
  `).join('');

  return `
    <!-- 1. Minimalist Hero Card: 3-Month Weight Target -->
    <div class="apple-card">
      <div class="ex-slot-tag">MỤC TIÊU CÂN NẶNG 3 THÁNG</div>
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-top:4px;">
        <div>
          <span style="font-size:12px;color:var(--label-secondary);">Hiện tại</span>
          <div style="font-size:28px;font-weight:700;letter-spacing:-0.025em;" class="tabular">${currentW} <span style="font-size:15px;font-weight:500;color:var(--label-secondary);">kg</span></div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:12px;color:var(--label-secondary);">Đích 3 tháng</span>
          <div style="display:flex;align-items:baseline;justify-content:flex-end;gap:4px;margin-top:2px;">
            <input type="text" inputmode="decimal" class="weight-val-input tabular" style="width:72px;text-align:right;color:var(--green);font-size:24px !important;"
              value="${target3MW}" onfocus="this.select()" onchange="updateBodyTarget3M('month3Weight', this.value)">
            <span style="font-size:14px;color:var(--green);font-weight:600;">kg</span>
          </div>
        </div>
      </div>

      <div class="apple-progress-track" style="height:6px;margin:10px 0;">
        <div class="apple-progress-fill" style="width:${weight3MPct}%;"></div>
      </div>

      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--label-secondary);" class="tabular">
        <span>T1: ${bt.month1Weight}kg · T2: ${bt.month2Weight}kg · T3: ${target3MW}kg · Đích: ${finalW}kg</span>
        <span style="color:var(--green);font-weight:600;">Còn −${remain3MW} kg</span>
      </div>
    </div>

    <!-- 2. Clean iOS Grouped List: Daily Energy, Steps & Body Targets -->
    <div class="section-header">
      <span class="section-title">Chỉ số cơ thể & Năng lượng</span>
      <span class="section-meta">Đạt ${avgStrengthPct}% sức mạnh</span>
    </div>
    <div class="ios-list tabular">
      <div class="ios-row" onclick="openActivitySheet()" style="cursor:pointer;">
        <div>
          <div style="font-size:15px;font-weight:500;">Ngân sách Calo giảm mỡ</div>
          <div style="font-size:12px;color:var(--label-secondary);">TDEE dự tính ${energy.dailyTotalEstTDEE.toLocaleString('vi-VN')} kcal · Thâm hụt −550</div>
        </div>
        <span style="font-size:15px;font-weight:600;color:var(--green);">Ăn ~${energy.recIntakeForCut.toLocaleString('vi-VN')} kcal</span>
      </div>
      <div class="ios-input-row">
        <label for="targetStepGoal">Mục tiêu bước chân / ngày</label>
        <input type="text" inputmode="numeric" id="targetStepGoal" value="${energy.stepGoal}" onchange="updateBodyTarget3M('stepGoal', this.value)">
      </div>
      <div class="ios-input-row">
        <label for="targetWaistInput">Vòng eo đích (cm) ${currentWaist ? `· Hiện ${currentWaist}` : ''}</label>
        <input type="text" inputmode="decimal" id="targetWaistInput" value="${bt.targetWaist}" onchange="updateBodyTarget3M('targetWaist', this.value)">
      </div>
      <div class="ios-input-row">
        <label for="targetForearmInput">Cẳng tay đích (cm) ${currentForearm ? `· Hiện ${currentForearm}` : ''}</label>
        <input type="text" inputmode="decimal" id="targetForearmInput" value="${bt.targetForearm}" onchange="updateBodyTarget3M('targetForearm', this.value)">
      </div>
      <div class="ios-row">
        <span style="font-size:15px;">Chạy bộ sáng Zone 2</span>
        <span style="font-size:15px;font-weight:600;color:var(--blue);">${maxRunKm} / ${bt.targetRunKm} km (${runPct}%)</span>
      </div>
    </div>

    <!-- 3. 3-Month Exercise Strength Targets (All 13 Lifts) -->
    <div class="section-header">
      <span class="section-title">Target 3 tháng · 13 bài tập</span>
      <span class="section-meta">Chạm số kg để chỉnh đích</span>
    </div>
    <div class="ios-list">
      ${exTargetRows}
    </div>

    <!-- 4. Quick Body Measurement Update -->
    <div class="section-header">
      <span class="section-title">Cập nhật cân nặng & số đo hôm nay</span>
      <span class="section-meta">Đồng bộ Sheet</span>
    </div>
    <div class="ios-list">
      <div class="ios-input-row">
        <label for="bmWeight">Cân nặng hôm nay (kg)</label>
        <input type="text" inputmode="decimal" id="bmWeight" placeholder="${currentW}">
      </div>
      <div class="ios-input-row">
        <label for="bmWaist">Vòng eo (cm)</label>
        <input type="text" inputmode="decimal" id="bmWaist" placeholder="81.0">
      </div>
      <div class="ios-input-row">
        <label for="bmForearm">Chu vi Cẳng tay (cm)</label>
        <input type="text" inputmode="decimal" id="bmForearm" placeholder="31.5">
      </div>
      <div class="ios-input-row">
        <label for="bmNote">Ghi chú</label>
        <input type="text" id="bmNote" placeholder="Gọn bụng, nổi gân" style="width:180px;">
      </div>
    </div>
    <button class="btn-primary-apple" style="margin-bottom:20px;" onclick="submitBodyMeasurement()">
      Lưu chỉ số cơ thể hôm nay
    </button>

    <div class="section-header">
      <span class="section-title">Lịch sử đo gần nhất</span>
    </div>
    <div class="ios-list">
      ${bodyRows}
    </div>

    <!-- 5. Check-in Chạy bộ Zone 2 -->
    <div class="section-header">
      <span class="section-title">Check-in Chạy bộ sáng (Target 5 km)</span>
      <span class="section-meta">Thứ 3 · 5 · 7</span>
    </div>
    <div class="ios-list">
      <div class="ios-input-row">
        <label for="cdWeek">Giai đoạn</label>
        <select id="cdWeek">
          ${ZONE2_PLAN.map(p => `<option value="${p.week}">${p.week} (${p.dist})</option>`).join('')}
        </select>
      </div>
      <div class="ios-input-row">
        <label for="cdDur">Thời lượng (phút)</label>
        <input type="text" inputmode="numeric" id="cdDur" value="25">
      </div>
      <div class="ios-input-row">
        <label for="cdDist">Cự ly hoàn thành (km)</label>
        <input type="text" inputmode="decimal" id="cdDist" value="3.0">
      </div>
    </div>
    <button class="btn-secondary-apple" style="width:100%;margin-bottom:14px;color:var(--green);" onclick="submitCardioLog()">
      Lưu buổi chạy sáng
    </button>
  `;
}

function renderLibraryTab() {
  const listHtml = EXERCISES.map(ex => `
    <div class="ios-row" onclick="openDetailSheet('${ex.id}')" style="cursor:pointer;">
      <div style="flex:1;">
        <div style="font-size:11px;font-weight:600;color:var(--green);">TẦNG ${ex.floor} · ${ex.id}</div>
        <div style="font-size:15px;font-weight:600;margin-top:1px;">${ex.name}</div>
        <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;">${ex.equip}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--label-tertiary)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  `).join('');

  return `
    <div class="apple-card">
      <div class="ex-slot-tag">CÀI ĐẶT LÊN MÀN HÌNH CHÍNH</div>
      <div class="ex-name" style="margin-bottom:6px;">Sử dụng toàn màn hình như ứng dụng iOS</div>
      <div style="font-size:13px;color:var(--label-secondary);line-height:1.5;margin-bottom:12px;">
        • <strong>iPhone (Safari):</strong> Chạm biểu tượng <strong>Chia sẻ</strong> ở thanh dưới cùng → chọn <strong>Thêm vào MH chính</strong>.<br>
        • <strong>Android (Chrome):</strong> Chạm nút cài đặt bên dưới hoặc menu <strong>⋮ → Cài đặt ứng dụng</strong>.
      </div>
      <button class="btn-primary-apple" onclick="triggerInstallPrompt()">
        Cài đặt ứng dụng
      </button>
    </div>

    <div class="section-header">
      <span class="section-title">Đồng bộ Google Sheet 2 chiều</span>
    </div>
    <div class="ios-list">
      <div class="ios-input-row">
        <label for="cfgWebhook" style="font-size:13px;">Apps Script URL</label>
        <input type="text" id="cfgWebhook" value="${state.webhookUrl || ''}" placeholder="https://script.google.com/..." style="width:190px;font-size:14px !important;">
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
      <button class="btn-secondary-apple" onclick="saveWebhookUrl()">Lưu kết nối</button>
      <button class="btn-secondary-apple" onclick="copyAppsScriptCode()">Chép mã Script</button>
    </div>

    <div class="section-header">
      <span class="section-title">Danh mục 13 bài tập</span>
      <span class="section-meta">Chạm mở chi tiết & video</span>
    </div>
    <div class="ios-list">
      ${listHtml}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;">
      <a href="${SHEET_URL}" target="_blank" rel="noopener" class="btn-secondary-apple">Mở Sheet gốc</a>
      <button class="btn-secondary-apple" style="color:var(--green);" onclick="forceUpdateAppUI()">Làm mới Giao diện</button>
    </div>
    <div style="margin-top:10px;">
      <button class="btn-secondary-apple" style="width:100%;color:var(--red);" onclick="resetLocalData()">Khôi phục dữ liệu gốc từ Sheet</button>
    </div>
  `;
}

function saveWebhookUrl() {
  state.webhookUrl = document.getElementById('cfgWebhook')?.value?.trim() || '';
  saveState();
  showToast('Đã lưu kết nối Google Sheet');
}

async function copyAppsScriptCode() {
  try {
    const res = await fetch('./google-apps-script.gs');
    const code = await res.text();
    await navigator.clipboard.writeText(code);
    showToast('Đã sao chép mã Google Apps Script');
  } catch (e) {
    showToast('Mở file google-apps-script.gs để chép mã');
  }
}

function resetLocalData() {
  localStorage.removeItem(STORAGE_KEY);
  state.logs = [...INITIAL_LOGS];
  state.body = [...INITIAL_BODY];
  state.cardioLogs = [...INITIAL_CARDIO_LOGS];
  state.todaySession = {};
  initTodayDefaults();
  syncFromGoogleSheet(false);
}

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

function triggerInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
  } else {
    showToast('iPhone: Chia sẻ → Thêm vào MH chính');
  }
}

function switchTab(tab) {
  hapticTap(8);
  state.activeTab = tab;
  saveState();
  render();
  const main = document.getElementById('appContent');
  if (main) main.scrollTop = 0;
}

function render() {
  const content = document.getElementById('appContent');
  const syncSub = document.getElementById('syncStatusText');
  const titleEl = document.getElementById('headerTitle');
  if (syncSub) syncSub.textContent = state.lastSync;

  const titles = {
    today: 'Tập luyện',
    progress: 'Tiến độ',
    cardio: 'Mục tiêu 3 Tháng',
    library: 'Thư viện'
  };
  if (titleEl) titleEl.textContent = titles[state.activeTab] || 'Hôm nay';

  if (!content) return;
  if (state.activeTab === 'today') content.innerHTML = renderTodayTab();
  else if (state.activeTab === 'progress') content.innerHTML = renderProgressTab();
  else if (state.activeTab === 'cardio') content.innerHTML = renderCardioBodyTab();
  else if (state.activeTab === 'library') content.innerHTML = renderLibraryTab();

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === state.activeTab);
  });
}

async function forceUpdateAppUI() {
  showToast('Đang làm mới giao diện...');
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch (e) {}
  window.location.replace(window.location.pathname + '?v=' + Date.now());
}

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  render();
  setupSheetGesture();
  syncFromGoogleSheet(true);

  if ('serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    navigator.serviceWorker.register('./sw.js?v=16', { updateViaCache: 'none' })
      .then((reg) => {
        reg.update();
      })
      .catch(() => {});
  }
});
