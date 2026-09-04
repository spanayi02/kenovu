# Kenovu — User Flows

## 1. The core demo flow (~60–90s)

1. Reset demo data (optional, ensures a clean state).
2. Enter **Business Mode**.
3. Tap **Create Kenovu Slot**.
4. Pick a service (e.g. Deep Tissue Massage, 60 min, €55).
5. Confirm date/time (defaults to Today).
6. Set Kenovu price (quick picks -10%/-20%/-30%/-40% or custom) → e.g. €38.
7. Preview what the customer will see.
8. **Publish** → "Your Kenovu Slot is live."
9. Tap **View as customer** → switches to Customer Mode on Discover, the
   new slot is visible.
10. Open the slot → Slot Details.
11. **Book for €38** → confirmation screen → **Confirm booking** → short
    processing state → **You're booked!** with a booking reference.
12. Switch back to **Business Mode**.
13. The slot now shows **BOOKED**, with the customer name and the booking
    listed under Bookings/metrics.

## 2. Customer discovery → booking

Discover (browse/search/filter) → tap a slot card → Slot Details → **Book
for €X** → Booking Confirmation (review) → Confirm → brief processing →
Success screen (reference, "View booking", "Add to calendar" affordance).

Edge cases handled: slot booked by someone else in the meantime (button
disables, friendly message), slot expired while viewing, direct
navigation to a stale/removed slot ID (not-found state).

## 3. Saving a business

Anywhere a business is shown (slot card, slot details, business page) → tap
the heart → added to **Saved**. Persists across refresh. Saved screen shows
"Get notified when this business has a last-minute opening" as a future
capability, not a working notification.

## 4. Managing bookings

**My Bookings** → Upcoming / Past / Cancelled tabs. Upcoming booking shows
business, service, date/time, area, price, status badge.

## 5. Business: publishing a slot

Today dashboard → **Create Kenovu Slot** (also reachable from Slots tab) →
4-step flow (service → time → price → preview) → Publish → success state
with **View as customer** shortcut.

## 6. Business: seeing a booking happen

Slots tab shows slot status change `ACTIVE → BOOKED` live (shared state).
Today dashboard's metrics (bookings count, revenue recovered, empty time
filled) update. Bookings tab lists the new booking with customer name and
price breakdown.

## 7. Demo Mode switch

A small, persistent but unobtrusive control (not part of normal customer
chrome) lets the demo operator switch Customer ⇄ Business at any time,
and reset all data back to the original seed.
