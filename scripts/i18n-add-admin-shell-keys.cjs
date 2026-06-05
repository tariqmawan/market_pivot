const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "src", "client", "i18n", "locales");

const en = {
  adminCrud: {
    deleteConfirm: "Delete this record? This cannot be undone.",
    exportCsv: "Export CSV",
    newRecord: "New",
    searchEntity: "Search {{entity}}...",
    deleteCount: "Delete ({{count}})",
    deleteSelectedConfirm: "Delete {{count}} selected records?",
    empty: "No {{entity}} yet. Click New to create one.",
    editEntity: "Edit {{entity}}",
    newEntity: "New {{entity}}",
    saveChanges: "Save changes",
    create: "Create"
  },
  adminSeo: {
    saved: "Saved!",
    errorSaving: "Error saving.",
    resetDefaults: "Reset to defaults.",
    metaTags: "Meta tags — {{page}}",
    ogTitle: "OG Title",
    ogImageUrl: "OG Image URL",
    ogDescription: "OG Description",
    canonicalUrl: "Canonical URL",
    index: "Index",
    follow: "Follow",
    robotsTxt: "Robots.txt",
    sitemapHint: "Enable XML sitemap generation at /sitemap.xml",
    disableSitemap: "Disable sitemap",
    enableSitemap: "Enable sitemap",
    resetToDefaults: "Reset to defaults",
    saveSettings: "Save SEO settings"
  }
};

const localized = {
  hi: {
    adminCrud: {
      deleteConfirm: "यह रिकॉर्ड हटाएँ? इसे वापस नहीं किया जा सकता।",
      exportCsv: "CSV एक्सपोर्ट करें",
      newRecord: "नया",
      searchEntity: "{{entity}} खोजें...",
      deleteCount: "हटाएँ ({{count}})",
      deleteSelectedConfirm: "{{count}} चुने हुए रिकॉर्ड हटाएँ?",
      empty: "अभी कोई {{entity}} नहीं है। नया बनाने के लिए New पर क्लिक करें।",
      editEntity: "{{entity}} संपादित करें",
      newEntity: "नया {{entity}}",
      saveChanges: "बदलाव सेव करें",
      create: "बनाएँ"
    },
    adminSeo: {
      saved: "सेव हो गया!",
      errorSaving: "सेव करने में त्रुटि।",
      resetDefaults: "डिफ़ॉल्ट पर रीसेट किया गया।",
      metaTags: "मेटा टैग — {{page}}",
      ogTitle: "OG शीर्षक",
      ogImageUrl: "OG इमेज URL",
      ogDescription: "OG विवरण",
      canonicalUrl: "कैनोनिकल URL",
      index: "इंडेक्स",
      follow: "फॉलो",
      robotsTxt: "Robots.txt",
      sitemapHint: "/sitemap.xml पर XML साइटमैप जनरेशन चालू करें",
      disableSitemap: "साइटमैप बंद करें",
      enableSitemap: "साइटमैप चालू करें",
      resetToDefaults: "डिफ़ॉल्ट पर रीसेट करें",
      saveSettings: "SEO सेटिंग्स सेव करें"
    }
  },
  ar: {
    adminCrud: {
      deleteConfirm: "هل تريد حذف هذا السجل؟ لا يمكن التراجع عن ذلك.",
      exportCsv: "تصدير CSV",
      newRecord: "جديد",
      searchEntity: "بحث في {{entity}}...",
      deleteCount: "حذف ({{count}})",
      deleteSelectedConfirm: "حذف {{count}} سجلات محددة؟",
      empty: "لا توجد {{entity}} بعد. انقر على جديد لإنشاء عنصر.",
      editEntity: "تعديل {{entity}}",
      newEntity: "{{entity}} جديد",
      saveChanges: "حفظ التغييرات",
      create: "إنشاء"
    },
    adminSeo: {
      saved: "تم الحفظ!",
      errorSaving: "حدث خطأ أثناء الحفظ.",
      resetDefaults: "تمت إعادة الضبط إلى الافتراضي.",
      metaTags: "وسوم التعريف — {{page}}",
      ogTitle: "عنوان OG",
      ogImageUrl: "رابط صورة OG",
      ogDescription: "وصف OG",
      canonicalUrl: "الرابط الأساسي",
      index: "فهرسة",
      follow: "متابعة",
      robotsTxt: "Robots.txt",
      sitemapHint: "تفعيل إنشاء خريطة XML على /sitemap.xml",
      disableSitemap: "تعطيل خريطة الموقع",
      enableSitemap: "تفعيل خريطة الموقع",
      resetToDefaults: "إعادة الضبط",
      saveSettings: "حفظ إعدادات SEO"
    }
  },
  fr: {
    adminCrud: {
      deleteConfirm: "Supprimer cet enregistrement ? Cette action est irréversible.",
      exportCsv: "Exporter CSV",
      newRecord: "Nouveau",
      searchEntity: "Rechercher {{entity}}...",
      deleteCount: "Supprimer ({{count}})",
      deleteSelectedConfirm: "Supprimer {{count}} enregistrements sélectionnés ?",
      empty: "Aucun {{entity}} pour le moment. Cliquez sur Nouveau pour en créer un.",
      editEntity: "Modifier {{entity}}",
      newEntity: "Nouveau {{entity}}",
      saveChanges: "Enregistrer les modifications",
      create: "Créer"
    },
    adminSeo: {
      saved: "Enregistré !",
      errorSaving: "Erreur lors de l’enregistrement.",
      resetDefaults: "Réinitialisé.",
      metaTags: "Balises méta — {{page}}",
      ogTitle: "Titre OG",
      ogImageUrl: "URL de l’image OG",
      ogDescription: "Description OG",
      canonicalUrl: "URL canonique",
      index: "Indexer",
      follow: "Suivre",
      robotsTxt: "Robots.txt",
      sitemapHint: "Activer la génération XML du sitemap sur /sitemap.xml",
      disableSitemap: "Désactiver le sitemap",
      enableSitemap: "Activer le sitemap",
      resetToDefaults: "Réinitialiser",
      saveSettings: "Enregistrer le SEO"
    }
  }
};

function merge(target, patch) {
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      target[key] = target[key] && typeof target[key] === "object" ? target[key] : {};
      merge(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

for (const lang of fs.readdirSync(root)) {
  const file = path.join(root, lang, "common.json");
  if (!fs.existsSync(file)) continue;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  merge(data, localized[lang] || en);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

console.log("Admin shell i18n keys added.");
