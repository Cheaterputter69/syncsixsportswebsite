// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔥 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCaq5fbEklEXYO8bGs37AsmLpn2Ezw-w_A",
  authDomain: "syncsix-31955.firebaseapp.com",
  databaseURL: "https://syncsix-31955-default-rtdb.firebaseio.com",
  projectId: "syncsix-31955",
  storageBucket: "syncsix-31955.appspot.com",
  messagingSenderId: "778268646395",
  appId: "1:778268646395:web:6808a8773ddc35a79a095e",
  measurementId: "G-VF30T8GS02"
};

// Initialize Firebase + Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔔 Toast Function
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  toast.classList.add("show");

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(30px)";
    toast.classList.remove("show");
  }, 3000);
}

// ==========================
// WAITLIST FORM SUBMISSION
// ==========================
export function setupWaitlistForm() {
  const waitlistForm = document.getElementById("waitlistForm");
  if (waitlistForm) {
    waitlistForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const example = document.getElementById("example").value;

      try {
        // ✅ Save to Firebase Realtime DB
        const newRef = push(ref(db, "waitlist"));
        await set(newRef, {
          username,
          name,
          email,
          example,
          timestamp: new Date().toISOString(),
        });

        // ✅ Send Email Notification (to you)
        emailjs
          .send("syncsixsports", "template_9bik4rf", {
            username,
            name,
            email,
            example,
          })
          .then(() => console.log("📧 Email sent successfully"))
          .catch((err) => console.error("❌ Email send error:", err));

        // ✅ Show toast and reset form
        showToast("✅ Thank you for joining the Waitlist!");
        waitlistForm.reset();
      } catch (err) {
        console.error("Error adding to waitlist:", err);
        showToast("❌ There was an issue submitting your info.");
      }
    });
  }
}


// ==========================
// SUBMIT SYNC FORM SUBMISSION
// ==========================
export function setupSubmitSyncForm() {
  const submitSyncForm = document.getElementById("submitSyncForm");
  if (submitSyncForm) {
    submitSyncForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const user = document.getElementById("syncUser").value;
      const email = document.getElementById("syncEmail").value;
      const sync = document.getElementById("syncExample").value;

      try {
        // ✅ Save submission to Realtime Database
        const newRef = push(ref(db, "syncSubmissions"));
        await set(newRef, {
          user,
          email,
          sync,
          timestamp: new Date().toISOString(),
        });

        // ✅ Send admin notification via EmailJS
        emailjs
          .send("syncsixsports", "template_p2tjeqk", {
            user,
            email,
            sync,
          })
          .then(() => console.log("📧 Sync submission email sent"))
          .catch((err) => console.error("❌ Email send error:", err));

        // ✅ User feedback
        showToast("✅ Thank you for your Sync submission!");
        submitSyncForm.reset();

      } catch (err) {
        console.error("Error adding Sync:", err);
        showToast("❌ There was an issue submitting your Sync.");
      }
    });
  }
}
