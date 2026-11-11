/**
 * MÃ ĐỒNG BỘ 2 CHIỀU CHO APP HÀ GYM (v22 — TỰ ĐỘNG GHI & CHỐNG TRÙNG LẶP DÒNG)
 * Hướng dẫn gắn vào Sheet (Chỉ làm 1 lần, dùng vĩnh viễn):
 * 1. Mở file Google Sheet: https://docs.google.com/spreadsheets/d/1pPayEETE_yoW9lzxYy3Qdd2GV5yEqp1uQZq285eK-wQ/edit
 * 2. Trên thanh menu bấm: Tiện ích mở rộng (Extensions) -> Apps Script
 * 3. Xóa mã cũ, dán toàn bộ đoạn mã này vào và bấm biểu tượng Đĩa mềm (Lưu).
 * 4. Bấm nút "Triển khai" (Deploy) góc trên bên phải -> "Tùy chọn triển khai mới" (New deployment)
 * 5. Chọn loại: "Ứng dụng web" (Web app)
 *    - Thực thi dưới dạng: "Tôi" (Me)
 *    - Ai có quyền truy cập: "Bất kỳ ai" (Anyone)
 * 6. Bấm "Triển khai" -> Copy đường dẫn URL Web App (https://script.google.com/macros/s/.../exec)
 * 7. Dán URL đó vào mục "Thư viện" -> "Apps Script URL" -> Bấm "Lưu kết nối" (hoặc gửi cho Nami hàn cứng vào App).
 */

const SPREADSHEET_ID = '1pPayEETE_yoW9lzxYy3Qdd2GV5yEqp1uQZq285eK-wQ';

function normDate(raw) {
  const s = String(raw || '').replace(/^'/, '').trim();
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const p = s.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    return ('0' + m[1]).slice(-2) + '/' + ('0' + m[2]).slice(-2) + '/' + m[3];
  }
  return s;
}

function doGet() {
  return jsonResponse({
    ok: true,
    service: 'Ha Gym Cloud Sync v22',
    sheetId: SPREADSHEET_ID
  });
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action === 'upsertWorkout' || action === 'appendWorkout') {
      const ws = ss.getSheetByName('Workout Log');
      const rows = payload.rows || [];
      const displayVals = ws.getDataRange().getDisplayValues();
      const rowIndexMap = {};

      for (let i = 1; i < displayVals.length; i++) {
        const dKey = normDate(displayVals[i][0]);
        const exKey = String(displayVals[i][3] || '').trim();
        if (dKey && exKey) {
          rowIndexMap[dKey + '|' + exKey] = i + 1; // 1-based sheet row
        }
      }

      let updated = 0;
      let added = 0;

      rows.forEach(r => {
        const dStr = normDate(r.date);
        const exStr = String(r.exercise || '').trim();
        if (!dStr || !exStr) return;

        const key = dStr + '|' + exStr;
        const rowValues = [
          "'" + dStr, // Giữ chuẩn chuỗi DD/MM/YYYY, chống Google Sheet đảo tháng/ngày kiểu Mỹ
          Number(r.week) || '',
          r.workout || '7 Bài Chuẩn (18 Hiệp)',
          exStr,
          Number(r.weight) || 0,
          Number(r.reps) || 0,
          Number(r.volume) || 0,
          r.rir || '1–2 RIR',
          Number(r.nextWeight) || 0,
          r.note || ''
        ];

        if (rowIndexMap[key]) {
          ws.getRange(rowIndexMap[key], 1, 1, rowValues.length).setValues([rowValues]);
          updated++;
        } else {
          ws.appendRow(rowValues);
          rowIndexMap[key] = ws.getLastRow();
          added++;
        }
      });

      return jsonResponse({ ok: true, added: added, updated: updated });
    }

    if (action === 'appendBody') {
      const ws = ss.getSheetByName('Body Measurements');
      const b = payload.data || {};
      const dStr = normDate(b.date);
      ws.appendRow([
        "'" + dStr,
        Number(b.weight) || 0,
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
      const c = payload.data || {};
      const dStr = normDate(c.date);
      ws.appendRow([
        '',
        "'" + dStr,
        c.dayLabel || '',
        c.weekLabel || '',
        c.duration || '',
        c.distance || '',
        c.pace || '',
        c.hr || '',
        'Hoàn thành',
        c.note || ''
      ]);
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
