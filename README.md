# CodeQuest: Learn to Code, For Real 🚀

Welcome to **CodeQuest**, a gamified mobile education platform designed to make learning programming languages and concepts as engaging as playing your favorite mobile game.

Traditional coding education on mobile is often dry, text-heavy, or fundamentally disconnected from real development environments. CodeQuest breaks this mold. By fusing a colorful, interactive user interface (inspired by hit language-learning apps) with an embedded **Mobile IDE**, learners don't just memorize syntax—they write, run, and debug real code on the go.

## 🎯 What this is

CodeQuest is an Expo-powered React Native application that guides users from complete novices to capable developers. Whether it's Python, Web Development, Mobile Apps, or AI, CodeQuest maps out the journey into bite-sized, interactive "Levels."

Our mission? **Lower the barrier to entry for coding by making it accessible, visual, and highly rewarding.**

## 🧩 How it works: Architecture & Flow

The app is built using **React Native**, orchestrated by **Expo**, and beautifully styled with **NativeWind** (Tailwind CSS for React Native). We leverage `@react-navigation/native` to handle the intricate flow from onboarding to core gameplay.

### Component Flow Map

Here is the life cycle of a user traversing the CodeQuest universe:

```ascii
                      +-------------------+
                      |   App Launch      |
                      |   (App.tsx)       |
                      +---------+---------+
                                |
                                v
                      +-------------------+
             +--------+   Authentication  +--------+
             |        |    (Screen4)      |        |
             |        +---------+---------+        |
             |                  |                  |
      [New User]         [Existing User]    [Social Auth]
             |                  |                  |
             v                  |                  v
  +-------------------+         |         +-------------------+
  |   Onboarding      |         |         | OAuth Integration |
  | (Screens 1, 2, 3) |         |         | (Apple / Google)  |
  +---------+---------+         |         +-------------------+
            |                   |
            +-------------------+
                                |
                                v
                      +-------------------+
                      |   Main Hub (Tabs) | <=================+
                      |  (AppNavigator)   |                   |
                      +---------+---------+                   |
                                |                             |
           +---------------+----+----+---------------+        |
           |               |         |               |        |
           v               v         v               v        |
     +-----------+  +-----------+ +-----------+ +-----------+ |
     | Learn Map |  |  Explore  | |  Badges   | |  Profile  | |
     | (Screen6) |  | (Screen7) | | (Screen9) | |(Screen11) | |
     +-----+-----+  +-----------+ +-----------+ +-----------+ |
           |                                                  |
           v                                                  |
    +-------------+                                           |
    | Lesson Node |  (e.g., Variables & Loops)                |
    +-----+-------+                                           |
          |                                                   |
          v                                                   |
    +-------------+     +-------------+     +-------------+   |
    | Lesson Intro| --> | Lesson Quiz | --> | Lesson Wrap |   |
    | (Screen5)   |     | (Screen8)   |     | (Screen10)  |   |
    +-------------+     +------+------+     +------+------+   |
                               |                   |          |
                               v                   |          |
                        +-------------+            |          |
                        | Mobile IDE  |            |          |
                        | (Screen12)  |            |          |
                        +-------------+            |          |
                               |                   |          |
                               +-------------------+----------+
```

### Key Modules:
*   **Navigation (`navigation/AppNavigator.tsx`)**: Manages the transitions. Separates the `Auth` stack, the `Onboarding` flow, the `MainTabs` (bottom bar navigation), and the `Lesson` stack (modals/full-screen overlays).
*   **Styling (`global.css`, `tailwind.config.js`)**: Utilizing NativeWind to bridge Tailwind utility classes to React Native Stylesheets. We define custom brand colors (like our signature `#1CB0F6` primary blue) directly in configuration for consistent theming.
*   **Fonts (`App.tsx`)**: We rely heavily on `@expo-google-fonts` (Fredoka, Plus Jakarta Sans, Fira Code) to give the app its friendly, game-like typography and a crisp, readable monospace font for the IDE.

## 💡 Why it matters

Learning to code is hard. Staring at a blank terminal is intimidating. CodeQuest matters because it replaces the terminal with a vibrant "Unit Map." It matters because every time you solve a loop correctly, you earn gems and maintain a streak, tapping into the same psychological rewards that keep people playing games. It empowers users to practice problem-solving while waiting for a bus or lying in bed.

## 🚀 How to use it (Setup & Installation)

Because CodeQuest relies heavily on specific React Native and Expo versions, we've Dockerized the environment to ensure a consistent developer experience without the hassle of `node_modules` conflicts or global dependency hell.

### Prerequisites
*   Docker & Docker Compose
*   Expo Go app on your physical mobile device (for local network testing)

### Running the Project

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/codequest.git
    cd codequest
    ```

2.  **Start the Docker Container:**
    This command builds the Docker image and starts the Expo development server in the background.
    ```bash
    docker compose up --build -d
    ```

3.  **Find the Expo QR Code:**
    Once the container is running, check the logs to find the Expo QR code.
    ```bash
    docker compose logs -f
    ```

4.  **Connect your device:**
    *   Ensure your mobile device is on the **same Wi-Fi network** as your host machine.
    *   Open the **Expo Go** app on your iOS or Android device.
    *   Scan the QR code displayed in the terminal logs.

### Important Notes for Docker
*   **LAN Testing:** For Expo to communicate with your phone from inside Docker, `REACT_NATIVE_PACKAGER_HOSTNAME` is configured to use your host's IP address.
*   **Hot Reloading:** We utilize `CHOKIDAR_USEPOLLING=true` so that changes made in your local IDE instantly reflect on your device, even across the Docker volume boundary.

## 🤝 How to contribute

We welcome contributions! Whether it's adding a new lesson type, fixing a UI glitch, or optimizing the Mobile IDE.

1.  **Understand the Paradigm:** We prefer hoisting static arrays and objects outside of React components to avoid unnecessary memory reallocation. Stick to explicit type annotations and standard `function` declarations over arrow functions for top-level components.
2.  **UI Consistency:** Always use `SafeAreaView` from `react-native-safe-area-context` (not `react-native`). Use NativeWind classes for styling. Icons are provided via `@expo/vector-icons` (specifically `MaterialIcons`).
3.  **Pull Requests:** Create a feature branch, make your changes, and submit a PR with a clear description of the problem solved and a screenshot (if it's a UI change).

---

*CodeQuest — Turning syntax into an adventure.*
