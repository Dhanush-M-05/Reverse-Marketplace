## Demo Accounts

Login at `/login` with password **`demo123`**:

| Role   | Email             |
| ------ | ----------------- |
| Buyer  | `buyer@demo.com`  |
| Seller | `seller@demo.com` |
| Admin  | `admin@demo.com`  |

You can also register a new buyer/seller, or click the social buttons on the login page
for one-click demo access. Any email works — a session is simulated.

## Getting Started
## backend run
./mvnw spring-boot:run

## frontend 
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # preview the production build
npm run lint     # run eslint
```

## Folder Structure

```
src/
  assets/        static assets
  components/    reusable UI (Navbar, Sidebar, Footer, cards, Modal, Chat, charts, AI cards...)
  pages/
    public/      Landing, Login, Register, About, Contact, FAQ
    buyer/       Dashboard, Post, Requirements, Details, Quotes, Compare, Orders, Messages, ...
    seller/      Dashboard, Browse, Submit Quote, Submitted Quotes, Reviews, Profile
    admin/       Dashboard, Users, Requirements, Quotes, Orders, Reviews, Disputes, Analytics
  layouts/       PublicLayout, AuthLayout, DashboardLayout
  routes/        navConfig, ProtectedRoute
  hooks/         useLocalStorage, useDebounce
  context/       AuthContext, ThemeContext, ToastContext
  data/          dummy JSON data (users, requirements, quotes, orders, reviews, ...)
  styles/        global.css (design system)
  utils/         format & storage helpers
  App.jsx        routes
  main.jsx       providers + entry
```
## backend run

./mvnw spring-boot:run
