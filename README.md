# 🎮 Pexeso Game

A memory matching game (Pexeso) built with **Next.js** and **React**.  
The game features interactive cards, multiple difficulty levels, smooth animations, and state management powered by **Redux Toolkit**.

👉 **[Live Demo](https://pexeso-next.netlify.app/)** – try the game online without installing anything!

---

## ✨ Features

- 🃏 Classic memory card matching (Pexeso)
- ⚡ Multiple difficulty levels (**easy**, **hard**)
- 🎞️ Animated card flipping
- 🔀 Shuffle mechanic on *hard* level
- 🌍 Localization support with **react-i18next**
- 📦 State management using **Redux Toolkit**
- 📱 Responsive design with **Material UI (MUI)**

---

## 📂 Project Structure
```plaintext
public/             # Static files
└── pictures/pexeso # Game image

src/
├── app/            # Next.js App Router – pages & API routes
│   ├── (main)/     # Main user pages (home, login, registration, game, about…)
│   └── api/        # Server API routes (auth, login, logout, registration)
│
├── components/     # UI components
│   ├── LoginReg/   # Login & Registration
│   ├── RelatedToGame/ # Game UI (board, settings…)
│   └── Shared...   # Shared layouts & components
│
├── lib/            # Core setup (firebase, i18n, redux)
├── themes/         # Theme configs
└── _inc/           # Internal helpers
    ├── functions/  # Business logic (auth, validation…)
    └── hooks/      # Custom React hooks

```

---

## 🕹️ How to Play

1. Click on cards to reveal hidden images.  
2. Match pairs of identical cards.  
3. On **hard** level, cards shuffle periodically for an extra challenge.  
4. The game ends when all pairs are matched. 🎉  

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React i18next](https://react.i18next.com/)
- [Material UI](https://mui.com/)

---

## 🚀 Deployment

The easiest way to deploy this app is using **Vercel**, the platform created by the Next.js team.  
For more details, see the [Next.js deployment docs](https://nextjs.org/docs/deployment).  

---

## 🤝 Contributing

Found an issue or want to contribute?  
Feel free to open an **issue** or **pull request** – contributions are welcome!  

---

## ⚡ Getting Started

Install dependencies and run the development server:

```bash
# with npm
npm install
npm run dev

```
Enjoy the game! 🎮
