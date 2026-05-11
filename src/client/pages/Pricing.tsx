import "./Pricing.css";

const Pricing = () => {
  return (
    <div className="pricing-page">

      <div className="pricing-header">
        <h1>Pricing Plans</h1>

        <p>
          Choose the perfect plan for your trading journey.
        </p>
      </div>

      <div className="pricing-container">

        {/* Starter */}
        <div className="pricing-card">

          <h2>Starter</h2>

          <div className="price">
            ₹999 <span>/month</span>
          </div>

          <p className="desc">
            Perfect for beginners entering the market.
          </p>

          <ul>
            <li>✓ Basic Market Data</li>
            <li>✓ Daily Insights</li>
            <li>✓ Limited Signals</li>
            <li>✓ Email Support</li>
          </ul>

          <button>Start Now</button>
        </div>

        {/* Pro */}
        <div className="pricing-card active">

          <div className="badge">
            MOST POPULAR
          </div>

          <h2>Pro</h2>

          <div className="price">
            ₹2999 <span>/month</span>
          </div>

          <p className="desc">
            Best for active traders & investors.
          </p>

          <ul>
            <li>✓ AI Predictions</li>
            <li>✓ Real-Time Signals</li>
            <li>✓ Advanced Analytics</li>
            <li>✓ Priority Support</li>
          </ul>

          <button>Get Pro Access</button>
        </div>

        {/* Enterprise */}
        <div className="pricing-card">

          <h2>Enterprise</h2>

          <div className="price">
            Custom
          </div>

          <p className="desc">
            Built for institutions & large teams.
          </p>

          <ul>
            <li>✓ Unlimited Access</li>
            <li>✓ Dedicated Manager</li>
            <li>✓ API Access</li>
            <li>✓ Custom Integrations</li>
          </ul>

          <button>Contact Sales</button>
        </div>

      </div>

    </div>
  );
};

export default Pricing;