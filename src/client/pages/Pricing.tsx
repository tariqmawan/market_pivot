import React from "react";
import { Check, CreditCard, ShieldCheck } from "lucide-react";
import { useI18n, type LanguageCode } from "../i18n";
import "./Pricing.css";

type BillingCycle = "monthly" | "yearly";
type PlanId = "starter" | "pro" | "enterprise";

type Plan = {
  id: PlanId;
  name: string;
  monthlyPrice: number | null;
  description: string;
  cta: string;
  popular?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 999,
    description: "Perfect for beginners entering the market.",
    cta: "Start Now",
    features: ["Basic market data", "Daily insights", "Limited signals", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 2999,
    description: "Best for active traders and investors.",
    cta: "Get Pro Access",
    popular: true,
    features: ["AI predictions", "Real-time signals", "Advanced analytics", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    description: "Built for institutions and large teams.",
    cta: "Contact Sales",
    features: ["Unlimited access", "Dedicated manager", "API access", "Custom integrations"],
  },
];

const pricingText: Record<LanguageCode, {
  title: string;
  intro: string;
  monthly: string;
  yearly: string;
  freeMonths: string;
  colorTheme: string;
  logoGold: string;
  emerald: string;
  blue: string;
  slate: string;
  popular: string;
  checkout: string;
  billing: string;
  dueToday: string;
  nextBilling: string;
  secure: string;
  paymentDetails: string;
  contactDetails: string;
  paymentIntro: string;
  enterpriseIntro: string;
  card: string;
  upi: string;
  cardholder: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  paymentDate: string;
  workEmail: string;
  companyName: string;
  subscribe: string;
  requestEnterprise: string;
}> = {
  en: {
    title: "Pricing Plans",
    intro: "Choose a plan, select billing, and complete a Stripe-style checkout flow.",
    monthly: "Monthly",
    yearly: "Yearly",
    freeMonths: "2 months free",
    colorTheme: "Card color",
    logoGold: "Logo gold",
    emerald: "Emerald",
    blue: "Blue",
    slate: "Slate",
    popular: "MOST POPULAR",
    checkout: "Subscription Checkout",
    billing: "Billing",
    dueToday: "Due today",
    nextBilling: "Next billing date",
    secure: "Demo checkout UI. Connect Stripe Checkout or Payment Intents on the backend for real payments.",
    paymentDetails: "Payment Details",
    contactDetails: "Contact Details",
    paymentIntro: "Stripe-style subscription payment form.",
    enterpriseIntro: "Enterprise plans are handled by sales.",
    card: "Card",
    upi: "UPI",
    cardholder: "Cardholder name",
    cardNumber: "Card number",
    expiry: "Expiry date",
    cvc: "CVC",
    paymentDate: "Payment date",
    workEmail: "Work email",
    companyName: "Company name",
    subscribe: "Subscribe",
    requestEnterprise: "Request Enterprise Setup",
  },
  ar: {} as any,
  zh: {} as any,
  ja: {} as any,
  ko: {} as any,
  th: {} as any,
  vi: {} as any,
  it: {} as any,
  es: {} as any,
  de: {} as any,
  fr: {} as any,
  pt: {} as any,
  ru: {} as any,
  pl: {} as any,
  tr: {} as any,
};

const translatedPricingText: Partial<Record<LanguageCode, Partial<typeof pricingText.en>>> = {
  es: { title: "Planes de precios", intro: "Elige un plan, selecciona facturación y completa el pago.", monthly: "Mensual", yearly: "Anual", freeMonths: "2 meses gratis", checkout: "Pago de suscripción", billing: "Facturación", dueToday: "Pago hoy", nextBilling: "Próxima fecha de cobro", paymentDetails: "Detalles de pago", contactDetails: "Datos de contacto", card: "Tarjeta", paymentDate: "Fecha de pago", subscribe: "Suscribirse" },
  fr: { title: "Plans tarifaires", intro: "Choisissez un plan, la facturation et terminez le paiement.", monthly: "Mensuel", yearly: "Annuel", freeMonths: "2 mois offerts", checkout: "Paiement d'abonnement", billing: "Facturation", dueToday: "Dû aujourd'hui", nextBilling: "Prochaine date", paymentDetails: "Détails du paiement", contactDetails: "Coordonnées", card: "Carte", paymentDate: "Date de paiement", subscribe: "S'abonner" },
  de: { title: "Preispläne", intro: "Plan wählen, Abrechnung auswählen und Zahlung abschließen.", monthly: "Monatlich", yearly: "Jährlich", freeMonths: "2 Monate gratis", checkout: "Abo-Zahlung", billing: "Abrechnung", dueToday: "Heute fällig", nextBilling: "Nächste Zahlung", paymentDetails: "Zahlungsdetails", contactDetails: "Kontaktdaten", card: "Karte", paymentDate: "Zahlungsdatum", subscribe: "Abonnieren" },
  pt: { title: "Planos de preços", intro: "Escolha um plano, selecione cobrança e finalize o pagamento.", monthly: "Mensal", yearly: "Anual", freeMonths: "2 meses grátis", checkout: "Checkout de assinatura", billing: "Cobrança", dueToday: "Hoje", nextBilling: "Próxima cobrança", paymentDetails: "Detalhes do pagamento", contactDetails: "Contato", card: "Cartão", paymentDate: "Data de pagamento", subscribe: "Assinar" },
  it: { title: "Piani tariffari", intro: "Scegli un piano, seleziona la fatturazione e completa il pagamento.", monthly: "Mensile", yearly: "Annuale", freeMonths: "2 mesi gratis", checkout: "Pagamento abbonamento", billing: "Fatturazione", dueToday: "Dovuto oggi", nextBilling: "Prossima data", paymentDetails: "Dettagli pagamento", contactDetails: "Contatti", card: "Carta", paymentDate: "Data pagamento", subscribe: "Abbonati" },
  tr: { title: "Fiyat Planları", intro: "Bir plan seçin, faturalamayı belirleyin ve ödemeyi tamamlayın.", monthly: "Aylık", yearly: "Yıllık", freeMonths: "2 ay ücretsiz", checkout: "Abonelik Ödemesi", billing: "Faturalama", dueToday: "Bugün ödenecek", nextBilling: "Sonraki ödeme", paymentDetails: "Ödeme Bilgileri", contactDetails: "İletişim", card: "Kart", paymentDate: "Ödeme tarihi", subscribe: "Abone ol" },
  pl: { title: "Plany cenowe", intro: "Wybierz plan, rozliczenie i zakończ płatność.", monthly: "Miesięcznie", yearly: "Rocznie", freeMonths: "2 miesiące gratis", checkout: "Płatność subskrypcji", billing: "Rozliczenie", dueToday: "Do zapłaty dziś", nextBilling: "Następna płatność", paymentDetails: "Dane płatności", contactDetails: "Kontakt", card: "Karta", paymentDate: "Data płatności", subscribe: "Subskrybuj" },
  ru: { title: "Тарифные планы", intro: "Выберите план, период оплаты и завершите платеж.", monthly: "Ежемесячно", yearly: "Ежегодно", freeMonths: "2 месяца бесплатно", checkout: "Оплата подписки", billing: "Оплата", dueToday: "К оплате сегодня", nextBilling: "Следующая дата", paymentDetails: "Данные оплаты", contactDetails: "Контакты", card: "Карта", paymentDate: "Дата оплаты", subscribe: "Подписаться" },
  zh: { title: "价格方案", intro: "选择方案、账单周期并完成付款。", monthly: "每月", yearly: "每年", freeMonths: "免 2 个月", checkout: "订阅结账", billing: "账单", dueToday: "今日应付", nextBilling: "下次扣款日期", paymentDetails: "付款详情", contactDetails: "联系信息", card: "银行卡", paymentDate: "付款日期", subscribe: "订阅" },
  ja: { title: "料金プラン", intro: "プランと請求周期を選び、支払いを完了します。", monthly: "月額", yearly: "年額", freeMonths: "2か月無料", checkout: "サブスクリプション決済", billing: "請求", dueToday: "本日の支払い", nextBilling: "次回請求日", paymentDetails: "支払い情報", contactDetails: "連絡先", card: "カード", paymentDate: "支払日", subscribe: "購読" },
  ko: { title: "요금제", intro: "요금제와 결제 주기를 선택하고 결제를 완료하세요.", monthly: "월간", yearly: "연간", freeMonths: "2개월 무료", checkout: "구독 결제", billing: "결제 주기", dueToday: "오늘 결제", nextBilling: "다음 결제일", paymentDetails: "결제 정보", contactDetails: "연락처", card: "카드", paymentDate: "결제일", subscribe: "구독" },
  th: { title: "แพ็กเกจราคา", intro: "เลือกแพ็กเกจ รอบบิล และชำระเงินให้เสร็จ", monthly: "รายเดือน", yearly: "รายปี", freeMonths: "ฟรี 2 เดือน", checkout: "ชำระค่าสมาชิก", billing: "รอบบิล", dueToday: "ชำระวันนี้", nextBilling: "วันชำระครั้งถัดไป", paymentDetails: "รายละเอียดการชำระเงิน", contactDetails: "ข้อมูลติดต่อ", card: "บัตร", paymentDate: "วันที่ชำระเงิน", subscribe: "สมัครสมาชิก" },
  vi: { title: "Bảng giá", intro: "Chọn gói, chu kỳ thanh toán và hoàn tất thanh toán.", monthly: "Hàng tháng", yearly: "Hàng năm", freeMonths: "miễn phí 2 tháng", checkout: "Thanh toán đăng ký", billing: "Thanh toán", dueToday: "Thanh toán hôm nay", nextBilling: "Ngày thanh toán tiếp", paymentDetails: "Thông tin thanh toán", contactDetails: "Liên hệ", card: "Thẻ", paymentDate: "Ngày thanh toán", subscribe: "Đăng ký" },
  ar: { title: "خطط الأسعار", intro: "اختر الخطة والفوترة وأكمل الدفع.", monthly: "شهري", yearly: "سنوي", freeMonths: "شهران مجاناً", checkout: "دفع الاشتراك", billing: "الفوترة", dueToday: "المستحق اليوم", nextBilling: "تاريخ الدفع القادم", paymentDetails: "تفاصيل الدفع", contactDetails: "بيانات الاتصال", card: "بطاقة", paymentDate: "تاريخ الدفع", subscribe: "اشترك" },
};

const getPricingText = (language: LanguageCode) => ({ ...pricingText.en, ...(translatedPricingText[language] ?? {}) });

const colorThemes = [
  { id: "logo-gold", labelKey: "logoGold", color: "#a27841", dark: "#111827" },
  { id: "emerald", labelKey: "emerald", color: "#087f5b", dark: "#10231c" },
  { id: "blue", labelKey: "blue", color: "#2563eb", dark: "#111d3a" },
  { id: "slate", labelKey: "slate", color: "#475569", dark: "#111827" },
] as const;

const formatPrice = (plan: Plan, cycle: BillingCycle) => {
  if (plan.monthlyPrice === null) return "Custom";
  const amount = cycle === "yearly" ? plan.monthlyPrice * 10 : plan.monthlyPrice;
  return `Rs ${amount.toLocaleString("en-IN")}`;
};

const getNextBillingDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
};

const Pricing = () => {
  const { language } = useI18n();
  const copy = getPricingText(language);
  const [selectedPlanId, setSelectedPlanId] = React.useState<PlanId>("pro");
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>("monthly");
  const [colorThemeId, setColorThemeId] = React.useState<(typeof colorThemes)[number]["id"]>("logo-gold");
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "upi">("card");
  const [cardName, setCardName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");
  const [upiId, setUpiId] = React.useState("");
  const [nextBillingDate, setNextBillingDate] = React.useState(getNextBillingDate());
  const [message, setMessage] = React.useState("");

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[1];
  const colorTheme = colorThemes.find((theme) => theme.id === colorThemeId) ?? colorThemes[0];
  const isEnterprise = selectedPlan.monthlyPrice === null;
  const dueToday = selectedPlan.monthlyPrice === null ? 0 : billingCycle === "yearly" ? selectedPlan.monthlyPrice * 10 : selectedPlan.monthlyPrice;

  const selectPlan = (plan: Plan) => {
    setSelectedPlanId(plan.id);
    setMessage("");
    const checkout = document.getElementById("checkout");
    checkout?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitPayment = (event: React.FormEvent) => {
    event.preventDefault();

    if (isEnterprise) {
      setMessage("Sales request saved. Our team will contact you for Enterprise subscription setup.");
      return;
    }

    if (paymentMethod === "card" && (!cardName.trim() || cardNumber.replace(/\s/g, "").length < 12 || !expiry.trim() || !cvc.trim())) {
      setMessage("Please enter valid card details to create the subscription.");
      return;
    }

    if (paymentMethod === "upi" && !upiId.trim()) {
      setMessage("Please enter a valid UPI ID.");
      return;
    }

    const subscription = {
      plan: selectedPlan.name,
      billingCycle,
      amount: dueToday,
      paymentMethod,
      nextBillingDate,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("mp_subscription", JSON.stringify(subscription));
    setMessage(`${selectedPlan.name} subscription activated. Next billing date: ${nextBillingDate}.`);
  };

  return (
    <div
      className="pricing-page"
      style={{
        "--pricing-accent": colorTheme.color,
        "--pricing-dark": colorTheme.dark,
      } as React.CSSProperties}
    >
      <div className="pricing-header">
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </div>

      <div className="billing-toggle" aria-label="Billing cycle">
        <button type="button" className={billingCycle === "monthly" ? "active" : ""} onClick={() => setBillingCycle("monthly")}>
          {copy.monthly}
        </button>
        <button type="button" className={billingCycle === "yearly" ? "active" : ""} onClick={() => setBillingCycle("yearly")}>
          {copy.yearly}
          <span>{copy.freeMonths}</span>
        </button>
      </div>

      <div className="pricing-theme-picker" aria-label={copy.colorTheme}>
        <span>{copy.colorTheme}</span>
        {colorThemes.map((theme) => (
          <button
            type="button"
            key={theme.id}
            className={colorThemeId === theme.id ? "active" : ""}
            style={{ "--swatch": theme.color } as React.CSSProperties}
            onClick={() => setColorThemeId(theme.id)}
          >
            <i />
            {copy[theme.labelKey]}
          </button>
        ))}
      </div>

      <div className="pricing-container">
        {plans.map((plan) => (
          <div key={plan.id} className={`pricing-card ${plan.popular ? "active" : ""} ${selectedPlanId === plan.id ? "selected" : ""}`}>
            {plan.popular ? <div className="badge">{copy.popular}</div> : null}

            <h2>{plan.name}</h2>

            <div className="price">
              {formatPrice(plan, billingCycle)} {plan.monthlyPrice !== null ? <span>/{billingCycle === "monthly" ? copy.monthly : copy.yearly}</span> : null}
            </div>

            <p className="desc">{plan.description}</p>

            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <button type="button" onClick={() => selectPlan(plan)}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <section className="checkout-panel" id="checkout">
        <div className="checkout-summary">
          <p className="checkout-kicker">{copy.checkout}</p>
          <h2>{selectedPlan.name}</h2>
          <p>{selectedPlan.description}</p>

          <div className="summary-row">
            <span>{copy.billing}</span>
            <strong>{billingCycle === "monthly" ? copy.monthly : copy.yearly}</strong>
          </div>
          <div className="summary-row">
            <span>{copy.dueToday}</span>
            <strong>{isEnterprise ? "Sales assisted" : `Rs ${dueToday.toLocaleString("en-IN")}`}</strong>
          </div>
          <div className="summary-row">
            <span>{copy.nextBilling}</span>
            <strong>{isEnterprise ? "After contract" : nextBillingDate}</strong>
          </div>

          <div className="checkout-secure">
            <ShieldCheck size={18} />
            <span>{copy.secure}</span>
          </div>
        </div>

        <form className="payment-form" onSubmit={submitPayment}>
          <div className="payment-form-head">
            <CreditCard size={20} />
            <div>
              <h3>{isEnterprise ? copy.contactDetails : copy.paymentDetails}</h3>
              <p>{isEnterprise ? copy.enterpriseIntro : copy.paymentIntro}</p>
            </div>
          </div>

          {!isEnterprise ? (
            <>
              <div className="payment-methods">
                <button type="button" className={paymentMethod === "card" ? "active" : ""} onClick={() => setPaymentMethod("card")}>
                  {copy.card}
                </button>
                <button type="button" className={paymentMethod === "upi" ? "active" : ""} onClick={() => setPaymentMethod("upi")}>
                  {copy.upi}
                </button>
              </div>

              {paymentMethod === "card" ? (
                <div className="payment-grid">
                  <label>
                    {copy.cardholder}
                    <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Rahul Sharma" />
                  </label>
                  <label>
                    {copy.cardNumber}
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                    />
                  </label>
                  <label>
                    {copy.expiry}
                    <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
                  </label>
                  <label>
                    {copy.cvc}
                    <input value={cvc} onChange={(e) => setCvc(e.target.value)} inputMode="numeric" placeholder="123" />
                  </label>
                </div>
              ) : (
                <div className="payment-grid">
                  <label>
                    {copy.upi} ID
                    <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@upi" />
                  </label>
                </div>
              )}

              <label className="billing-date-field">
                {copy.paymentDate}
                <input type="date" value={nextBillingDate} onChange={(e) => setNextBillingDate(e.target.value)} />
              </label>
            </>
          ) : (
            <div className="payment-grid">
              <label>
                {copy.workEmail}
                <input placeholder="finance@company.com" />
              </label>
              <label>
                {copy.companyName}
                <input placeholder="Company Pvt Ltd" />
              </label>
            </div>
          )}

          <button type="submit" className="subscribe-button">
            <Check size={18} />
            {isEnterprise ? copy.requestEnterprise : `${copy.subscribe} ${selectedPlan.name}`}
          </button>

          {message ? <div className="payment-message">{message}</div> : null}
        </form>
      </section>
    </div>
  );
};

export default Pricing;
