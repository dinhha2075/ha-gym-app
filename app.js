// HA GYM PRO — Mobile Native PWA (Synced with Google Sheet 1pPayEETE_yoW9lzxYy3Qdd2GV5yEqp1uQZq285eK-wQ)
const SHEET_ID = '1pPayEETE_yoW9lzxYy3Qdd2GV5yEqp1uQZq285eK-wQ';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?usp=sharing`;
const STORAGE_KEY = 'HA_GYM_PRO_STATE_V2';

// 13 Canonical Exercises from Exercise Library
const EXERCISES = [
  {
    id: 'EX01',
    name: 'Leg Press - Đạp đùi',
    shortName: 'Leg Press (Đạp đùi)',
    floor: 1,
    slot2F: 'T1-5',
    slotA: 'A-1',
    slotB: null,
    muscle: 'Cơ đùi trước (Quads)',
    subMuscle: 'Cơ mông, Đùi sau',
    equip: 'Máy Đạp đùi / Squat máy Smith (Tầng 1)',
    sets: 3,
    repMin: 8,
    repMax: 10,
    rir: '1 - 2 RIR',
    restSec: 105,
    restLabel: '90 - 120 Giây',
    inc: 5,
    video: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    image: 'https://www.muscleandstrength.com/exercises/45-degree-leg-press.html',
    cues: 'Lưng & mông áp sát ghế; Đạp bằng toàn bàn chân; Không khóa cứng khớp gối ở đỉnh. (T2/T6 đặt chân vừa; T4 đặt chân cao ăn vào Mông/Đùi sau).',
    mistakes: 'Khóa cứng khớp gối; Nhấc mông khỏi đệm; Đầu gối sụp vào trong.',
    alt: 'Smith Squat / Hack Squat'
  },
  {
    id: 'EX02',
    name: 'Seated Machine Chest Press - Ngồi thẳng đẩy ngực máy',
    shortName: 'Seated Chest Press (Ngực ngang)',
    floor: 2,
    slot2F: 'T2-4',
    slotA: 'A-2',
    slotB: null,
    muscle: 'Cơ ngực giữa (Mid Chest)',
    subMuscle: 'Vai trước, Tay sau',
    equip: 'Máy ngồi đẩy ngực 90 độ (Tầng 2)',
    sets: 2,
    setsA: 3,
    repMin: 8,
    repMax: 10,
    rir: '1 - 2 RIR',
    restSec: 90,
    restLabel: '90 Giây',
    inc: 5,
    video: 'https://www.youtube.com/watch?v=jrBo8-VSR9M',
    image: 'https://www.muscleandstrength.com/exercises/chest',
    cues: 'Ép chặt bả vai vào đệm ghế; Hạ tạ kiểm soát 2-3s; Đẩy ra trước thở ra gồng ngực, cùi chỏ mở ~60°.',
    mistakes: 'Nhô vai về trước; Cùi chỏ mở ngang 90° gây đau khớp vai; Thả tạ rơi tự do.',
    alt: 'Smith Flat Press / Cable Chest Press'
  },
  {
    id: 'EX03',
    name: 'Lat Pulldown - Kéo xô máy',
    shortName: 'Lat Pulldown (Kéo xô cáp)',
    floor: 1,
    slot2F: 'T1-6',
    slotA: 'A-3',
    slotB: null,
    muscle: 'Cơ xô (Lats - Lưng chữ V)',
    subMuscle: 'Tay trước, Lưng giữa',
    equip: 'Cáp kéo xô tại máy Smith (Tầng 1)',
    sets: 2,
    setsA: 3,
    repMin: 8,
    repMax: 10,
    rir: '1 - 2 RIR',
    restSec: 90,
    restLabel: '90 Giây',
    inc: 5,
    video: 'https://www.youtube.com/watch?v=SALxEARiMkw',
    image: 'https://www.muscleandstrength.com/exercises/lat-pull-down.html',
    cues: 'Cố định đùi; Ngực hơi ưỡn hướng lên; Kéo khuỷu tay xuống về phía hông siết xô 1s; Trả tạ chậm.',
    mistakes: 'Ngả người ra sau quá sâu; Giật đà thân trên; Kéo thanh ra sau gáy.',
    alt: 'Assisted Pull-up / High Row'
  },
  {
    id: 'EX04',
    name: 'Machine Shoulder Press - Đẩy vai máy',
    shortName: 'Shoulder Press (Đẩy vai máy)',
    floor: 1,
    slot2F: 'T1-8',
    slotA: 'A-4',
    slotB: null,
    muscle: 'Cơ vai (Deltoids)',
    subMuscle: 'Tay sau, Cầu vai',
    equip: 'Máy đẩy vai ngồi (Tầng 1)',
    sets: 2,
    repMin: 8,
    repMax: 10,
    rir: '1 - 2 RIR',
    restSec: 90,
    restLabel: '90 Giây',
    inc: 5,
    video: 'https://www.youtube.com/watch?v=Lo6dnolXt3E',
    image: 'https://www.muscleandstrength.com/exercises/shoulders',
    cues: 'Lưng áp sát ghế, siết bụng; Đẩy tay cầm lên đỉnh có kiểm soát; Hạ xuống ngang cằm.',
    mistakes: 'Ưỡn võng thắt lưng quá mức; Cùi chỏ bẻ ngoặt ra sau; Thả rơi tạ.',
    alt: 'Dumbbell Shoulder Press / Smith Overhead Press'
  },
  {
    id: 'EX05',
    name: 'Triceps Pushdown - Kéo cáp tay sau',
    shortName: 'Triceps Pushdown (Kéo cáp tay sau)',
    floor: 1,
    slot2F: 'T1-9B',
    slotA: 'A-5',
    slotB: null,
    muscle: 'Cơ tay sau (Triceps)',
    subMuscle: 'Cẳng tay',
    equip: 'Cáp kéo tay sau tại máy Smith (Tầng 1)',
    sets: 2,
    repMin: 10,
    repMax: 12,
    rir: '1 - 2 RIR',
    restSec: 60,
    restLabel: '60 Giây',
    inc: 2.5,
    video: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
    image: 'https://www.muscleandstrength.com/exercises/triceps',
    cues: 'Khóa cố định khuỷu tay sát sườn; Duỗi thẳng tay xuống dưới siết chặt tay sau 1s; Trả chậm.',
    mistakes: 'Vung vẩy khuỷu tay; Dùng sức nặng cơ thể đè lên cáp.',
    alt: 'Overhead Cable Extension'
  },
  {
    id: 'EX06',
    name: 'Wrist Curl - Cuộn cổ tay',
    shortName: 'Wrist Curl (Cuộn cổ tay Finger-Roll)',
    floor: 1,
    slot2F: 'T1-9C',
    slotA: 'A-6',
    slotB: null,
    muscle: 'Cơ gập cổ tay (Bụng cẳng tay dưới)',
    subMuscle: 'Sức nắm bàn tay (Grip)',
    equip: 'Tạ đơn / Cáp máy Smith (Tầng 1) + 45s Farmer Hold',
    sets: 2,
    repMin: 15,
    repMax: 20,
    rir: '0 - 1 RIR',
    restSec: 45,
    restLabel: '45 Giây',
    inc: 2.5,
    video: 'https://www.youtube.com/watch?v=1-55N7Qlu_U',
    image: 'https://www.muscleandstrength.com/exercises/barbell-wrist-curl.html',
    cues: 'Mẹo Finger-Roll: Hạ xuống mở lỏng bàn tay cho tạ lăn ra đầu ngón tay -> bóp chặt nắm đấm cuộn gập cổ tay lên kịch trần siết 1s! Xong 2 hiệp xách tạ nặng 45s (Farmer Hold) để nổi gân!',
    mistakes: 'Nhấc cả cẳng tay khỏi đùi/ghế; Giật cổ tay quá nhanh.',
    alt: 'Cable Wrist Curl'
  },
  {
    id: 'EX07',
    name: 'Seated Leg Curl - Cuộn đùi sau máy',
    shortName: 'Seated Leg Curl (Cuộn đùi sau)',
    floor: 1,
    slot2F: null,
    slotA: null,
    slotB: 'B-1',
    muscle: 'Cơ đùi sau (Hamstrings)',
    subMuscle: 'Bắp chuối, Cơ mông',
    equip: 'Máy tập đùi sau / Smith RDL (Tầng 1)',
    sets: 3,
    repMin: 10,
    repMax: 12,
    rir: '1 - 2 RIR',
    restSec: 90,
    restLabel: '90 Giây',
    inc: 5,
    video: 'https://www.youtube.com/watch?v=Orxowest56U',
    image: 'https://www.muscleandstrength.com/exercises/leg-curl.html',
    cues: 'Khóa chặt đệm tì đùi; Gập gót chân về sau hết biên độ siết đùi sau 1s; Trả chậm 2-3s.',
    mistakes: 'Nhấc mông khỏi ghế; Dùng đà quán tính giật gót.',
    alt: 'Dumbbell Romanian Deadlift (RDL)'
  },
  {
    id: 'EX08',
    name: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy',
    shortName: 'Incline Chest Press (Ngực trên máy xéo)',
    floor: 2,
    slot2F: 'T2-1',
    slotA: null,
    slotB: 'B-2',
    muscle: 'Cơ ngực trên (Upper Chest)',
    subMuscle: 'Vai trước, Tay sau',
    equip: 'Máy Incline ghế xéo đẩy từng bên (Tầng 2)',
    sets: 3,
    repMin: 8,
    repMax: 10,
    rir: '1 - 2 RIR',
    restSec: 90,
    restLabel: '90 Giây',
    inc: 5,
    video: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    image: 'https://www.muscleandstrength.com/exercises/incline-bench-press.html',
    cues: 'Bài mở màn Tầng 2 khi 100% thể lực! Ưỡn ngực ép bả vai; Hạ tạ sâu có kiểm soát; Đẩy lên thở ra gồng ngực trên.',
    mistakes: 'Nhấc vai khỏi ghế; Đẩy bằng vai trước thay vì ngực trên.',
    alt: 'Incline Dumbbell Press'
  },
  {
    id: 'EX09',
    name: 'Seated Row Machine - Kéo lưng ngồi máy',
    shortName: 'Seated Row Machine (Kéo lưng dày)',
    floor: 1,
    slot2F: 'T1-7',
    slotA: null,
    slotB: 'B-3',
    muscle: 'Cơ lưng giữa (Mid Back), Xô',
    subMuscle: 'Vai sau, Tay trước',
    equip: 'Máy ngồi Row Machine (Tầng 1)',
    sets: 2,
    setsB: 3,
    repMin: 8,
    repMax: 10,
    rir: '1 - 2 RIR',
    restSec: 90,
    restLabel: '90 Giây',
    inc: 5,
    video: 'https://www.youtube.com/watch?v=3EP5HpKtJG0',
    image: 'https://www.muscleandstrength.com/exercises/middle-back',
    cues: 'Ngực tì đệm đỡ; Kéo khuỷu tay ra sau ép chặt 2 bả vai lại với nhau 1s; Trả về trước giãn bả vai.',
    mistakes: 'Dùng đà giật lưng rời khỏi đệm; Nhún vai co cổ.',
    alt: 'Seated Cable Row'
  },
  {
    id: 'EX10',
    name: 'Lateral Raise - Nâng vai ngang',
    shortName: 'Lateral Raise (Nâng vai ngang tạ đơn)',
    floor: 1,
    slot2F: 'T1-9A',
    slotA: null,
    slotB: 'B-4',
    muscle: 'Cơ vai giữa (Lateral Deltoid - Mở rộng vai)',
    subMuscle: 'Cầu vai',
    equip: 'Tạ đơn (Tầng 1)',
    sets: 2,
    setsB: 3,
    repMin: 12,
    repMax: 15,
    rir: '1 - 2 RIR',
    restSec: 60,
    restLabel: '60 Giây (Ghép 9B)',
    inc: 2.5,
    video: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    image: 'https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html',
    cues: 'Hơi đổ nhẹ người về trước 10°, dẫn hướng bằng cùi chỏ nâng ngang tầm vai; Hạ tạ chậm 2-3s.',
    mistakes: 'Dùng đà nhún chân giật tạ; Nhún cầu vai.',
    alt: 'Cable Lateral Raise'
  },
  {
    id: 'EX11',
    name: 'Hammer Curl - Cuộn tay trước búa',
    shortName: 'Hammer Curl (Cuộn bắp tay & Cẳng tay)',
    floor: 2,
    slot2F: 'T2-2',
    slotA: null,
    slotB: 'B-5',
    muscle: 'Cơ cánh tay quay (Brachioradialis), Biceps',
    subMuscle: 'Brachialis, Cẳng tay trên',
    equip: 'Máy cuộn bắp tay (Tầng 2) / Tạ đơn (Tầng 1)',
    sets: 2,
    repMin: 10,
    repMax: 12,
    rir: '0 - 1 RIR',
    restSec: 60,
    restLabel: '60 Giây',
    inc: 2.5,
    video: 'https://www.youtube.com/watch?v=HfSzuZPVlnA',
    image: 'https://www.muscleandstrength.com/exercises/biceps',
    cues: 'Trạm nghỉ 3p cho cơ Ngực ở Tầng 2! Hiệp 1 cầm kiểu Búa (Hammer), Hiệp 2 có thể cầm Sấp tay (Reverse Curl) để bơm tối đa khối cơ gồ sát khuỷu tay!',
    mistakes: 'Đung đưa khuỷu tay lấy đà; Thả tạ rơi tự do.',
    alt: 'Reverse Barbell/Dumbbell Curl'
  },
  {
    id: 'EX12',
    name: 'Ab Crunch Machine - Gập bụng với máy',
    shortName: 'Ab Crunch Machine (Máy gập bụng)',
    floor: 2,
    slot2F: 'T2-3',
    slotA: 'Opt',
    slotB: 'B-6',
    muscle: 'Cơ bụng 6 múi (Rectus Abdominis)',
    subMuscle: 'Cơ liên sườn (Obliques)',
    equip: 'Máy gập bụng (Tầng 2)',
    sets: 2,
    repMin: 12,
    repMax: 15,
    rir: '1 - 2 RIR',
    restSec: 60,
    restLabel: '60 Giây',
    inc: 5,
    video: 'https://www.youtube.com/watch?v=_O1xunCfYEM',
    image: 'https://www.muscleandstrength.com/exercises/ab-crunch-machine.html',
    cues: 'Trạm nghỉ tiếp theo cho cơ Ngực ở Tầng 2! Thở hết hơi ra khi cuộn tròn cột sống ngực gập xuống, siết cứng bụng 1s.',
    mistakes: 'Dùng lực tay/vai đè máy hoặc gập hông mà không cuộn lưng.',
    alt: 'Cable Kneeling Crunch'
  },
  {
    id: 'EX13',
    name: 'Reverse Wrist Curl - Cuộn cổ tay ngược',
    shortName: 'Reverse Wrist Curl (Cuộn cổ tay ngược)',
    floor: 1,
    slot2F: 'Opt',
    slotA: null,
    slotB: 'Opt',
    muscle: 'Cơ duỗi cổ tay (Mặt trên cẳng tay)',
    subMuscle: 'Brachioradialis',
    equip: 'Tạ đơn cuộn cổ tay ngược (Tầng 1)',
    sets: 2,
    repMin: 12,
    repMax: 20,
    rir: '0 - 1 RIR',
    restSec: 45,
    restLabel: '45 Giây',
    inc: 2.5,
    video: 'https://www.youtube.com/watch?v=hCMC4Vh2g_s',
    image: 'https://www.muscleandstrength.com/exercises/forearms',
    cues: 'Úp sấp lòng bàn tay, tì cẳng tay lên đùi/ghế, vểnh mu bàn tay lên cao hết cỡ giữ 1s để nổi rõ các thớ cơ và đường gân mặt ngoài cẳng tay.',
    mistakes: 'Dùng tạ quá nặng gây mỏi khớp cổ tay; Nhấc cả cánh tay.',
    alt: 'Overhand Wrist Roller'
  }
];

// Initial Workout Logs from Live Google Sheet (up to 26/10/2026)
const INITIAL_LOGS = [
  { date: '23/09/2026', week: 1, workout: 'Workout B', exercise: 'Incline Chest Press - Ghế nghiêng đẩy ngực trên máy', weight: 60, reps: 24, volume: 1440, rir: '1 - 2 RIR', nextWeight: 65, note: '' },
  { date: '23/09/2026', week: 1, workout: 'Workout A', exercise: 'Leg Press - Đạp đùi', weight: 100, reps: 24, volume: 2400, rir: '1 - 2 RIR', nextWeight: 105, note: '' },
  { date: '23/09/2026', week: 1, workout: 'Workout B', exercise: 'Machine Shoulder Press - Đẩy vai máy', weight: 10, reps: 24, volume: 2400, rir: '1 - 2 RIR', nextWeight: 15, note: '' },
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

// Initial Body Measurements from Live Google Sheet (up to 06/11/2026)
const INITIAL_BODY = [
  { date: '23/09/2026', weight: 75.0, waist: '', chest: '', arm: '', forearm: '', thigh: '', bf: '', note: 'Khởi đầu đo lường tuần 1 (Mốc cơ sở)' },
  { date: '01/10/2026', weight: 73.0, waist: '', chest: '', arm: '', forearm: '', thigh: '', bf: '', note: 'Tăng cân nạc, cẳng tay và bắp tay dày hơn, eo giảm nhẹ' },
  { date: '14/10/2026', weight: 75.0, waist: '', chest: '', arm: '', forearm: '', thigh: '', bf: '', note: 'Cơ thể dày hơn rõ rệt, grip và cẳng tay rất khỏe' },
  { date: '22/10/2026', weight: 73.0, waist: '', chest: '', arm: '', forearm: '', thigh: '', bf: '', note: '' },
  { date: '06/11/2026', weight: 74.0, waist: '', chest: '', arm: '', forearm: '', thigh: '', bf: '', note: 'Cập nhật từ Google Sheet' }
];

// 8-Week Zone 2 Running Plan
const ZONE2_PLAN = [
  { week: 'Tuần 1', structure: 'Đi bộ nhanh 2p + Chạy chậm 1p (× 7 lần)', duration: '21 phút', dist: '2.0 - 2.5 km', zone: 'Zone 1 - 2', goal: 'Làm quen nhịp tim, thích nghi khớp và dây chằng' },
  { week: 'Tuần 2', structure: 'Đi bộ nhanh 1.5p + Chạy chậm 1.5p (× 8 lần)', duration: '24 phút', dist: '2.5 - 2.8 km', zone: 'Zone 2', goal: 'Tăng thời gian chạy, kiểm soát nhịp thở ổn định' },
  { week: 'Tuần 3', structure: 'Đi bộ nhanh 1p + Chạy chậm 2p (× 8 lần)', duration: '25 phút', dist: '2.8 - 3.2 km', zone: 'Zone 2', goal: 'Kích hoạt chuyển hóa chất béo, quen guồng chân' },
  { week: 'Tuần 4', structure: 'Đi bộ nhanh 1p + Chạy chậm 3p (× 7 lần)', duration: '28 phút', dist: '3.2 - 3.5 km', zone: 'Zone 2', goal: 'Tăng sức bền hiếu khí, giữ form thân trên thả lỏng' },
  { week: 'Tuần 5', structure: 'Đi bộ KĐ 3p + Chạy liên tục 22p + Đi bộ hạ nhiệt 2p', duration: '27 phút', dist: '3.5 - 3.8 km', zone: 'Zone 2', goal: 'Chuyển sang chạy liên tục không cần ngắt quãng' },
  { week: 'Tuần 6', structure: 'Đi bộ KĐ 3p + Chạy liên tục 25p + Đi bộ hạ nhiệt 2p', duration: '30 phút', dist: '4.0 km', zone: 'Zone 2', goal: 'Củng cố mốc 4 km liên tục, duy trì nhịp tim Zone 2' },
  { week: 'Tuần 7', structure: 'Đi bộ KĐ 2p + Chạy liên tục 30p + Đi bộ hạ nhiệt 2p', duration: '34 phút', dist: '4.5 km', zone: 'Zone 2', goal: 'Tăng thể tích oxy hiếu khí và sức bền cơ bắp chân' },
  { week: 'Tuần 8', structure: 'Khởi động 2p + Chạy 5 km liên tục tốc độ Zone 2', duration: '35 - 38 phút', dist: '5.0 km', zone: 'Zone 2', goal: 'Chinh phục mốc 5 km bền bỉ, tối ưu giảm mỡ & giữ cơ' }
];

const INITIAL_CARDIO_LOGS = [
  { date: '24/09/2026', day: 'Thứ 5', week: 'Tuần 1', duration: 21, dist: 2.2, hr: 'RPE 4 (128 bpm)', status: 'Hoàn thành', note: 'Buổi đầu tiên làm quen, chạy xen kẽ đi bộ nhẹ nhàng' },
  { date: '26/09/2026', day: 'Thứ 7', week: 'Tuần 1', duration: 21, dist: 2.4, hr: 'RPE 4 (130 bpm)', status: 'Hoàn thành', note: 'Guồng chân đều, khớp gối và cổ chân hoàn toàn ổn định' }
];

// App State
let state = {
  activeTab: 'today',
  workoutMode: '2FLOOR', // '2FLOOR' | 'WORKOUT_A' | 'WORKOUT_B'
  warmupDone: false,
  finisherDone: false,
  farmerHoldDone: false,
  todaySession: {}, // keyed by exercise.id -> { weight, sets: [{reps, done}], rir, note }
  logs: [...INITIAL_LOGS],
  body: [...INITIAL_BODY],
  cardioLogs: [...INITIAL_CARDIO_LOGS],
  webhookUrl: '',
  lastSync: '06/11/2026',
  libFilter: 'ALL'
};

// Load saved state from localStorage
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
        cardioLogs: parsed.cardioLogs && parsed.cardioLogs.length ? parsed.cardioLogs : [...INITIAL_CARDIO_LOGS]
      };
    }
  } catch (e) {
    console.warn('Could not read localStorage', e);
  }
  initTodayDefaults();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save state', e);
  }
}

// Compute stats for an exercise based on logs
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
      sessions: 0,
      lastDate: '—',
      status: 'CHƯA TẬP',
      pctChange: 0
    };
  }
  const first = matches[0];
  const last = matches[matches.length - 1];
  const prWeight = Math.max(...matches.map(m => Number(m.weight) || 0));
  const recWeight = Number(last.nextWeight) || (Number(last.weight) + ex.inc);
  const firstW = Number(first.weight) || 0;
  const lastW = Number(last.weight) || 0;
  const pctChange = firstW > 0 ? Math.round(((lastW - firstW) / firstW) * 100) : 0;

  let status = 'HOLD';
  if (lastW > firstW || Number(last.volume) > Number(first.volume)) {
    status = 'PROGRESSING';
  } else if (matches.length >= 3) {
    status = 'PLATEAU';
  }

  return {
    firstWeight: firstW,
    lastWeight: lastW,
    prWeight,
    lastReps: last.reps,
    recWeight,
    sessions: matches.length,
    lastDate: last.date,
    status,
    pctChange
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
    if (!state.todaySession[ex.id]) {
      state.todaySession[ex.id] = {
        weight: stats.recWeight,
        sets: Array.from({ length: 3 }, () => ({ reps: ex.repMax, done: false })),
        rir: ex.rir,
        note: ''
      };
    } else {
      while (state.todaySession[ex.id].sets.length < numSets) {
        state.todaySession[ex.id].sets.push({ reps: ex.repMax, done: false });
      }
    }
  });
}

// Get ordered list of exercises for active mode
function getTodayExercises() {
  if (state.workoutMode === '2FLOOR') {
    const order = ['EX08', 'EX11', 'EX12', 'EX02', 'EX01', 'EX03', 'EX09', 'EX04', 'EX10', 'EX05', 'EX06', 'EX13'];
    return order.map(id => EXERCISES.find(e => e.id === id)).filter(Boolean);
  }
  if (state.workoutMode === 'WORKOUT_A') {
    const order = ['EX01', 'EX02', 'EX03', 'EX04', 'EX05', 'EX06', 'EX12'];
    return order.map(id => EXERCISES.find(e => e.id === id)).filter(Boolean);
  }
  if (state.workoutMode === 'WORKOUT_B') {
    const order = ['EX07', 'EX08', 'EX09', 'EX10', 'EX11', 'EX12', 'EX13'];
    return order.map(id => EXERCISES.find(e => e.id === id)).filter(Boolean);
  }
  return EXERCISES;
}

function getSlotLabel(ex) {
  if (state.workoutMode === '2FLOOR') return ex.slot2F || 'Opt';
  if (state.workoutMode === 'WORKOUT_A') return ex.slotA || 'Opt';
  if (state.workoutMode === 'WORKOUT_B') return ex.slotB || 'Opt';
  return ex.id;
}

// Rest Countdown Timer + Web Audio API Beep
let timerInterval = null;
let timerRemaining = 0;
let timerContextLabel = 'Nghỉ giữa hiệp';

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.22, 0.44].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.35, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.19);
    });
  } catch (e) {}
  if (navigator.vibrate) {
    navigator.vibrate([250, 120, 250, 120, 350]);
  }
}

function startRestTimer(seconds, label = 'Nghỉ giữa hiệp') {
  clearInterval(timerInterval);
  timerRemaining = seconds;
  timerContextLabel = label;
  const bar = document.getElementById('restTimerBar');
  if (bar) bar.classList.add('active');
  updateTimerUI();

  timerInterval = setInterval(() => {
    timerRemaining--;
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRemaining = 0;
      updateTimerUI();
      playBeep();
      showToast(`🔔 Hết giờ: ${timerContextLabel}! Vào hiệp tiếp theo!`);
      setTimeout(() => {
        if (bar) bar.classList.remove('active');
      }, 2500);
    } else {
      updateTimerUI();
    }
  }, 1000);
}

function adjustTimer(delta) {
  timerRemaining = Math.max(0, timerRemaining + delta);
  updateTimerUI();
}

function stopTimer() {
  clearInterval(timerInterval);
  const bar = document.getElementById('restTimerBar');
  if (bar) bar.classList.remove('active');
}

function updateTimerUI() {
  const m = String(Math.floor(timerRemaining / 60)).padStart(2, '0');
  const s = String(timerRemaining % 60).padStart(2, '0');
  const timeEl = document.getElementById('timerTime');
  const lblEl = document.getElementById('timerLabel');
  if (timeEl) timeEl.textContent = `${m}:${s}`;
  if (lblEl) lblEl.textContent = timerContextLabel;
}

// Toast helper
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

// Live Google Sheet CSV parser (CORS enabled via gviz/tq)
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cur.trim());
        cur = '';
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && next === '\n') i++;
        row.push(cur.trim());
        rows.push(row);
        row = [];
        cur = '';
      } else {
        cur += ch;
      }
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur.trim());
    rows.push(row);
  }
  return rows;
}

async function syncFromGoogleSheet(silent = false) {
  if (!silent) showToast('🔄 Đang đồng bộ dữ liệu từ Google Sheet...');
  try {
    // 1. Fetch Workout Log
    const logUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('Workout Log')}&t=${Date.now()}`;
    const resLog = await fetch(logUrl);
    if (resLog.ok) {
      const csvText = await resLog.text();
      const rows = parseCSV(csvText);
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
        // Merge sheetLogs with any newer local-only logs
        const keySet = new Set(sheetLogs.map(l => `${l.date}|${l.exercise}|${l.weight}|${l.reps}`));
        const localExtra = state.logs.filter(l => l.isLocal && !keySet.has(`${l.date}|${l.exercise}|${l.weight}|${l.reps}`));
        state.logs = [...sheetLogs, ...localExtra];
      }
    }

    // 2. Fetch Body Measurements
    const bodyUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('Body Measurements')}&t=${Date.now()}`;
    const resBody = await fetch(bodyUrl);
    if (resBody.ok) {
      const csvText = await resBody.text();
      const rows = parseCSV(csvText);
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
          chest: r[3] || '',
          arm: r[4] || '',
          forearm: r[5] || '',
          thigh: r[6] || '',
          bf: r[7] || '',
          note: r[8] || ''
        });
      }
      if (sheetBody.length > 0) {
        const localBodyExtra = state.body.filter(b => b.isLocal);
        state.body = [...sheetBody, ...localBodyExtra];
      }
    }

    const now = new Date();
    state.lastSync = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} • ${now.toLocaleDateString('vi-VN')}`;
    saveState();
    render();
    if (!silent) showToast('✅ Đã đồng bộ mới nhất từ Google Sheet!');
  } catch (err) {
    console.warn('Sheet sync offline or error:', err);
    if (!silent) showToast('⚠️ Đang dùng dữ liệu Offline trên máy');
  }
}

// Actions for Today Workout
function setWorkoutMode(mode) {
  state.workoutMode = mode;
  initTodayDefaults();
  saveState();
  render();
}

function stepWeight(exId, delta) {
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
  const s = state.todaySession[exId];
  if (!s) return;
  s.weight = recVal;
  saveState();
  render();
  showToast(`⚡ Đã áp dụng mức tạ đề xuất: ${recVal} kg`);
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
    startRestTimer(ex.restSec, `Nghỉ ${ex.shortName} (Hiệp ${setIdx + 1})`);
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
    const allHitMin = activeSets.length >= numSets && activeSets.every(st => Number(st.reps) >= ex.repMin);
    const nextW = allHitMin ? w + ex.inc : w;

    newRows.push({
      date: todayStr,
      week: Math.max(6, Math.ceil((state.logs.length + 1) / 6)),
      workout: state.workoutMode === '2FLOOR' ? 'Full-Body 2 Tầng' : state.workoutMode === 'WORKOUT_A' ? 'Workout A' : 'Workout B',
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
    showToast('⚠️ Hãy bấm "✓ Xong Hiệp" ít nhất 1 bài trước khi lưu!');
    return;
  }

  state.logs.push(...newRows);
  // Reset done flags for next session and update recommended weights
  newRows.forEach(r => {
    const ex = EXERCISES.find(e => e.name === r.exercise);
    if (ex && state.todaySession[ex.id]) {
      state.todaySession[ex.id].weight = r.nextWeight;
      state.todaySession[ex.id].sets.forEach(st => { st.done = false; });
    }
  });
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
      showToast(`✅ Đã lưu ${newRows.length} bài & gửi lên Google Sheet!`);
      return;
    } catch (e) {
      console.warn('Webhook error:', e);
    }
  }
  showToast(`✅ Đã lưu ${newRows.length} bài tập vào Nhật ký trên máy!`);
}

// Copy workout rows as TSV for 1-tap paste into Google Sheet
function copyLogsTSV() {
  const recent = state.logs.slice(-12);
  const tsv = recent.map(r => [
    r.date, r.week, r.workout, r.exercise, r.weight, r.reps, r.volume, r.rir, r.nextWeight, r.note || ''
  ].join('\t')).join('\n');
  navigator.clipboard.writeText(tsv).then(() => {
    showToast('📋 Đã copy dữ liệu chuẩn cột Google Sheet!');
  });
}

// Body measurement logger
async function submitBodyMeasurement() {
  const w = parseFloat(document.getElementById('bmWeight')?.value);
  if (!w || isNaN(w)) {
    showToast('⚠️ Vui lòng nhập cân nặng (kg)!');
    return;
  }
  const entry = {
    date: new Date().toLocaleDateString('vi-VN'),
    weight: w,
    waist: document.getElementById('bmWaist')?.value || '',
    chest: document.getElementById('bmChest')?.value || '',
    arm: document.getElementById('bmArm')?.value || '',
    forearm: document.getElementById('bmForearm')?.value || '',
    thigh: document.getElementById('bmThigh')?.value || '',
    bf: document.getElementById('bmBf')?.value || '',
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
  showToast(`✅ Đã lưu cân nặng ${w} kg!`);
}

// Cardio logger
async function submitCardioLog() {
  const dur = parseFloat(document.getElementById('cdDur')?.value) || 25;
  const dist = parseFloat(document.getElementById('cdDist')?.value) || 3.0;
  const week = document.getElementById('cdWeek')?.value || 'Tuần 3';
  const hr = document.getElementById('cdHr')?.value || 'Zone 2 (~130 bpm)';
  const note = document.getElementById('cdNote')?.value || '';

  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const now = new Date();
  const entry = {
    date: now.toLocaleDateString('vi-VN'),
    day: days[now.getDay()],
    week,
    duration: dur,
    dist,
    hr,
    status: 'Hoàn thành',
    note,
    isLocal: true
  };
  state.cardioLogs.push(entry);
  saveState();
  render();

  if (state.webhookUrl) {
    try {
      await fetch(state.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'appendCardio',
          data: {
            date: entry.date,
            dayLabel: entry.day,
            weekLabel: entry.week,
            duration: entry.duration,
            distance: entry.dist,
            pace: dist > 0 ? `${Math.floor(dur / dist)}:${String(Math.round(((dur / dist) % 1) * 60)).padStart(2, '0')}` : '',
            hr: entry.hr,
            note: entry.note
          }
        })
      });
    } catch (e) {}
  }
  showToast(`🏃 Đã lưu buổi chạy ${dist} km (${dur} phút)!`);
}

// Render Functions
function renderTodayTab() {
  const exList = getTodayExercises();
  const latestBody = state.body[state.body.length - 1] || { weight: 74.0 };
  let totalCompletedSets = 0;
  let totalTargetSets = 0;
  let todayVolume = 0;

  exList.forEach(ex => {
    const numSets = getTargetSetsCount(ex);
    totalTargetSets += numSets;
    const s = state.todaySession[ex.id];
    if (s) {
      s.sets.slice(0, numSets).forEach(st => {
        if (st.done) {
          totalCompletedSets++;
          todayVolume += (Number(s.weight) || 0) * (Number(st.reps) || 0);
        }
      });
    }
  });

  const pctDone = totalTargetSets > 0 ? Math.round((totalCompletedSets / totalTargetSets) * 100) : 0;

  let cardsHtml = '';
  let currentFloorGroup = null;

  exList.forEach(ex => {
    if (state.workoutMode === '2FLOOR' && ex.floor !== currentFloorGroup) {
      currentFloorGroup = ex.floor;
      if (currentFloorGroup === 2) {
        cardsHtml += `
          <div class="floor-banner floor-2">
            <span>🔥 CHẶNG 1: TẦNG 2 (NGỰC • BẮP TAY • BỤNG)</span>
            <span>~18 Phút</span>
          </div>
        `;
      } else {
        cardsHtml += `
          <div class="floor-banner floor-1">
            <span>⚡ CHẶNG 2: ĐI XUỐNG TẦNG 1 (CHÂN • LƯNG • VAI • CỔ TAY)</span>
            <span>~30 Phút • Về luôn</span>
          </div>
        `;
      }
    }

    const stats = getExerciseStats(ex);
    const numSets = getTargetSetsCount(ex);
    const s = state.todaySession[ex.id] || { weight: stats.recWeight, sets: [] };
    const doneSetsCount = s.sets.slice(0, numSets).filter(st => st.done).length;
    const isCardDone = doneSetsCount >= numSets;
    const slotLabel = getSlotLabel(ex);

    let setsHtml = '';
    for (let i = 0; i < numSets; i++) {
      const st = s.sets[i] || { reps: ex.repMax, done: false };
      setsHtml += `
        <div class="set-box ${st.done ? 'set-done' : ''}">
          <div class="set-top">
            <span>HIỆP ${i + 1}</span>
            <span>Mục tiêu ${ex.repMin}-${ex.repMax}</span>
          </div>
          <div class="set-reps-wrap">
            <input type="number" inputmode="numeric" class="set-reps-input" value="${st.reps}"
              onchange="updateSetReps('${ex.id}', ${i}, this.value)" aria-label="Số reps hiệp ${i + 1}">
          </div>
          <button class="set-check-btn" onclick="toggleSetDone('${ex.id}', ${i})">
            ${st.done ? '✓ Đã xong' : '○ Bấm xong'}
          </button>
        </div>
      `;
    }

    cardsHtml += `
      <div class="card ${isCardDone ? 'done-card' : ''}">
        <div class="ex-header">
          <div>
            <div class="ex-badges">
              <span class="badge ${ex.floor === 2 ? 'badge-f2' : 'badge-f1'}">${slotLabel} • TẦNG ${ex.floor}</span>
              <span class="badge badge-green">${numSets} Hiệp × ${ex.repMin}-${ex.repMax} Reps</span>
              <span class="badge badge-purple">${ex.rir}</span>
              ${stats.prWeight > 0 ? `<span class="badge badge-f2">PR: ${stats.prWeight}kg</span>` : ''}
            </div>
            <div class="ex-title">${ex.name}</div>
            <div class="ex-equip">📍 ${ex.equip} • 🎯 ${ex.muscle}</div>
          </div>
          <button class="btn-icon" onclick="startRestTimer(${ex.restSec}, 'Nghỉ ${ex.shortName}')" title="Bấm giờ nghỉ">
            ⏱️ ${ex.restSec}s
          </button>
        </div>

        <div class="ex-meta-grid">
          <div class="meta-box">
            <div class="m-lbl">Tạ buổi trước</div>
            <div class="m-val">${stats.lastWeight > 0 ? `${stats.lastWeight} kg` : 'Chưa có'}</div>
          </div>
          <div class="meta-box">
            <div class="m-lbl">Reps trước (${stats.lastDate})</div>
            <div class="m-val">${stats.lastReps > 0 ? `${stats.lastReps} reps` : '—'}</div>
          </div>
          <div class="meta-box rec" onclick="applyRecWeight('${ex.id}', ${stats.recWeight})" style="cursor:pointer;">
            <div class="m-lbl">Đề xuất hôm nay 👆</div>
            <div class="m-val">${stats.recWeight} kg</div>
          </div>
        </div>

        <div class="input-row">
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);">Tạ thực tế (kg):</div>
          <div class="weight-control" style="justify-content:flex-end;">
            <button class="step-btn" onclick="stepWeight('${ex.id}', -${ex.inc})">-${ex.inc}</button>
            <input type="number" step="0.5" inputmode="decimal" class="weight-input" value="${s.weight}"
              onchange="updateWeightInput('${ex.id}', this.value)">
            <button class="step-btn" onclick="stepWeight('${ex.id}', ${ex.inc})">+${ex.inc}</button>
          </div>
        </div>

        <div class="sets-grid">
          ${setsHtml}
        </div>

        <div class="ex-cues">
          💡 <strong>Kỹ thuật:</strong> ${ex.cues}
        </div>

        <div class="ex-links">
          <div style="display:flex;gap:6px;">
            <a href="${ex.video}" target="_blank" rel="noopener" class="btn-outline">▶ Video mẫu</a>
            <a href="${ex.image}" target="_blank" rel="noopener" class="btn-outline">🖼️ Hình cơ</a>
          </div>
          <span style="font-size:11px;color:var(--text-muted);font-weight:700;">
            ${doneSetsCount}/${numSets} hiệp • Vol: ${(Number(s.weight) || 0) * s.sets.slice(0, numSets).filter(x => x.done).reduce((a, b) => a + Number(b.reps), 0)} kg
          </span>
        </div>
      </div>
    `;
  });

  return `
    <!-- Mode Switcher -->
    <div class="mode-switcher">
      <button class="mode-btn ${state.workoutMode === '2FLOOR' ? 'active' : ''}" onclick="setWorkoutMode('2FLOOR')">
        🔥 2 Tầng (T2→T1)<br><span style="font-size:10px;opacity:0.85;">Full-Body 55p</span>
      </button>
      <button class="mode-btn ${state.workoutMode === 'WORKOUT_A' ? 'active' : ''}" onclick="setWorkoutMode('WORKOUT_A')">
        ⚡ Buổi A<br><span style="font-size:10px;opacity:0.85;">Chân/Ngực/Xô 45p</span>
      </button>
      <button class="mode-btn ${state.workoutMode === 'WORKOUT_B' ? 'active' : ''}" onclick="setWorkoutMode('WORKOUT_B')">
        💪 Buổi B<br><span style="font-size:10px;opacity:0.85;">Đùi sau/Lưng 45p</span>
      </button>
    </div>

    <!-- Summary Strip -->
    <div class="summary-strip">
      <div class="stat-pill">
        <div class="lbl">Tiến độ</div>
        <div class="val">${totalCompletedSets}/${totalTargetSets}</div>
        <div class="sub">${pctDone}% hiệp</div>
      </div>
      <div class="stat-pill">
        <div class="lbl">Volume hôm nay</div>
        <div class="val">${todayVolume.toLocaleString('vi-VN')}</div>
        <div class="sub">kg tạ</div>
      </div>
      <div class="stat-pill">
        <div class="lbl">Cân nặng</div>
        <div class="val">${latestBody.weight} kg</div>
        <div class="sub">Đích: 62 kg</div>
      </div>
      <div class="stat-pill" onclick="syncFromGoogleSheet(false)" style="cursor:pointer;">
        <div class="lbl">Google Sheet</div>
        <div class="val">🔄 Đồng bộ</div>
        <div class="sub">Chạm cập nhật</div>
      </div>
    </div>

    <!-- Warm-up Card (Floor 2) -->
    <div class="card ${state.warmupDone ? 'done-card' : ''}">
      <div class="ex-header" style="margin-bottom:4px;">
        <div>
          <span class="badge badge-f2">KHỞI ĐỘNG TẦNG 2 • 4 PHÚT</span>
          <div class="ex-title" style="margin-top:4px;">🚴 Đạp Xe 3 Phút + 🥊 Đấm Bao Cát Nhẹ 1 Phút</div>
          <div class="ex-equip">Làm nóng khớp gối, khớp vai, cổ tay & tăng nhịp tim lên 110-120 bpm trước khi đẩy ngực nặng.</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
        <button class="btn-outline" onclick="startRestTimer(180, 'Khởi động: Đạp xe Tầng 2 (3 phút)')">⏱️ Bấm 3p Đạp Xe</button>
        <button class="btn-outline" onclick="startRestTimer(60, 'Khởi động: Đấm bao cát nhẹ (1 phút)')">🥊 Bấm 1p Bao Cát</button>
        <button class="btn-emerald" style="padding:8px 12px;font-size:12px;margin-left:auto;"
          onclick="state.warmupDone=!state.warmupDone;saveState();render();">
          ${state.warmupDone ? '✓ Đã khởi động' : '○ Hoàn thành KĐ'}
        </button>
      </div>
    </div>

    <!-- Exercise Cards -->
    ${cardsHtml}

    <!-- Forearm Vein & Finisher Protocol Card -->
    <div class="card ${state.finisherDone ? 'done-card' : ''}">
      <div class="ex-badges">
        <span class="badge badge-green">ĐỘ CẲNG TAY NỔI GÂN & CARDIO ĐỐT MỠ CUỐI BUỔI (10 PHÚT)</span>
      </div>
      <div class="ex-title">🔥 Phác Đồ Chốt Hạ: Farmer's Hold + Cardio Theo Thứ</div>
      <div class="ex-cues" style="margin-top:8px;">
        <div><strong>1. Bơm Cẳng Tay Nổi Gân (Ngay sau bài Cổ tay ở Tầng 1):</strong> Xách 2 quả tạ đơn nặng nhất có thể (20–30kg/tay), đứng thẳng gồng chặt bàn tay giữ tĩnh <strong>45 giây × 2 hiệp</strong>.</div>
        <div style="margin-top:6px;"><strong>2. Cardio Đốt Mỡ Nội Tạng 10 Phút:</strong></div>
        <ul style="padding-left:18px;margin-top:4px;">
          <li><strong>Thứ 2 & Thứ 6 (Tại Tầng 1):</strong> Đi bộ dốc trên máy chạy bộ <strong>Độ dốc (Incline) 10% • Tốc độ 4.8 - 5.0 km/h • 10 phút</strong> (Không vịn tay cầm).</li>
          <li><strong>Thứ 4 (Tại Tầng 2):</strong> Quật dây thừng <strong>Battle Ropes</strong> (30s quật / 30s nghỉ × 3 hiệp) + <strong>Đấm & Đá thấp bao cát</strong> (Combo 2 Đấm - 1 Đá 2p × 2 hiệp) + <strong>Máy rung</strong> 3 phút.</li>
        </ul>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">
        <button class="btn-amber" onclick="startRestTimer(45, 'Xách tạ nặng Farmer Hold (45 giây)')">✊ Bấm 45s Xách Tạ</button>
        <button class="btn-outline" onclick="startRestTimer(600, 'Đi bộ dốc 10% - Tốc 5.0 (10 phút)')">🚶 10p Đi Bộ Dốc</button>
        <button class="btn-outline" onclick="startRestTimer(30, 'Quật dây thừng Battle Ropes (30 giây)')">〰️ 30s Dây Thừng</button>
        <button class="btn-outline" onclick="startRestTimer(120, 'Hiệp Đấm-Đá Bao Cát (2 phút)')">🥊 2p Bao Cát</button>
      </div>
    </div>

    <!-- Save Workout Button -->
    <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px;">
      <button class="btn-emerald" style="width:100%;padding:15px;font-size:15px;" onclick="saveTodayWorkout()">
        💾 LƯU BUỔI TẬP HÔM NAY & ĐỒNG BỘ SHEET
      </button>
      <div style="display:flex;gap:8px;">
        <button class="btn-outline" style="flex:1;padding:11px;" onclick="copyLogsTSV()">
          📋 Copy Dữ Liệu Dán Sheet
        </button>
        <a href="${SHEET_URL}" target="_blank" rel="noopener" class="btn-outline" style="flex:1;padding:11px;">
          📊 Mở Google Sheet Gốc
        </a>
      </div>
    </div>
  `;
}

function renderProgressTab() {
  const startWeight = 78.0;
  const baseSheetWeight = 75.0;
  const targetWeight = 62.0;
  const latestBody = state.body[state.body.length - 1] || { weight: 74.0, date: '06/11/2026' };
  const currentW = Number(latestBody.weight) || 74.0;
  const lostSoFar = Math.max(0, startWeight - currentW);
  const totalToLose = startWeight - targetWeight;
  const weightProgPct = Math.min(100, Math.max(5, Math.round((lostSoFar / totalToLose) * 100)));
  const bmi = (currentW / (1.63 * 1.63)).toFixed(1);

  const uniqueDates = new Set(state.logs.map(l => l.date)).size;
  const totalVolume = state.logs.reduce((acc, l) => acc + (Number(l.volume) || 0), 0);

  let progCount = 0;
  let holdCount = 0;
  let rowsHtml = '';

  EXERCISES.forEach(ex => {
    const st = getExerciseStats(ex);
    if (st.status === 'PROGRESSING') progCount++;
    if (st.status === 'HOLD') holdCount++;

    const badgeClass = st.status === 'PROGRESSING' ? 'badge-green' : st.status === 'PLATEAU' ? 'badge-rose' : 'badge-f2';
    rowsHtml += `
      <div class="card" style="padding:12px;margin-bottom:9px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <div>
            <div style="font-size:14px;font-weight:800;">${ex.name}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">
              Tầng ${ex.floor} • Đã tập: ${st.sessions} buổi (Gần nhất: ${st.lastDate})
            </div>
          </div>
          <span class="badge ${badgeClass}">${st.status}</span>
        </div>
        <div class="ex-meta-grid" style="margin:8px 0 0 0;">
          <div class="meta-box">
            <div class="m-lbl">Khởi điểm</div>
            <div class="m-val">${st.firstWeight > 0 ? `${st.firstWeight} kg` : '—'}</div>
          </div>
          <div class="meta-box">
            <div class="m-lbl">Hiện tại / PR</div>
            <div class="m-val">${st.lastWeight > 0 ? `${st.lastWeight}kg (PR ${st.prWeight}kg)` : '—'}</div>
          </div>
          <div class="meta-box rec">
            <div class="m-lbl">Mục tiêu tới</div>
            <div class="m-val">${st.recWeight} kg</div>
          </div>
        </div>
      </div>
    `;
  });

  const recentLogsHtml = [...state.logs].reverse().slice(0, 20).map(l => `
    <div class="log-row">
      <div>
        <div style="font-weight:700;color:var(--text-main);">${l.exercise}</div>
        <div style="font-size:11px;color:var(--text-muted);">${l.date} • ${l.workout}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:800;color:var(--emerald);">${l.weight} kg × ${l.reps} reps</div>
        <div style="font-size:11px;color:var(--text-muted);">Vol: ${Number(l.volume).toLocaleString('vi-VN')} kg</div>
      </div>
    </div>
  `).join('');

  return `
    <!-- Body Recomposition Card -->
    <div class="card">
      <div class="ex-badges">
        <span class="badge badge-green">BODY RECOMPOSITION (TĂNG CƠ - GIẢM MỠ)</span>
        <span class="badge badge-f1">Cao 1m63 • BMI ${bmi}</span>
      </div>
      <div class="ex-title">🎯 Hành Trình Cân Nặng: ${startWeight} kg → ${currentW} kg → Đích ${targetWeight} kg</div>
      <div class="prog-track" style="margin:10px 0;">
        <div class="prog-fill" style="width:${weightProgPct}%;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">
        <span>Bắt đầu: ${startWeight}kg (Sheet: ${baseSheetWeight}kg)</span>
        <span style="color:var(--emerald);font-weight:700;">Đã giảm: -${lostSoFar.toFixed(1)} kg (${weightProgPct}%)</span>
        <span>Đích: ${targetWeight}kg (BMI 23.3)</span>
      </div>
      <div class="ex-meta-grid" style="margin-top:10px;margin-bottom:0;">
        <div class="meta-box">
          <div class="m-lbl">Tổng số buổi</div>
          <div class="m-val">${uniqueDates} buổi</div>
        </div>
        <div class="meta-box">
          <div class="m-lbl">Tổng Volume</div>
          <div class="m-val">${totalVolume.toLocaleString('vi-VN')} kg</div>
        </div>
        <div class="meta-box rec">
          <div class="m-lbl">Đang tăng tải</div>
          <div class="m-val">${progCount} bài (${holdCount} Hold)</div>
        </div>
      </div>
    </div>

    <div class="floor-banner floor-1">
      <span>📊 TIẾN ĐỘ TĂNG TẢI 13 BÀI TẬP (PROGRESS)</span>
      <span>Tự động tính PR</span>
    </div>
    ${rowsHtml}

    <div class="floor-banner floor-2">
      <span>📝 NHẬT KÝ TẬP LUYỆN GẦN NHẤT (WORKOUT LOG)</span>
      <span>${state.logs.length} dòng</span>
    </div>
    <div class="card">
      ${recentLogsHtml}
    </div>
  `;
}

function renderCardioBodyTab() {
  const bodyRowsHtml = [...state.body].reverse().map(b => `
    <div class="log-row">
      <div>
        <div style="font-weight:700;">📅 ${b.date}</div>
        <div style="font-size:11px;color:var(--text-muted);">${b.note || 'Đo định kỳ'}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:800;font-size:14px;color:var(--emerald);">${b.weight} kg</div>
        <div style="font-size:11px;color:var(--text-muted);">
          ${b.waist ? `Eo ${b.waist}cm ` : ''}${b.forearm ? `• Cẳng tay ${b.forearm}cm` : ''}
        </div>
      </div>
    </div>
  `).join('');

  const z2RowsHtml = ZONE2_PLAN.map(p => `
    <div class="log-row" style="align-items:flex-start;flex-direction:column;gap:4px;">
      <div style="display:flex;justify-content:space-between;width:100%;">
        <span style="font-weight:800;color:var(--amber);">${p.week} (${p.dist})</span>
        <span class="badge badge-f1">${p.duration} • ${p.zone}</span>
      </div>
      <div style="font-size:12px;color:var(--text-main);font-weight:600;">🏃 ${p.structure}</div>
      <div style="font-size:11px;color:var(--text-muted);">🎯 ${p.goal}</div>
    </div>
  `).join('');

  const cardioHistHtml = [...state.cardioLogs].reverse().map(c => `
    <div class="log-row">
      <div>
        <div style="font-weight:700;">${c.date} (${c.day} • ${c.week})</div>
        <div style="font-size:11px;color:var(--text-muted);">${c.note || c.hr}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:800;color:var(--emerald);">${c.dist} km • ${c.duration}p</div>
        <div style="font-size:11px;color:var(--text-muted);">${c.status}</div>
      </div>
    </div>
  `).join('');

  return `
    <!-- Body Measurement Input Card -->
    <div class="card">
      <div class="ex-badges">
        <span class="badge badge-green">CẬP NHẬT CÂN NẶNG & SỐ ĐO CƠ THỂ (BODY MEASUREMENTS)</span>
      </div>
      <div class="ex-title" style="margin-bottom:10px;">⚖️ Nhập Cân Nặng & Vòng Đo Hôm Nay</div>
      <div class="form-grid-2">
        <div class="field-group">
          <label>Cân nặng (kg) *</label>
          <input type="number" step="0.1" inputmode="decimal" id="bmWeight" placeholder="VD: 73.0">
        </div>
        <div class="field-group">
          <label>Vòng eo (cm)</label>
          <input type="number" step="0.5" inputmode="decimal" id="bmWaist" placeholder="VD: 82">
        </div>
        <div class="field-group">
          <label>Cẳng tay (cm)</label>
          <input type="number" step="0.2" inputmode="decimal" id="bmForearm" placeholder="VD: 31.5">
        </div>
        <div class="field-group">
          <label>Bắp tay (cm)</label>
          <input type="number" step="0.2" inputmode="decimal" id="bmArm" placeholder="VD: 36">
        </div>
        <div class="field-group">
          <label>Vòng ngực (cm)</label>
          <input type="number" step="0.5" inputmode="decimal" id="bmChest" placeholder="VD: 98">
        </div>
        <div class="field-group">
          <label>Tỷ lệ mỡ (%)</label>
          <input type="number" step="0.5" inputmode="decimal" id="bmBf" placeholder="VD: 22">
        </div>
      </div>
      <div class="field-group" style="margin-bottom:10px;">
        <label>Ghi chú cơ thể</label>
        <input type="text" id="bmNote" placeholder="VD: Cẳng tay nổi gân rõ, bụng nhẹ hơn">
      </div>
      <button class="btn-emerald" style="width:100%;" onclick="submitBodyMeasurement()">
        💾 Lưu Cân Nặng & Số Đo
      </button>
    </div>

    <div class="card">
      <div class="ex-title" style="margin-bottom:6px;">📈 Lịch Sử Cân Nặng (Mục tiêu: 62.0 kg)</div>
      ${bodyRowsHtml}
    </div>

    <!-- Morning Cardio Logger -->
    <div class="card">
      <div class="ex-badges">
        <span class="badge badge-f2">CHẠY BỘ SÁNG THỨ 3 - 5 - 7 (ZONE 2 CARDIO)</span>
      </div>
      <div class="ex-title" style="margin-bottom:10px;">🏃 Check-in Buổi Chạy Sáng / Cardio</div>
      <div class="form-grid-2">
        <div class="field-group">
          <label>Tuần lộ trình</label>
          <select id="cdWeek">
            ${ZONE2_PLAN.map(p => `<option value="${p.week}">${p.week} (${p.dist})</option>`).join('')}
          </select>
        </div>
        <div class="field-group">
          <label>Thời gian (phút)</label>
          <input type="number" inputmode="numeric" id="cdDur" value="25">
        </div>
        <div class="field-group">
          <label>Cự ly (km)</label>
          <input type="number" step="0.1" inputmode="decimal" id="cdDist" value="3.0">
        </div>
        <div class="field-group">
          <label>Nhịp tim / RPE</label>
          <input type="text" id="cdHr" value="Zone 2 (130 bpm)">
        </div>
      </div>
      <div class="field-group" style="margin-bottom:10px;">
        <label>Ghi chú buổi chạy</label>
        <input type="text" id="cdNote" placeholder="VD: Hơi thở đều, khớp gối êm">
      </div>
      <button class="btn-amber" style="width:100%;" onclick="submitCardioLog()">
        ✓ Hoàn Thành Buổi Chạy Sáng
      </button>
    </div>

    <div class="card">
      <div class="ex-title" style="margin-bottom:6px;">🗓️ Lộ Trình 8 Tuần Chạy Bộ Zone 2 (0 → 5km)</div>
      ${z2RowsHtml}
    </div>

    <div class="card">
      <div class="ex-title" style="margin-bottom:6px;">📝 Nhật Ký Cardio Đã Tập</div>
      ${cardioHistHtml}
    </div>
  `;
}

function renderLibraryTab() {
  const filtered = EXERCISES.filter(ex => {
    if (state.libFilter === 'F2') return ex.floor === 2;
    if (state.libFilter === 'F1') return ex.floor === 1;
    return true;
  });

  const libCards = filtered.map(ex => `
    <div class="card">
      <div class="ex-badges">
        <span class="badge ${ex.floor === 2 ? 'badge-f2' : 'badge-f1'}">${ex.id} • TẦNG ${ex.floor}</span>
        <span class="badge badge-green">${ex.sets} Hiệp × ${ex.repMin}-${ex.repMax}</span>
        <span class="badge badge-purple">${ex.rir} • Nghỉ ${ex.restLabel}</span>
      </div>
      <div class="ex-title">${ex.name}</div>
      <div class="ex-equip">📍 Thiết bị: ${ex.equip}</div>
      <div class="ex-cues" style="margin-top:8px;">
        <div>🎯 <strong>Cơ chính:</strong> ${ex.muscle} (Phụ: ${ex.subMuscle})</div>
        <div style="margin-top:4px;">✅ <strong>Kỹ thuật chuẩn:</strong> ${ex.cues}</div>
        <div style="margin-top:4px;color:#FDA4AF;">⚠️ <strong>Lỗi cần tránh:</strong> ${ex.mistakes}</div>
        <div style="margin-top:4px;color:var(--sky);">🔄 <strong>Bài thay thế:</strong> ${ex.alt}</div>
      </div>
      <div style="display:flex;gap:8px;">
        <a href="${ex.video}" target="_blank" rel="noopener" class="btn-outline" style="flex:1;">▶ Xem Video YouTube</a>
        <a href="${ex.image}" target="_blank" rel="noopener" class="btn-outline" style="flex:1;">🖼️ Xem Giải Phẫu Cơ</a>
      </div>
    </div>
  `).join('');

  return `
    <div class="mode-switcher">
      <button class="mode-btn ${state.libFilter === 'ALL' ? 'active' : ''}" onclick="state.libFilter='ALL';render();">
        Tất cả (13 bài)
      </button>
      <button class="mode-btn ${state.libFilter === 'F2' ? 'active' : ''}" onclick="state.libFilter='F2';render();">
        Tầng 2 (4 bài)
      </button>
      <button class="mode-btn ${state.libFilter === 'F1' ? 'active' : ''}" onclick="state.libFilter='F1';render();">
        Tầng 1 (9 bài)
      </button>
    </div>

    <div class="card">
      <div class="ex-title">📐 Quy Tắc Tăng Tải (Progressive Overload) & RIR</div>
      <div class="ex-cues" style="margin-top:8px;margin-bottom:0;">
        <div>• <strong>RIR 1 - 2 (Bài chính):</strong> Dừng hiệp khi cảm nhận còn làm cố thêm được 1-2 cái chuẩn form. Giúp cơ phát triển tối đa mà không quá tải khớp.</div>
        <div style="margin-top:4px;">• <strong>RIR 0 - 1 (Cẳng tay / Tay trước):</strong> Tập sát ngưỡng mỏi cơ để bơm máu căng phồng và nổi gân.</div>
        <div style="margin-top:4px;">• <strong>Khi nào tăng tạ?</strong> Khi hoàn thành chạm trần số Reps tối đa ở tất cả các hiệp (VD: 10/10/10) -> Buổi sau tăng <strong>+5 kg</strong> (bài máy lớn) hoặc <strong>+2.5 kg</strong> (bài đơn/cáp).</div>
      </div>
    </div>

    ${libCards}
  `;
}

function renderSettingsTab() {
  return `
    <!-- Install App Instructions -->
    <div class="card">
      <div class="ex-badges">
        <span class="badge badge-green">CÀI ĐẶT APP RA MÀN HÌNH CHÍNH ĐIỆN THOẠI</span>
      </div>
      <div class="ex-title">📲 Cách Cài Đặt Như App Native (Full Màn Hình, Có Icon)</div>
      <div class="ex-cues" style="margin-top:8px;">
        <div>🍎 <strong>Trên iPhone (Safari):</strong></div>
        <div>1. Mở link App này bằng trình duyệt <strong>Safari</strong>.</div>
        <div>2. Bấm nút <strong>Chia sẻ (Share)</strong> ở thanh dưới cùng (biểu tượng ô vuông có mũi tên chỉ lên).</div>
        <div>3. Cuộn xuống chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong> → Bấm <strong>Thêm</strong>.</div>
        <div style="margin-top:8px;">🤖 <strong>Trên Android (Chrome):</strong></div>
        <div>1. Bấm nút bên dưới hoặc menu <strong>3 chấm (⋮)</strong> góc trên phải Chrome → Chọn <strong>"Cài đặt ứng dụng" (Install App / Thêm vào Màn hình chính)</strong>.</div>
      </div>
      <button class="btn-emerald" style="width:100%;" onclick="triggerInstallPrompt()">
        📲 Cài Đặt Ứng Dụng Ngay
      </button>
    </div>

    <!-- Live Google Sheet Connection -->
    <div class="card">
      <div class="ex-badges">
        <span class="badge badge-f1">ĐỒNG BỘ GOOGLE SHEET 2 CHIỀU</span>
      </div>
      <div class="ex-title">🔗 Kết Nối File Sheet: HA MACHINE FULL-BODY 55P</div>
      <div style="font-size:12px;color:var(--text-muted);margin:6px 0 10px 0;">
        • <strong>Chiều Đọc (Sheet → App):</strong> Tự động 100% theo thời gian thực mỗi khi anh Hà mở App hoặc bấm "🔄 Đồng bộ".<br>
        • <strong>Chiều Ghi Tự Động (App → Sheet):</strong> Dán link Web App (Google Apps Script) vào ô dưới đây để khi bấm "Lưu Buổi Tập", điện thoại tự động điền thẳng dòng mới vào Sheet:
      </div>
      <div class="field-group" style="margin-bottom:10px;">
        <label>Google Apps Script Webhook URL (Tùy chọn)</label>
        <input type="text" id="cfgWebhook" value="${state.webhookUrl || ''}" placeholder="https://script.google.com/macros/s/.../exec">
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn-emerald" style="flex:1;" onclick="saveWebhookUrl()">💾 Lưu Cấu Hình</button>
        <button class="btn-outline" style="flex:1;" onclick="copyAppsScriptCode()">📋 Copy Mã Apps Script</button>
      </div>
    </div>

    <!-- Backup & Export -->
    <div class="card">
      <div class="ex-title" style="margin-bottom:8px;">🧰 Sao Lưu & Xuất Dữ Liệu</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <button class="btn-outline" style="padding:11px;" onclick="copyLogsTSV()">
          📋 Copy Nhật Ký Tập (Dán 1-chạm vào Google Sheet)
        </button>
        <a href="${SHEET_URL}" target="_blank" rel="noopener" class="btn-outline" style="padding:11px;">
          📊 Mở File Google Sheet Gốc Trên Điện Thoại
        </a>
        <button class="btn-outline" style="padding:11px;color:var(--rose);" onclick="resetLocalData()">
          🗑️ Tải Lại Dữ Liệu Gốc Từ Google Sheet
        </button>
      </div>
    </div>
  `;
}

function saveWebhookUrl() {
  const val = document.getElementById('cfgWebhook')?.value?.trim() || '';
  state.webhookUrl = val;
  saveState();
  showToast('✅ Đã lưu đường dẫn đồng bộ Google Sheet!');
}

async function copyAppsScriptCode() {
  try {
    const res = await fetch('./google-apps-script.gs');
    const code = await res.text();
    await navigator.clipboard.writeText(code);
    showToast('📋 Đã copy mã Apps Script! Mở Sheet -> Tiện ích mở rộng -> Apps Script để dán.');
  } catch (e) {
    showToast('⚠️ Không thể copy tự động, vui lòng mở file google-apps-script.gs');
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

// PWA Install Prompt Handling
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
    showToast('📲 iPhone: Bấm nút Chia sẻ (Share) -> "Thêm vào MH chính". Android: Menu ⋮ -> "Cài đặt ứng dụng"!');
  }
}

function switchTab(tab) {
  state.activeTab = tab;
  saveState();
  render();
  const main = document.getElementById('appContent');
  if (main) main.scrollTop = 0;
}

function render() {
  const content = document.getElementById('appContent');
  const syncSub = document.getElementById('syncStatusText');
  if (syncSub) syncSub.textContent = `Đồng bộ Sheet: ${state.lastSync}`;

  if (!content) return;
  if (state.activeTab === 'today') content.innerHTML = renderTodayTab();
  else if (state.activeTab === 'progress') content.innerHTML = renderProgressTab();
  else if (state.activeTab === 'cardio') content.innerHTML = renderCardioBodyTab();
  else if (state.activeTab === 'library') content.innerHTML = renderLibraryTab();
  else if (state.activeTab === 'settings') content.innerHTML = renderSettingsTab();

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === state.activeTab);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  render();
  // Auto-sync live data from Google Sheet in background
  syncFromGoogleSheet(true);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
