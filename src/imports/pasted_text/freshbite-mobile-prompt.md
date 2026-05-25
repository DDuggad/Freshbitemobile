Master Specification: FreshBite Mobile (Figma & Development Prompt)

1. Project Identity & Global Styles
Theme: Modern "Glassmorphism" with a "Pure Veg" Bangalore aesthetic.

Color Palette:

Primary Green: #10b981 (Brand/Action).

Dark Accents: #064e3b (Headings).

Error/Discount: #dc2626 (Badges/Alerts).

Background: Soft white-to-light-green gradients with backdrop-blur cards.

Typography: Clean sans-serif (Inter/Roboto) with a strong visual hierarchy.

Animations: Smooth 0.3s ease transitions, hover/elevation effects on cards, and fade-in entries.

2. Application Architecture & Navigation
Base URL: https://freshbite.onrender.com/ for all API interactions (auth, deals, vendors).

No-Login Guest Access: Users must be able to land on the homepage and browse deals immediately without authentication.

Dynamic Navigation Bar (Bottom Nav):

Guest/Customer View: [Home, Deals, Vendor Section].

Authenticated Vendor View: [Dashboard, Add Deal, Profile] (Replaces Customer-specific tabs).

3. Detailed Page Flows & UI Elements
A. User/Customer Landing Page

Hero Section: Explainer showing "Save Money, Reduce Waste" benefits.

Primary CTA: "Browse Active Deals" button leading to the Deals Grid.

Visuals: High-quality imagery of vegetarian food from famous Bangalore spots.

B. Deals Browsing Page (Public)

Filter Bar: Horizontal scroll for Cuisine Types (South Indian, North Indian, Italian, Chinese, Continental, Multi-Cuisine, Pure Veg).

Location Picker: Dropdown featuring Bangalore localities: Basavanagudi, Jayanagar, Rajajinagar, Hanumanth Nagar, Malleshwaram, Indiranagar, Koramangala, BTM Layout.

Deal Cards: Show itemName, newPrice with ₹ symbol, originalPrice (struck through), discountPercentage badge, stockAvailable, and a "Jain Food" green 🟢 indicator if applicable.

C. Vendor Landing & Onboarding

Entry: Accessible via the "Vendor" button in the Guest Nav bar.

Onboarding: Shows business benefits (Turn waste to profit). Contains "Login" and "Sign Up" buttons.

Vendor Sign-Up: Clean form requesting only username, email, and password.

Profile Setup (Mandatory post-signup):

Required Fields: Restaurant Name, Full Address, Phone Number, Restaurant Image URL, Google Maps Location URL (e.g., http://maps.google.com/0), and a searchable Location dropdown.

D. Vendor Dashboard (Authenticated)

Overview: List of active deals created by the specific vendor.

Stats: Real-time tracking of claimed items vs. stockAvailable.

Actions: "Edit" or "Delete" (Close) deal buttons.

E. "Add New Deal" Page (Detailed Form)

Header: <h1>➕ Add New Deal</h1> with description text.

Form Structure:

Row 1: Item Name (text) | Food Type (dropdown with standard categories).

Row 2: Description (textarea - 3 rows).

Row 3: Original Price (₹) | Deal Price (₹) | Automatic Discount % Badge calculation.

Row 4: Stock Available | Start Time (datetime-local) | End Time (datetime-local).

Row 5: Image URL (url input).

Actions: Cancel (Secondary) | Create Deal (Primary/Large).

4. Backend Integration Logic
Data Models:

User/Vendor: Store role: 'Vendor' by default. Only allow dashboard access if profileCompleted: true.

Deals: Store prices as Numbers with currency: 'INR'. Ensure dealEndTime > dealStartTime validation.

API Interactions:

POST /api/auth/register (Initial signup).

PUT /api/auth/profile (Initial profile setup and updates).

POST /api/deals (Creating new surplus listings).

GET /api/deals (Public fetching of all active deals).

5. Technical Constraints for Figma AI/Dev
Ensure all monetary values use the ₹ symbol.

Implement ProtectedRoute logic for mobile: Redirect vendors to Profile Setup if profileCompleted is false.

No customer authentication required: Users can view and claim (via external phone/map link) without logging in.




FreshBite Mobile: UI/UX Fix & Implementation Prompt
Objective: Overhaul the existing UI to support a dual-user experience (Guest Customer vs. Authenticated Vendor), fix authentication roadblocks, and implement precise form structures for the Bangalore market.

1. Authentication & Access Logic Overhaul
Remove Global Auth Gates: Disable any default "Sign-in Required" redirects for the root and /deals routes.

Guest-First Access: Customers must land directly on a homepage that highlights platform benefits. No login/signup is required for customers to browse or view deals.

Vendor-Only Auth: Authentication (Login/Signup) is strictly for restaurant vendors.

Entry Points: Provide a "Profile/Vendor" button in the bottom navigation bar. For guests, this leads to a "Vendor Info" page with "Login" and "Sign Up" options.

2. Multi-State Bottom Navigation Bar
Guest State: Display tabs for [Home, Deals, Vendor Hub].

Authenticated Vendor State: Upon successful login, dynamically replace the navigation bar with [Dashboard, Add Deal, Profile].

Transition: Ensure the transition between these states is seamless and updates immediately upon login/logout.

3. Vendor Onboarding & Profile Setup
Simplified Sign-Up: The initial registration form must only request Username, Email, and Password.

Mandatory Profile Completion: Immediately after signup, redirect vendors to a "Complete Your Profile" page.

Required Fields:

Restaurant Name* (Text)

Full Address* (Text)

Phone Number* (Tel)

Restaurant Image URL (URL)

Google Maps Location URL (URL - Example: https://maps.google.com/?q=Your+Restaurant+Name+Location)

Location*: A dropdown menu featuring: Basavanagudi, Jayanagar, Rajajinagar, Hanumanth Nagar, Malleshwaram, Indiranagar, Koramangala, BTM Layout.

4. "Add New Deal" Page Implementation
Create a card-based form with the following structure:

Header: ➕ Add New Deal with sub-text "Create an exciting deal for your customers."

Field Group 1 (Row): Item Name | Food Type (Dropdown: Pure Veg, South Indian, North Indian, Italian, Chinese, Continental, Multi-Cuisine).

Field Group 2: Description (Textarea).

Field Group 3 (Price Row): Original Price (₹) | Deal Price (₹) | Discount Badge (Visual element that auto-calculates % OFF based on price inputs).

Field Group 4 (Availability Row): Stock Available | Start Time (Datetime) | End Time (Datetime).

Field Group 5: Image URL.

Footer Actions: Cancel (Secondary button) and Create Deal (Primary large button).

5. Vendor Dashboard UI
Active Listings: Display a list of current deals created by the vendor.

Status Indicators: Show "Live" or "Expired" badges based on the dealEndTime.

Management Actions: Include "Edit" and "Delete" icons on each deal card.

6. Technical Integration & Data Consistency
API Base URL: Hardcode all service calls to https://freshbite.onrender.com/.

Currency: Use the ₹ symbol for every price field. Ensure the UI class .currency-inr is applied for consistent formatting.

Data Alignment: Map all form inputs to the existing MongoDB schema fields: itemName, foodType, originalPrice, newPrice, stockAvailable, dealStartTime, and dealEndTime.

Jain Options: Ensure the isJain boolean is representable in the UI via a green 🟢 indicator on the Deals page.

Figma/Dev Instruction: Apply these fixes to the current prototype. Prioritize the conditional navigation logic and the specific field requirements for the Vendor Profile and Add Deal pages. Ensure the "Glassmorphism" theme and Bangalore-specific location options are consistently applied.

