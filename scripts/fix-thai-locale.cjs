const fs = require('fs');

const LOCALES_DIR = 'src/client/i18n/locales/th';

function fixJSON(name, fixFn) {
  const path = `${LOCALES_DIR}/${name}.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  fixFn(data);
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  console.log(`Fixed ${name}.json`);
}

// ─── crypto.json ─────────────────────────────────────────────────────────
fixJSON('crypto', (t) => {
  // Top-level
  t.ath = 'สูงสุดตลอดกาล';
  t.atl = 'ต่ำสุดตลอดกาล';
  t.categories.defi.name = 'ดีไฟ';
  t.categories.infrastructure.name = 'โครงสร้างพื้นฐาน';
  t.categories.layer1.name = 'เลเยอร์ 1';
  t.categories.layer2.name = 'เลเยอร์ 2';
  t.categories.meme.name = 'มีม';
  t.categories.payments.name = 'การชำระเงิน';
  t.categories.stablecoin.name = 'สเตเบิลคอยน์';

  // Cryptocurrency names & descriptions (names stay as proper nouns)
  const coins = {
    bitcoin: 'คริปโตเคอร์เรนซีแรกและใหญ่ที่สุดในโลกตามมูลค่าตลาด',
    ethereum: 'แพลตฟอร์มสัญญาอัจฉริยะชั้นนำและศูนย์กลาง DeFi',
    tether: 'สเตเบิลคอยน์ผูกกับ USD ที่ใช้กันอย่างแพร่หลายที่สุด',
    binancecoin: 'โทเคนเนทีฟของระบบนิเวศ Binance Smart Chain',
    solana: 'แพลตฟอร์มบล็อกเชนความเร็วสูงสำหรับแอปพลิเคชันแบบกระจายศูนย์',
    ripple: 'เครือข่ายการชำระเงินที่เน้นการโอนเงินระหว่างประเทศที่รวดเร็วและต้นทุนต่ำ',
    usdCoin: 'สเตเบิลคอยน์ผูกกับ USD ที่ได้รับการควบคุม',
    cardano: 'แพลตฟอร์มบล็อกเชนที่ผ่านการตรวจสอบโดยผู้เชี่ยวชาญ เน้นความยั่งยืน',
    dogecoin: 'เหรียญมีมดั้งเดิม — เริ่มจากเรื่องตลก สู่ไอคอนวัฒนธรรมคริปโต',
    avalanche2: 'โซลูชัน Subnet และการปรับขนาดสำหรับแอปพลิเคชันบล็อกเชน',
    chainlink: 'เครือข่าย Oracle แบบกระจายศูนย์เชื่อมต่อบล็อกเชนกับข้อมูลโลกจริง',
    polkadot: 'บล็อกเชนหลายสายที่เปิดใช้งานการทำงานร่วมกันข้ามเชน',
    litecoin: 'Silver สู่ Gold ของ Bitcoin การชำระเงินแบบ peer-to-peer ที่รวดเร็ว',
    tron: 'แพลตฟอร์มบล็อกเชนสำหรับความบันเทิงแบบกระจายศูนย์',
    uniswap: 'การแลกเปลี่ยนแบบกระจายศูนย์ชั้นนำและโปรโตคอล DeFi',
    stellar: 'เครือข่ายบล็อกเชนสำหรับการเข้าถึงทางการเงินและการโอนเงิน',
    cosmos: 'ระบบนิเวศบล็อกเชนที่ทำงานร่วมกันได้และอินเทอร์เน็ตของบล็อกเชน',
    aave: 'โปรโตคอลสภาพคล่องแบบไม่ต้องฝากทรัพย์สินสำหรับการให้กู้ยืมและการยืม',
    arbitrum: 'โซลูชันการปรับขนาดเลเยอร์ 2 ของ Ethereum และโทเคนการกำกับดูแล',
    shibaInu: 'Dogecoin killer — เหรียญมีมบน Ethereum พร้อมชุมชนขนาดใหญ่',
    pepe: 'วัฒนธรรมอินเทอร์เน็ตพบคริปโต — มีมนกกระเรียนกลายเป็นโทเคนมูลค่าพันล้าน',
    bonk: 'เหรียญมีมสำคัญแรกของ Solana — airdrop สู่ชุมชน สู่แกนหลัก DeFi',
    floki: 'คริปโตของประชาชน — ได้แรงบันดาลใจจาก Elon Musk ชุมชนสร้างระบบนิเวศมีม',
    curveDaoToken: 'การแลกเปลี่ยนแบบกระจายศูนย์ที่ปรับปรุงสำหรับการสลับสเตเบิลคอยน์และสินทรัพย์ผูกพัน',
    compoundGovernanceToken: 'โปรโตคอลอัตราดอกเบี้ยอัตโนมัติแบบอัลกอริทึมสำหรับการให้กู้ยืม DeFi',
    maker: 'โทเคนการกำกับดูแลของ MakerDAO โปรโตคอลเบื้องหลังสเตเบิลคอยน์ DAI',
    dai: 'สเตเบิลคอยน์ backed โดย USD แบบกระจายศูนย์บน Ethereum',
    theOpenNetwork: 'บล็อกเชนความเร็วสูงพิเศษที่เน้นการส่งข้อความและการชำระเงิน'
  };

  // Also handle maticNetwork
  if (t.cryptocurrencies.maticNetwork) {
    t.cryptocurrencies.maticNetwork.description = 'โซลูชันการปรับขนาด Ethereum ที่ช่วยให้ธุรกรรมเร็วขึ้นและถูกลง';
  }

  for (const [key, desc] of Object.entries(coins)) {
    if (t.cryptocurrencies[key]) {
      t.cryptocurrencies[key].description = desc;
    }
  }

  t.cryptocurrency = 'คริปโตเคอร์เรนซี';
  t.cryptocurrencyCategories = 'หมวดหมู่คริปโตเคอร์เรนซี';
  t.allCryptocurrencies = 'คริปโตเคอร์เรนซีทั้งหมด';
  t.categoryNotFound = 'ไม่พบหมวดหมู่';
  t.categoryNotFoundDescription = 'หมวดหมู่นี้ไม่มีอยู่ เรียกดูคริปโตเคอร์เรนซีทั้งหมดด้านล่าง';

  t.categoryPages.common.marketOverview = 'ภาพรวมตลาด';
  t.categoryPages.common.combinedMarketCap = 'มูลค่าตลาดรวม';
  t.categoryPages.common.topGainer24h = 'เพิ่มขึ้นสูงสุด (24 ชม.)';
  t.categoryPages.common.name = 'ชื่อ';
  t.categoryPages.common.price = 'ราคา';
  t.categoryPages.common.change24h = 'เปลี่ยนแปลง 24 ชม.';
  t.categoryPages.common.marketCap = 'มูลค่าตลาด';
  t.categoryPages.common.volume24h = 'ปริมาณ 24 ชม.';
  t.categoryPages.common.riskProfile = 'โปรไฟล์ความเสี่ยง';
  t.categoryPages.common.fullCryptoMarket = 'ตลาดคริปโตเต็มรูปแบบ';
  t.categoryPages.common.exploreAllCryptocurrencies = 'สำรวจคริปโตเคอร์เรนซีทั้งหมด';

  t.categoryPages.meme.eyebrow = 'โทเคนชุมชน';
  t.categoryPages.meme.title = 'เหรียญมีม';
  t.categoryPages.meme.body = 'คริปโตเคอร์เรนซีที่ขับเคลื่อนโดยชุมชน เกิดจากวัฒนธรรมไวรัล โมเมนตัมทางสังคม และกลุ่มผู้ติดตาม สินทรัพย์ความเสี่ยงสูง-ผลตอบแทนสูงที่ความเชื่อมั่นครองตลาด';
  t.categoryPages.meme.metrics.coinsListed = 'เหรียญที่จดทะเบียน';
  t.categoryPages.meme.rankingsTitle = 'อันดับเหรียญมีม';
  t.categoryPages.meme.table.community = 'ชุมชน';
  t.categoryPages.meme.communities.DOGE = 'OG ดั้งเดิม';
  t.categoryPages.meme.communities.SHIB = 'กองทัพ Shib';
  t.categoryPages.meme.communities.PEPE = 'ชาติ Pepe';
  t.categoryPages.meme.communities.BONK = 'มีม Solana';
  t.categoryPages.meme.communities.FLOKI = 'กองทัพไวกิ้ง';
  t.categoryPages.meme.insights.origins.eyebrow = 'จุดกำเนิด';
  t.categoryPages.meme.insights.origins.title = 'เรื่องราวของเหรียญมีม';
  t.categoryPages.meme.insights.origins.items.dogecoin = 'Dogecoin (2013) - เหรียญมีมอินเทอร์เน็ตดั้งเดิม';
  t.categoryPages.meme.insights.origins.items.elon = 'ทวีตของ Elon Musk เป็นตัวเร่งราคา';
  t.categoryPages.meme.insights.origins.items.pumps = 'การปั๊มแบบ WallStreetBets ที่ประสานงานกัน';
  t.categoryPages.meme.insights.origins.items.shiba = 'Shiba Inu เปิดตัวในฐานะ "DOGE killer"';
  t.categoryPages.meme.insights.origins.items.pepe = 'บูม PEPE ปี 2023 ฟื้นวัฏจักรมีม';
  t.categoryPages.meme.insights.origins.items.bonk = 'BONK ถูก airdrop สู่ชีวิต DeFi ของ Solana';
  t.categoryPages.meme.insights.risk.title = 'สิ่งที่นักลงทุนควรรู้';
  t.categoryPages.meme.insights.risk.items.sentiment = 'ราคาขับเคลื่อนโดยความเชื่อมั่นเกือบทั้งหมด';
  t.categoryPages.meme.insights.risk.items.pumpDump = 'เสี่ยงต่อแผนการปั๊มแล้วทิ้ง';
  t.categoryPages.meme.insights.risk.items.utility = 'ประโยชน์ใช้สอยน้อยหรือไม่มีเลย';
  t.categoryPages.meme.insights.risk.items.volatility = 'ความผันผวนรุนแรง - 50%+ เป็นเรื่องปกติ';
  t.categoryPages.meme.insights.risk.items.rugPull = 'ความเสี่ยง Rug-pull ในเหรียญใหม่ที่ยังไม่ตรวจสอบ';
  t.categoryPages.meme.insights.risk.items.viralCycles = 'ความสัมพันธ์สูงกับวัฏจักรสื่อไวรัล';
  t.categoryPages.meme.insights.signals.eyebrow = 'สัญญาณชุมชน';
  t.categoryPages.meme.insights.signals.title = 'วิธีติดตามโมเมนตัม';
  t.categoryPages.meme.insights.signals.items.twitter = 'การกล่าวถึง Twitter/X และ hashtags ที่กำลังมาแรง';
  t.categoryPages.meme.insights.signals.items.reddit = 'กิจกรรม Reddit บน r/CryptoCurrency';
  t.categoryPages.meme.insights.signals.items.whales = 'การแจ้งเตือนกระเป๋าวาฬและการโอนจำนวนมาก';
  t.categoryPages.meme.insights.signals.items.listings = 'ประกาศการจดทะเบียนในตลาดซื้อขาย';
  t.categoryPages.meme.insights.signals.items.google = 'ปริมาณการค้นหา Google Trends พุ่งสูง';
  t.categoryPages.meme.insights.signals.items.influencers = 'กิจกรรมโซเชียลมีเดียของอินฟลูเอนเซอร์';
  t.categoryPages.meme.cta.description = 'เปรียบเทียบเหรียญมีมกับสินทรัพย์ blue-chip โปรโตคอล DeFi และบล็อกเชนเลเยอร์ 1';
});

// ─── pages.json ──────────────────────────────────────────────────────────
fixJSON('pages', (t) => {
  // Add forbiddenpage
  t.forbiddenpage = {
    h0: 'การเข้าถึงถูกปฏิเสธ',
    description: 'คุณไม่มีสิทธิ์ในการดูหน้านี้ กรุณาติดต่อผู้ดูแลระบบหากคุณคิดว่านี่เป็นข้อผิดพลาด',
    backToHome: 'กลับหน้าแรก'
  };

  // Categories
  const cats = t.categories;
  cats.commoditiesAgriculture.description = 'สินค้าโภคภัณฑ์พืชผลรวมถึงฟิวเจอร์สข้าวสาลี ข้าวโพด ถั่วเหลือง และน้ำตาล';
  cats.commoditiesAgriculture.eyebrow = 'สินค้าเกษตร';
  cats.commoditiesAgriculture.title = 'ตลาดเกษตรกรรม';
  cats.commoditiesEnergy.description = 'ราคาและฟิวเจอร์สน้ำมัน ก๊าซธรรมชาติ ถ่านหิน และพลังงานหมุนเวียน';
  cats.commoditiesEnergy.eyebrow = 'ตลาดพลังงาน';
  cats.commoditiesEnergy.title = 'สินค้าโภคภัณฑ์พลังงาน';
  cats.commoditiesIndustrial.description = 'วัสดุอุตสาหกรรมเช่นลิเธียม แร่หายาก และสินค้าโภคภัณฑ์ก่อสร้าง';
  cats.commoditiesIndustrial.eyebrow = 'วัตถุดิบอุตสาหกรรม';
  cats.commoditiesIndustrial.title = 'สินค้าโภคภัณฑ์อุตสาหกรรม';
  cats.commoditiesMetals.description = 'ราคาทองคำ เงิน ทองแดง และโลหะอุตสาหกรรมพร้อมกลยุทธ์ป้องกันความเสี่ยง';
  cats.commoditiesMetals.eyebrow = 'มีค่าและอุตสาหกรรม';
  cats.commoditiesMetals.title = 'ตลาดโลหะ';
  cats.newsAlerts.description = 'ข่าวด่วน เหตุการณ์สำคัญ และปัจจัยขับเคลื่อนตลาดแบบเรียลไทม์';
  cats.newsAlerts.eyebrow = 'อัปเดตเรียลไทม์';
  cats.newsAlerts.title = 'การแจ้งเตือนตลาด';
  cats.newsAlerts.features.breakingNews = 'ข่าวด่วน';
  cats.newsAlerts.features.marketMoving = 'ปัจจัยขับเคลื่อนตลาด';
  cats.newsAlerts.features.criticalAlerts = 'การแจ้งเตือนสำคัญ';
  cats.newsAlerts.features.watchlistAlerts = 'การแจ้งเตือนรายการติดตาม';
  cats.newsAlerts.insights.earningsSurprises = 'ผลประกอบการเกินคาด';
  cats.newsAlerts.insights.economicData = 'ข้อมูลเศรษฐกิจ';
  cats.newsAlerts.insights.policyChanges = 'การเปลี่ยนแปลงนโยบาย';
  cats.newsAlerts.insights.macroEvents = 'เหตุการณ์มหภาค';
  cats.newsCrypto.description = 'ข่าวตลาดคริปโตเคอร์เรนซี อัปเดตกฎระเบียบ และการวิเคราะห์ออนเชน';
  cats.newsCrypto.eyebrow = 'สินทรัพย์ดิจิทัล';
  cats.newsCrypto.title = 'ข่าวคริปโต';
  cats.newsRegions.description = 'ข่าวตลาดและการวิเคราะห์แบ่งตามภูมิภาคและกลุ่มการค้า';
  cats.newsRegions.eyebrow = 'ตลาดโลก';
  cats.newsRegions.title = 'ข่าวภูมิภาค';
  cats.newsSectors.description = 'ข่าวเฉพาะภาคส่วนรวมถึงผลประกอบการ การควบรวมกิจการ และแนวโน้มตามธีม';
  cats.newsSectors.eyebrow = 'ตลาดหุ้น';
  cats.newsSectors.title = 'ข่าวภาคส่วน';

  // Forex section
  const fx = t.forex;
  fx.fxSubtitle = 'ความแข็งแกร่งของสกุลเงิน คู่เงินหลักและเอ็กซอติก นโยบายธนาคารกลาง ปฏิทินเศรษฐกิจ กระแสเงินทุนภูมิภาค และกราฟย้อนหลังในเทอร์มินัลเดียว';
  fx.calendarSubtitle = 'เหตุการณ์สำคัญในเศรษฐกิจหลัก';
  fx.centralBankMacroSubtitle = 'อัตรานโยบาย เงินเฟ้อ การเติบโต และบริบทการค้า';
  fx.heatmapTitle = 'ฮีตแมปผลตอบแทนสกุลเงิน';
  fx.strengthSubtitle = 'ความแข็งแกร่งสัมพัทธ์ของสกุลเงินหลักและตลาดเกิดใหม่';
  fx.volatilitySubtitle = 'ความผันผวนของ FX ในคู่เงินหลัก';
  fx.majorPairsTitle = 'คู่สกุลเงินหลัก';
  fx.majorPairsSubtitle = 'ผู้นำสภาพคล่องที่ขับเคลื่อนกระแส FX ทั่วโลก';
  fx.crossPairsSubtitle = 'คู่ไขว้หลักที่มีธีมภูมิภาคและการเทรด';
  fx.exoticSubtitle = 'สกุลเงินตลาดเกิดใหม่ที่มีความผันผวนสูง';
  fx.centralBank = 'ธนาคารกลาง';
  fx.centralBanks = 'ธนาคารกลาง';
  fx.forecast = 'พยากรณ์';
  fx.previous = 'ครั้งก่อน';
  fx.result = 'ผลลัพธ์';
  fx.action = 'การดำเนินการ';
  fx.change = 'เปลี่ยนแปลง';
  fx.currency = 'สกุลเงิน';
  fx.inflation = 'เงินเฟ้อ';
  fx.volatility = 'ความผันผวน';
  fx.rate = 'อัตรา';
  fx.trend = 'แนวโน้ม';
  fx.strength = 'ความแข็งแกร่ง';
  fx.region = 'ภูมิภาค';
  fx.from = 'จาก';
  fx.to = 'ถึง';

  // News
  t.news.readMore = 'อ่านเพิ่มเติม →';

  // Pricing
  t.pricingTitle = 'ราคาที่โปร่งใสและเรียบง่าย';
  t.pricingSubtitle = 'เริ่มต้นฟรี อัปเกรดเมื่อคุณต้องการข้อมูลเรียลไทม์ การวิเคราะห์ขั้นสูง และความครอบคลุมไม่จำกัด';
  t.pricingAllPlansInclude = 'ทุกแผนรวมการเข้ารหัส SSL 256-bit ระดับธนาคารและการจัดการข้อมูลที่สอดคล้องกับ GDPR';
  t.pricingHaveQuestions = 'มีคำถาม?';
  t.pricingOr = 'หรือ';
  t.pricingReadFaq = 'อ่านคำถามที่พบบ่อย';
  t.pricingTalkToTeam = 'พูดคุยกับทีมของเรา';
  t.monthly = 'รายเดือน';
  t.annual = 'รายปี';
  t.billingPeriod = 'รอบการเรียกเก็บเงิน';
  t.mostPopular = 'ได้รับความนิยมสูงสุด';
  t.save30Percent = 'ประหยัด 30%';
  t.guaranteeMoneyBack = 'รับประกันคืนเงินภายใน 30 วัน';
  t.guaranteeNoCreditCard = 'ไม่ต้องใช้บัตรเครดิตสำหรับแผนฟรี';
  t.guaranteeCancelAnytime = 'ยกเลิกหรือลดระดับได้ทุกเมื่อ';
  t.guarantee247Support = 'สนับสนุน 24/7 ทุกแผนที่ชำระเงิน';
  t.contactSales = 'ติดต่อฝ่ายขาย';
  t.enterpriseCta = 'ติดต่อฝ่ายขาย';

  // Starter/Professional/Business pricing (legacy)
  t.starterCta = 'เริ่มต้นใช้งาน';
  t.starterPlanDescription = 'เครื่องมือ PDF ที่จำเป็นสำหรับการใช้งานเบา';
  t.starterFeaturesLabel = 'ฟีเจอร์เริ่มต้นรวมถึง';
  t.starterFeature1 = 'เข้าถึงเครื่องมือ PDF ที่จำเป็น';
  t.starterFeature2 = 'การจัดการเอกสารพื้นฐาน';
  t.starterFeature3 = 'การสนับสนุนมาตรฐาน';
  t.starterFeature4 = '5 ลายเซ็นอิเล็กทรอนิกส์ต่อเดือน';
  t.starterFeature5 = 'การเซ็นด้วยตนเองและหลายฝ่าย';
  t.professionalCta = 'อัปเกรด';
  t.professionalPlanDescription = 'เครื่องมือขั้นสูงสำหรับมืออาชีพเดี่ยว';
  t.professionalFeaturesLabel = 'ฟีเจอร์มืออาชีพรวมถึง';
  t.professionalFeature1 = 'เครื่องมือ PDF ขั้นสูง';
  t.professionalFeature2 = 'การสนับสนุนลำดับความสำคัญ';
  t.professionalFeature3 = '25 ลายเซ็นอิเล็กทรอนิกส์ต่อเดือน';
  t.professionalFeature4 = 'การเซ็นด้วยตนเองและหลายฝ่าย';
  t.professionalFeature5 = 'เทมเพลตเอกสาร';
  t.businessCta = 'อัปเกรด';
  t.businessPlanDescription = 'ดีที่สุดสำหรับทีมและธุรกิจที่กำลังเติบโต';
  t.businessFeaturesLabel = 'ฟีเจอร์ธุรกิจรวมถึง';
  t.businessFeature1 = 'เครื่องมือ PDF ไม่จำกัด';
  t.businessFeature2 = 'การสนับสนุนลำดับความสำคัญ';
  t.businessFeature3 = 'ลายเซ็นอิเล็กทรอนิกส์ไม่จำกัด';
  t.businessFeature4 = 'การเซ็นด้วยตนเองและหลายฝ่าย';
  t.businessFeature5 = 'การทำงานร่วมกันเป็นทีม';
  t.enterpriseFeature1 = 'เครื่องมือทั้งหมดไม่จำกัด';
  t.enterpriseFeature2 = 'ผู้จัดการบัญชีเฉพาะ';
  t.enterpriseFeature3 = 'ลายเซ็นอิเล็กทรอนิกส์ไม่จำกัด';
  t.enterpriseFeature4 = 'การเซ็นด้วยตนเองและหลายฝ่าย';
  t.enterpriseFeature5 = 'การบูรณาการที่กำหนดเอง';
  t.enterpriseFeaturesLabel = 'ฟีเจอร์องค์กรรวมถึง';
  t.enterprisePlanDescription = 'โซลูชันที่กำหนดเองพร้อมพลังไม่จำกัดสำหรับองค์กร';

  // Economic Calendar - fix romanized Thai to real Thai
  if (t.economiccalendar) {
    const ec = t.economiccalendar;
    if (ec.hero) {
      ec.hero.eyebrow = 'ปฏิทินเศรษฐกิจ';
      ec.hero.title = 'เหตุการณ์มหภาคในภาพรวม';
      ec.hero.description = 'ติดตามธนาคารกลาง การประกาศเงินเฟ้อ ข้อมูลการเติบโต และเหตุการณ์นโยบายด้วยไทม์ไลน์ที่สะอาดสำหรับการสแกนอย่างรวดเร็ว';
      ec.hero.panelLabel = 'เหตุการณ์ผลกระทบสูง';
    }
    if (ec.metrics) {
      ec.metrics.events = 'เหตุการณ์';
      ec.metrics.currentView = 'ในมุมมองปัจจุบัน';
      ec.metrics.regions = 'ภูมิภาค';
      ec.metrics.regionsMeta = 'US, EU, UK, ญี่ปุ่น, อินเดีย';
      ec.metrics.next = 'ถัดไป';
      ec.metrics.noEvents = 'ไม่มีเหตุการณ์';
      ec.metrics.risk = 'ความเสี่ยง';
      ec.metrics.riskMeta = 'ความผันผวนทางเศรษฐกิจมหภาค';
    }
    if (ec.risk) {
      ec.risk.elevated = 'สูง';
      ec.risk.quiet = 'สงบ';
    }
    if (ec.filters) {
      ec.filters.eyebrow = 'ตัวกรอง';
      ec.filters.title = 'ดูตามวันที่ ภูมิภาค และผลกระทบ';
      ec.filters.dateRangeLabel = 'ช่วงวันที่';
      ec.filters.countryLabel = 'ประเทศ';
      ec.filters.impactLabel = 'ผลกระทบ';
      ec.filters.allCountries = 'ทั้งหมด';
      ec.filters.allImpact = 'ทั้งหมด';
      ec.filters.impacts = ec.filters.impacts || {};
      ec.filters.impacts.High = 'สูง';
      ec.filters.impacts.Medium = 'ปานกลาง';
      ec.filters.impacts.Low = 'ต่ำ';
    }
    if (ec.dateRanges) {
      ec.dateRanges.today = 'วันนี้';
      ec.dateRanges.tomorrow = 'พรุ่งนี้';
      ec.dateRanges.thisWeek = 'สัปดาห์นี้';
    }
    if (ec.timeline) {
      ec.timeline.eyebrow = 'เหตุการณ์ที่กำลังจะมาถึง';
    }
    if (ec.values) {
      ec.values.forecast = 'พยากรณ์';
      ec.values.previous = 'ครั้งก่อน';
      ec.values.actual = 'จริง';
    }
    if (ec.eventValues) {
      ec.eventValues.pending = 'รอผล';
      ec.eventValues.unchanged = 'ไม่เปลี่ยนแปลง';
      ec.eventValues.hawkish = 'เข้มงวด';
      ec.eventValues.neutral = 'เป็นกลาง';
    }
    if (ec.countries) {
      ec.countries.US = 'สหรัฐฯ';
      ec.countries.EU = 'EU';
      ec.countries.UK = 'สหราชอาณาจักร';
      ec.countries.Japan = 'ญี่ปุ่น';
      ec.countries.India = 'อินเดีย';
    }
  }
});

// ─── forex.json ──────────────────────────────────────────────────────────
fixJSON('forex', (t) => {
  // Translate country names
  const countryTranslations = {
    ae: 'สหรัฐอาหรับเอมิเรตส์',
    au: 'ออสเตรเลีย',
    br: 'บราซิล',
    ca: 'แคนาดา',
    ch: 'สวิตเซอร์แลนด์',
    cl: 'ชิลี',
    cn: 'จีน',
    eu: 'สหภาพยุโรป',
    gb: 'สหราชอาณาจักร',
    hk: 'ฮ่องกง',
    in: 'อินเดีย',
    jp: 'ญี่ปุ่น',
    kr: 'เกาหลีใต้',
    mx: 'เม็กซิโก',
    no: 'นอร์เวย์',
    sa: 'ซาอุดีอาระเบีย',
    se: 'สวีเดน',
    sg: 'สิงคโปร์',
    us: 'สหรัฐอเมริกา',
    za: 'แอฟริกาใต้'
  };
  for (const [code, name] of Object.entries(countryTranslations)) {
    if (t.countries[code]) t.countries[code].name = name;
  }

  // Translate currency names & descriptions
  const currencyTranslations = {
    aed: { name: 'ดีแรห์มสหรัฐอาหรับเอมิเรตส์', description: 'สกุลเงินที่ผูกกับ USD ของศูนย์กลางการเงินอ่าวเปอร์เซีย' },
    aud: { name: 'ดอลลาร์ออสเตรเลีย', description: 'สกุลเงินที่เชื่อมโยงกับสินค้าโภคภัณฑ์ ศูนย์กลางเอเชียแปซิฟิก' },
    brl: { name: 'เรอัลบราซิล', description: 'สกุลเงินของเศรษฐกิจใหญ่ที่สุดในละตินอเมริกา' },
    cad: { name: 'ดอลลาร์แคนาดา', description: 'สกุลเงินที่เชื่อมโยงกับสินค้าโภคภัณฑ์ของประเทศ G7' },
    chf: { name: 'ฟรังก์สวิส', description: 'สกุลเงินปลอดภัย Known for stability and strong purchasing power' },
    clp: { name: 'เปโซชิลี', description: 'สกุลเงินของประเทศละตินอเมริกาที่มีเสถียรภาพทางเศรษฐกิจ' },
    cny: { name: 'หยวนจีน', description: 'สกุลเงินของเศรษฐกิจใหญ่อันดับสองของโลก' },
    eur: { name: 'ยูโร', description: 'สกุลเงินของยูโรโซน สกุลเงินสำรองใหญ่อันดับสอง' },
    gbp: { name: 'ปอนด์สเตอร์ลิงอังกฤษ', description: 'สกุลเงินของสหราชอาณาจักร หนึ่งในสกุลเงินที่เก่าแก่ที่สุด' },
    hkd: { name: 'ดอลลาร์ฮ่องกง', description: 'ผูกกับดอลลาร์สหรัฐ ศูนย์กลางการเงินเอเชียที่สำคัญ' },
    inr: { name: 'รูปีอินเดีย', description: 'สกุลเงินของประเทศที่มีประชากรมากที่สุดในโลก' },
    jpy: { name: 'เยนญี่ปุ่น', description: 'สกุลเงินสำรองใหญ่อันดับสาม สินทรัพย์ปลอดภัย' },
    krw: { name: 'วอนเกาหลีใต้', description: 'สกุลเงินของศูนย์กลางเทคโนโลยีและการผลิตที่สำคัญ' },
    mxn: { name: 'เปโซเม็กซิโก', description: 'สกุลเงินของคู่ค้าหลักในอเมริกาเหนือ' },
    nok: { name: 'โครนนอร์เวย์', description: 'สกุลเงินของผู้ส่งออกพลังงานรายใหญ่ เชื่อมโยงกับสินค้าโภคภัณฑ์' },
    sar: { name: 'ริยาลซาอุดีอาระเบีย', description: 'สกุลเงินที่ผูกกับ USD ของผู้ส่งออกน้ำมันรายใหญ่ที่สุดของโลก' },
    sek: { name: 'โครนาสวีเดน', description: 'สกุลเงินนอร์ดิกที่มีฐานอุตสาหกรรม' },
    sgd: { name: 'ดอลลาร์สิงคโปร์', description: 'สกุลเงินภูมิภาคที่แข็งแกร่งในเอเชียตะวันออกเฉียงใต้' },
    usd: { name: 'ดอลลาร์สหรัฐ', description: 'สกุลเงินสำรองที่ใช้กันอย่างแพร่หลายที่สุดในโลกและเป็นมาตรฐานสากล' },
    zar: { name: 'แรนด์แอฟริกาใต้', description: 'สกุลเงินของเศรษฐกิจใหญ่ที่สุดในแอฟริกาและผู้ผลิตสินค้าโภคภัณฑ์' }
  };
  for (const [code, info] of Object.entries(currencyTranslations)) {
    if (t.currencies[code]) {
      if (info.name) t.currencies[code].name = info.name;
      if (info.description) t.currencies[code].description = info.description;
    }
  }

  // Regions
  t.regions.northamerica = 'อเมริกาเหนือ';
  t.regions.europe = 'ยุโรป';
  t.regions.asia = 'เอเชีย';
  t.regions.americas = 'อเมริกา';
  t.regions.middleeast = 'ตะวันออกกลาง';
  t.regions.africa = 'แอฟริกา';

  // Impacts
  t.impacts.High = 'สูง';
  t.impacts.Medium = 'ปานกลาง';
  t.impacts.Low = 'ต่ำ';

  // Currency types
  t.currencyTypes.fiat = 'สกุลเงิน Fiat';
  t.currencyTypes.commodity = 'สกุลเงินสินค้าโภคภัณฑ์';
  t.currencyTypes.crypto = 'สกุลเงินคริปโต';

  // Reserve statuses
  t.reserveStatuses.primaryreservecurrency = 'สกุลเงินสำรองหลัก';
  t.reserveStatuses.secondreservecurrency = 'สกุลเงินสำรองอันดับสอง';
  t.reserveStatuses.thirdreservecurrency = 'สกุลเงินสำรองอันดับสาม';
  t.reserveStatuses.regionalreservecurrency = 'สกุลเงินสำรองระดับภูมิภาค';
  t.reserveStatuses.regional = 'ระดับภูมิภาค';

  // Capital flow types
  t.capitalFlowTypes.safehaveninflows = 'กระแสเงินเข้าสินทรัพย์ปลอดภัย';
  t.capitalFlowTypes.mixedinflows = 'กระแสเงินเข้าผสม';
  t.capitalFlowTypes.exportdrivenflows = 'กระแสเงินจากการส่งออก';
  t.capitalFlowTypes.commoditylinkedflows = 'กระแสเงินเชื่อมโยงสินค้าโภคภัณฑ์';
  t.capitalFlowTypes.open = 'เปิด';
});

// ─── markets.json ────────────────────────────────────────────────────────
fixJSON('markets', (t) => {
  // Commodity names
  const commodityNames = {
    brent: 'น้ำมันดิบเบรนท์',
    copper: 'ทองแดง',
    crudeOil: 'น้ำมันดิบ WTI',
    gold: 'ทองคำ',
    lithium: 'ลิเทียมคาร์บอเนต',
    naturalGas: 'ก๊าซธรรมชาติ',
    silver: 'เงิน',
    uranium: 'ยูเรเนียม',
    wheat: 'ข้าวสาลี'
  };
  for (const [key, name] of Object.entries(commodityNames)) {
    if (t.commodities[key]) t.commodities[key].name = name;
  }

  // Country names
  const countryNames = {
    ae: 'สหรัฐอาหรับเอมิเรตส์', au: 'ออสเตรเลีย', br: 'บราซิล',
    ca: 'แคนาดา', ch: 'สวิตเซอร์แลนด์', cl: 'ชิลี', cn: 'จีน',
    de: 'เยอรมนี', es: 'สเปน', eu: 'สหภาพยุโรป', gb: 'สหราชอาณาจักร',
    hk: 'ฮ่องกง', id: 'อินโดนีเซีย', in: 'อินเดีย', it: 'อิตาลี',
    jp: 'ญี่ปุ่น', kr: 'เกาหลีใต้', mx: 'เม็กซิโก', my: 'มาเลเซีย',
    sa: 'ซาอุดีอาระเบีย', se: 'กลุ่มนอร์ดิกและบอลติก', sg: 'สิงคโปร์',
    th: 'ไทย', tw: 'ไต้หวัน', us: 'สหรัฐอเมริกา', za: 'แอฟริกาใต้'
  };
  for (const [code, name] of Object.entries(countryNames)) {
    if (t.countries[code]) t.countries[code].name = name;
  }

  // Region names
  t.regions.americas.name = 'อเมริกา';
  t.regions.asiaPacific.name = 'เอเชียแปซิฟิก';
  t.regions.europe.name = 'ยุโรป';
  t.regions.middleEastAfrica.name = 'ตะวันออกกลางและแอฟริกา';

  // Exchange regions
  t.exchangeRegions.americas = 'อเมริกา';
  t.exchangeRegions.northAmerica = 'อเมริกาเหนือ';
  t.exchangeRegions.europe = 'ยุโรป';
  t.exchangeRegions.asia = 'เอเชีย';
  t.exchangeRegions.asiaPacific = 'เอเชียแปซิฟิก';
  t.exchangeRegions.oceania = 'โอเชียเนีย';
  t.exchangeRegions.middleEast = 'ตะวันออกกลาง';
  t.exchangeRegions.africa = 'แอฟริกา';
  t.exchangeRegions.middleEastAfrica = 'ตะวันออกกลางและแอฟริกา';
  t.exchangeRegions.latinAmerica = 'ละตินอเมริกา';

  // Sentiment
  t.sentiment.Equities.label = 'หุ้น';
  t.sentiment.FX.label = 'FX';
  t.sentiment.Crypto.label = 'คริปโต';
  t.sentiment.Commodities.label = 'สินค้าโภคภัณฑ์';

  // ytdShort
  t.ytdShort = 'YTD';

  // Some miscellaneous text
  t.advancedScreener = 'ตัวคัดกรองขั้นสูง';
  t.commoditiesHeading = 'พลังงาน โลหะ เกษตรกรรม และวัตถุดิบอุตสาหกรรม';
  t.commoditiesTitle = 'สินค้าโภคภัณฑ์';
  t.regionsHeading = 'ภูมิภาคตลาดโลก';
  t.sectorsTitle = 'กลุ่มอุตสาหกรรม';
  t.equities = 'ตราสารทุน';
});

// ─── Validate all files ──────────────────────────────────────────────────
console.log('\n=== Validation ===');
let allOk = true;
['admin','auth','common','crypto','dashboard','footer','forex','markets','nav','pages'].forEach(f => {
  try {
    JSON.parse(fs.readFileSync(`${LOCALES_DIR}/${f}.json`, 'utf8'));
    console.log(`  ${f}.json: OK`);
  } catch(e) {
    console.log(`  ${f}.json: ERROR - ${e.message}`);
    allOk = false;
  }
});

if (allOk) {
  console.log('\nAll Thai locale files are valid!');
} else {
  console.log('\nSome files have errors. Check above.');
}
