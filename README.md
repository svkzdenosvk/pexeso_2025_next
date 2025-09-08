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
components/              # UI components by feature
├── LogReg/              # Login & Registration
├── OutsideTheGame/      # Non-game pages (Home, Rules, About, Images, Error)
├── RelatedToGame/       # Game pages (Board, Settings)
└── StylingComp/         # Theming & styles

lib/                     # Core libraries & setup
├── firebase/            # Firebase config
├── i18n/                # i18n setup + translation files
└── redux/               # Redux store, reducers, middlewares

_inc/                    # Internal logic
├── functions/           # Business logic (login, register, helpers)
└── hooks/               # Custom React hooks

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
