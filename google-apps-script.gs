/**
 * MÃ ĐỒNG BỘ 2 CHIỀU CHO APP HÀ GYM PRO -> GOOGLE SHEET
 * Hướng dẫn gắn vào Sheet (Chỉ làm 1 lần, dùng vĩnh viễn):
 * 1. Mở file Google Sheet: https://docs.google.com/spreadsheets/d/1pPayEETE_yoW9lzxYy3Qdd2GV5yEqp1uQZq285eK-wQ/edit
 * 2. Trên thanh menu bấm: Tiện ích mở rộng (Extensions) -> Apps Script
 * 3. Xóa mã cũ, dán toàn bộ đoạn mã này vào và bấm biểu tượng Đĩa mềm (Lưu).
 * 4. Bấm nút "Triển khai" (Deploy) góc trên bên phải -> "Tùy chọn triển khai mới" (New deployment)
 * 5. Chọn loại: "Ứng dụng web" (Web app)
 *    - Thực thi dưới dạng: "Tôi" (Me)
 *    - Ai có quyền truy cập: "Bất kỳ ai" (Anyone)
 * 6. Bấm "Triển khai" -> Copy đường dẫn URL Web App (https://script.google.com/macros/s/.../exec)
 * 7. Dán URL đó vào mục "Cài đặt & Đồng bộ" trong App Hà Gym Pro trên điện thoại!
 */

const SPREADSHEET_ID = '1pPayEETE_yoW9lzxYy3Qdd2GV5yEqp1uQZq285eK-wQ';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action === 'appendWorkout') {
      const ws = ss.getSheetByName('Workout Log');
      const rows = payload.rows || [];
      rows.forEach(r => {
        ws.appendRow([
          r.date,
          r.week,
          r.workout,
          r.exercise,
          r.weight,
          r.reps,
          r.volume,
          r.rir,
          r.nextWeight,
          r.note || ''
        ]);
      });
      return jsonResponse({ ok: true, added: rows.length });
    }

    if (action === 'appendBody') {
      const ws = ss.getSheetByName('Body Measurements');
      const b = payload.data;
      ws.appendRow([
        b.date,
        b.weight,
        b.waist || '',
        b.chest || '',
        b.arm || '',
        b.forearm || '',
        b.thigh || '',
        b.bf || '',
        b.note || ''
      ]);
      return jsonResponse({ ok: true });
    }

    if (action === 'appendCardio') {
      const ws = ss.getSheetByName('Cardio & Running');
      const c = payload.data;
      ws.appendRow([
        '',
        c.date,
        c.dayLabel,
        c.weekLabel,
        c.duration,
        c.distance,
        c.pace,
        c.hr,
        'Hoàn thành',
        c.note || ''
      ]);
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
