# WearCost

Cost-per-wear truth for your closet.

**Startup idea:** the price tag tells you what you paid, not what it costs. A $200 jacket worn twice is a $100-per-wear mistake; $60 jeans worn 100 times are a 60-cent triumph. WearCost logs wears and ranks your wardrobe - unworn money traps on top, workhorses at the bottom - so the next purchase decision comes with math.

## Use

Open `app.html`. Add items with prices, tap "Wore it today" when you wear them. Each card shows cost per wear (or the full price at stake for unworn items) and a verdict: workhorse, earning it, pricey, closet weight, unworn. Data persists in localStorage.

## Engine

`engine.js` holds the pure logic (cost-per-wear, verdict bands, worst-value-first ranking, wardrobe stats) and is covered by node tests. The UI is a thin render layer over it.

Part of the hourly app factory - 60+ small tools, one per hour.
