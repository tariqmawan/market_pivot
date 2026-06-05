const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "src", "client", "i18n", "locales");

const patches = {
  en: {
    saving: "Saving...",
    adminBulkActions: {
      selectedCount: "{{selected}} of {{total}} selected",
      clearSelection: "Clear selection",
    },
    adminFilters: {
      resetFilters: "Reset filters",
    },
    adminTable: {
      selectRow: "Select row {{id}}",
      showingRange: "Showing {{from}}-{{to}} of {{total}}",
    },
  },
  hi: {
    saving: "सेव हो रहा है...",
    adminBulkActions: {
      selectedCount: "{{total}} में से {{selected}} चयनित",
      clearSelection: "चयन हटाएं",
    },
    adminFilters: {
      resetFilters: "फिल्टर रीसेट करें",
    },
    adminTable: {
      selectRow: "पंक्ति {{id}} चुनें",
      showingRange: "{{total}} में से {{from}}-{{to}} दिखा रहे हैं",
    },
  },
  ar: {
    saving: "جارٍ الحفظ...",
    adminBulkActions: {
      selectedCount: "{{selected}} من {{total}} محدد",
      clearSelection: "مسح التحديد",
    },
    adminFilters: {
      resetFilters: "إعادة تعيين الفلاتر",
    },
    adminTable: {
      selectRow: "تحديد الصف {{id}}",
      showingRange: "عرض {{from}}-{{to}} من {{total}}",
    },
  },
  zh: {
    saving: "正在保存...",
    adminBulkActions: {
      selectedCount: "已选择 {{selected}} / {{total}}",
      clearSelection: "清除选择",
    },
    adminFilters: {
      resetFilters: "重置筛选",
    },
    adminTable: {
      selectRow: "选择第 {{id}} 行",
      showingRange: "显示 {{from}}-{{to}}，共 {{total}}",
    },
  },
  fr: {
    saving: "Enregistrement...",
    adminBulkActions: {
      selectedCount: "{{selected}} sur {{total}} sélectionné(s)",
      clearSelection: "Effacer la sélection",
    },
    adminFilters: {
      resetFilters: "Réinitialiser les filtres",
    },
    adminTable: {
      selectRow: "Sélectionner la ligne {{id}}",
      showingRange: "Affichage de {{from}} à {{to}} sur {{total}}",
    },
  },
  de: {
    saving: "Speichern...",
    adminBulkActions: {
      selectedCount: "{{selected}} von {{total}} ausgewählt",
      clearSelection: "Auswahl löschen",
    },
    adminFilters: {
      resetFilters: "Filter zurücksetzen",
    },
    adminTable: {
      selectRow: "Zeile {{id}} auswählen",
      showingRange: "{{from}}-{{to}} von {{total}} angezeigt",
    },
  },
  es: {
    saving: "Guardando...",
    adminBulkActions: {
      selectedCount: "{{selected}} de {{total}} seleccionados",
      clearSelection: "Borrar selección",
    },
    adminFilters: {
      resetFilters: "Restablecer filtros",
    },
    adminTable: {
      selectRow: "Seleccionar fila {{id}}",
      showingRange: "Mostrando {{from}}-{{to}} de {{total}}",
    },
  },
  pt: {
    saving: "Salvando...",
    adminBulkActions: {
      selectedCount: "{{selected}} de {{total}} selecionados",
      clearSelection: "Limpar seleção",
    },
    adminFilters: {
      resetFilters: "Redefinir filtros",
    },
    adminTable: {
      selectRow: "Selecionar linha {{id}}",
      showingRange: "Mostrando {{from}}-{{to}} de {{total}}",
    },
  },
  ru: {
    saving: "Сохранение...",
    adminBulkActions: {
      selectedCount: "Выбрано {{selected}} из {{total}}",
      clearSelection: "Очистить выбор",
    },
    adminFilters: {
      resetFilters: "Сбросить фильтры",
    },
    adminTable: {
      selectRow: "Выбрать строку {{id}}",
      showingRange: "Показано {{from}}-{{to}} из {{total}}",
    },
  },
  ja: {
    saving: "保存中...",
    adminBulkActions: {
      selectedCount: "{{total}} 件中 {{selected}} 件を選択",
      clearSelection: "選択を解除",
    },
    adminFilters: {
      resetFilters: "フィルターをリセット",
    },
    adminTable: {
      selectRow: "行 {{id}} を選択",
      showingRange: "{{total}} 件中 {{from}}-{{to}} 件を表示",
    },
  },
  ko: {
    saving: "저장 중...",
    adminBulkActions: {
      selectedCount: "{{total}}개 중 {{selected}}개 선택됨",
      clearSelection: "선택 지우기",
    },
    adminFilters: {
      resetFilters: "필터 재설정",
    },
    adminTable: {
      selectRow: "{{id}} 행 선택",
      showingRange: "{{total}}개 중 {{from}}-{{to}} 표시",
    },
  },
  th: {
    saving: "กำลังบันทึก...",
    adminBulkActions: {
      selectedCount: "เลือก {{selected}} จาก {{total}}",
      clearSelection: "ล้างการเลือก",
    },
    adminFilters: {
      resetFilters: "รีเซ็ตตัวกรอง",
    },
    adminTable: {
      selectRow: "เลือกแถว {{id}}",
      showingRange: "แสดง {{from}}-{{to}} จาก {{total}}",
    },
  },
  vi: {
    saving: "Đang lưu...",
    adminBulkActions: {
      selectedCount: "Đã chọn {{selected}} / {{total}}",
      clearSelection: "Bỏ chọn",
    },
    adminFilters: {
      resetFilters: "Đặt lại bộ lọc",
    },
    adminTable: {
      selectRow: "Chọn hàng {{id}}",
      showingRange: "Hiển thị {{from}}-{{to}} trong {{total}}",
    },
  },
  pl: {
    saving: "Zapisywanie...",
    adminBulkActions: {
      selectedCount: "Wybrano {{selected}} z {{total}}",
      clearSelection: "Wyczyść wybór",
    },
    adminFilters: {
      resetFilters: "Resetuj filtry",
    },
    adminTable: {
      selectRow: "Wybierz wiersz {{id}}",
      showingRange: "Wyświetlanie {{from}}-{{to}} z {{total}}",
    },
  },
  tr: {
    saving: "Kaydediliyor...",
    adminBulkActions: {
      selectedCount: "{{total}} içinden {{selected}} seçildi",
      clearSelection: "Seçimi temizle",
    },
    adminFilters: {
      resetFilters: "Filtreleri sıfırla",
    },
    adminTable: {
      selectRow: "{{id}} satırını seç",
      showingRange: "{{total}} içinden {{from}}-{{to}} gösteriliyor",
    },
  },
  id: {
    saving: "Menyimpan...",
    adminBulkActions: {
      selectedCount: "{{selected}} dari {{total}} dipilih",
      clearSelection: "Hapus pilihan",
    },
    adminFilters: {
      resetFilters: "Reset filter",
    },
    adminTable: {
      selectRow: "Pilih baris {{id}}",
      showingRange: "Menampilkan {{from}}-{{to}} dari {{total}}",
    },
  },
  ms: {
    saving: "Menyimpan...",
    adminBulkActions: {
      selectedCount: "{{selected}} daripada {{total}} dipilih",
      clearSelection: "Kosongkan pilihan",
    },
    adminFilters: {
      resetFilters: "Tetapkan semula penapis",
    },
    adminTable: {
      selectRow: "Pilih baris {{id}}",
      showingRange: "Memaparkan {{from}}-{{to}} daripada {{total}}",
    },
  },
};

for (const [locale, patch] of Object.entries(patches)) {
  const file = path.join(root, locale, "common.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  Object.assign(data, patch);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

console.log(`Added shared UI keys to ${Object.keys(patches).length} locales.`);
