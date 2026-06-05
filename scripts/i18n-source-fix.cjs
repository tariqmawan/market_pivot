const fs = require("fs");

function update(file, mutate) {
  const before = fs.readFileSync(file, "utf8");
  const after = mutate(before);
  if (after !== before) fs.writeFileSync(file, after, "utf8");
}

update("src/client/admin/components/ui/AdminCrudPage.tsx", (source) => source
  .replace(/>\s*[^<]*Export CSV\s*</, '>{t("adminCrud.exportCsv")}<')
  .replace(/>\s*\+ New\s*</, '>{t("adminCrud.newRecord")}<')
  .replace(/placeholder=\{`Search \$\{title\.toLowerCase\(\)\}[^`]*`\}/, 'placeholder={t("adminCrud.searchEntity", { entity: title.toLowerCase() } as any)}')
  .replace(/label: `Delete \(\$\{store\.selection\.length\}\)`,/, 'label: t("adminCrud.deleteCount", { count: store.selection.length } as any),')
  .replace(/confirm: `Delete \$\{store\.selection\.length\} selected records\?`,/, 'confirm: t("adminCrud.deleteSelectedConfirm", { count: store.selection.length } as any),')
  .replace(/>\s*Edit\s*</g, '>{t("edit")}<')
  .replace(/>\s*Delete\s*</g, '>{t("delete")}<')
  .replace(/emptyMessage=\{`No \$\{title\.toLowerCase\(\)\} yet\. Click "\+ New" to create one\.`\}/, 'emptyMessage={t("adminCrud.empty", { entity: title.toLowerCase() } as any)}')
  .replace(/title=\{editing \? `Edit \$\{title\.replace\(\/s\$\/i, ""\)\}` : `New \$\{title\.replace\(\/s\$\/i, ""\)\}`\}/, 'title={editing ? t("adminCrud.editEntity", { entity: title.replace(/s$/i, "") } as any) : t("adminCrud.newEntity", { entity: title.replace(/s$/i, "") } as any)}')
  .replace(/saveLabel=\{editing \? "Save changes" : "Create"\}/, 'saveLabel={editing ? t("adminCrud.saveChanges") : t("adminCrud.create")}')
);

update("src/client/admin/pages/PlatformPage.tsx", (source) => source
  .replace('setToast("Saved!");', 'setToast(t("adminSeo.saved"));')
  .replace('setToast("Error saving.");', 'setToast(t("adminSeo.errorSaving"));')
  .replace('setToast("Reset to defaults.");', 'setToast(t("adminSeo.resetDefaults"));')
  .replace(/<h2>Meta Tags [^<]*\{activePage\}<\/h2>/, '<h2>{t("adminSeo.metaTags", { page: activePage } as any)}</h2>')
  .replace(/>\s*OG Title\s*</g, '>{t("adminSeo.ogTitle")}<')
  .replace(/>\s*OG Image URL\s*</g, '>{t("adminSeo.ogImageUrl")}<')
  .replace(/>\s*OG Description\s*</g, '>{t("adminSeo.ogDescription")}<')
  .replace(/>\s*Canonical URL\s*</g, '>{t("adminSeo.canonicalUrl")}<')
  .replace(/>\s*Index\s*</g, '>{t("adminSeo.index")}<')
  .replace(/>\s*Follow\s*</g, '>{t("adminSeo.follow")}<')
  .replace(/>\s*Robots\.txt\s*</g, '>{t("adminSeo.robotsTxt")}<')
  .replace(/Enable XML sitemap generation at \/sitemap\.xml/g, '{t("adminSeo.sitemapHint")}')
  .replace(/title=\{settings\.sitemapEnabled \? "Disable sitemap" : "Enable sitemap"\}/, 'title={settings.sitemapEnabled ? t("adminSeo.disableSitemap") : t("adminSeo.enableSitemap")}')
  .replace(/>\s*Reset to Defaults\s*</g, '>{t("adminSeo.resetToDefaults")}<')
  .replace(/>\s*Save SEO Settings\s*</g, '>{t("adminSeo.saveSettings")}<')
);

console.log("Source i18n fixes applied.");
