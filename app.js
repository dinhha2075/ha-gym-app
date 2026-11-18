// HÀ GYM — Minimalist Apple Design Edition (WWDC Fluid Interface Principles)
const SHEET_ID = '1pPayEETE_yoW9lzxYy3Qdd2GV5yEqp1uQZq285eK-wQ';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?usp=sharing`;
const STORAGE_KEY = 'HA_GYM_PRO_STATE_V2';
const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzk8U7ooZTvIBYhs86Lsyl9_zkXN0elsZOpElPOQz9GhO1AfOJ_wMSrD9JiKbhaR6PO/exec';

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
// 2. CANONICAL EXERCISE DATA (14 Exercises — Paired with Live Google Sheet)
// ============================================================================
const EXERCISES = [
  {
    id: 'EX01',
    name: 'Leg Press - Đạp đùi',
    title: 'Leg Press / V-Squat',
    vnSub: 'Đạp & Gánh đùi · Máy Vàng-Đen Tầng 1 (+5kg/bên = +10kg)',
    floor: 1,
    slotE7: 'T1-5',
    slot2F: 'T1-5',
    slotA: 'A-4',
    slotB: null,
    muscle: 'Đùi trước, Mông',
    equip: 'Máy Đạp đùi 45° / Máy V-Squat Vàng-Đen Tầng 1 (Lắp bánh 5kg/bên = +10kg/nấc)',
    sets: 3,
    repMin: 8,
    repMax: 10,
    rir: '1–2 RIR',
    restSec: 105,
    inc: 10,
    minRecWeight: 180,
    video: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    image: 'https://www.muscleandstrength.com/exercises/45-degree-leg-press.html',
    cues: 'Góc trong Tầng 1 có cặp Máy Đạp đùi 45° & V-Squat Vàng-Đen sát cạnh nhau. Luôn đạp nháp 1 hiệp khởi động khớp ở 130–140kg × 6 lần trước khi vào mức chính (180kg+). Hạ sâu đủ biên độ, mông lưng dán chặt đệm, không khóa cứng gối. Đạt đủ 10/10/10 lần buổi sau lắp thêm bánh 5kg mỗi bên (+10kg tổng). Khi vượt mốc 200kg+ có thể hạ bước tăng về +5kg nếu sát ngưỡng.',
    mistakes: 'Khóa cứng đầu gối; nhấc mông/lưng khỏi đệm; bỏ hiệp nháp làm quen khớp.',
    alt: 'Máy V-Squat Vàng-Đen / Smith Squat (Tầng 1)'
  },
  {
    id: 'EX02',
    name: 'Seated Machine Chest Press - Ngồi thẳng đẩy ngực máy',
    title: 'Seated Chest Press',
    vnSub: 'Ngực giữa · Máy Xám 90° Tầng 2 (+5kg/nấc)',
    floor: 2,
    slot2F: 'T2-4',
    slotA: 'A-1',
    slotB: null,
    muscle: 'Ngực giữa, Tay sau',
    equip: 'Máy Đẩy ngực ngồi 90° khung xám Tầng 2 (+5kg/nấc · Dự phòng: MULTI PRESS Đen)',
    sets: 2,
    setsA: 3,
    repMin: 8,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=jrBo8-VSR9M',
    image: 'https://www.muscleandstrength.com/exercises/chest',
    cues: 'Máy khung xám tay cầm chữ U inox ở Tầng 2 (chồng tạ +5kg/nấc): Đạt đủ 12 lần/hiệp thì buổi sau cắm chốt +5kg và bắt đầu lại ở 8 lần.',
    mistakes: 'Nhô vai về trước; cùi chỏ mở ngang 90° gây đau vai.',
    alt: 'Máy MULTI PRESS Đen Tầng 2 / Máy Đen Tầng 1'
  },
  {
    id: 'EX03',
    name: 'Lat Pulldown - Kéo xô máy',
    title: 'Lat Pulldown',
    vnSub: 'Kéo xô · Tháp Cáp Tầng 1 (Kẹt máy → Mặt sau Máy Đen 2m)',
    floor: 1,
    slotE7: 'T1-6',
    slot2F: 'T1-6',
    slotA: 'A-5',
    slotB: null,
    muscle: 'Cơ xô (Lats), Tay trước',
    equip: 'Tháp Cáp 4 Trạm Tầng 1 (+5kg/nấc · Kẹt máy qua ngay Mặt sau Máy Đen lắp tạ rời cách 2m)',
    sets: 2,
    setsA: 3,
    repMin: 8,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=SALxEARiMkw',
    image: 'https://www.muscleandstrength.com/exercises/lat-pull-down.html',
    cues: 'Ngồi trạm Kéo xô cao trên Tháp Cáp 4 Trạm Tầng 1 (+5kg/nấc, mẹo kẹp đĩa 2.5kg lên đỉnh chồng tạ nếu muốn bước đệm). Nếu cáp đông người: bước đúng 2m sang MẶT SAU Máy Đen sát gương (có ghế đệm kẹp đùi & 2 tay đòn kéo xô lắp đĩa 2.5kg/bên cực thoáng!).',
    mistakes: 'Ngả người ra sau quá sâu lấy đà; kéo thanh ra sau gáy.',
    alt: 'Mặt sau Máy Đen lắp tạ rời Tầng 1 / One-Arm Dumbbell Row'
  },
  {
    id: 'EX04',
    name: 'Machine Shoulder Press - Đẩy vai máy',
    title: 'Machine Shoulder Press',
    vnSub: 'Đẩy vai · Máy MULTI PRESS Đen Tầng 2 (+5kg/nấc)',
    floor: 2,
    slotE7: 'T2-4',
    slot2F: 'T2-4',
    slotA: 'A-3',
    slotB: null,
    muscle: 'Cơ vai (Deltoids), Tay sau',
    equip: 'Máy MULTI PRESS Đen chồng tạ Tầng 2 (+5kg/nấc · Dự phòng: Máy Vai Vàng-Đen / Tạ đơn Tầng 1)',
    sets: 2,
    setsA: 3,
    repMin: 8,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=Lo6dnolXt3E',
    image: 'https://www.muscleandstrength.com/exercises/shoulders',
    cues: 'Chốt cố định trên Máy MULTI PRESS Đen ở Tầng 2 vắng người — xóa sổ hoàn toàn cảnh kẹt máy Tầng 1! Kéo chốt vàng dựng thẳng lưng ghế, chỉnh tay đòn lên nấc cao ngang tai, nắm tay cầm rộng đẩy qua đầu. Xếp cuối Chặng 1 Tầng 2 (sau Cuộn tay & Gập bụng) giúp vai kịp nghỉ hồi lực ~8 phút sau bài Ngực trên. Đạt 12/12 lần cắm chốt +5kg về 8 lần.',
    mistakes: 'Ưỡn võng thắt lưng quá mức; thả rơi chồng tạ tự do.',
    alt: 'Máy Vai Vàng-Đen Tầng 1 (+2.5kg/bên) / Đẩy vai Tạ đơn ghế 75°'
  },
  {
    id: 'EX05',
    name: 'Triceps Pushdown - Kéo cáp tay sau',
    title: 'Triceps Pushdown',
    vnSub: 'Kéo cáp tay sau · Tháp Cáp 4 Trạm Tầng 1 (+5kg)',
    floor: 1,
    slot2F: 'T1-9B',
    slotA: 'A-6',
    slotB: null,
    muscle: 'Cơ tay sau (Triceps)',
    equip: 'Ròng rọc cao + Dây thừng/Thanh thẳng tại Tháp Cáp 4 Trạm Tầng 1 (+5kg/nấc)',
    sets: 2,
    repMin: 10,
    repMax: 15,
    rir: '1–2 RIR',
    restSec: 60,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
    image: 'https://www.muscleandstrength.com/exercises/triceps',
    cues: 'Chốt ròng rọc lên cao trên Tháp Cáp 4 Trạm Tầng 1 (có sẵn dây thừng đen & thanh thẳng dưới chân): Tích lũy 2 hiệp 10 → 12 → 15 lần, đạt đủ 15/15 lần mới cắm chốt +5kg về 10 lần.',
    mistakes: 'Vung vẩy khuỷu tay; dùng sức nặng cơ thể đè lên cáp.',
    alt: 'Máy Trợ lực Xà kép Tầng 2 (Dip)'
  },
  {
    id: 'EX06',
    name: 'Wrist Curl - Cuộn cổ tay',
    title: 'Wrist Curl (Finger-Roll)',
    vnSub: 'Cuộn cổ tay · Kệ Tạ đơn / Cáp thấp Tầng 1',
    floor: 1,
    slotE7: 'T1-8B',
    slot2F: 'T1-9C',
    slotA: 'A-7',
    slotB: null,
    muscle: 'Cơ gập cổ tay, Sức nắm (Grip)',
    equip: 'Tạ đơn kệ gương (+2.5kg) hoặc Ròng rọc thấp + Thanh thẳng xoay Tháp Cáp Tầng 1 (+5kg/nấc)',
    sets: 2,
    repMin: 10,
    repMax: 15,
    rir: '0–1 RIR',
    restSec: 45,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=1-55N7Qlu_U',
    image: 'https://www.muscleandstrength.com/exercises/barbell-wrist-curl.html',
    cues: 'Kẹp ngay trong 60s nghỉ của bài Nâng vai ngang (T1-8A) để tiết kiệm trọn thời gian: Cầm Tạ đơn ngay kệ gương (+2.5kg) hoặc hạ ròng rọc Tháp Cáp xuống thấp nhất móc thanh thẳng xoay (+5kg/nấc, tích lũy 10 → 12 → 15 lần). Xong qua luôn T1-9 Xách tạ 45s.',
    mistakes: 'Nhấc cả cẳng tay khỏi đùi; giật cổ tay theo quán tính.',
    alt: 'Dumbbell Finger-Roll kệ gương Tầng 1 (+2.5kg)'
  },
  {
    id: 'EX07',
    name: 'Seated Leg Curl - Cuộn đùi sau máy',
    title: 'Lying Leg Curl (Đùi sau)',
    vnSub: 'Nằm móc đùi sau · Máy MBH Tầng 2 (+5kg)',
    floor: 2,
    slot2F: null,
    slotA: null,
    slotB: 'B-4',
    muscle: 'Cơ đùi sau (Hamstrings)',
    equip: 'Máy nằm sấp móc đùi sau MBH đệm nâu Tầng 2 (+5kg/nấc)',
    sets: 3,
    repMin: 10,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=Orxowest56U',
    image: 'https://www.muscleandstrength.com/exercises/leg-curl.html',
    cues: 'Tại PLUS GYM, máy đùi sau chồng tạ chuyên dụng là máy Nằm sấp MBH đệm nâu ở Tầng 2: Áp chặt xương hông xuống đệm, gập gót chân về mông siết đùi sau 1 giây, trả chậm 2–3 giây.',
    mistakes: 'Nhấc bổng mông khi gập tạ; dùng đà giật gót.',
    alt: 'Ghế Lưng dưới / Đùi sau 45° Tầng 2 (Roman Chair)'
  },
  {
    id: 'EX08',
    name: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy',
    title: 'Incline Chest Press',
    vnSub: 'Ngực trên · Máy Vàng-Đen lắp tạ Tầng 2 (+2.5kg/bên)',
    floor: 2,
    slotE7: 'T2-1',
    slot2F: 'T2-1',
    slotA: null,
    slotB: 'B-1',
    muscle: 'Cơ ngực trên (Upper Chest)',
    equip: 'Máy Incline Vàng-Đen lắp bánh tạ rời 2 bên Tầng 2 (+2.5kg/bên = +5kg tổng)',
    sets: 3,
    repMin: 8,
    repMax: 10,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    image: 'https://www.muscleandstrength.com/exercises/incline-bench-press.html',
    cues: 'Máy Vàng-Đen đặt ở phòng thảm đen Tầng 2, lắp bánh tạ rời 2 bên: Vì mỗi tay chỉ tăng nhẹ +2.5kg (+5kg tổng 2 bên) nên anh chỉ cần đẩy từ 8 lên 10 lần (đạt 10/10/10) là buổi sau gắn thêm đĩa 2.5kg mỗi bên!',
    mistakes: 'Nhấc vai khỏi ghế; đẩy bằng cơ vai trước thay vì ngực trên.',
    alt: 'Máy MULTI PRESS Đen Tầng 2 (chồng tạ)'
  },
  {
    id: 'EX09',
    name: 'Seated Row Machine - Kéo lưng ngồi máy',
    title: 'Seated Row Machine',
    vnSub: 'Kéo lưng & Vai sau · Máy Vàng-Đen Tầng 1 (+2.5kg/bên)',
    floor: 1,
    slotE7: 'T1-7',
    slot2F: 'T1-7',
    slotA: null,
    slotB: 'B-5',
    muscle: 'Cơ lưng giữa, Vai sau (Rear Delts)',
    equip: 'Máy Ngồi Kéo Lưng Vàng-Đen đệm ngực tròn Tầng 1 (Lắp bánh tạ rời +2.5kg/bên = +5kg tổng)',
    sets: 2,
    setsB: 3,
    repMin: 8,
    repMax: 12,
    rir: '1–2 RIR',
    restSec: 90,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=3EP5HpKtJG0',
    image: 'https://www.muscleandstrength.com/exercises/middle-back',
    cues: 'Máy Vàng-Đen Tầng 1 lắp bánh tạ rời 2 bên (+2.5kg/bên) & có sẵn đủ 2 tay cầm: Hiệp 1 nắm 2 tay cầm DỌC kéo sát sườn ăn dày Lưng giữa; Hiệp 2 nắm 2 tay cầm NGANG trên cao mở cùi chỏ 70° kéo về ngực trên ăn Vai sau. Đủ 12/12 lần gắn thêm 2.5kg/bên.',
    mistakes: 'Dùng đà giật thân người rời khỏi đệm ngực tròn; nhún vai co cổ.',
    alt: 'Cáp ngồi thấp Tháp Cáp / Máy Rear Delt MBH Tầng 1'
  },
  {
    id: 'EX10',
    name: 'Lateral Raise - Nâng vai ngang',
    title: 'Lateral Raise',
    vnSub: 'Nâng vai ngang (Khung chữ V) · Dàn Tạ đơn gương Tầng 1',
    floor: 1,
    slotE7: 'T1-8A',
    slot2F: 'T1-9A',
    slotA: null,
    slotB: 'B-6',
    muscle: 'Cơ vai giữa (Lateral Deltoid)',
    equip: 'Dàn Tạ đơn dọc gương Tầng 1 (+2.5kg · Thay thế: Cáp thấp kéo vai ngang)',
    sets: 2,
    setsB: 3,
    repMin: 12,
    repMax: 15,
    wUnit: 'kg/tay',
    rir: '1–2 RIR',
    restSec: 60,
    inc: 2.5,
    video: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    image: 'https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html',
    cues: 'Mảnh ghép quyết định độ bè ngang bờ vai chữ V: Đứng trước dàn tạ đơn dọc gương Tầng 1, hơi đổ người về trước 10–15°, dẫn hướng bằng cùi chỏ nâng chếch trước 20° (mặt phẳng bả vai) ngang tầm vai; hạ chậm 2–3 giây. Nghỉ 60s kẹp luôn Cuộn cổ tay (T1-8B). Đủ 15/15 lần mới tăng tạ.',
    mistakes: 'Dùng đà nhún người; nâng quá cao làm co cầu vai.',
    alt: 'Cáp kéo vai ngang tại Tháp Cáp Tầng 1'
  },
  {
    id: 'EX11',
    name: 'Hammer Curl - Cuộn tay trước búa',
    title: 'Hammer & Reverse Curl',
    vnSub: 'Tay trước & Cẳng tay · Máy MBH chữ V Tầng 2 (+5kg)',
    floor: 2,
    slotE7: 'T2-2',
    slot2F: 'T2-2',
    slotA: null,
    slotB: 'B-2',
    muscle: 'Brachioradialis (Cẳng tay), Biceps',
    equip: 'Máy Cuộn tay MBH tay cầm chữ V Tầng 2 (+5kg/nấc · Sát bên có Ghế EZ-Bar lắp tạ rời)',
    sets: 2,
    repMin: 10,
    repMax: 15,
    rir: '0–1 RIR',
    restSec: 60,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=HfSzuZPVlnA',
    image: 'https://www.muscleandstrength.com/exercises/biceps',
    cues: 'Máy MBH đệm nâu Tầng 2 có tay cầm chữ V xoay (+5kg/nấc, tích lũy 10 → 12 → 15 lần): Hiệp 1 úp SẤP bàn tay (Reverse Grip) nắm tay chữ V cuộn lên ăn căng bắp cẳng tay trên; Hiệp 2 nắm NGỬA tay (Underhand EZ) bơm đỉnh Bắp tay trước (hoặc cầm Búa tạ đơn). Muốn tăng nhỏ +2.5kg thì dùng Ghế EZ-Bar lắp tạ rời ngay sát cạnh!',
    mistakes: 'Nhổm nách khỏi đệm nâu lấy đà; thả tạ rơi mất sức căng.',
    alt: 'Ghế Preacher EZ-Bar lắp tạ rời Tầng 2 / Tạ đơn Hammer'
  },
  {
    id: 'EX12',
    name: 'Ab Crunch Machine - Gập bụng với máy',
    title: 'Ab Crunch Machine',
    vnSub: 'Gập bụng · Máy đệm vai nâu Tầng 2 (+5kg)',
    floor: 2,
    slotE7: 'T2-3',
    slot2F: 'T2-3',
    slotA: 'A-2',
    slotB: 'B-3',
    muscle: 'Cơ bụng (Rectus Abdominis)',
    equip: 'Máy Gập bụng ngồi chồng tạ Tầng 2 (Sát khu Bao cát ONE)',
    sets: 2,
    repMin: 12,
    repMax: 15,
    rir: '1–2 RIR',
    restSec: 60,
    inc: 5,
    video: 'https://www.youtube.com/watch?v=_O1xunCfYEM',
    image: 'https://www.muscleandstrength.com/exercises/ab-crunch-machine.html',
    cues: 'Máy gập bụng đệm vai tròn màu nâu đặt sát bao cát Tầng 2 (2 hiệp × 12–15 lần): Cố định hông, hai tay ôm đệm trên vai, thở hết hơi cuộn tròn đốt sống ngực ép xuống. Đạt 15/15 lần cắm chốt +5kg.',
    mistakes: 'Gập khớp hông mà không cuộn tròn cột sống ngực.',
    alt: 'Ghế gập bụng dốc xuống Tầng 2'
  },
  {
    id: 'EX13',
    name: 'Reverse Wrist Curl - Cuộn cổ tay ngược',
    title: 'Reverse Wrist Curl',
    vnSub: 'Cuộn cổ tay sấp · Tạ đơn / Cáp thấp Tầng 1',
    floor: 1,
    slot2F: 'Opt',
    slotA: null,
    slotB: 'B-7',
    muscle: 'Cơ duỗi cổ tay (Mặt trên cẳng tay)',
    equip: 'Tạ đơn kệ gương / Thanh thẳng cáp thấp Tầng 1 + 45s Farmer Hold',
    sets: 2,
    repMin: 12,
    repMax: 20,
    wUnit: 'kg/tay',
    rir: '0–1 RIR',
    restSec: 45,
    inc: 2.5,
    video: 'https://www.youtube.com/watch?v=hCMC4Vh2g_s',
    image: 'https://www.muscleandstrength.com/exercises/forearms',
    cues: 'Úp sấp lòng bàn tay cầm tạ đơn (hoặc thanh thẳng cáp thấp), tì cố định cẳng tay lên đùi, vểnh mu bàn tay lên cao hết cỡ giữ 1 giây để nổi rõ đường gân mặt ngoài.',
    mistakes: 'Dùng tạ quá nặng gây mỏi khớp cổ tay.',
    alt: 'Cuộn sấp tay với thanh EZ-Bar'
  },
  {
    id: 'EX14',
    name: 'Farmer Hold - Xách tạ đơn giữ tĩnh',
    title: 'Farmer Hold (Xách tạ đơn)',
    vnSub: 'Xách tạ giữ tĩnh · Dàn Tạ đơn gương Tầng 1 (+2.5kg/tay)',
    floor: 1,
    slotE7: 'T1-9',
    slot2F: 'T1-9D',
    slotA: 'A-8',
    slotB: 'B-8',
    muscle: 'Sức nắm (Grip), Cẳng tay, Cầu vai & Core',
    equip: 'Cặp Tạ đơn nặng tại kệ gương Tầng 1 (Ghi mức tạ 1 bên tay · Tăng +2.5kg khi giữ đủ 45/45 giây)',
    sets: 2,
    repMin: 30,
    repMax: 45,
    unit: 'giây',
    wUnit: 'kg/tay',
    rir: 'Siết chặt',
    restSec: 60,
    inc: 2.5,
    video: 'https://www.youtube.com/watch?v=Fkzk_RqlYig',
    image: 'https://www.muscleandstrength.com/exercises/farmers-walk',
    cues: 'Bài chốt hạ bơm đặc cẳng tay (mục tiêu 33cm) & sức mạnh cơ lõi đứng tự nhiên: Bấm nút [45s] trên thẻ bài (có sẵn 3s trừ hao nhấc tạ), xách 2 quả tạ đơn nặng đứng thẳng mở ngực, gồng cứng bụng, ghì vai xuống xa tai, bóp chặt thanh tạ giữ yên đến khi chuông reo. Đủ 45/45 giây buổi sau lên cặp tạ nặng hơn +2.5kg/tay.',
    mistakes: 'So vai rụt cổ; thả lỏng bụng làm võng lưng; để tạ tì vào đùi.',
    alt: 'Treo người giữ xà đơn (Dead Hang 45s)'
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
  { date: '26/10/2026', week: 6, workout: 'Workout B', exercise: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy', weight: 50, reps: 8, volume: 400, rir: '1 - 2 RIR', nextWeight: 55, note: '' },
  { date: '11/11/2026', week: 6, workout: '7 Bài Chuẩn (18 Hiệp)', exercise: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy', weight: 60, reps: 30, volume: 1800, rir: '1–2 RIR', nextWeight: 65, note: 'Hiệp: 10/10/10' },
  { date: '11/11/2026', week: 6, workout: '7 Bài Chuẩn (18 Hiệp)', exercise: 'Hammer Curl - Cuộn tay trước búa', weight: 15, reps: 24, volume: 360, rir: '0–1 RIR', nextWeight: 15, note: 'Hiệp: 12/12' },
  { date: '11/11/2026', week: 6, workout: '7 Bài Chuẩn (18 Hiệp)', exercise: 'Ab Crunch Machine - Gập bụng với máy', weight: 40, reps: 24, volume: 960, rir: '1–2 RIR', nextWeight: 40, note: 'Hiệp: 12/12' },
  { date: '11/11/2026', week: 6, workout: '7 Bài Chuẩn (18 Hiệp)', exercise: 'Leg Press - Đạp đùi', weight: 160, reps: 30, volume: 4800, rir: '1–2 RIR', nextWeight: 165, note: 'Hiệp: 10/10/10' },
  { date: '11/11/2026', week: 6, workout: '7 Bài Chuẩn (18 Hiệp)', exercise: 'Lat Pulldown - Kéo xô máy', weight: 40, reps: 20, volume: 800, rir: '1–2 RIR', nextWeight: 40, note: 'Hiệp: 10/10' },
  { date: '11/11/2026', week: 6, workout: '7 Bài Chuẩn (18 Hiệp)', exercise: 'Seated Row Machine - Kéo lưng ngồi máy', weight: 60, reps: 20, volume: 1200, rir: '1–2 RIR', nextWeight: 60, note: 'Hiệp: 10/10' },
  { date: '11/11/2026', week: 6, workout: '7 Bài Chuẩn (18 Hiệp)', exercise: 'Machine Shoulder Press - Đẩy vai máy', weight: 40, reps: 18, volume: 720, rir: '1–2 RIR', nextWeight: 40, note: 'Hiệp: 10/8' },
  { date: '11/11/2026', week: 6, workout: '7 Bài Chuẩn (18 Hiệp)', exercise: 'Wrist Curl - Cuộn cổ tay', weight: 35, reps: 20, volume: 700, rir: '0–1 RIR', nextWeight: 35, note: 'Hiệp: 10/10' },
  { date: '14/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy', weight: 65, reps: 24, volume: 1560, rir: '1–2 RIR', nextWeight: 65, note: 'Hiệp: 8/8/8' },
  { date: '14/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Hammer Curl - Cuộn tay trước búa', weight: 15, reps: 30, volume: 450, rir: '0–1 RIR', nextWeight: 20, note: 'Hiệp: 15/15' },
  { date: '14/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Ab Crunch Machine - Gập bụng với máy', weight: 40, reps: 28, volume: 1120, rir: '1–2 RIR', nextWeight: 40, note: 'Hiệp: 14/14' },
  { date: '14/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Wrist Curl - Cuộn cổ tay', weight: 35, reps: 24, volume: 840, rir: '0–1 RIR', nextWeight: 35, note: 'Hiệp: 12/12' },
  { date: '14/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Seated Row Machine - Kéo lưng ngồi máy', weight: 55, reps: 24, volume: 1320, rir: '1–2 RIR', nextWeight: 60, note: 'Hiệp: 12/12' },
  { date: '14/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Leg Press - Đạp đùi', weight: 170, reps: 24, volume: 4080, rir: '1–2 RIR', nextWeight: 170, note: 'Hiệp: 8/8/8' },
  { date: '14/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Lat Pulldown - Kéo xô máy', weight: 40, reps: 24, volume: 960, rir: '1–2 RIR', nextWeight: 45, note: 'Hiệp: 12/12' },
  { date: '17/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy', weight: 65, reps: 22, volume: 1430, rir: '1–2 RIR', nextWeight: 65, note: 'Hiệp: 10/7/5 · 5p02s · 40 kcal' },
  { date: '17/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Hammer Curl - Cuộn tay trước búa', weight: 20, reps: 35, volume: 700, rir: '0–1 RIR', nextWeight: 20, note: 'Hiệp: 10/25 · 1p59s · 13 kcal' },
  { date: '17/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Ab Crunch Machine - Gập bụng với máy', weight: 40, reps: 30, volume: 1200, rir: '1–2 RIR', nextWeight: 45, note: 'Hiệp: 15/15 · 2p54s · 20 kcal' },
  { date: '17/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Machine Shoulder Press - Đẩy vai máy', weight: 40, reps: 22, volume: 880, rir: '1–2 RIR', nextWeight: 40, note: 'Hiệp: 11/11 · 5p34s · 41 kcal' },
  { date: '17/11/2026', week: 6, workout: '9 Bài Chuẩn (22 Hiệp)', exercise: 'Lat Pulldown - Kéo xô máy', weight: 45, reps: 8, volume: 360, rir: '1–2 RIR', nextWeight: 45, note: 'Hiệp: 8 · 43p55s · 48 kcal' }
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
  EX01: 240,   // Leg Press: 180kg -> 240kg (+10kg/nấc)
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
  EX13: 20,    // Reverse Wrist Curl: 10kg -> 20kg
  EX14: 30     // Farmer Hold (mỗi tay): 20kg -> 30kg × 45s
};

const GOLDEN_40_TARGETS = {
  heightCm: 163,
  weight: 63.0,
  bf: 13.0,
  waist: 74.5,      // WHtR = 0.457 (Phẳng bụng, kéo dài tỷ lệ chân thị giác cho 1m63)
  shoulder: 117.0,  // Vai/Eo = 1.57x (Chuẩn Chữ V Adonis)
  chest: 100.5,     // Ngực/Eo = 1.35x (Dày thềm ngực trên & xô)
  arm: 36.5,        // Bắp tay gồng săn nét
  forearm: 33.0,    // Cẳng tay = 90% Bắp tay (Xắn tay áo đầm chắc)
  thigh: 55.5       // Đùi săn gọn mặc quần Âu thoát dáng
};

const DEFAULT_BODY_TARGETS_3M = {
  startWeight: 78.0,
  month1Weight: 71.0,
  month2Weight: 68.0,
  month3Weight: 65.0,
  finalWeight: 63.0,
  targetWaist: 74.5,
  targetShoulder: 117.0,
  targetChest: 100.5,
  targetForearm: 33.0,
  targetRunKm: 5.0,
  stepGoal: 8000
};

function formatDateVN(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function normalizeDateVN(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [yyyy, mm, dd] = s.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    return `${m[1].padStart(2, '0')}/${m[2].padStart(2, '0')}/${m[3]}`;
  }
  return s;
}

function getTodayDateKey() {
  return formatDateVN(new Date());
}

function formatClockMMSS(totalSec) {
  const sec = Math.max(0, Math.round(Number(totalSec) || 0));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDurationCompact(totalSec) {
  const sec = Math.max(0, Math.round(Number(totalSec) || 0));
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}p${String(s).padStart(2, '0')}s` : `${m}p`;
}

function parseNoteSetReps(noteStr) {
  const raw = String(noteStr || '');
  if (!raw.includes('Hiệp:')) return [];
  const head = raw.split('·')[0].replace('Hiệp:', '').trim();
  return head.split('/').map(n => parseInt(n, 10)).filter(n => !isNaN(n) && n > 0);
}

function parseNoteDurationSec(noteStr) {
  const raw = String(noteStr || '');
  const mMinSec = raw.match(/(?:·|\s)(\d+)p(?:(\d+)s)?(?:\s|·|$)/);
  if (mMinSec) {
    return parseInt(mMinSec[1], 10) * 60 + (mMinSec[2] ? parseInt(mMinSec[2], 10) : 0);
  }
  const mOnlySec = raw.match(/·\s*(\d+)s(?:\s|·|$)/);
  if (mOnlySec) {
    return parseInt(mOnlySec[1], 10);
  }
  return 0;
}

function getExerciseElapsedSec(s) {
  if (!s) return 0;
  if (s.endedAt && s.startedAt) {
    return Math.max(1, Math.round((s.endedAt - s.startedAt) / 1000));
  }
  if (Number(s.durationSec) > 0 && !s.startedAt) {
    return Math.round(Number(s.durationSec));
  }
  if (s.startedAt && !s.endedAt) {
    return Math.max(0, Math.round((Date.now() - s.startedAt) / 1000));
  }
  return Number(s.durationSec) > 0 ? Math.round(Number(s.durationSec)) : 0;
}

let state = {
  activeTab: 'today',
  workoutMode: 'ESSENTIAL_7', // 'ESSENTIAL_7' | 'WORKOUT_A' | 'WORKOUT_B'
  userManuallySelectedMode: false,
  warmupDone: false,
  todaySessionDate: '',
  todaySession: {},
  dailyActivity: {},
  logs: [...INITIAL_LOGS],
  body: [...INITIAL_BODY],
  cardioLogs: [...INITIAL_CARDIO_LOGS],
  exTargets3M: { ...DEFAULT_EX_TARGETS_3M },
  bodyTargets3M: { ...DEFAULT_BODY_TARGETS_3M },
  webhookUrl: DEFAULT_WEBHOOK_URL,
  lastSync: 'Đã đồng bộ Sheet',
  libFilter: 'ALL'
};

// Analyze last completed workout session from logs & recommend Unified 9 Bài Chuẩn routine
function getLastSessionInfo() {
  const todayKey = getTodayDateKey();
  const todayLogs = (state.logs || []).filter(l => normalizeDateVN(l.date) === todayKey);
  const pastLogs = (state.logs || []).filter(l => normalizeDateVN(l.date) !== todayKey);
  const sourceLogs = pastLogs.length > 0 ? pastLogs : (state.logs || []);

  if (sourceLogs.length === 0) {
    return {
      lastDate: 'Chưa có',
      lastLabel: 'Chưa tập',
      lastCode: 'NONE',
      exCount: 0,
      todaySavedCount: todayLogs.length,
      totalVol: 0,
      nextMode: 'ESSENTIAL_7',
      nextLabel: '9 Bài Chuẩn · 22 Hiệp (Tầng 2 → Tầng 1)'
    };
  }
  const lastEntry = sourceLogs[sourceLogs.length - 1];
  const lastDate = normalizeDateVN(lastEntry.date);
  const sameDayLogs = sourceLogs.filter(l => normalizeDateVN(l.date) === lastDate);
  const totalVol = sameDayLogs.reduce((acc, l) => acc + (Number(l.volume) || 0), 0);

  let countA = 0;
  let countB = 0;
  let isEssential9 = false;
  let isEssential8 = false;
  let isEssential7 = false;
  sameDayLogs.forEach(l => {
    const wStr = String(l.workout || '').toUpperCase();
    if (wStr.includes('9 BÀI')) isEssential9 = true;
    else if (wStr.includes('8 BÀI')) isEssential8 = true;
    else if (wStr.includes('7 BÀI') || wStr.includes('2 TẦNG') || wStr.includes('FULL')) isEssential7 = true;
    else if (wStr.includes('B')) countB++;
    else if (wStr.includes('A')) countA++;
  });

  const lastWTag = String(lastEntry.workout || '').toUpperCase();
  let lastCode = 'ESSENTIAL_7';
  let lastLabel = '9 Bài Chuẩn';

  if (isEssential9) {
    lastCode = 'ESSENTIAL_7';
    lastLabel = '9 Bài Chuẩn';
  } else if (isEssential8) {
    lastCode = 'ESSENTIAL_7';
    lastLabel = '8 Bài Chuẩn';
  } else if (isEssential7) {
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
    todaySavedCount: todayLogs.length,
    totalVol,
    nextMode: 'ESSENTIAL_7',
    nextLabel: '9 Bài Chuẩn · 22 Hiệp (Tầng 2 → Tầng 1)'
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
        webhookUrl: (parsed.webhookUrl && String(parsed.webhookUrl).trim()) || DEFAULT_WEBHOOK_URL,
        logs: parsed.logs && parsed.logs.length >= INITIAL_LOGS.length ? parsed.logs : [...INITIAL_LOGS],
        body: parsed.body && parsed.body.length >= INITIAL_BODY.length ? parsed.body : [...INITIAL_BODY],
        cardioLogs: parsed.cardioLogs && parsed.cardioLogs.length ? parsed.cardioLogs : [...INITIAL_CARDIO_LOGS],
        exTargets3M: { ...DEFAULT_EX_TARGETS_3M, ...(parsed.exTargets3M || {}) },
        bodyTargets3M: { ...DEFAULT_BODY_TARGETS_3M, ...(parsed.bodyTargets3M || {}) },
        dailyActivity: parsed.dailyActivity || {}
      };
      if (state.exTargets3M && state.exTargets3M.EX01 === 200) {
        state.exTargets3M.EX01 = 240;
      }
      if (state.bodyTargets3M && state.bodyTargets3M.finalWeight === 62) {
        state.bodyTargets3M.finalWeight = 63.0;
      }
      if (state.bodyTargets3M && state.bodyTargets3M.targetWaist === 78) {
        state.bodyTargets3M.targetWaist = 74.5;
      }
    }
  } catch (e) {}
  // Default to the unified Essential 7 routine so all 7 core lifts progress every week
  if (!state.userManuallySelectedMode || state.workoutMode === '2FLOOR') {
    state.workoutMode = 'ESSENTIAL_7';
  }

  const todayKey = getTodayDateKey();
  const prevDateKey = normalizeDateVN(state.todaySessionDate);
  if (!prevDateKey) {
    state.todaySessionDate = todayKey;
    // Restore checkmarks if today's workout was already committed earlier, then rescue any checked sets
    hydrateTodayFromLogs(todayKey);
    syncTodaySessionToLogs(todayKey);
  } else if (prevDateKey !== todayKey) {
    // New calendar day: commit previous day's checked sets, then start fresh for today
    syncTodaySessionToLogs(prevDateKey);
    state.todaySession = {};
    state.todaySessionDate = todayKey;
    hydrateTodayFromLogs(todayKey);
  } else {
    state.todaySessionDate = todayKey;
    hydrateTodayFromLogs(todayKey);
    syncTodaySessionToLogs(todayKey);
  }

  initTodayDefaults();
  getTodayActivity();
  ensureLiveExTimerLoop();
  saveState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

// ============================================================================
// 2A. AGE-40 GOLDEN RATIO & ANATOMICAL SILHOUETTE ENGINE (1M63 EDITION)
// ============================================================================
let blueprintProgress = 1.0;

function parseShoulderFromNote(noteStr) {
  const m = String(noteStr || '').match(/Vai[:\s]*([0-9]+(?:\.[0-9]+)?)/i);
  return m ? parseFloat(m[1]) : 0;
}

function getCurrentBodyProfile() {
  const findLatest = (field) => {
    for (let i = (state.body || []).length - 1; i >= 0; i--) {
      const v = parseFloat(state.body[i]?.[field]);
      if (!isNaN(v) && v > 0) return v;
    }
    if (field === 'shoulder') {
      for (let i = (state.body || []).length - 1; i >= 0; i--) {
        const sv = parseShoulderFromNote(state.body[i]?.note);
        if (sv > 0) return sv;
      }
    }
    return null;
  };

  const mWeight = findLatest('weight');
  const weight = mWeight || 74.0;
  const dw = weight - 74.0; // Anthropometric scaling around 1m63 · 74.0kg reference

  const mWaist = findLatest('waist');
  const mShoulder = findLatest('shoulder');
  const mChest = findLatest('chest');
  const mArm = findLatest('arm');
  const mForearm = findLatest('forearm');
  const mThigh = findLatest('thigh');
  const mBf = findLatest('bf');

  const profile = {
    weight,
    waist: mWaist || Number((87.0 + dw * 0.95).toFixed(1)),
    shoulder: mShoulder || Number((112.0 + dw * 0.25).toFixed(1)),
    chest: mChest || Number((98.0 + dw * 0.55).toFixed(1)),
    arm: mArm || Number((34.5 + dw * 0.18).toFixed(1)),
    forearm: mForearm || Number((29.5 + dw * 0.12).toFixed(1)),
    thigh: mThigh || Number((58.0 + dw * 0.45).toFixed(1)),
    bf: mBf || Number(Math.max(10, Math.min(35, 24.0 + dw * 0.75)).toFixed(1)),
    measured: {
      weight: Boolean(mWeight),
      waist: Boolean(mWaist),
      shoulder: Boolean(mShoulder),
      chest: Boolean(mChest),
      arm: Boolean(mArm),
      forearm: Boolean(mForearm),
      thigh: Boolean(mThigh),
      bf: Boolean(mBf)
    }
  };

  const coreKeys = ['weight', 'waist', 'shoulder', 'chest', 'arm', 'forearm', 'thigh'];
  profile.measuredCount = coreKeys.filter(k => profile.measured[k]).length;

  const wScore = Math.min(1, Math.max(0, (78.0 - profile.weight) / (78.0 - GOLDEN_40_TARGETS.weight)));
  const vRatio = profile.shoulder / Math.max(55, profile.waist);
  const vScore = Math.min(1, Math.max(0, (vRatio - 1.22) / (1.57 - 1.22)));
  const whtr = profile.waist / GOLDEN_40_TARGETS.heightCm;
  const waistScore = Math.min(1, Math.max(0, (0.56 - whtr) / (0.56 - 0.457)));
  const faScore = Math.min(1, Math.max(0, (profile.forearm - 28.5) / (GOLDEN_40_TARGETS.forearm - 28.5)));
  profile.goldenReadinessPct = Math.round((wScore * 0.35 + vScore * 0.30 + waistScore * 0.20 + faScore * 0.15) * 100);

  return profile;
}

function buildBlueprintBodyPaths(cx, m, isDefined) {
  const sw = m.shoulder * 0.35;
  const cw = m.chest * 0.30;
  const ww = (m.waist - 45) * 0.52 + 7.5;
  const loveHandle = Math.max(0, (m.waist - 76) * 0.28);
  const flankW = ww + loveHandle;
  const hw = Math.max(ww + loveHandle * 0.65, 24.8);
  const uawDelta = (m.arm - 33) * 0.55;
  const faDelta = (m.forearm - 28) * 0.68;
  const tw = (m.thigh - 46) * 0.45 + 22.5;
  const innerGap = Math.max(1.8, 4.8 - loveHandle * 0.5);

  const outer = `
    M ${cx} 24
    C ${cx + 8.5} 24, ${cx + 11.5} 30.5, ${cx + 11} 39.5
    C ${cx + 10.5} 47.5, ${cx + 8.2} 52.5, ${cx + 7.8} 56.5
    L ${cx + 9.5} 62
    C ${cx + 16} 64.5, ${cx + sw - 11} 66, ${cx + sw - 2.5} 71
    C ${cx + sw + 3} 75.5, ${cx + sw + 4.5} 85, ${cx + sw + 3.2} 95
    C ${cx + sw + 4.8 + uawDelta} 104, ${cx + sw + 5.2 + uawDelta} 113, ${cx + sw + 4.6} 121
    C ${cx + sw + 8.2 + faDelta} 130, ${cx + sw + 9 + faDelta * 0.6} 144, ${cx + sw + 8.4} 159
    L ${cx + sw + 9.4} 168
    Q ${cx + sw + 5.5} 172, ${cx + sw + 2} 168
    L ${cx + sw + 2} 159
    C ${cx + sw - 0.8} 145, ${cx + sw - 3.2 - faDelta * 0.3} 131, ${cx + sw - 4.2} 121
    C ${cx + sw - 5.2} 112, ${cx + cw + 3.5} 104, ${cx + cw + 1.5} 97
    C ${cx + cw + 0.5} 111, ${cx + ww + 1.5} 126, ${cx + ww} 138
    C ${cx + flankW} 146, ${cx + hw + 1} 153, ${cx + hw} 161
    C ${cx + tw + 1.5} 177, ${cx + tw + 0.8} 199, ${cx + 19.5} 223
    L ${cx + 17.5} 234
    C ${cx + 20.5} 246, ${cx + 19.5} 259, ${cx + 14.5} 276
    L ${cx + 17.5} 285
    L ${cx + 8} 285
    L ${cx + 8.6} 276
    C ${cx + 7.6} 259, ${cx + 7.4} 245, ${cx + 8} 234
    C ${cx + 6.5} 213, ${cx + innerGap + 1.5} 191, ${cx + 2.1} 174
    L ${cx - 2.1} 174
    C ${cx - innerGap - 1.5} 191, ${cx - 6.5} 213, ${cx - 8} 234
    C ${cx - 7.4} 245, ${cx - 7.6} 259, ${cx - 8.6} 276
    L ${cx - 8} 285
    L ${cx - 17.5} 285
    L ${cx - 14.5} 276
    C ${cx - 19.5} 259, ${cx - 20.5} 246, ${cx - 17.5} 234
    L ${cx - 19.5} 223
    C ${cx - tw - 0.8} 199, ${cx - tw - 1.5} 177, ${cx - hw} 161
    C ${cx - hw - 1} 153, ${cx - flankW} 146, ${cx - ww} 138
    C ${cx - ww - 1.5} 126, ${cx - cw - 0.5} 111, ${cx - cw - 1.5} 97
    C ${cx - cw - 3.5} 104, ${cx - sw + 5.2} 112, ${cx - sw + 4.2} 121
    C ${cx - sw + 3.2 + faDelta * 0.3} 131, ${cx - sw + 0.8} 145, ${cx - sw - 2} 159
    L ${cx - sw - 2} 168
    Q ${cx - sw - 5.5} 172, ${cx - sw - 9.4} 168
    L ${cx - sw - 8.4} 159
    C ${cx - sw - 9 - faDelta * 0.6} 144, ${cx - sw - 8.2 - faDelta} 130, ${cx - sw - 4.6} 121
    C ${cx - sw - 5.2 - uawDelta} 113, ${cx - sw - 4.8 - uawDelta} 104, ${cx - sw - 3.2} 95
    C ${cx - sw - 4.5} 85, ${cx - sw - 3} 75.5, ${cx - sw + 2.5} 71
    C ${cx - sw + 11} 66, ${cx - 16} 64.5, ${cx - 9.5} 62
    L ${cx - 7.8} 56.5
    C ${cx - 8.2} 52.5, ${cx - 10.5} 47.5, ${cx - 11} 39.5
    C ${cx - 11.5} 30.5, ${cx - 8.5} 24, ${cx} 24 Z
  `;

  const pecY = isDefined ? 97 : 101;
  const pecCurve = `
    M ${cx - cw + 3} ${pecY - 5}
    Q ${cx - cw * 0.48} ${pecY + 3.5}, ${cx - 2} ${pecY - 1}
    M ${cx + cw - 3} ${pecY - 5}
    Q ${cx + cw * 0.48} ${pecY + 3.5}, ${cx + 2} ${pecY - 1}
  `;

  const absLines = `
    M ${cx} ${pecY + 2} L ${cx} 150
    M ${cx - 9.5} 113 Q ${cx} 115, ${cx + 9.5} 113
    M ${cx - 10} 125 Q ${cx} 127, ${cx + 10} 125
    M ${cx - 9} 137 Q ${cx} 139, ${cx + 9} 137
    M ${cx - 10.5} 107 C ${cx - 12.5} 123, ${cx - 11.5} 141, ${cx - 7.5} 154
    M ${cx + 10.5} 107 C ${cx + 12.5} 123, ${cx + 11.5} 141, ${cx + 7.5} 154
  `;

  return { outer, pecCurve, absLines, sw: sw + 3, cw, ww: flankW, waistCore: ww, faX: sw + 9 + faDelta };
}

function lerpMetric(a, b, t) {
  return a + (b - a) * t;
}

function buildBlueprintSvgMarkup(cur, progress = 1.0) {
  const sim = {
    weight: lerpMetric(cur.weight, GOLDEN_40_TARGETS.weight, progress),
    bf: lerpMetric(cur.bf, GOLDEN_40_TARGETS.bf, progress),
    shoulder: lerpMetric(cur.shoulder, GOLDEN_40_TARGETS.shoulder, progress),
    chest: lerpMetric(cur.chest, GOLDEN_40_TARGETS.chest, progress),
    waist: lerpMetric(cur.waist, GOLDEN_40_TARGETS.waist, progress),
    arm: lerpMetric(cur.arm, GOLDEN_40_TARGETS.arm, progress),
    forearm: lerpMetric(cur.forearm, GOLDEN_40_TARGETS.forearm, progress),
    thigh: lerpMetric(cur.thigh, GOLDEN_40_TARGETS.thigh, progress)
  };

  const pctInt = Math.round(progress * 100);
  const leftCx = 74;
  const rightCx = 228;
  const pCur = buildBlueprintBodyPaths(leftCx, cur, false);
  const pGhost = buildBlueprintBodyPaths(rightCx, cur, false);
  const pSim = buildBlueprintBodyPaths(rightCx, sim, progress > 0.55);

  const curRatio = (cur.shoulder / Math.max(55, cur.waist)).toFixed(2);
  const simRatio = (sim.shoulder / Math.max(55, sim.waist)).toFixed(2);
  const abOpacity = Math.max(0, (progress - 0.35) / 0.65) * 0.65;
  const shPrefix = cur.measured?.shoulder ? '' : '~';
  const waPrefix = cur.measured?.waist ? '' : '~';

  return `
    <line x1="10" y1="24" x2="346" y2="24" stroke="rgba(255,255,255,0.12)" stroke-dasharray="2 3" stroke-width="0.8" />
    <line x1="10" y1="141" x2="346" y2="141" stroke="rgba(255,255,255,0.10)" stroke-dasharray="2 3" stroke-width="0.8" />
    <line x1="10" y1="285" x2="346" y2="285" stroke="rgba(255,255,255,0.16)" stroke-width="1" />

    <text x="${leftCx}" y="15" text-anchor="middle" fill="rgba(235,235,245,0.68)" font-size="10.2" font-weight="600">HIỆN TẠI (${cur.weight.toFixed(1)} KG)</text>
    <text x="${rightCx}" y="15" text-anchor="middle" fill="#30D158" font-size="10.2" font-weight="700">${pctInt >= 99 ? 'CHUẨN TRƯỚC 40T' : `MÔ PHỎNG ${pctInt}%`} (${sim.weight.toFixed(1)} KG)</text>

    <path d="${pCur.outer}" fill="rgba(174,174,178,0.18)" stroke="rgba(235,235,245,0.52)" stroke-width="1.35" />
    <path d="${pCur.pecCurve}" fill="none" stroke="rgba(235,235,245,0.38)" stroke-width="1.1" />
    <polygon points="${leftCx - pCur.sw + 4},74 ${leftCx + pCur.sw - 4},74 ${leftCx + pCur.ww},144 ${leftCx - pCur.ww},144"
      fill="rgba(255,159,10,0.08)" stroke="#FF9F0A" stroke-dasharray="3 2" stroke-width="1" />

    <line x1="${leftCx - pCur.sw + 2}" y1="74" x2="${leftCx + pCur.sw - 2}" y2="74" stroke="#FF9F0A" stroke-width="1.2" />
    <text x="${leftCx}" y="87" text-anchor="middle" fill="#FFFFFF" font-size="9.5" font-weight="600">Vai ${shPrefix}${cur.shoulder.toFixed(0)}cm</text>
    <line x1="${leftCx - pCur.ww}" y1="142" x2="${leftCx + pCur.ww}" y2="142" stroke="#FF453A" stroke-width="1.5" />
    <text x="${leftCx}" y="156" text-anchor="middle" fill="#FF453A" font-size="9.5" font-weight="700">Eo ${waPrefix}${cur.waist.toFixed(0)}cm</text>
    <text x="${leftCx}" y="301" text-anchor="middle" fill="rgba(235,235,245,0.62)" font-size="9.8" font-weight="600">Vai/Eo: ${curRatio}× (${Number(curRatio) >= 1.50 ? 'Chữ V' : 'Chữ H'})</text>

    <text x="149" y="143" text-anchor="middle" fill="#30D158" font-size="14" font-weight="700">➔</text>

    <path d="${pGhost.outer}" fill="rgba(255,159,10,0.20)" stroke="#FF9F0A" stroke-dasharray="3 2" stroke-width="1" />
    <path d="${pSim.outer}" fill="rgba(48,209,88,0.22)" stroke="#30D158" stroke-width="1.65" />
    <path d="${pSim.pecCurve}" fill="none" stroke="#30D158" stroke-opacity="0.82" stroke-width="1.3" />
    <path d="${pSim.absLines}" fill="none" stroke="#30D158" stroke-opacity="${abOpacity.toFixed(2)}" stroke-width="1" />

    <polygon points="${rightCx - pSim.sw + 3},73 ${rightCx + pSim.sw - 3},73 ${rightCx},150"
      fill="rgba(48,209,88,0.12)" stroke="#30D158" stroke-dasharray="2 2" stroke-width="1.1" />

    <line x1="${rightCx - pSim.sw + 2}" y1="73" x2="${rightCx + pSim.sw - 2}" y2="73" stroke="#30D158" stroke-width="1.4" />
    <text x="${rightCx}" y="86" text-anchor="middle" fill="#FFFFFF" font-size="9.5" font-weight="700">Vai ${sim.shoulder.toFixed(0)}cm</text>

    <line x1="${rightCx - pSim.waistCore}" y1="140" x2="${rightCx + pSim.waistCore}" y2="140" stroke="#30D158" stroke-width="1.8" />
    <text x="${rightCx}" y="164" text-anchor="middle" fill="#30D158" font-size="9.5" font-weight="700">Eo ${sim.waist.toFixed(1)}cm</text>

    <line x1="${rightCx + pSim.faX + 1}" y1="138" x2="${rightCx + pSim.faX + 10}" y2="138" stroke="#30D158" stroke-width="1" />
    <text x="${rightCx + pSim.faX + 12}" y="135" text-anchor="start" fill="#30D158" font-size="9.2" font-weight="700">Cẳng tay</text>
    <text x="${rightCx + pSim.faX + 12}" y="146" text-anchor="start" fill="#FFFFFF" font-size="9.5" font-weight="700">${sim.forearm.toFixed(1)}cm</text>

    <line x1="${rightCx + 24}" y1="204" x2="${rightCx + 35}" y2="204" stroke="rgba(235,235,245,0.55)" stroke-width="0.9" />
    <text x="${rightCx + 37}" y="201" text-anchor="start" fill="rgba(235,235,245,0.65)" font-size="9.0" font-weight="600">Đùi gọn</text>
    <text x="${rightCx + 37}" y="212" text-anchor="start" fill="#FFFFFF" font-size="9.5" font-weight="700">${sim.thigh.toFixed(1)}cm</text>

    <text x="${rightCx}" y="301" text-anchor="middle" fill="#30D158" font-size="9.8" font-weight="700">Chuẩn Chữ V: ${simRatio}× (Adonis)</text>
  `;
}

function buildBlueprintRatioBarsMarkup(cur, progress = 1.0) {
  const sim = {
    shoulder: lerpMetric(cur.shoulder, GOLDEN_40_TARGETS.shoulder, progress),
    chest: lerpMetric(cur.chest, GOLDEN_40_TARGETS.chest, progress),
    waist: lerpMetric(cur.waist, GOLDEN_40_TARGETS.waist, progress),
    arm: lerpMetric(cur.arm, GOLDEN_40_TARGETS.arm, progress),
    forearm: lerpMetric(cur.forearm, GOLDEN_40_TARGETS.forearm, progress)
  };

  const curVRatio = cur.shoulder / Math.max(55, cur.waist);
  const simVRatio = sim.shoulder / Math.max(55, sim.waist);

  const curWHtR = cur.waist / GOLDEN_40_TARGETS.heightCm;
  const simWHtR = sim.waist / GOLDEN_40_TARGETS.heightCm;

  const curCW = cur.chest / Math.max(55, cur.waist);
  const simCW = sim.chest / Math.max(55, sim.waist);

  const simFaPct = Math.round((sim.forearm / Math.max(25, sim.arm)) * 100);
  const isFullTarget = progress >= 0.99;

  const rows = [
    {
      name: '1. Chữ V Vai / Eo (Adonis)',
      valText: isFullTarget
        ? `Hiện ${curVRatio.toFixed(2)}× → Đích 1.57×`
        : `Mô phỏng: ${simVRatio.toFixed(2)}× / 1.57×`,
      curPct: Math.min(100, Math.max(10, Math.round(((curVRatio - 1.15) / (1.57 - 1.15)) * 100))),
      simPct: Math.min(100, Math.max(10, Math.round(((simVRatio - 1.15) / (1.57 - 1.15)) * 100))),
      good: (isFullTarget ? curVRatio : simVRatio) >= 1.50
    },
    {
      name: '2. Độ phẳng bụng (Eo / Cao)',
      valText: isFullTarget
        ? `Hiện ${curWHtR.toFixed(2)} → Đích 0.46 (${GOLDEN_40_TARGETS.waist}cm)`
        : `Mô phỏng: ${simWHtR.toFixed(2)} (${sim.waist.toFixed(1)}cm)`,
      curPct: Math.min(100, Math.max(10, Math.round(((0.58 - curWHtR) / (0.58 - 0.457)) * 100))),
      simPct: Math.min(100, Math.max(10, Math.round(((0.58 - simWHtR) / (0.58 - 0.457)) * 100))),
      good: (isFullTarget ? curWHtR : simWHtR) <= 0.47
    },
    {
      name: '3. Độ dày Ngực / Eo',
      valText: isFullTarget
        ? `Hiện ${curCW.toFixed(2)}× → Đích 1.35×`
        : `Mô phỏng: ${simCW.toFixed(2)}× (${sim.chest.toFixed(0)}cm)`,
      curPct: Math.min(100, Math.max(10, Math.round(((curCW - 1.05) / (1.35 - 1.05)) * 100))),
      simPct: Math.min(100, Math.max(10, Math.round(((simCW - 1.05) / (1.35 - 1.05)) * 100))),
      good: (isFullTarget ? curCW : simCW) >= 1.30
    },
    {
      name: '4. Cẳng tay / Bắp tay (Xắn áo)',
      valText: isFullTarget
        ? `Hiện ${cur.forearm.toFixed(1)} → Đích 33.0cm (90%)`
        : `Mô phỏng: ${sim.forearm.toFixed(1)} / ${sim.arm.toFixed(1)}cm (${simFaPct}%)`,
      curPct: Math.min(100, Math.max(12, Math.round(((cur.forearm - 27) / (33 - 27)) * 100))),
      simPct: Math.min(100, Math.max(12, Math.round(((sim.forearm - 27) / (33 - 27)) * 100))),
      good: (isFullTarget ? cur.forearm : sim.forearm) >= 32.0
    }
  ];

  return rows.map(r => `
    <div class="bp-ratio-item">
      <div class="bp-ratio-head">
        <span style="font-weight:500;color:var(--label-primary);">${r.name}</span>
        <span class="tabular" style="font-weight:600;color:${r.good ? 'var(--green)' : (isFullTarget ? 'var(--green)' : 'var(--orange)')};">${r.valText}</span>
      </div>
      <div class="bp-ratio-track">
        <div class="bp-ratio-sim-fill" style="width:${r.simPct}%;"></div>
        <div class="bp-ratio-cur-fill" style="width:${r.curPct}%;background:${r.curPct >= 85 ? 'var(--green)' : 'var(--orange)'};"></div>
      </div>
    </div>
  `).join('');
}

function onBlueprintSlide(val) {
  blueprintProgress = Math.max(0, Math.min(1, Number(val) / 100));
  const cur = getCurrentBodyProfile();
  const simW = lerpMetric(cur.weight, GOLDEN_40_TARGETS.weight, blueprintProgress).toFixed(1);
  const simBf = Math.round(lerpMetric(cur.bf, GOLDEN_40_TARGETS.bf, blueprintProgress));
  const pctInt = Math.round(blueprintProgress * 100);

  const svgEl = document.getElementById('bpSvg');
  if (svgEl) svgEl.innerHTML = buildBlueprintSvgMarkup(cur, blueprintProgress);

  const badgeEl = document.getElementById('bpStageBadge');
  if (badgeEl) badgeEl.textContent = `${pctInt}% · ${simW}kg (${simBf}%)`;

  const barsEl = document.getElementById('bpRatioBars');
  if (barsEl) barsEl.innerHTML = buildBlueprintRatioBarsMarkup(cur, blueprintProgress);
}

function scrollToBodyForm() {
  hapticTap(10);
  const sec = document.getElementById('bodyMeasureFormSection');
  if (sec && typeof sec.scrollIntoView === 'function') {
    sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  setTimeout(() => {
    const waistIn = document.getElementById('bmWaist');
    if (waistIn && typeof waistIn.focus === 'function') waistIn.focus();
  }, 360);
}

// ============================================================================
// 2AA. WEEKLY STREAK ENGINE (MIN 3 SESSIONS/WEEK × MIN 3 EXERCISES/SESSION)
// ============================================================================
const STREAK_MIN_EX_PER_SESSION = 3;
const STREAK_MIN_SESSIONS_PER_WEEK = 3;

function parseDateVN(raw) {
  if (raw instanceof Date) {
    return new Date(raw.getFullYear(), raw.getMonth(), raw.getDate(), 12, 0, 0, 0);
  }
  const norm = normalizeDateVN(raw);
  const m = norm.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const dd = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const yyyy = parseInt(m[3], 10);
  const d = new Date(yyyy, mm - 1, dd, 12, 0, 0, 0);
  return isNaN(d.getTime()) ? null : d;
}

function getMondayOfWeek(d) {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
  const isoDay = copy.getDay() === 0 ? 7 : copy.getDay();
  copy.setDate(copy.getDate() - (isoDay - 1));
  return copy;
}

function calculateStreakStats(refDateOverride = null) {
  const refParsed = refDateOverride ? parseDateVN(refDateOverride) : null;
  const nowRef = refParsed || new Date();
  const todayNoon = new Date(nowRef.getFullYear(), nowRef.getMonth(), nowRef.getDate(), 12, 0, 0, 0);
  const todayKey = formatDateVN(todayNoon);

  // Build map: DD/MM/YYYY -> Set of distinct completed exercise names
  const dayExMap = new Map();
  let earliestDate = todayNoon;

  (state.logs || []).forEach(l => {
    if (Number(l.weight) <= 0 && Number(l.reps) <= 0) return;
    let dKey = normalizeDateVN(l.date);
    if (dKey === '10/01/2026' && String(l.week) === '2') dKey = '01/10/2026';
    const dObj = parseDateVN(dKey);
    if (!dObj || dObj.getTime() > todayNoon.getTime()) return;
    if (dObj.getTime() < earliestDate.getTime()) earliestDate = dObj;

    const exName = String(l.exercise || '').trim();
    if (!exName) return;
    if (!dayExMap.has(dKey)) dayExMap.set(dKey, new Set());
    dayExMap.get(dKey).add(exName);
  });

  const currentMonday = getMondayOfWeek(todayNoon);
  const eightWeeksAgoMonday = new Date(currentMonday.getTime());
  eightWeeksAgoMonday.setDate(eightWeeksAgoMonday.getDate() - 7 * 7);

  let startMonday = getMondayOfWeek(earliestDate);
  if (startMonday.getTime() > eightWeeksAgoMonday.getTime()) {
    startMonday = eightWeeksAgoMonday;
  }

  const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const allWeeks = [];
  const cursor = new Date(startMonday.getTime());

  while (cursor.getTime() <= currentMonday.getTime()) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dObj = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + i, 12, 0, 0, 0);
      const dStr = formatDateVN(dObj);
      const exCount = dayExMap.has(dStr) ? dayExMap.get(dStr).size : 0;
      days.push({
        label: dayNames[i],
        dateStr: dStr,
        dd: dStr.slice(0, 2),
        ddmm: dStr.slice(0, 5),
        exCount,
        isValid: exCount >= STREAK_MIN_EX_PER_SESSION,
        isPartial: exCount > 0 && exCount < STREAK_MIN_EX_PER_SESSION,
        isToday: dStr === todayKey,
        isFuture: dObj.getTime() > todayNoon.getTime()
      });
    }

    const validSessions = days.filter(d => d.isValid).length;
    const totalExercises = days.reduce((s, d) => s + d.exCount, 0);
    allWeeks.push({
      mondayKey: days[0].dateStr,
      rangeShort: `${days[0].ddmm}–${days[6].ddmm}`,
      days,
      validSessions,
      totalExercises,
      qualified: validSessions >= STREAK_MIN_SESSIONS_PER_WEEK,
      isCurrent: cursor.getTime() === currentMonday.getTime()
    });

    cursor.setDate(cursor.getDate() + 7);
  }

  let bestStreakWeeks = 0;
  let run = 0;
  allWeeks.forEach(w => {
    run = w.qualified ? run + 1 : 0;
    if (run > bestStreakWeeks) bestStreakWeeks = run;
  });

  let totalValidSessions = 0;
  dayExMap.forEach(exSet => {
    if (exSet.size >= STREAK_MIN_EX_PER_SESSION) totalValidSessions++;
  });

  const thisWeek = allWeeks[allWeeks.length - 1];
  let priorConsecutive = 0;
  for (let i = allWeeks.length - 2; i >= 0; i--) {
    if (allWeeks[i].qualified) priorConsecutive++;
    else break;
  }

  const todayIsoDay = todayNoon.getDay() === 0 ? 7 : todayNoon.getDay();
  const todayExCount = dayExMap.has(todayKey) ? dayExMap.get(todayKey).size : 0;
  const todayIsValid = todayExCount >= STREAK_MIN_EX_PER_SESSION;
  const neededSessions = Math.max(0, STREAK_MIN_SESSIONS_PER_WEEK - thisWeek.validSessions);
  const remainingDaysAfterToday = 7 - todayIsoDay;
  const maxPossibleAdditionalSessions = (todayIsValid ? 0 : 1) + remainingDaysAfterToday;
  const canStillQualifyThisWeek = neededSessions <= maxPossibleAdditionalSessions;

  let currentStreakWeeks = 0;
  let streakState = 'BUILDING';
  let shortHint = '';

  if (thisWeek.qualified) {
    currentStreakWeeks = priorConsecutive + 1;
    streakState = 'LOCKED';
    shortHint = `✓ Đã khóa chuẩn tuần (${thisWeek.validSessions}/3 buổi hợp lệ)`;
  } else if (priorConsecutive > 0 && canStillQualifyThisWeek) {
    currentStreakWeeks = priorConsecutive;
    if (neededSessions === maxPossibleAdditionalSessions) {
      streakState = 'URGENT';
      shortHint = neededSessions === 1 && todayIsoDay === 7
        ? '⚠️ Hạn chót CN: Tập ≥3 bài hôm nay để giữ chuỗi!'
        : `⚠️ Phải tập đủ ${neededSessions} ngày còn lại để giữ chuỗi!`;
    } else {
      streakState = 'ACTIVE_PENDING';
      shortHint = `Tuần này ${thisWeek.validSessions}/3 buổi · Còn ${neededSessions} buổi để nối chuỗi`;
    }
  } else if (!canStillQualifyThisWeek) {
    currentStreakWeeks = 0;
    streakState = priorConsecutive > 0 ? 'BROKEN_THIS_WEEK' : 'MISSED_WEEK';
    shortHint = todayIsValid
      ? `✓ Đã chốt buổi hôm nay (${todayExCount} bài) · Thứ 2 mở Chuỗi Tuần 1`
      : `Hết quỹ ngày tuần này (${thisWeek.validSessions}/3) · Tập ≥3 bài lấy đà Thứ 2`;
  } else {
    currentStreakWeeks = 0;
    streakState = 'BUILDING';
    shortHint = neededSessions === maxPossibleAdditionalSessions
      ? `Tập đủ ${neededSessions} ngày còn lại để mở Chuỗi Tuần 1`
      : `Tuần này ${thisWeek.validSessions}/3 buổi · Còn ${neededSessions} buổi mở Chuỗi Tuần 1`;
  }

  if (currentStreakWeeks > bestStreakWeeks) {
    bestStreakWeeks = currentStreakWeeks;
  }

  const remExToday = Math.max(0, STREAK_MIN_EX_PER_SESSION - todayExCount);
  const liveSubText = (todayExCount > 0 && !todayIsValid)
    ? `Hôm nay ${todayExCount}/3 bài — thêm ${remExToday} bài nữa để tính 1 buổi!`
    : shortHint;

  return {
    currentStreakWeeks,
    bestStreakWeeks,
    totalValidSessions,
    streakState,
    shortHint,
    liveSubText,
    todayExCount,
    todayIsValid,
    neededSessions,
    canStillQualifyThisWeek,
    thisWeek,
    recent8Weeks: allWeeks.slice(-8)
  };
}

function buildTodayStreakBannerMarkup(streak) {
  const cardCls = streak.streakState === 'LOCKED'
    ? 'locked'
    : (streak.streakState === 'URGENT' || (streak.todayExCount > 0 && !streak.todayIsValid))
      ? 'urgent'
      : '';

  const titleText = streak.currentStreakWeeks > 0
    ? `Chuỗi ${streak.currentStreakWeeks} tuần liên tục`
    : 'Chuỗi Streak: 0 tuần';

  const subColor = streak.streakState === 'LOCKED'
    ? 'var(--green)'
    : (streak.streakState === 'URGENT' || (streak.todayExCount > 0 && !streak.todayIsValid))
      ? 'var(--orange)'
      : 'var(--label-secondary)';

  const slotsHtml = [0, 1, 2].map(idx => {
    if (idx < streak.thisWeek.validSessions) {
      return `<span class="streak-slot done tabular">✓</span>`;
    }
    if (idx === streak.thisWeek.validSessions && streak.todayExCount > 0 && !streak.todayIsValid) {
      return `<span class="streak-slot partial tabular">${streak.todayExCount}/3</span>`;
    }
    return `<span class="streak-slot empty tabular">B${idx + 1}</span>`;
  }).join('');

  const bonusPill = streak.thisWeek.validSessions > 3
    ? `<span class="streak-slot done tabular">+${streak.thisWeek.validSessions - 3}</span>`
    : '';

  return `
    <div class="af-streak-card ${cardCls}" onclick="openStreakSheet()">
      <div class="af-streak-left">
        <div class="af-streak-title-row">
          <span class="af-streak-flame">${streak.currentStreakWeeks > 0 || streak.streakState === 'LOCKED' ? '🔥' : '⚡'}</span>
          <span class="af-streak-title tabular">${titleText}</span>
          ${streak.bestStreakWeeks > 0 ? `<span style="font-size:10.5px;font-weight:600;color:var(--label-secondary);" class="tabular">· Kỷ lục ${streak.bestStreakWeeks}t</span>` : ''}
        </div>
        <div class="af-streak-sub tabular" style="color:${subColor};">${streak.liveSubText}</div>
      </div>
      <div class="af-streak-slots">
        ${slotsHtml}
        ${bonusPill}
      </div>
    </div>
  `;
}

function buildProgressStreakCardMarkup(streak) {
  const daysHtml = streak.thisWeek.days.map(d => {
    const dotCls = d.isValid ? 'done' : d.isPartial ? 'partial' : 'empty';
    const dotTxt = d.isValid ? '✓' : d.isPartial ? `${d.exCount}/3` : '·';
    const subTxt = d.exCount > 0 ? `${d.exCount} bài` : d.dd;
    return `
      <div class="streak-day-col ${d.isToday ? 'today' : ''}">
        <span class="streak-day-lbl">${d.label}</span>
        <div class="streak-day-dot ${dotCls} tabular">${dotTxt}</div>
        <span class="streak-day-sub tabular">${subTxt}</span>
      </div>
    `;
  }).join('');

  const weeks8Html = streak.recent8Weeks.map((w, idx) => {
    const lbl = w.isCurrent ? 'Tuần này' : `T-${streak.recent8Weeks.length - 1 - idx}`;
    const valColor = w.qualified ? 'var(--green)' : w.isCurrent ? 'var(--orange)' : 'var(--label-secondary)';
    return `
      <div class="streak-8w-cell ${w.qualified ? 'qualified' : ''} ${w.isCurrent ? 'current' : ''} tabular">
        <div style="font-size:9.5px;color:var(--label-secondary);">${lbl}</div>
        <div style="font-size:11.5px;font-weight:700;color:${valColor};margin-top:2px;">${w.qualified ? '✓ ' : ''}${w.validSessions}/3</div>
      </div>
    `;
  }).join('');

  return `
    <div class="apple-card" onclick="openStreakSheet()" style="cursor:pointer;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <div class="ex-slot-tag" style="margin-bottom:0;color:${streak.streakState === 'LOCKED' ? 'var(--green)' : 'var(--orange)'};">
          STREAK LIÊN TỤC · TỐI THIỂU 3 BUỔI × 3 BÀI/TUẦN
        </div>
        <span style="font-size:11.5px;font-weight:600;color:var(--label-secondary);" class="tabular">Kỷ lục: ${streak.bestStreakWeeks} tuần</span>
      </div>

      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-top:6px;">
        <div style="font-size:26px;font-weight:700;letter-spacing:-0.025em;" class="tabular">
          🔥 ${streak.currentStreakWeeks} <span style="font-size:15px;font-weight:500;color:var(--label-secondary);">tuần liên tục</span>
        </div>
        <div style="font-size:13.5px;font-weight:700;color:${streak.thisWeek.qualified ? 'var(--green)' : 'var(--orange)'};" class="tabular">
          Tuần này: ${streak.thisWeek.validSessions}/3 buổi
        </div>
      </div>

      <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;" class="tabular">${streak.liveSubText}</div>

      <div class="streak-week-grid">
        ${daysHtml}
      </div>

      <div style="font-size:11px;font-weight:600;color:var(--label-secondary);margin-top:12px;display:flex;justify-content:space-between;" class="tabular">
        <span>Chuỗi 8 tuần gần nhất (${streak.thisWeek.rangeShort})</span>
        <span>Tổng: ${streak.totalValidSessions} buổi hợp lệ</span>
      </div>
      <div class="streak-8w-grid">
        ${weeks8Html}
      </div>
    </div>
  `;
}

function getExerciseStats(ex, options = {}) {
  const unitLbl = ex.unit || 'lần';
  const wUnit = ex.wUnit || 'kg';
  const todayKey = getTodayDateKey();
  const matches = state.logs.filter(l =>
    l.exercise === ex.name &&
    Number(l.weight) > 0 &&
    (!options.excludeToday || normalizeDateVN(l.date) !== todayKey)
  );
  if (matches.length === 0) {
    const defaultStart = (ex.id === 'EX05' || ex.id === 'EX14') ? 20 : ex.id === 'EX07' ? 35 : 10;
    return {
      firstWeight: 0,
      lastWeight: 0,
      prWeight: 0,
      lastReps: 0,
      recWeight: defaultStart,
      recReps: ex.unit === 'giây' ? ex.repMax : ex.repMin,
      recHint: `Đề xuất: ${defaultStart} ${wUnit} × ${ex.repMin}–${ex.repMax} ${unitLbl}`,
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

  // Determine average reps/seconds per set accurately (supports both 2-set and 3-set logs)
  let lastAvgReps = ex.repMin;
  const noteStr = String(last.note || '');
  if (noteStr.includes('Hiệp:')) {
    const parts = parseNoteSetReps(noteStr);
    if (parts.length > 0) {
      lastAvgReps = Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
    }
  } else if (lastTotalReps <= (ex.repMax || 15)) {
    lastAvgReps = lastTotalReps;
  } else {
    // Historical sheet logs had 3 sets for compound lifts (24 reps = 3x8) and 2 sets for isolation (20 or 30 reps)
    const histSets = (ex.setsA || ex.setsB || ex.sets || 3);
    lastAvgReps = Math.round(lastTotalReps / histSets);
  }

  let recWeight = lastW;
  let recReps = ex.repMax;
  let recHint = '';

  // Double Progression: Step up weight (+10kg leg press / +5kg machine / +2.5kg DB) when hitting repMax!
  if (ex.minRecWeight && lastW < ex.minRecWeight) {
    recWeight = ex.minRecWeight;
    recReps = ex.repMin;
    recHint = `Đã vượt ${lastW}kg×16 → Lên ${recWeight} ${wUnit} × ${ex.repMin}–${ex.repMax} ${unitLbl}`;
  } else if (lastAvgReps >= ex.repMax) {
    const jumpSteps = (ex.unit !== 'giây' && lastAvgReps >= ex.repMax + 5) ? 2 : 1;
    recWeight = lastW + ex.inc * jumpSteps;
    recReps = ex.repMin;
    recHint = `Đủ ${ex.repMax} ${unitLbl} → Lên ${recWeight} ${wUnit} × ${ex.repMin} ${unitLbl}`;
  } else {
    recWeight = lastW;
    const stepRep = ex.unit === 'giây' ? 5 : ((ex.repMax - ex.repMin >= 5 && lastAvgReps >= 12) ? 3 : 2);
    recReps = Math.min(ex.repMax, Math.max(ex.repMin, lastAvgReps + stepRep));
    recHint = `Giữ ${lastW} ${wUnit} · Đẩy lên ${recReps} ${unitLbl}`;
  }

  let status = `Ép lên ${ex.repMax} ${unitLbl}`;
  if (recWeight > lastW) {
    status = `Lên tạ → ${recWeight} ${wUnit}`;
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
    const stats = getExerciseStats(ex, { excludeToday: true });
    const numSets = getTargetSetsCount(ex);
    const defaultRep = Math.min(ex.repMax, Math.max(ex.repMin, stats.recReps || ex.repMax));
    if (!state.todaySession[ex.id]) {
      state.todaySession[ex.id] = {
        weight: stats.recWeight,
        sets: Array.from({ length: 3 }, () => ({ reps: defaultRep, done: false })),
        rir: ex.rir,
        startedAt: null,
        endedAt: null,
        durationSec: 0,
        autoStarted: false
      };
    } else {
      const s = state.todaySession[ex.id];
      const anyDone = Array.isArray(s.sets) && s.sets.some(st => st.done);
      if (!anyDone) {
        s.weight = stats.recWeight;
      }
      while (s.sets.length < numSets) {
        s.sets.push({ reps: defaultRep, done: false });
      }
      s.sets.forEach(st => {
        if (!st.done) {
          st.reps = defaultRep;
        }
      });
    }
  });
}

let cloudSyncTimer = null;

// Restore green checkmarks & weights on Today tab if logs already contain today's workout (from Sheet or earlier Save)
function hydrateTodayFromLogs(targetDate) {
  const normTarget = normalizeDateVN(targetDate);
  const dayLogs = (state.logs || []).filter(l => normalizeDateVN(l.date) === normTarget);
  if (dayLogs.length === 0) return;

  dayLogs.forEach(l => {
    const ex = EXERCISES.find(e => e.name === l.exercise);
    if (!ex) return;
    const numSets = getTargetSetsCount(ex);
    const cur = state.todaySession[ex.id];
    const anyDone = cur && Array.isArray(cur.sets) && cur.sets.some(st => st.done);
    if (anyDone) return;

    const noteStr = String(l.note || '');
    let repParts = parseNoteSetReps(noteStr);
    const hydratedDurSec = Number(l.durationSec) || parseNoteDurationSec(noteStr);
    if (repParts.length === 0) {
      const total = Number(l.reps) || ex.repMax;
      if (total <= ex.repMax + 2) {
        repParts = [total];
      } else {
        const perSet = Math.max(1, Math.round(total / numSets));
        repParts = Array.from({ length: numSets }, () => perSet);
      }
    }

    const setsArr = [];
    const totalSlots = Math.max(3, numSets, repParts.length);
    for (let i = 0; i < totalSlots; i++) {
      if (i < repParts.length) {
        setsArr.push({ reps: repParts[i], done: true });
      } else {
        setsArr.push({ reps: ex.repMax, done: false });
      }
    }

    state.todaySession[ex.id] = {
      weight: Number(l.weight) || ex.inc,
      sets: setsArr,
      rir: l.rir || ex.rir,
      startedAt: null,
      endedAt: null,
      durationSec: hydratedDurSec,
      autoStarted: false
    };
  });
}

// Real-time auto-commit: Every checked set (✓) immediately updates state.logs (Progress & 3M Target)
function syncTodaySessionToLogs(dateOverride = null) {
  const targetDate = normalizeDateVN(dateOverride || state.todaySessionDate || getTodayDateKey());
  const workoutLabel = state.workoutMode === 'ESSENTIAL_7'
    ? '9 Bài Chuẩn (22 Hiệp)'
    : state.workoutMode === 'WORKOUT_A'
      ? 'Workout A'
      : 'Workout B';

  const baseLogCount = state.logs.filter(l => normalizeDateVN(l.date) !== targetDate).length;
  const weekNum = Math.max(6, Math.ceil((baseLogCount + 1) / 6));
  const latestBody = state.body[state.body.length - 1] || { weight: 74.0 };
  const bodyW = Number(latestBody.weight) || 74.0;

  EXERCISES.forEach(ex => {
    const s = state.todaySession[ex.id];
    const numSets = getTargetSetsCount(ex);
    const activeSets = s && Array.isArray(s.sets)
      ? s.sets.slice(0, numSets).filter(st => st.done && Number(st.reps) > 0)
      : [];

    const existingIdx = state.logs.findIndex(l => normalizeDateVN(l.date) === targetDate && l.exercise === ex.name);

    if (activeSets.length > 0) {
      const totalReps = activeSets.reduce((acc, st) => acc + Number(st.reps), 0);
      const w = Number(s.weight) || 0;
      const vol = w * totalReps;
      const allHitMax = activeSets.length >= numSets && activeSets.every(st => Number(st.reps) >= ex.repMax);
      const nextW = allHitMax ? w + ex.inc : w;
      const durSec = getExerciseElapsedSec(s);
      const exCal = getExerciseCalorieInfo(ex, w, s.sets, numSets, bodyW, s);
      const setTag = `Hiệp: ${activeSets.map(x => x.reps).join('/')}`;
      const noteFull = durSec > 0
        ? `${setTag} · ${formatDurationCompact(durSec)} · ${exCal.burnedKcal} kcal`
        : setTag;

      const rowObj = {
        date: targetDate,
        week: weekNum,
        workout: workoutLabel,
        exercise: ex.name,
        weight: w,
        reps: totalReps,
        volume: vol,
        rir: s.rir || ex.rir,
        nextWeight: nextW,
        note: noteFull,
        durationSec: durSec,
        kcal: exCal.burnedKcal,
        isLocal: true,
        autoSynced: true
      };

      if (existingIdx >= 0) {
        state.logs[existingIdx] = rowObj;
      } else {
        state.logs.push(rowObj);
      }
    } else if (existingIdx >= 0 && state.logs[existingIdx].autoSynced) {
      // Only remove if user unchecked all sets of an auto-synced row today
      state.logs.splice(existingIdx, 1);
    }
  });
}

// CORS-safe Google Apps Script POST (uses text/plain to bypass preflight OPTIONS & prevent header stripping)
async function postWebhookPayload(payload) {
  if (!state.webhookUrl) return false;
  const bodyStr = JSON.stringify(payload);
  try {
    await fetch(state.webhookUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: bodyStr
    });
    return true;
  } catch (err) {
    try {
      await fetch(state.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: bodyStr
      });
      return true;
    } catch (e2) {
      return false;
    }
  }
}

async function syncLocalLogsToCloud(silent = true) {
  if (!state.webhookUrl) return false;
  const todayStr = getTodayDateKey();
  const rowsToPush = state.logs.filter(l => l.isLocal || normalizeDateVN(l.date) === todayStr);
  if (rowsToPush.length === 0) return false;

  const ok = await postWebhookPayload({ action: 'upsertWorkout', rows: rowsToPush });
  if (ok) {
    const now = new Date();
    state.lastSync = `Đã ghi Sheet ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const syncSub = document.getElementById('syncStatusText');
    if (syncSub) syncSub.textContent = state.lastSync;
    saveState();
    if (!silent) showToast(`✓ Đã đồng bộ ${rowsToPush.length} bài lên Google Sheet`);
  }
  return ok;
}

function scheduleCloudSync() {
  if (!state.webhookUrl) return;
  if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => {
    syncLocalLogsToCloud(true);
  }, 2000);
}

function getTodayExercises() {
  // Default: Tinh Nhuệ 9 Bài Chuẩn + Kẹp Cổ Tay (22 hiệp · Tầng 2 -> Tầng 1)
  if (state.workoutMode === 'ESSENTIAL_7') {
    // Chặng 1 Tầng 2 (4 trạm · 9 hiệp): EX08 Ngực trên (3h) -> EX11 Hammer/Reverse Curl (2h) -> EX12 Gập bụng (2h) -> EX04 Đẩy vai MULTI PRESS Tầng 2 (2h)
    // Chặng 2 Tầng 1 (5 bài + kẹp cổ tay · 13 hiệp): EX01 Đạp đùi (3h) -> EX03 Kéo xô (2h) -> EX09 Kéo lưng/Vai sau (2h) -> EX10 Nâng vai ngang (2h) + EX06 Cuộn cổ tay (2h) -> EX14 Farmer Hold 45s (2h)
    const order = ['EX08', 'EX11', 'EX12', 'EX04', 'EX01', 'EX03', 'EX09', 'EX10', 'EX06', 'EX14'];
    return order.map(id => EXERCISES.find(e => e.id === id)).filter(Boolean);
  }
  if (state.workoutMode === 'WORKOUT_A') {
    const order = ['EX02', 'EX12', 'EX04', 'EX01', 'EX03', 'EX05', 'EX06', 'EX14'];
    return order.map(id => EXERCISES.find(e => e.id === id)).filter(Boolean);
  }
  if (state.workoutMode === 'WORKOUT_B') {
    const order = ['EX08', 'EX11', 'EX12', 'EX07', 'EX09', 'EX10', 'EX13', 'EX14'];
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

// Estimate & calculate burned kcal for a single exercise based on REAL measured duration (MET) + mechanical volume
function getExerciseCalorieInfo(ex, weight, setsArr, numSets, bodyW, sessionObj = null) {
  const compoundIds = ['EX01', 'EX02', 'EX03', 'EX04', 'EX07', 'EX08', 'EX09'];
  const isCompound = compoundIds.includes(ex.id);
  const met = ex.id === 'EX01' || ex.id === 'EX14' ? 6.0 : isCompound ? 5.3 : 4.2;
  const estMinPerSet = ex.id === 'EX01' ? 2.2 : isCompound ? 1.9 : 1.5;
  const volFactor = isCompound ? 0.0048 : 0.004;

  const w = Number(weight) || 0;
  // Bilateral dumbbell lifts (kg/tay) move TWO dumbbells simultaneously
  const mechLoad = ex.wUnit === 'kg/tay' ? w * 2 : w;

  let estMechKcal = 0;
  let actualMechKcal = 0;
  let doneCount = 0;

  for (let i = 0; i < numSets; i++) {
    const st = (setsArr && setsArr[i]) ? setsArr[i] : { reps: ex.repMax, done: false };
    const rawReps = Number(st.reps) || ex.repMax;
    const workUnits = ex.unit === 'giây' ? rawReps * 0.35 : rawReps;
    const setMech = mechLoad * workUnits * volFactor;
    estMechKcal += setMech;
    if (st.done) {
      doneCount++;
      actualMechKcal += setMech;
    }
  }

  const estMetKcal = met * 3.5 * (bodyW / 200) * (estMinPerSet * numSets);
  const estKcal = Math.max(6, Math.round(estMetKcal + estMechKcal));

  const s = sessionObj || (state.todaySession && state.todaySession[ex.id]) || null;
  const rawElapsedSec = getExerciseElapsedSec(s);
  const isRunning = Boolean(s && s.startedAt && !s.endedAt && doneCount < numSets);

  let burnedKcal = 0;
  if (doneCount > 0 || (isRunning && rawElapsedSec >= 5)) {
    const effectiveSec = rawElapsedSec > 0
      ? rawElapsedSec
      : Math.round(doneCount * estMinPerSet * 60);
    // Physiological anti-inflation cap: max 210s (3.5 min) active MET credit per performed/active set
    const activeSlots = Math.min(numSets, doneCount + (isRunning ? 1 : 0));
    const cappedActiveSec = Math.min(effectiveSec, Math.max(45, activeSlots * 210));
    const actualMetKcal = met * 3.5 * (bodyW / 200) * (cappedActiveSec / 60);
    burnedKcal = Math.max(doneCount > 0 ? 3 : 0, Math.round(actualMetKcal + actualMechKcal));
  }

  return {
    estKcal,
    burnedKcal,
    elapsedSec: rawElapsedSec,
    isRunning
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

  // 2. Strength sets estimated & burned kcal + total measured exercise duration
  let setsEstKcal = 0;
  let setsBurnedKcal = 0;
  let totalExSec = 0;

  exList.forEach(ex => {
    const numSets = getTargetSetsCount(ex);
    const stats = getExerciseStats(ex, { excludeToday: true });
    const s = state.todaySession[ex.id] || { weight: stats.recWeight, sets: [] };
    const info = getExerciseCalorieInfo(ex, s.weight, s.sets, numSets, bodyW, s);
    setsEstKcal += info.estKcal;
    setsBurnedKcal += info.burnedKcal;
    totalExSec += info.elapsedSec;
  });

  // Also check if user already saved a workout earlier today in state.logs
  const savedTodayLogs = state.logs.filter(l => normalizeDateVN(l.date) === todayKey);
  let savedLogKcal = 0;
  if (savedTodayLogs.length > 0 && setsBurnedKcal === 0) {
    savedTodayLogs.forEach(l => {
      if (Number(l.kcal) > 0) {
        savedLogKcal += Number(l.kcal);
      } else {
        const ex = EXERCISES.find(e => e.name === l.exercise);
        const numSets = ex ? getTargetSetsCount(ex) : 3;
        const compoundIds = ['EX01', 'EX02', 'EX03', 'EX04', 'EX07', 'EX08', 'EX09'];
        const isCompound = ex ? compoundIds.includes(ex.id) : true;
        const met = isCompound ? 5.3 : 4.2;
        const minPerSet = isCompound ? 1.9 : 1.5;
        const volFactor = isCompound ? 0.0048 : 0.004;
        savedLogKcal += Math.round((met * 3.5 * (bodyW / 200) * minPerSet * numSets) + ((Number(l.volume) || 0) * volFactor));
      }
      if (totalExSec === 0) {
        totalExSec += Number(l.durationSec) || parseNoteDurationSec(l.note);
      }
    });
  }

  const totalExMinutes = Math.round(totalExSec / 60);
  const totalExTimeLabel = totalExSec > 0 ? formatDurationCompact(totalExSec) : '';

  const effectiveSetsBurned = Math.max(setsBurnedKcal, savedLogKcal);
  const hasFarmerCard = exList.some(e => e.id === 'EX14');
  const addonsBurnedKcal =
    (act.bikeDone ? bikeKcal : 0) +
    (!hasFarmerCard && act.farmerDone ? farmerKcal : 0) +
    (act.inclineDone ? inclineKcal : 0) +
    (act.bagDone ? bagKcal : 0);

  // Standard session includes: 3p Bike + Strength Sets (incl. Farmer Hold card) + 10p Incline Walk
  const workoutEstKcal = setsEstKcal + bikeKcal + (hasFarmerCard ? 0 : farmerKcal) + inclineKcal;
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
    totalExSec,
    totalExMinutes,
    totalExTimeLabel,
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

// Ảnh chụp thực tế các máy tại phòng tập PLUS GYM của anh Hà (Tầng 2 & Tầng 1)
const REAL_GYM_PHOTOS = {
  EX01: [
    { label: 'Máy Đạp Đùi 45° / V-Squat · Tầng 1 (+5kg/bên = +10kg)', src: './img/gym/t1_vsquat_leg.jpg' }
  ],
  EX02: [
    { label: 'Máy Đẩy Ngực 90° Xám · Tầng 2 (+5kg)', src: './img/gym/t2_chest_press_90.jpg' },
    { label: 'Dự phòng: MULTI PRESS Đen · Tầng 2', src: './img/gym/t2_multi_press.jpg' }
  ],
  EX03: [
    { label: 'Tháp Cáp 4 Trạm · Tầng 1 (+5kg/nấc)', src: './img/gym/t1_cable_lat.jpg' },
    { label: 'Dự phòng: Máy Đen 2 mặt (Kéo xô tạ rời)', src: './img/gym/t1_iso_chest_lat.jpg' }
  ],
  EX04: [
    { label: 'Chính: Máy MULTI PRESS Đen Tầng 2 (+5kg/nấc)', src: './img/gym/t2_multi_press.jpg' },
    { label: 'Dự phòng: Máy Vai Vàng-Đen Tầng 1 (+2.5kg/bên)', src: './img/gym/t1_shoulder_press.jpg' }
  ],
  EX05: [
    { label: 'Tháp Cáp Tầng 1 · Dây thừng & Thanh thẳng dưới chân', src: './img/gym/t1_cable_pushdown.jpg' }
  ],
  EX06: [
    { label: 'Kệ Tạ Đơn Gương · Tầng 1 (Kẹp nghỉ T1-8A)', src: './img/gym/t1_dumbbell_zone.jpg' },
    { label: 'Ròng rọc thấp + Thanh thẳng xoay · Tháp Cáp Tầng 1', src: './img/gym/t1_cable_pushdown.jpg' }
  ],
  EX07: [
    { label: 'Máy Nằm Sấp Móc Đùi Sau MBH · Tầng 2 (+5kg/nấc)', src: './img/gym/t2_lying_leg_curl.jpg' }
  ],
  EX08: [
    { label: 'Máy Ngực Trên Vàng-Đen · Tầng 2 (Lắp đĩa 2.5kg/bên)', src: './img/gym/t2_incline_press.jpg' }
  ],
  EX09: [
    { label: 'Chính: Máy Row Vàng-Đen Tầng 1 (+2.5kg/bên)', src: './img/gym/t1_seated_row.jpg' },
    { label: 'Bổ trợ Vai sau: Máy MBH Pec/Rear Delt Tầng 1', src: './img/gym/t1_pec_reardelt.jpg' }
  ],
  EX10: [
    { label: 'Khu Kệ Tạ Đơn Dọc Gương & Máy Đòn Bẩy · Tầng 1', src: './img/gym/t1_dumbbell_zone.jpg' }
  ],
  EX11: [
    { label: 'Chính: Máy Cuộn Tay MBH chữ V · Tầng 2 (+5kg)', src: './img/gym/t2_bicep_machine.jpg' },
    { label: 'Sát cạnh: Ghế EZ-Bar lắp tạ rời · Tầng 2', src: './img/gym/t2_ez_preacher.jpg' }
  ],
  EX12: [
    { label: 'Máy Gập Bụng Đệm Vai Nâu · Tầng 2 (Sát khu Bao cát)', src: './img/gym/t2_ab_crunch.jpg' }
  ],
  EX13: [
    { label: 'Khu Tạ Đơn Kệ Gương · Tầng 1', src: './img/gym/t1_dumbbell_zone.jpg' },
    { label: 'Thanh Đòn Thẳng Cáp Thấp · Tầng 1', src: './img/gym/t1_cable_pushdown.jpg' }
  ],
  EX14: [
    { label: 'Dàn Tạ Đơn Kệ Gương · Tầng 1 (Xách cặp tạ đứng thẳng)', src: './img/gym/t1_dumbbell_zone.jpg' }
  ]
};

const EX_PHOTOS = {
  EX01: [{ label: '1. Hạ tạ sâu', url: 'Leg_Press/0.jpg' }, { label: '2. Đạp lên (không khóa gối)', url: 'Leg_Press/1.jpg' }],
  EX02: [{ label: '1. Mở ngực 90°', url: 'Leverage_Chest_Press/0.jpg' }, { label: '2. Đẩy ép ngực', url: 'Leverage_Chest_Press/1.jpg' }],
  EX03: [{ label: '1. Giãn xô trên đỉnh', url: 'Wide-Grip_Lat_Pulldown/0.jpg' }, { label: '2. Kéo xuống ngang cằm', url: 'Wide-Grip_Lat_Pulldown/1.jpg' }],
  EX04: [{ label: '1. Hạ ngang cằm mở vai', url: 'Leverage_Shoulder_Press/0.jpg' }, { label: '2. Đẩy thẳng qua đầu', url: 'Leverage_Shoulder_Press/1.jpg' }],
  EX05: [{ label: '1. Khóa khuỷu tay sát sườn', url: 'Triceps_Pushdown/0.jpg' }, { label: '2. Duỗi thẳng siết tay sau', url: 'Triceps_Pushdown/1.jpg' }],
  EX06: [{ label: '1. Cáp / Máy Cuộn cổ tay', url: 'Cable_Wrist_Curl/0.jpg' }, { label: '2. Gập cổ tay kịch trần', url: 'Cable_Wrist_Curl/1.jpg' }],
  EX07: [{ label: '1. Nằm sấp áp chặt hông', url: 'Lying_Leg_Curls/0.jpg' }, { label: '2. Gập gót siết đùi sau', url: 'Lying_Leg_Curls/1.jpg' }],
  EX08: [{ label: '1. Hạ sâu mở ngực trên', url: 'Leverage_Incline_Chest_Press/0.jpg' }, { label: '2. Đẩy chéo lên đỉnh', url: 'Leverage_Incline_Chest_Press/1.jpg' }],
  EX09: [
    { label: 'Hiệp 1 · Tay cầm dọc (Duỗi vai)', url: 'Leverage_Iso_Row/0.jpg' },
    { label: 'Hiệp 1 · Kéo sát sườn (Lưng giữa)', url: 'Leverage_Iso_Row/1.jpg' },
    { label: 'Hiệp 2 · Tay cầm ngang (Duỗi)', url: 'Cable_Rope_Rear-Delt_Rows/0.jpg' },
    { label: 'Hiệp 2 · Mở cùi chỏ 70° (Vai sau)', url: 'Cable_Rope_Rear-Delt_Rows/1.jpg' }
  ],
  EX10: [{ label: '1. Chuẩn bị nâng ngang', url: 'Side_Lateral_Raise/0.jpg' }, { label: '2. Nâng ngang tầm vai', url: 'Side_Lateral_Raise/1.jpg' }],
  EX11: [
    { label: 'Hiệp 1 · Nắm Sấp (Ăn cẳng tay trên)', url: 'Standing_Dumbbell_Reverse_Curl/1.jpg' },
    { label: 'Hiệp 2 · Nắm Ngửa / Búa (Ăn bắp trước)', url: 'Machine_Preacher_Curls/1.jpg' }
  ],
  EX12: [{ label: '1. Cố định hông', url: 'Ab_Crunch_Machine/0.jpg' }, { label: '2. Cuộn đốt sống ngực ép bụng', url: 'Ab_Crunch_Machine/1.jpg' }],
  EX13: [{ label: '1. Úp sấp lòng bàn tay', url: 'Seated_Dumbbell_Palms-Down_Wrist_Curl/0.jpg' }, { label: '2. Vểnh mu bàn tay lên', url: 'Seated_Dumbbell_Palms-Down_Wrist_Curl/1.jpg' }],
  EX14: [{ label: '1. Nhấc cặp tạ mở ngực', url: 'Farmers_Walk/0.jpg' }, { label: '2. Giữ thẳng 45s siết cẳng tay', url: 'Farmers_Walk/1.jpg' }]
};

function openDetailSheet(exId) {
  const ex = EXERCISES.find(e => e.id === exId);
  if (!ex) return;
  hapticTap(12);

  const stats = getExerciseStats(ex);
  const realPhotos = REAL_GYM_PHOTOS[ex.id] || [];
  const realPhotosHtml = realPhotos.length > 0 ? `
    <div style="margin-bottom:12px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.03em;color:var(--green);margin-bottom:6px;text-transform:uppercase;">
        Máy thật tại PLUS GYM · Tầng ${ex.floor}
      </div>
      <div style="display:grid;grid-template-columns:${realPhotos.length === 1 ? '1fr' : '1fr 1fr'};gap:8px;">
        ${realPhotos.map(rp => `
          <div style="background:var(--bg-tertiary);border-radius:12px;overflow:hidden;border:1px solid rgba(48, 209, 88, 0.35);">
            <img src="${rp.src}" alt="${rp.label}" loading="lazy" style="width:100%;height:${realPhotos.length === 1 ? '186px' : '148px'};object-fit:cover;display:block;">
            <div style="padding:6px 8px;font-size:11px;font-weight:600;color:var(--label-primary);text-align:center;line-height:1.35;">${rp.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const photos = EX_PHOTOS[ex.id] || [];
  const photosHtml = photos.length > 0 ? `
    <div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.02em;color:var(--label-secondary);margin-bottom:6px;text-transform:uppercase;">
        Biên độ & Tư thế chuẩn
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${photos.map(p => `
          <div style="background:var(--bg-tertiary);border-radius:12px;overflow:hidden;border:1px solid var(--separator);">
            <img src="${EX_IMG_BASE}${p.url}" alt="${p.label}" loading="lazy" style="width:100%;height:124px;object-fit:cover;display:block;">
            <div style="padding:6px 8px;font-size:11px;font-weight:600;color:var(--label-primary);text-align:center;">${p.label}</div>
          </div>
        `).join('')}
      </div>
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

    ${realPhotosHtml}
    ${photosHtml}

    <div class="ios-list" style="background:var(--bg-tertiary);margin-bottom:14px;">
      <div class="ios-row">
        <span style="color:var(--label-secondary);font-size:14px;">Cấu trúc chuẩn</span>
        <span style="font-weight:600;font-size:14px;" class="tabular">${ex.sets} hiệp × ${ex.repMin}–${ex.repMax} ${ex.unit || 'lần'} (${ex.rir})</span>
      </div>
      <div class="ios-row">
        <span style="color:var(--label-secondary);font-size:14px;">Kỷ lục cá nhân (PR)</span>
        <span style="font-weight:600;font-size:14px;color:var(--green);" class="tabular">${stats.prWeight > 0 ? `${stats.prWeight} ${ex.wUnit || 'kg'}` : 'Chưa ghi nhận'}</span>
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
        <span style="color:var(--label-secondary);font-size:14px;">Thời gian các bài tạ đã đo</span>
        <span style="font-weight:600;font-size:14px;color:var(--green);">${energy.totalExTimeLabel || 'Chưa bấm Start'} · ${energy.setsBurnedKcal} kcal</span>
      </div>
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

function openStreakSheet() {
  hapticTap(12);
  const streak = calculateStreakStats();
  const body = document.getElementById('sheetBody');
  const scrim = document.getElementById('sheetScrim');
  const panel = document.getElementById('sheetPanel');
  if (!body || !scrim || !panel) return;

  const daysDetailHtml = streak.thisWeek.days.map(d => {
    const statusTxt = d.isValid
      ? `<span style="color:var(--green);font-weight:700;">✓ Đạt buổi (${d.exCount} bài)</span>`
      : d.isPartial
        ? `<span style="color:var(--orange);font-weight:600;">Đang dở (${d.exCount}/3 bài)</span>`
        : d.isFuture
          ? `<span style="color:var(--label-tertiary);">Sắp tới</span>`
          : `<span style="color:var(--label-secondary);">Nghỉ</span>`;
    return `
      <div class="ios-row tabular" style="padding:10px 14px;">
        <span style="font-size:14px;font-weight:${d.isToday ? '700' : '500'};color:${d.isToday ? 'var(--green)' : 'var(--label-primary)'};">
          ${d.label} (${d.ddmm})${d.isToday ? ' · Hôm nay' : ''}
        </span>
        <span style="font-size:13.5px;">${statusTxt}</span>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    <div style="margin-bottom:12px;">
      <div class="ex-slot-tag" style="color:var(--orange);">KỶ LUẬT THÉP · 3 BUỔI/TUẦN × ≥3 BÀI/BUỔI</div>
      <div style="display:flex;align-items:baseline;justify-content:space-between;">
        <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;" class="tabular">🔥 Chuỗi ${streak.currentStreakWeeks} tuần</div>
        <div style="font-size:13px;font-weight:600;color:var(--green);" class="tabular">Kỷ lục: ${streak.bestStreakWeeks} tuần</div>
      </div>
      <div style="font-size:12.5px;color:var(--label-secondary);margin-top:3px;" class="tabular">${streak.liveSubText}</div>
    </div>

    <div class="ios-list" style="background:var(--bg-tertiary);margin-bottom:12px;">
      ${daysDetailHtml}
    </div>

    <div style="background:var(--bg-tertiary);border-radius:13px;padding:12px 14px;font-size:12.5px;line-height:1.45;color:var(--label-secondary);margin-bottom:12px;">
      <strong style="color:var(--label-primary);">Quy tắc khóa Streak:</strong><br>
      • <strong>1 buổi hợp lệ:</strong> Hoàn thành tối thiểu <strong>3 bài tập khác nhau</strong> trong cùng 1 ngày.<br>
      • <strong>1 tuần giữ Streak:</strong> Tối thiểu <strong>3 buổi hợp lệ / tuần</strong> (tính từ Thứ 2 đến hết Chủ Nhật).
    </div>

    <button class="btn-primary-apple" onclick="closeDetailSheet()">Đã rõ · Vào tập ngay</button>
  `;

  scrim.classList.add('open');
  sheetOpen = true;
  const h = panel.offsetHeight || 420;
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
        let rawLogDate = r[0] || '';
        if (rawLogDate === '2026-01-10' && String(r[1]) === '2') rawLogDate = '01/10/2026';
        sheetLogs.push({
          date: normalizeDateVN(rawLogDate),
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
        const todayKey = getTodayDateKey();
        const merged = [...sheetLogs];
        const localRows = state.logs.filter(l => l.isLocal);
        localRows.forEach(loc => {
          const normLocDate = normalizeDateVN(loc.date);
          const idx = merged.findIndex(s => normalizeDateVN(s.date) === normLocDate && s.exercise === loc.exercise);
          if (idx === -1) {
            merged.push(loc);
          } else if (normLocDate === todayKey && (Number(loc.reps) > Number(merged[idx].reps) || Number(loc.weight) !== Number(merged[idx].weight))) {
            merged[idx] = loc;
          }
        });
        state.logs = merged;
        hydrateTodayFromLogs(todayKey);
        syncTodaySessionToLogs(todayKey);
        if (state.webhookUrl && state.logs.some(l => l.isLocal)) {
          scheduleCloudSync();
        }
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
        d = normalizeDateVN(d);
        const noteStr = r[8] || '';
        const parsedShoulder = parseFloat(r[9]) || parseShoulderFromNote(noteStr) || '';
        sheetBody.push({
          date: d,
          weight: w,
          waist: r[2] || '',
          chest: r[3] || '',
          arm: r[4] || '',
          forearm: r[5] || '',
          thigh: r[6] || '',
          bf: r[7] || '',
          shoulder: parsedShoulder,
          note: noteStr
        });
      }
      if (sheetBody.length > 0) {
        const localBodyExtra = state.body.filter(b => b.isLocal);
        const mergedBody = [...sheetBody];
        localBodyExtra.forEach(loc => {
          const normLocDate = normalizeDateVN(loc.date);
          const idx = mergedBody.findIndex(sb => normalizeDateVN(sb.date) === normLocDate);
          if (idx === -1) {
            mergedBody.push(loc);
          } else {
            mergedBody[idx] = {
              ...mergedBody[idx],
              weight: loc.weight || mergedBody[idx].weight,
              waist: loc.waist || mergedBody[idx].waist,
              shoulder: loc.shoulder || mergedBody[idx].shoulder,
              chest: loc.chest || mergedBody[idx].chest,
              arm: loc.arm || mergedBody[idx].arm,
              forearm: loc.forearm || mergedBody[idx].forearm,
              thigh: loc.thigh || mergedBody[idx].thigh,
              bf: loc.bf || mergedBody[idx].bf,
              note: loc.note || mergedBody[idx].note,
              isLocal: true
            };
          }
        });
        state.body = mergedBody;
      }
    }

    const now = new Date();
    state.lastSync = `Đồng bộ ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (!state.userManuallySelectedMode) {
      state.workoutMode = getLastSessionInfo().nextMode;
    }
    initTodayDefaults();
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
  syncTodaySessionToLogs();
  saveState();
  render();
  scheduleCloudSync();
}

function updateWeightInput(exId, val) {
  const s = state.todaySession[exId];
  if (!s) return;
  s.weight = Math.max(0, parseFloat(val) || 0);
  syncTodaySessionToLogs();
  saveState();
  scheduleCloudSync();
}

function applyRecWeight(exId, recVal) {
  hapticTap(12);
  const s = state.todaySession[exId];
  if (!s) return;
  const ex = EXERCISES.find(e => e.id === exId);
  const wUnit = ex?.wUnit || 'kg';
  s.weight = recVal;
  syncTodaySessionToLogs();
  saveState();
  render();
  scheduleCloudSync();
  showToast(`Đã đặt mức đề xuất ${recVal} ${wUnit}`);
}

function updateSetReps(exId, setIdx, val) {
  const s = state.todaySession[exId];
  if (!s || !s.sets[setIdx]) return;
  s.sets[setIdx].reps = Math.max(0, parseInt(val, 10) || 0);
  syncTodaySessionToLogs();
  saveState();
  scheduleCloudSync();
}

let liveExTimerInterval = null;

function updateLiveExerciseTimers() {
  const exList = getTodayExercises();
  const latestBody = state.body[state.body.length - 1] || { weight: 74.0 };
  const bodyW = Number(latestBody.weight) || 74.0;
  let anyRunning = false;

  exList.forEach(ex => {
    const s = state.todaySession && state.todaySession[ex.id];
    if (!s || !s.startedAt || s.endedAt) return;
    const numSets = getTargetSetsCount(ex);
    const doneCount = s.sets.slice(0, numSets).filter(st => st.done).length;
    if (doneCount >= numSets) return;

    anyRunning = true;
    if (state.activeTab === 'today') {
      const elapsed = getExerciseElapsedSec(s);
      const timerTxtEl = document.getElementById(`exTimerText-${ex.id}`);
      if (timerTxtEl) {
        timerTxtEl.textContent = formatClockMMSS(elapsed);
      }
      const metaEl = document.getElementById(`exMetaTag-${ex.id}`);
      if (metaEl) {
        const exCal = getExerciseCalorieInfo(ex, s.weight, s.sets, numSets, bodyW, s);
        const slotLabel = getSlotLabel(ex);
        metaEl.textContent = `${slotLabel} · TẦNG ${ex.floor} · ${exCal.burnedKcal}/${exCal.estKcal} KCAL`;
      }
    }
  });

  if (anyRunning && state.activeTab === 'today') {
    const energy = calculateEnergyStats();
    const wBurnEl = document.getElementById('liveWorkoutBurnedVal');
    if (wBurnEl) wBurnEl.textContent = String(energy.workoutBurnedKcal);
    const dBurnEl = document.getElementById('liveDailyBurnedVal');
    if (dBurnEl) dBurnEl.textContent = energy.dailyTotalBurnedTDEE.toLocaleString('vi-VN');
    const exTimeLbl = document.getElementById('liveExTimeLabel');
    if (exTimeLbl) {
      exTimeLbl.textContent = energy.totalExTimeLabel ? `Hiệp tập · ${energy.totalExTimeLabel}` : 'Hiệp tập · Tải';
    }
  }

  if (!anyRunning && liveExTimerInterval) {
    clearInterval(liveExTimerInterval);
    liveExTimerInterval = null;
  }
}

function ensureLiveExTimerLoop() {
  const hasActive = Object.entries(state.todaySession || {}).some(([id, s]) => {
    if (!s || !s.startedAt || s.endedAt) return false;
    const ex = EXERCISES.find(e => e.id === id);
    const numSets = ex ? getTargetSetsCount(ex) : 3;
    const doneCount = Array.isArray(s.sets) ? s.sets.slice(0, numSets).filter(st => st.done).length : 0;
    return doneCount < numSets;
  });
  if (hasActive && !liveExTimerInterval) {
    liveExTimerInterval = setInterval(updateLiveExerciseTimers, 1000);
  } else if (!hasActive && liveExTimerInterval) {
    clearInterval(liveExTimerInterval);
    liveExTimerInterval = null;
  }
}

function startExerciseTimer(exId) {
  hapticTap(12);
  state.todaySessionDate = getTodayDateKey();
  const ex = EXERCISES.find(e => e.id === exId);
  const s = state.todaySession[exId];
  if (!ex || !s) return;

  const numSets = getTargetSetsCount(ex);
  const doneCount = s.sets.slice(0, numSets).filter(st => st.done).length;
  const latestBody = state.body[state.body.length - 1] || { weight: 74.0 };
  const bodyW = Number(latestBody.weight) || 74.0;

  // Already completed all sets -> display summary toast
  if (doneCount >= numSets && (s.endedAt || s.durationSec > 0)) {
    const durSec = getExerciseElapsedSec(s);
    const exCal = getExerciseCalorieInfo(ex, s.weight, s.sets, numSets, bodyW, s);
    showToast(`✓ Đã chốt ${formatDurationCompact(durSec)} · ${exCal.burnedKcal} kcal`);
    return;
  }

  // Currently running -> reset if 0 sets done (accidental tap), else guide user
  if (s.startedAt && !s.endedAt) {
    if (doneCount === 0) {
      s.startedAt = null;
      s.endedAt = null;
      s.durationSec = 0;
      s.autoStarted = false;
      ensureLiveExTimerLoop();
      saveState();
      render();
      showToast('Đã đặt lại đồng hồ bài tập');
    } else {
      showToast('Tích ✓ hiệp cuối để tự động chốt giờ & Calo');
    }
    return;
  }

  // Clean up any accidental 0-set timer left open on another card
  Object.entries(state.todaySession).forEach(([otherId, os]) => {
    if (otherId !== exId && os && os.startedAt && !os.endedAt) {
      const oEx = EXERCISES.find(e => e.id === otherId);
      const oNum = oEx ? getTargetSetsCount(oEx) : 3;
      const oDone = Array.isArray(os.sets) ? os.sets.slice(0, oNum).filter(st => st.done).length : 0;
      if (oDone === 0) {
        os.startedAt = null;
        os.endedAt = null;
        os.durationSec = 0;
        os.autoStarted = false;
      }
    }
  });

  s.startedAt = Date.now();
  s.endedAt = null;
  s.durationSec = 0;
  s.autoStarted = false;
  ensureLiveExTimerLoop();
  saveState();
  render();
  showToast(`▶ Bắt đầu tính giờ: ${ex.title}`);
}

function toggleSetDone(exId, setIdx) {
  const ex = EXERCISES.find(e => e.id === exId);
  const s = state.todaySession[exId];
  if (!ex || !s || !s.sets[setIdx]) return;

  const now = Date.now();
  const numSets = getTargetSetsCount(ex);
  state.todaySessionDate = getTodayDateKey();
  const targetSet = s.sets[setIdx];
  targetSet.done = !targetSet.done;
  if (targetSet.done && (!targetSet.reps || targetSet.reps <= 0)) {
    targetSet.reps = ex.repMax;
  }
  if (exId === 'EX14' && targetSet.done) {
    getTodayActivity().farmerDone = true;
  }

  const doneCount = s.sets.slice(0, numSets).filter(st => st.done).length;

  if (targetSet.done) {
    // Anti-forget fallback: backdate start if user jumped straight into Set 1 without pressing Start
    if (!s.startedAt && !s.durationSec) {
      const fallbackSec = ex.unit === 'giây' ? (Number(targetSet.reps) || 45) + 10 : 45;
      s.startedAt = now - fallbackSec * 1000;
      s.endedAt = null;
      s.autoStarted = true;
    }
    // Auto-finish stopwatch immediately upon checking the final set of the exercise!
    if (doneCount >= numSets) {
      if (s.startedAt) {
        s.endedAt = now;
        s.durationSec = Math.max(15, Math.round((s.endedAt - s.startedAt) / 1000));
      } else if (!s.durationSec) {
        s.durationSec = numSets * 90;
      }
    }
  } else {
    // Unchecking sets: reset auto-started timer if 0 sets remain, or reopen timer if final set was unchecked
    if (doneCount === 0) {
      s.endedAt = null;
      s.durationSec = 0;
      if (s.autoStarted) {
        s.startedAt = null;
        s.autoStarted = false;
      }
    } else if (doneCount < numSets && s.endedAt) {
      s.endedAt = null;
    }
  }

  ensureLiveExTimerLoop();

  // Auto-save live to state.logs immediately upon ticking ✓ & detect Streak milestone
  const prevStreak = calculateStreakStats();
  syncTodaySessionToLogs();
  const nextStreak = calculateStreakStats();
  saveState();
  render();
  scheduleCloudSync();

  if (targetSet.done) {
    if (!prevStreak.todayIsValid && nextStreak.todayIsValid) {
      if (nextStreak.thisWeek.validSessions === STREAK_MIN_SESSIONS_PER_WEEK) {
        showToast(`🔥 KHÓA STREAK TUẦN (${nextStreak.currentStreakWeeks} tuần liên tục · 3/3 buổi)!`);
      } else {
        showToast(`✓ Đủ 3 bài — Đã tính Buổi ${nextStreak.thisWeek.validSessions}/3 tuần này!`);
      }
    }
    const latestBody = state.body[state.body.length - 1] || { weight: 74.0 };
    const bodyW = Number(latestBody.weight) || 74.0;
    const exCal = getExerciseCalorieInfo(ex, s.weight, s.sets, numSets, bodyW, s);
    if (doneCount >= numSets) {
      startRestTimer(ex.restSec, `✓ Xong ${ex.title} · ${formatDurationCompact(s.durationSec)} · ${exCal.burnedKcal} kcal`);
    } else {
      startRestTimer(ex.restSec, `${ex.title} · Hiệp ${setIdx + 1}`);
    }
  } else {
    hapticTap(8);
  }
}

async function saveTodayWorkout() {
  const todayStr = getTodayDateKey();
  state.todaySessionDate = todayStr;
  syncTodaySessionToLogs(todayStr);

  const todayRows = state.logs.filter(l => normalizeDateVN(l.date) === todayStr);
  if (todayRows.length === 0) {
    showToast('Chạm vòng tròn ✓ ít nhất 1 hiệp để lưu');
    return;
  }

  playBell();
  saveState();
  render();

  if (state.webhookUrl) {
    const ok = await syncLocalLogsToCloud(true);
    if (ok) {
      render();
      showToast(`✓ Đã lưu ${todayRows.length} bài & đồng bộ lên Google Sheet`);
      return;
    }
  }

  // Fallback when Apps Script URL is not yet configured: auto-copy TSV rows for 1-paste into Sheet
  try {
    const tsv = todayRows.map(r => [
      r.date, r.week, r.workout, r.exercise, r.weight, r.reps, r.volume, r.rir, r.nextWeight, r.note || ''
    ].join('\t')).join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(tsv);
      showToast(`✓ Đã lưu ${todayRows.length} bài & chép sẵn dòng để dán vào Sheet`);
      return;
    }
  } catch (e) {}
  showToast(`✓ Đã lưu ${todayRows.length} bài vào Tiến độ trên máy`);
}

function copyLogsTSV() {
  syncTodaySessionToLogs();
  saveState();
  const localRows = state.logs.filter(l => l.isLocal);
  let targetRows = localRows;
  if (targetRows.length === 0 && state.logs.length > 0) {
    const latestDate = normalizeDateVN(state.logs[state.logs.length - 1].date);
    targetRows = state.logs.filter(l => normalizeDateVN(l.date) === latestDate);
  }
  if (targetRows.length === 0) {
    showToast('Chưa có dòng tập nào để sao chép');
    return;
  }
  const tsv = targetRows.map(r => [
    normalizeDateVN(r.date), r.week, r.workout, r.exercise, r.weight, r.reps, r.volume, r.rir, r.nextWeight, r.note || ''
  ].join('\t')).join('\n');
  const dateTag = normalizeDateVN(targetRows[targetRows.length - 1].date);
  navigator.clipboard.writeText(tsv).then(() => {
    showToast(`Đã chép ${targetRows.length} bài (${dateTag}) — Dán vào ô A cuối Sheet`);
  });
}

async function submitBodyMeasurement() {
  const readNumStr = (id) => {
    const raw = String(document.getElementById(id)?.value || '').replace(',', '.').trim();
    const n = parseFloat(raw);
    return (!isNaN(n) && n > 0) ? String(Number(n.toFixed(1))) : '';
  };

  const curProfile = getCurrentBodyProfile();
  const rawWeightStr = readNumStr('bmWeight');
  const waist = readNumStr('bmWaist');
  const shoulder = readNumStr('bmShoulder');
  const chest = readNumStr('bmChest');
  const forearm = readNumStr('bmForearm');
  const arm = readNumStr('bmArm');
  const thigh = readNumStr('bmThigh');
  const bf = readNumStr('bmBf');
  const rawNote = String(document.getElementById('bmNote')?.value || '').trim();

  const hasCircumference = Boolean(waist || shoulder || chest || forearm || arm || thigh || bf);
  if (!rawWeightStr && !hasCircumference) {
    showToast('Vui lòng nhập cân nặng hoặc ít nhất 1 số đo (cm)');
    return;
  }

  const w = rawWeightStr ? parseFloat(rawWeightStr) : curProfile.weight;
  const todayKey = getTodayDateKey();
  let noteToSave = rawNote;
  if (shoulder && !/Vai[:\s]/i.test(noteToSave)) {
    noteToSave = noteToSave ? `${noteToSave} · Vai: ${shoulder}cm` : `Vai: ${shoulder}cm`;
  }

  const existingIdx = state.body.findIndex(b => normalizeDateVN(b.date) === todayKey);
  const prevToday = existingIdx >= 0 ? state.body[existingIdx] : {};

  const entry = {
    date: todayKey,
    weight: w,
    waist: waist || prevToday.waist || '',
    shoulder: shoulder || prevToday.shoulder || '',
    chest: chest || prevToday.chest || '',
    arm: arm || prevToday.arm || '',
    forearm: forearm || prevToday.forearm || '',
    thigh: thigh || prevToday.thigh || '',
    bf: bf || prevToday.bf || '',
    note: noteToSave || prevToday.note || '',
    isLocal: true
  };

  if (existingIdx >= 0) {
    state.body[existingIdx] = entry;
  } else {
    state.body.push(entry);
  }

  hapticTap(15);
  saveState();
  render();

  if (state.webhookUrl) {
    postWebhookPayload({ action: 'appendBody', data: entry });
  }
  showToast('✓ Đã lưu số đo & cập nhật Bản vẽ Chuẩn 40t');
}

async function submitCardioLog() {
  const dur = parseFloat(document.getElementById('cdDur')?.value) || 25;
  const dist = parseFloat(document.getElementById('cdDist')?.value) || 3.0;
  const week = document.getElementById('cdWeek')?.value || 'Tuần 3';
  const days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const now = new Date();
  const entry = {
    date: formatDateVN(now),
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
  if (state.webhookUrl) {
    postWebhookPayload({
      action: 'appendCardio',
      data: {
        date: entry.date,
        dayLabel: entry.day,
        weekLabel: entry.week,
        duration: entry.duration,
        distance: entry.dist,
        pace: (entry.duration / Math.max(0.1, entry.dist)).toFixed(1),
        hr: entry.hr,
        note: ''
      }
    });
  }
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
  const streak = calculateStreakStats();
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
        ? (state.workoutMode === 'ESSENTIAL_7' ? '4 trạm · 9 hiệp · ~18p' : state.workoutMode === 'WORKOUT_A' ? '3 bài · ~16 phút' : '4 bài · ~21 phút')
        : (state.workoutMode === 'ESSENTIAL_7' ? '5 bài + Cổ tay · 13 hiệp · ~23p' : state.workoutMode === 'WORKOUT_A' ? '5 bài · ~24 phút' : '4 bài · ~21 phút');
      listHtml += `
        <div class="section-header">
          <span class="section-title">${floorTitle}</span>
          <span class="section-meta">${floorMeta}</span>
        </div>
      `;
    }

    const stats = getExerciseStats(ex, { excludeToday: true });
    const numSets = getTargetSetsCount(ex);
    const s = state.todaySession[ex.id] || { weight: stats.recWeight, sets: [] };
    const exCal = getExerciseCalorieInfo(ex, s.weight, s.sets, numSets, bodyW, s);
    const exDoneCount = s.sets.slice(0, numSets).filter(st => st.done).length;
    const isCompleted = exDoneCount >= numSets;
    const isRunning = Boolean(s.startedAt && !s.endedAt && !isCompleted);
    const settledSec = getExerciseElapsedSec(s);
    const slotLabel = getSlotLabel(ex);
    const unitLbl = ex.unit || 'lần';
    const wUnit = ex.wUnit || 'kg';

    let timerBtnHtml = '';
    if (isCompleted && settledSec > 0) {
      timerBtnHtml = `
        <button id="exTimerBtn-${ex.id}" class="ex-timer-pill done tabular" onclick="startExerciseTimer('${ex.id}')" aria-label="Thời gian hoàn thành bài tập">
          ✓ ${formatDurationCompact(settledSec)}
        </button>
      `;
    } else if (isRunning) {
      timerBtnHtml = `
        <button id="exTimerBtn-${ex.id}" class="ex-timer-pill running tabular" onclick="startExerciseTimer('${ex.id}')" aria-label="Đang bấm giờ bài tập">
          <span class="ex-live-dot"></span>
          <span id="exTimerText-${ex.id}">${formatClockMMSS(settledSec)}</span>
        </button>
      `;
    } else {
      timerBtnHtml = `
        <button id="exTimerBtn-${ex.id}" class="ex-timer-pill tabular" onclick="startExerciseTimer('${ex.id}')" aria-label="Bắt đầu tính giờ bài tập">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg>
          Bắt đầu
        </button>
      `;
    }

    let setRowsHtml = '';
    for (let i = 0; i < numSets; i++) {
      const st = s.sets[i] || { reps: ex.repMax, done: false };
      setRowsHtml += `
        <div class="set-row ${st.done ? 'done' : ''}">
          <span class="set-index">Hiệp ${i + 1}</span>
          <span class="set-target tabular">${ex.repMin}–${ex.repMax} ${unitLbl} · ${ex.rir}</span>
          <div class="set-reps-box">
            <input type="text" inputmode="numeric" pattern="[0-9]*" class="set-reps-field tabular" value="${st.reps}"
              onfocus="this.select()" onchange="updateSetReps('${ex.id}', ${i}, this.value)" aria-label="Số ${unitLbl} hiệp ${i + 1}">
            <span class="set-reps-lbl">${unitLbl}</span>
          </div>
          <button class="check-ring" onclick="toggleSetDone('${ex.id}', ${i})" aria-label="Hoàn thành hiệp ${i + 1}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      `;
    }

    const metaCalText = isCompleted && settledSec > 0
      ? `✓ ${exCal.burnedKcal} KCAL`
      : `${exCal.burnedKcal}/${exCal.estKcal} KCAL`;

    listHtml += `
      <div class="apple-card ${isCompleted ? 'completed' : ''}">
        <div class="card-top">
          <div onclick="openDetailSheet('${ex.id}')" style="cursor:pointer;flex:1;min-width:0;">
            <div id="exMetaTag-${ex.id}" class="ex-slot-tag tabular">${slotLabel} · TẦNG ${ex.floor} · ${metaCalText}</div>
            <div class="ex-name">${ex.title}</div>
            <div class="ex-sub">${ex.vnSub}</div>
          </div>
          <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
            ${timerBtnHtml}
            ${ex.unit === 'giây' ? `
              <button class="icon-pill-btn tabular" style="background:var(--green-dim);color:var(--green);height:32px;padding:0 9px;font-size:12px;"
                onclick="startRestTimer(${ex.repMax + 3}, '${ex.title} · Giữ ${ex.repMax}s (+3s cầm tạ)')" aria-label="Bấm giờ giữ ${ex.repMax} giây">
                ${ex.repMax}s
              </button>
            ` : ''}
            <button class="icon-circle-btn" style="width:32px;height:32px;" onclick="openDetailSheet('${ex.id}')" aria-label="Chi tiết kỹ thuật & video">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </button>
          </div>
        </div>

        <div class="weight-bar">
          <div class="weight-hint" onclick="applyRecWeight('${ex.id}', ${stats.recWeight})" style="cursor:pointer;">
            <span class="weight-hint-top tabular">Trước: ${stats.lastWeight > 0 ? `${stats.lastWeight} ${wUnit}` : '—'}</span>
            <span class="weight-hint-rec tabular">${stats.recHint || `Đề xuất: ${stats.recWeight} ${wUnit}`}</span>
          </div>
          <div class="weight-stepper">
            <button class="stepper-circle" onclick="stepWeight('${ex.id}', -${ex.inc})" aria-label="Giảm tạ">−</button>
            <div class="weight-val-wrap">
              <input type="text" inputmode="decimal" class="weight-val-input tabular" style="${wUnit === 'kg/tay' ? 'width:50px;' : ''}" value="${s.weight}"
                onfocus="this.select()" onchange="updateWeightInput('${ex.id}', this.value)" aria-label="Mức tạ ${wUnit}">
              <span class="weight-unit">${wUnit}</span>
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
      <span>${lastSession.todaySavedCount > 0 ? `<strong style="color:var(--green);">Hôm nay: Đã lưu ${lastSession.todaySavedCount} bài ✓</strong> · Trước: ${lastSession.lastDate}` : `Trước: ${lastSession.lastLabel} (${lastSession.lastDate})`}</span>
      <span>Chế độ: <strong>9 Bài Chuẩn · 22 Hiệp</strong> ${state.workoutMode === 'ESSENTIAL_7' ? '✓' : '→'}</span>
    </div>

    <!-- Sliding Segmented Control (9 Bài Chuẩn | Buổi A | Buổi B) -->
    <div class="segmented-control">
      <div id="segPill" class="segmented-pill" style="transform:translateX(${modeIdx * 100}%);"></div>
      <button class="seg-btn ${state.workoutMode === 'ESSENTIAL_7' ? 'active' : ''}" onclick="setWorkoutMode('ESSENTIAL_7')">9 Bài Chuẩn</button>
      <button class="seg-btn ${state.workoutMode === 'WORKOUT_A' ? 'active' : ''}" onclick="setWorkoutMode('WORKOUT_A')">Buổi A</button>
      <button class="seg-btn ${state.workoutMode === 'WORKOUT_B' ? 'active' : ''}" onclick="setWorkoutMode('WORKOUT_B')">Buổi B</button>
    </div>

    <!-- Weekly Discipline Streak Banner (Min 3 Sessions/Week × Min 3 Exercises/Session) -->
    ${buildTodayStreakBannerMarkup(streak)}

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
            <div class="af-m-val" style="color:var(--red);"><span id="liveWorkoutBurnedVal">${energy.workoutBurnedKcal}</span> <span class="af-m-sub">/ ${energy.workoutEstKcal}</span></div>
          </div>
          <div>
            <div class="af-m-label">Calo trong ngày</div>
            <div class="af-m-val" style="color:var(--orange);"><span id="liveDailyBurnedVal">${energy.dailyTotalBurnedTDEE.toLocaleString('vi-VN')}</span> <span class="af-m-sub">/ ${energy.dailyTotalEstTDEE.toLocaleString('vi-VN')}</span></div>
          </div>
          <div>
            <div id="liveExTimeLabel" class="af-m-label">${energy.totalExTimeLabel ? `Hiệp tập · ${energy.totalExTimeLabel}` : 'Hiệp tập · Tải'}</div>
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
      ${exList.some(e => e.id === 'EX14') ? '' : `
      <button class="af-timer-pill ${energy.act.farmerDone ? 'done' : ''}"
        onclick="triggerAddonActivity('farmerDone', 45, 'Xách tạ Farmer Hold', ${energy.farmerKcal})">
        ${energy.act.farmerDone ? '✓ ' : ''}Xách tạ 45s
      </button>
      `}
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
  const targetWeight = GOLDEN_40_TARGETS.weight;
  const curProfile = getCurrentBodyProfile();
  const latestBody = state.body[state.body.length - 1] || { weight: 74.0 };
  const currentW = Number(latestBody.weight) || 74.0;
  const lost = Math.max(0, startWeight - currentW);
  const pct = Math.min(100, Math.max(5, Math.round((lost / (startWeight - targetWeight)) * 100)));
  const bmi = (currentW / (1.63 * 1.63)).toFixed(1);
  const totalVol = state.logs.reduce((a, b) => a + (Number(b.volume) || 0), 0);
  const sessionsCount = new Set(state.logs.map(l => {
    let d = normalizeDateVN(l.date);
    if (d === '10/01/2026' && String(l.week) === '2') d = '01/10/2026';
    return d;
  })).size;
  const streak = calculateStreakStats();

  const exRows = EXERCISES.map(ex => {
    const st = getExerciseStats(ex);
    const wUnit = ex.wUnit || 'kg';
    const statusColor = st.status === 'Tăng tải' ? 'var(--green)' : st.status === 'Chững tạ' ? 'var(--orange)' : 'var(--label-secondary)';
    const nextStatusStr = st.status.includes('→') ? st.status : `${st.status} → ${st.recWeight} ${wUnit}`;
    return `
      <div class="ios-row" onclick="openDetailSheet('${ex.id}')" style="cursor:pointer;">
        <div style="flex:1;">
          <div style="font-size:15px;font-weight:600;letter-spacing:-0.01em;">${ex.title}</div>
          <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;">
            Khởi điểm ${st.firstWeight ? `${st.firstWeight} ${wUnit}` : '—'} · Kỷ lục ${st.prWeight ? `${st.prWeight} ${wUnit}` : '—'}
          </div>
        </div>
        <div style="text-align:right;">
          <div class="tabular" style="font-size:16px;font-weight:700;">${st.lastWeight > 0 ? `${st.lastWeight} ${wUnit}` : '—'}</div>
          <div style="font-size:11px;font-weight:600;color:${statusColor};margin-top:2px;">
            ${nextStatusStr}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Group logs by date to show Session-by-Session history
  const sessionMap = new Map();
  state.logs.forEach(l => {
    let dKey = normalizeDateVN(l.date);
    if (dKey === '10/01/2026' && String(l.week) === '2') dKey = '01/10/2026';
    if (!sessionMap.has(dKey)) {
      sessionMap.set(dKey, { date: dKey, countA: 0, countB: 0, e9: false, e8: false, e7: false, full: false, exSet: new Set(), vol: 0, lastTag: l.workout });
    }
    const item = sessionMap.get(dKey);
    const exName = String(l.exercise || '').trim();
    if (exName && (Number(l.weight) > 0 || Number(l.reps) > 0)) item.exSet.add(exName);
    item.vol += Number(l.volume) || 0;
    item.lastTag = l.workout;
    const wStr = String(l.workout || '').toUpperCase();
    if (wStr.includes('9 BÀI')) item.e9 = true;
    else if (wStr.includes('8 BÀI')) item.e8 = true;
    else if (wStr.includes('7 BÀI')) item.e7 = true;
    else if (wStr.includes('2 TẦNG') || wStr.includes('FULL')) item.full = true;
    else if (wStr.includes('B')) item.countB++;
    else if (wStr.includes('A')) item.countA++;
  });

  const sessionRows = Array.from(sessionMap.values()).reverse().map(s => {
    const exCount = s.exSet.size;
    let label = 'Buổi A';
    let color = 'var(--green)';
    if (s.e9) {
      label = '9 Bài Chuẩn';
      color = 'var(--blue)';
    } else if (s.e8) {
      label = '8 Bài Chuẩn';
      color = 'var(--blue)';
    } else if (s.e7) {
      label = '7 Bài Chuẩn';
      color = 'var(--blue)';
    } else if (s.full && exCount >= 7) {
      label = 'Gộp A+B (2 Tầng)';
      color = 'var(--blue)';
    } else if (String(s.lastTag || '').toUpperCase().includes('B') || s.countB > s.countA) {
      label = 'Buổi B';
      color = 'var(--orange)';
    }
    const streakBadge = exCount >= STREAK_MIN_EX_PER_SESSION
      ? `<span style="color:var(--green);font-weight:600;">✓ Tính Streak</span> · ${exCount} bài`
      : `<span style="color:var(--orange);font-weight:600;">Chưa đủ 3 bài</span> · ${exCount}/3 bài`;
    return `
      <div class="ios-row">
        <div>
          <div style="font-size:15px;font-weight:600;" class="tabular">${s.date}</div>
          <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;" class="tabular">${streakBadge}</div>
        </div>
        <div style="text-align:right;" class="tabular">
          <div style="font-size:14px;font-weight:700;color:${color};">${label}</div>
          <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;">${s.vol.toLocaleString('vi-VN')} kg</div>
        </div>
      </div>
    `;
  }).join('');

  const historyRows = [...state.logs].reverse().slice(0, 18).map(l => {
    const exMatch = EXERCISES.find(e => e.name === l.exercise);
    const wUnit = exMatch?.wUnit || 'kg';
    const durTag = l.durationSec ? ` · ${formatDurationCompact(l.durationSec)}` : '';
    const kcalTag = l.kcal ? ` · ${l.kcal} kcal` : '';
    const noteExtra = (!l.durationSec && String(l.note || '').includes('kcal'))
      ? ' · ' + String(l.note).split('·').slice(1).map(x => x.trim()).join(' · ')
      : `${durTag}${kcalTag}`;
    return `
    <div class="ios-row">
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:600;">${l.exercise.split(' - ')[0]}</div>
        <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;" class="tabular">${l.date} · ${l.workout}${noteExtra}</div>
      </div>
      <div style="text-align:right;" class="tabular">
        <div style="font-size:15px;font-weight:600;color:var(--green);">${l.weight} ${wUnit} × ${l.reps}${exMatch?.unit === 'giây' ? 's' : ''}</div>
        <div style="font-size:11px;color:var(--label-secondary);">${Number(l.volume).toLocaleString('vi-VN')} kg</div>
      </div>
    </div>
  `;
  }).join('');

  return `
    <div class="apple-card" onclick="switchTab('cardio')" style="cursor:pointer;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <div class="ex-slot-tag" style="margin-bottom:0;">MỤC TIÊU HÌNH THỂ · 1M63 · BMI ${bmi}</div>
        <span style="font-size:11.5px;font-weight:600;color:var(--green);" class="tabular">Bản vẽ 40t (${curProfile.goldenReadinessPct}%) →</span>
      </div>
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-top:6px;">
        <div style="font-size:28px;font-weight:700;letter-spacing:-0.025em;" class="tabular">${currentW} <span style="font-size:16px;font-weight:500;color:var(--label-secondary);">kg</span></div>
        <div style="font-size:13px;color:var(--green);font-weight:600;" class="tabular">Đích 40t: ${targetWeight.toFixed(1)} kg (−${Math.max(0, currentW - targetWeight).toFixed(1)} kg)</div>
      </div>
      <div class="apple-progress-track">
        <div class="apple-progress-fill" style="width:${pct}%;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--label-secondary);" class="tabular">
        <span>Khởi điểm: ${startWeight} kg</span>
        <span>Đã tập: ${sessionsCount} buổi · ${totalVol.toLocaleString('vi-VN')} kg tạ</span>
      </div>
    </div>

    ${buildProgressStreakCardMarkup(streak)}

    <div class="section-header">
      <span class="section-title">Nhật ký các buổi tập</span>
      <span class="section-meta">${sessionMap.size} buổi</span>
    </div>
    <div class="ios-list">
      ${sessionRows}
    </div>

    <div class="section-header">
      <span class="section-title">Sức mạnh ${EXERCISES.length} bài tập</span>
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
  const wUnit = EXERCISES.find(e => e.id === exId)?.wUnit || 'kg';
  saveState();
  render();
  showToast(`Đã đặt Target 3 tháng: ${num} ${wUnit}`);
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
  const streak = calculateStreakStats();
  const curProfile = getCurrentBodyProfile();

  const latestBody = state.body[state.body.length - 1] || { weight: 74.0, waist: '', forearm: '' };
  const currentW = Number(latestBody.weight) || 74.0;
  const startW = bt.startWeight || 78.0;
  const target3MW = bt.month3Weight || 65.0;
  const finalW = bt.finalWeight || GOLDEN_40_TARGETS.weight;

  // Progress toward 3-Month Weight Target (78kg -> 65kg)
  const lostSoFar = Math.max(0, startW - currentW);
  const total3MLoss = Math.max(0.5, startW - target3MW);
  const weight3MPct = Math.min(100, Math.max(5, Math.round((lostSoFar / total3MLoss) * 100)));
  const remain3MW = Math.max(0, (currentW - target3MW)).toFixed(1);

  // Latest logged waist & forearm & max run distance
  const currentWaist = curProfile.measured.waist ? curProfile.waist : null;
  const currentForearm = curProfile.measured.forearm ? curProfile.forearm : null;
  const maxRunKm = state.cardioLogs.reduce((m, c) => Math.max(m, Number(c.dist) || 0), 0);
  const runPct = Math.min(100, Math.round((maxRunKm / (bt.targetRunKm || 5.0)) * 100));

  // Blueprint SVG & Live Slider Initial State
  const simWInit = lerpMetric(curProfile.weight, GOLDEN_40_TARGETS.weight, blueprintProgress).toFixed(1);
  const simBfInit = Math.round(lerpMetric(curProfile.bf, GOLDEN_40_TARGETS.bf, blueprintProgress));
  const sliderInt = Math.round(blueprintProgress * 100);
  const svgMarkup = buildBlueprintSvgMarkup(curProfile, blueprintProgress);
  const ratioBarsMarkup = buildBlueprintRatioBarsMarkup(curProfile, blueprintProgress);

  const badgeTag = (isMeasured) => isMeasured
    ? '<span class="bp-tag-measured">✓ Đã đo</span>'
    : '<span class="bp-tag-est">Ước tính</span>';

  const zoneSpecs = [
    {
      title: 'Cân nặng & % Mỡ',
      tag: badgeTag(curProfile.measured.weight),
      curStr: `${curProfile.weight.toFixed(1)} kg · ${curProfile.measured.bf ? '' : '~'}${curProfile.bf.toFixed(0)}%`,
      targetStr: `${GOLDEN_40_TARGETS.weight.toFixed(1)} kg · ${GOLDEN_40_TARGETS.bf}%`,
      sub: `FFMI ~20.8 · Rõ 4–6 múi, mặt góc cạnh · Chạm xem Calo`,
      action: `openActivitySheet()`
    },
    {
      title: 'Vòng Eo (ngang rốn)',
      tag: badgeTag(curProfile.measured.waist),
      curStr: `${curProfile.measured.waist ? '' : '~'}${curProfile.waist.toFixed(1)} cm`,
      targetStr: `${GOLDEN_40_TARGETS.waist.toFixed(1)} cm`,
      sub: `Eo/Cao 0.46 (Đòn bẩy #1 kéo dài chân) · EX12 Gập bụng`,
      action: `openDetailSheet('EX12')`
    },
    {
      title: 'Vòng Vai ngang',
      tag: badgeTag(curProfile.measured.shoulder),
      curStr: `${curProfile.measured.shoulder ? '' : '~'}${curProfile.shoulder.toFixed(1)} cm`,
      targetStr: `${GOLDEN_40_TARGETS.shoulder.toFixed(1)} cm`,
      sub: `Vai/Eo 1.57× (Chữ V Adonis) · EX10 Bay vai + EX04 Multi Press`,
      action: `openDetailSheet('EX10')`
    },
    {
      title: 'Vòng Ngực & Xô',
      tag: badgeTag(curProfile.measured.chest),
      curStr: `${curProfile.measured.chest ? '' : '~'}${curProfile.chest.toFixed(1)} cm`,
      targetStr: `${GOLDEN_40_TARGETS.chest.toFixed(1)} cm`,
      sub: `Ngực/Eo 1.35× · EX08 Ngực trên + EX03 Kéo xô`,
      action: `openDetailSheet('EX08')`
    },
    {
      title: 'Cẳng tay / Bắp tay',
      tag: badgeTag(curProfile.measured.forearm),
      curStr: `${curProfile.measured.forearm ? '' : '~'}${curProfile.forearm.toFixed(1)} / ${curProfile.arm.toFixed(1)}`,
      targetStr: `${GOLDEN_40_TARGETS.forearm.toFixed(1)} / ${GOLDEN_40_TARGETS.arm.toFixed(1)} cm`,
      sub: `Cẳng tay = 90% Bắp tay · EX14 Farmer Hold + EX11 Cuộn búa`,
      action: `openDetailSheet('EX14')`
    },
    {
      title: 'Vòng Đùi săn gọn',
      tag: badgeTag(curProfile.measured.thigh),
      curStr: `${curProfile.measured.thigh ? '' : '~'}${curProfile.thigh.toFixed(1)} cm`,
      targetStr: `${GOLDEN_40_TARGETS.thigh.toFixed(1)} cm`,
      sub: `Gọt mỡ đùi trong, cơ đặc quần Âu đẹp · EX01 Leg Press 240kg`,
      action: `openDetailSheet('EX01')`
    }
  ];

  const zoneRowsHtml = zoneSpecs.map(z => `
    <div class="ios-row" onclick="${z.action}" style="cursor:pointer;align-items:flex-start;">
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span style="font-size:14.5px;font-weight:600;">${z.title}</span>
          ${z.tag}
        </div>
        <div style="font-size:12px;color:var(--label-secondary);margin-top:3px;line-height:1.35;">${z.sub}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;" class="tabular">
        <div style="font-size:14.5px;font-weight:700;color:var(--green);">${z.targetStr}</div>
        <div style="font-size:11.5px;color:var(--label-secondary);margin-top:2px;">Hiện: ${z.curStr}</div>
      </div>
    </div>
  `).join('');

  // Active stage detection among 3 Phases before Age 40 (2026-2029)
  const activePhase = currentW > 65.0 ? 1 : (curProfile.goldenReadinessPct < 92 ? 2 : 3);
  const phaseBadge = (num) => {
    if (num === activePhase) {
      return '<span class="bp-stage-badge" style="background:var(--green-dim);color:var(--green);">● Đang thực thi</span>';
    }
    if (num < activePhase) {
      return '<span class="bp-stage-badge" style="background:rgba(10,132,255,0.16);color:var(--blue);">✓ Đã qua</span>';
    }
    return '<span class="bp-stage-badge" style="background:var(--bg-tertiary);color:var(--label-secondary);">Kế tiếp</span>';
  };

  // Calculate overall 3-month strength target completion across all 14 exercises
  let sumStrengthPct = 0;
  const exTargetRows = EXERCISES.map(ex => {
    const st = getExerciseStats(ex);
    const wUnit = ex.wUnit || 'kg';
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
            <span style="font-size:12px;color:var(--label-secondary);" class="tabular">${curPR > 0 ? `${curPR} ${wUnit}` : '—'} (${pct}%)</span>
          </div>
        </div>
        <div class="set-reps-box" style="margin-right:0;min-width:86px;padding:4px 10px;">
          <input type="text" inputmode="decimal" class="set-reps-field tabular" style="width:42px;color:var(--green);"
            value="${tWeight}" onfocus="this.select()" onchange="updateExTarget3M('${ex.id}', this.value)" aria-label="Target 3 tháng ${ex.title}">
          <span class="set-reps-lbl">${wUnit}</span>
        </div>
      </div>
    `;
  }).join('');

  const avgStrengthPct = Math.round(sumStrengthPct / EXERCISES.length);

  const bodyRows = [...state.body].reverse().slice(0, 6).map(b => {
    const shVal = b.shoulder || parseShoulderFromNote(b.note);
    const parts = [];
    if (b.waist) parts.push(`Eo ${b.waist}`);
    if (shVal) parts.push(`Vai ${shVal}`);
    if (b.chest) parts.push(`Ngực ${b.chest}`);
    if (b.forearm) parts.push(`Cẳng ${b.forearm}`);
    if (b.arm) parts.push(`Tay ${b.arm}`);
    if (b.thigh) parts.push(`Đùi ${b.thigh}`);
    if (b.bf) parts.push(`${b.bf}% mỡ`);
    return `
      <div class="ios-row">
        <div style="flex:1;min-width:0;">
          <div style="font-size:15px;font-weight:600;" class="tabular">${b.date}</div>
          <div style="font-size:12px;color:var(--label-secondary);margin-top:1px;">${b.note || 'Đo định kỳ'}</div>
        </div>
        <div style="text-align:right;" class="tabular">
          <div style="font-size:16px;font-weight:700;color:var(--green);">${b.weight} kg</div>
          ${parts.length > 0 ? `<div style="font-size:11px;color:var(--label-secondary);margin-top:1px;">${parts.join(' · ')}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  return `
    <!-- 0. Centerpiece: Age-40 Golden Ratio Interactive Blueprint (1m63) -->
    <div class="apple-card">
      <div class="bp-card-head">
        <div>
          <div class="ex-slot-tag">CHUẨN FORM TRƯỚC 40 TUỔI · NAM 1M63</div>
          <div class="ex-name">Hiện tại vs Tỷ lệ vàng Chữ V</div>
          <div class="ex-sub tabular">37 tuổi (${currentW.toFixed(1)}kg) → Đích 40 tuổi (${GOLDEN_40_TARGETS.weight.toFixed(1)}kg · 13% mỡ)</div>
        </div>
        <div class="bp-readiness-pill tabular">Đạt ${curProfile.goldenReadinessPct}%</div>
      </div>

      <div class="bp-canvas-box">
        <svg id="bpSvg" viewBox="0 0 356 308" class="bp-svg">${svgMarkup}</svg>
        <div class="bp-legend-row">
          <span class="bp-legend-item"><span class="bp-swatch-fat"></span>Mỡ eo & đùi gọt bỏ</span>
          <span class="bp-legend-item"><span class="bp-swatch-muscle"></span>Cơ Vai · Xô · Cẳng tay</span>
        </div>
      </div>

      <div class="bp-slider-row">
        <span class="bp-slider-lbl">Kéo biến đổi:</span>
        <input id="bpRangeSlider" type="range" min="0" max="100" value="${sliderInt}" oninput="onBlueprintSlide(this.value)" class="bp-range" aria-label="Thanh trượt mô phỏng tỷ lệ cơ thể">
        <span id="bpStageBadge" class="bp-stage-pill tabular">${sliderInt}% · ${simWInit}kg (${simBfInit}%)</span>
      </div>

      <div id="bpRatioBars" class="bp-ratio-list">
        ${ratioBarsMarkup}
      </div>

      <div class="bp-card-foot">
        <div style="font-size:12px;color:var(--label-secondary);" class="tabular">
          Đã đo thật: <strong style="color:var(--label-primary);">${curProfile.measuredCount}/7</strong> chỉ số ${curProfile.measuredCount < 4 ? '(còn lại đang ước tính)' : ''}
        </div>
        <button class="af-pill active-green" onclick="scrollToBodyForm()">Nhập số đo ↓</button>
      </div>
    </div>

    <!-- 0B. 6 Body Zones & Sculpting Exercises -->
    <div class="section-header">
      <span class="section-title">Thông số 6 vùng & Bài tập đúc form</span>
      <span class="section-meta">Chạm mở máy tập</span>
    </div>
    <div class="ios-list">
      ${zoneRowsHtml}
    </div>

    <!-- 0C. 3-Stage Roadmap Before Age 40 (2026 - 2029) -->
    <div class="section-header">
      <span class="section-title">Lộ trình 3 chặng trước tuổi 40</span>
      <span class="section-meta">2026 – 2029</span>
    </div>
    <div class="ios-list">
      <div class="ios-row" style="align-items:flex-start;flex-direction:column;gap:5px;">
        <div style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span style="font-size:15px;font-weight:700;">Chặng 1 · Gọt Mỡ Mở Khung Chữ V (Tuổi 37)</span>
          ${phaseBadge(1)}
        </div>
        <div style="font-size:12.5px;color:var(--label-secondary);line-height:1.42;" class="tabular">
          6–8 tháng đầu: Đưa cân nặng <strong>74.0 → 64.5 kg</strong>, thu vòng eo xuống <strong>76 cm</strong>. Ăn ~${energy.recIntakeForCut.toLocaleString('vi-VN')} kcal (khóa <strong>135g Đạm/ngày</strong>), giữ 9 Bài Chuẩn + Chạy sáng Zone 2 + Ngủ 23:00–05:00.
        </div>
      </div>

      <div class="ios-row" style="align-items:flex-start;flex-direction:column;gap:5px;">
        <div style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span style="font-size:15px;font-weight:700;">Chặng 2 · Đúc Cơ Sắc Nét Recomp (Tuổi 38)</span>
          ${phaseBadge(2)}
        </div>
        <div style="font-size:12.5px;color:var(--label-secondary);line-height:1.42;" class="tabular">
          12 tháng tiếp: Cân đứng đẹp ở <strong>63.0 kg (13% mỡ)</strong>, Eo <strong>74.5 cm</strong>, đắp +2kg cơ nạc vào Vai (<strong>117 cm</strong>), Ngực trên (<strong>100.5 cm</strong>), Cẳng tay (<strong>33 cm</strong>) & đẩy Leg Press cán mốc <strong>240 kg</strong>.
        </div>
      </div>

      <div class="ios-row" style="align-items:flex-start;flex-direction:column;gap:5px;">
        <div style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span style="font-size:15px;font-weight:700;">Chặng 3 · Khóa Đỉnh Cao U40 Top 1% (39–40+)</span>
          ${phaseBadge(3)}
        </div>
        <div style="font-size:12.5px;color:var(--label-secondary);line-height:1.42;" class="tabular">
          Duy trì bền vững <strong>12.5–13.5% mỡ</strong> quanh năm (không ép khô kiệt &lt;9%), giữ mặt góc cạnh, 4–6 múi bụng rõ nét, nội tiết Testosterone & năng lượng làm việc đỉnh cao.
        </div>
      </div>
    </div>

    <!-- 1. Minimalist Hero Card: Short-Term 3-Month Weight Target -->
    <div class="apple-card">
      <div class="ex-slot-tag">MỤC TIÊU NGẮN HẠN · CÂN NẶNG 3 THÁNG</div>
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
        <span>T1: ${bt.month1Weight}kg · T2: ${bt.month2Weight}kg · T3: ${target3MW}kg · Đích 40t: ${finalW}kg</span>
        <span style="color:var(--green);font-weight:600;">Còn −${remain3MW} kg</span>
      </div>
    </div>

    <!-- 2. Clean iOS Grouped List: Daily Energy, Steps & Body Targets -->
    <div class="section-header">
      <span class="section-title">Chỉ số năng lượng & Kỷ luật ngày</span>
      <span class="section-meta">Đạt ${avgStrengthPct}% sức mạnh</span>
    </div>
    <div class="ios-list tabular">
      <div class="ios-row" onclick="openStreakSheet()" style="cursor:pointer;">
        <div>
          <div style="font-size:15px;font-weight:500;">Chuỗi Streak kỷ luật tuần</div>
          <div style="font-size:12px;color:var(--label-secondary);">Tối thiểu 3 buổi/tuần · ≥3 bài/buổi</div>
        </div>
        <span style="font-size:15px;font-weight:600;color:${streak.thisWeek.qualified ? 'var(--green)' : 'var(--orange)'};">🔥 ${streak.currentStreakWeeks} tuần (${streak.thisWeek.validSessions}/3)</span>
      </div>
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
        <label for="targetWaistInput">Vòng eo đích 40t (cm) ${currentWaist ? `· Hiện ${currentWaist}` : ''}</label>
        <input type="text" inputmode="decimal" id="targetWaistInput" value="${bt.targetWaist}" onchange="updateBodyTarget3M('targetWaist', this.value)">
      </div>
      <div class="ios-input-row">
        <label for="targetForearmInput">Cẳng tay đích 40t (cm) ${currentForearm ? `· Hiện ${currentForearm}` : ''}</label>
        <input type="text" inputmode="decimal" id="targetForearmInput" value="${bt.targetForearm}" onchange="updateBodyTarget3M('targetForearm', this.value)">
      </div>
      <div class="ios-row">
        <span style="font-size:15px;">Chạy bộ sáng Zone 2</span>
        <span style="font-size:15px;font-weight:600;color:var(--blue);">${maxRunKm} / ${bt.targetRunKm} km (${runPct}%)</span>
      </div>
    </div>

    <!-- 3. Quick Body Measurement Update (Full Golden Ratio Tape Inputs) -->
    <div id="bodyMeasureFormSection" class="section-header">
      <span class="section-title">Cập nhật cân nặng & số đo thước dây</span>
      <span class="section-meta">Cập nhật Bản vẽ & Sheet</span>
    </div>
    <div class="ios-list tabular">
      <div class="ios-input-row">
        <label for="bmWeight">Cân nặng hôm nay (kg)</label>
        <input type="text" inputmode="decimal" id="bmWeight" placeholder="${currentW}">
      </div>
      <div class="ios-input-row">
        <label for="bmWaist">Vòng eo ngang rốn (cm)</label>
        <input type="text" inputmode="decimal" id="bmWaist" placeholder="${curProfile.waist} (Đích 74.5)">
      </div>
      <div class="ios-input-row">
        <label for="bmShoulder">Vòng vai ngang (cm)</label>
        <input type="text" inputmode="decimal" id="bmShoulder" placeholder="${curProfile.shoulder} (Đích 117.0)">
      </div>
      <div class="ios-input-row">
        <label for="bmChest">Vòng ngực (cm)</label>
        <input type="text" inputmode="decimal" id="bmChest" placeholder="${curProfile.chest} (Đích 100.5)">
      </div>
      <div class="ios-input-row">
        <label for="bmForearm">Cẳng tay gồng (cm)</label>
        <input type="text" inputmode="decimal" id="bmForearm" placeholder="${curProfile.forearm} (Đích 33.0)">
      </div>
      <div class="ios-input-row">
        <label for="bmArm">Bắp tay gồng (cm)</label>
        <input type="text" inputmode="decimal" id="bmArm" placeholder="${curProfile.arm} (Đích 36.5)">
      </div>
      <div class="ios-input-row">
        <label for="bmThigh">Vòng đùi (cm)</label>
        <input type="text" inputmode="decimal" id="bmThigh" placeholder="${curProfile.thigh} (Đích 55.5)">
      </div>
      <div class="ios-input-row">
        <label for="bmBf">% Mỡ ước tính (tùy chọn)</label>
        <input type="text" inputmode="decimal" id="bmBf" placeholder="${curProfile.bf} (Đích 13%)">
      </div>
      <div class="ios-input-row">
        <label for="bmNote">Ghi chú</label>
        <input type="text" id="bmNote" placeholder="Đo sáng bụng đói" style="width:175px;">
      </div>
    </div>
    <button class="btn-primary-apple" style="margin-bottom:20px;" onclick="submitBodyMeasurement()">
      Lưu số đo & Cập nhật Bản vẽ 40t
    </button>

    <div class="section-header">
      <span class="section-title">Lịch sử đo gần nhất</span>
    </div>
    <div class="ios-list">
      ${bodyRows}
    </div>

    <!-- 4. 3-Month Exercise Strength Targets (All 14 Lifts) -->
    <div class="section-header">
      <span class="section-title">Target 3 tháng · ${EXERCISES.length} bài tập</span>
      <span class="section-meta">Chạm số kg để chỉnh đích</span>
    </div>
    <div class="ios-list">
      ${exTargetRows}
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
  const listHtml = EXERCISES.map(ex => {
    const thumb = (REAL_GYM_PHOTOS[ex.id] && REAL_GYM_PHOTOS[ex.id][0]?.src) || '';
    return `
      <div class="ios-row" onclick="openDetailSheet('${ex.id}')" style="cursor:pointer;gap:12px;">
        ${thumb ? `<img src="${thumb}" alt="${ex.title}" loading="lazy" style="width:46px;height:46px;border-radius:10px;object-fit:cover;flex-shrink:0;border:0.5px solid var(--glass-edge);">` : ''}
        <div style="flex:1;min-width:0;">
          <div style="font-size:11px;font-weight:600;color:var(--green);">TẦNG ${ex.floor} · ${ex.id}</div>
          <div style="font-size:15px;font-weight:600;margin-top:1px;">${ex.name}</div>
          <div style="font-size:12px;color:var(--label-secondary);margin-top:2px;">${ex.equip}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--label-tertiary)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    `;
  }).join('');

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
      <span class="section-title">Danh mục ${EXERCISES.length} bài tập</span>
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

async function saveWebhookUrl() {
  state.webhookUrl = document.getElementById('cfgWebhook')?.value?.trim() || '';
  saveState();
  if (state.webhookUrl) {
    showToast('Đã lưu kết nối — Đang đẩy lịch sử tập lên Sheet...');
    await syncLocalLogsToCloud(false);
  } else {
    showToast('Đã xóa URL kết nối');
  }
}

async function copyAppsScriptCode() {
  try {
    const res = await fetch('./google-apps-script.gs?v=30', { cache: 'no-store' });
    const code = await res.text();
    await navigator.clipboard.writeText(code);
    showToast('Đã sao chép mã Google Apps Script v30');
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
    cardio: 'Mục tiêu & Form 40t',
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
    navigator.serviceWorker.register('./sw.js?v=30', { updateViaCache: 'none' })
      .then((reg) => {
        reg.update();
      })
      .catch(() => {});
  }
});
