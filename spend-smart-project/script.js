// Fixed categories and localStorage keys
const CATEGORIES = ["Food", "Travel", "Books", "Fun", "Other"];
const EXPENSES_STORAGE_KEY = "spendsmart_expenses";
const BUDGET_STORAGE_KEY = "spendsmart_budget";
const PROFILE_STORAGE_KEY = "spendsmart_profile";
const PROFILE_COMPLETE_KEY = "spendsmart_profile_complete";
const SAVED_PROFILES_KEY = "spendsmart_saved_profiles";
const SESSION_ACTIVE_KEY = "spendsmart_logged_in";
const THEME_STORAGE_KEY = "spendsmart_dark_mode";
const MAX_PHOTO_BYTES = 1024 * 1024; // 1 MB limit so photo fits cleanly in localStorage

// Initial sample expenses for first-time visitors
const sampleExpenses = [
  { id: 1, title: "Canteen lunch", amount: 80, category: "Food", date: "2026-11-02" },
  { id: 2, title: "Bus pass", amount: 300, category: "Travel", date: "2026-11-03" },
  { id: 3, title: "Maths notebook", amount: 120, category: "Books", date: "2026-11-05" },
  { id: 4, title: "Movie with friends", amount: 250, category: "Fun", date: "2026-11-08" },
  { id: 5, title: "Phone recharge", amount: 199, category: "Other", date: "2026-11-10" }
];

// Blank template for a new student profile before onboarding is completed
const emptyProfile = {
  name: "",
  roll: "",
  college: "",
  room: "",
  course: "",
  allowance: 0,
  emergency: "",
  goal: "",
  photo: ""
};

// Page titles and subtitles for navigation sections
const SECTION_INFO = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Track daily hostel expenses and stay within your monthly budget"
  },
  history: {
    title: "Expense History",
    subtitle: "Search, filter, sort, export, edit, or delete recorded expenses"
  },
  analytics: {
    title: "Spending Analytics",
    subtitle: "Compare category totals and calculate safe daily spending"
  },
  profile: {
    title: "Student Profile",
    subtitle: "Complete your student card, photo, allowance, and monthly budget"
  },
  settings: {
    title: "Settings",
    subtitle: "Customize theme, manage your account, or reset saved data"
  }
};

// App state
let expenses = [];
let monthlyBudget = 0;
let editingId = null;
let profile = { ...emptyProfile };
let savedProfiles = [];
let isProfileComplete = false;
let isLoggedIn = false;
let isDarkMode = false;
let pendingDataAction = null;

// Welcome page elements
const welcomePageEl = document.getElementById("welcome-page");
const appShellEl = document.getElementById("app-shell");
const welcomeGreetingEl = document.getElementById("welcome-greeting");
const welcomeStatsStripEl = document.getElementById("welcome-stats-strip");
const welcomeTotalCountEl = document.getElementById("welcome-total-count");
const welcomeTotalSpentEl = document.getElementById("welcome-total-spent");
const welcomeBudgetPillEl = document.getElementById("welcome-budget-pill");
const welcomeAutofillBoxEl = document.getElementById("welcome-autofill-box");
const autofillProfileSelectEl = document.getElementById("autofill-profile-select");
const autofillProfileBtn = document.getElementById("autofill-profile-btn");
const welcomeAutofillMsgEl = document.getElementById("welcome-autofill-msg");
const welcomePhotoPreviewEl = document.getElementById("welcome-photo-preview");
const welcomePhotoLabelEl = document.getElementById("welcome-photo-label");
const welcomePhotoInput = document.getElementById("welcome-photo-input");
const welcomeRemovePhotoBtn = document.getElementById("welcome-remove-photo-btn");
const welcomePhotoErrorEl = document.getElementById("welcome-photo-error");
const welcomeForm = document.getElementById("welcome-form");
const welcomeNameInput = document.getElementById("welcome-name-input");
const welcomeRollInput = document.getElementById("welcome-roll-input");
const welcomeCollegeInput = document.getElementById("welcome-college-input");
const welcomeRoomInput = document.getElementById("welcome-room-input");
const welcomeCourseInput = document.getElementById("welcome-course-input");
const welcomeAllowanceInput = document.getElementById("welcome-allowance-input");
const welcomeAllowanceErrorEl = document.getElementById("welcome-allowance-error");
const welcomeBudgetInput = document.getElementById("welcome-budget-input");
const welcomeBudgetErrorEl = document.getElementById("welcome-budget-error");
const welcomeEmergencyInput = document.getElementById("welcome-emergency-input");
const welcomeGoalInput = document.getElementById("welcome-goal-input");
const welcomeProfileMsgEl = document.getElementById("welcome-profile-msg");
const startAppBtn = document.getElementById("start-app-btn");
const welcomeUpdateProfileBtn = document.getElementById("welcome-update-profile-btn");
const welcomeHistoryBtn = document.getElementById("welcome-history-btn");
const welcomeProfileBtn = document.getElementById("welcome-profile-btn");

// Navigation & header elements
const navMenuEl = document.getElementById("nav-menu");
const navWelcomeBtn = document.getElementById("nav-welcome-btn");
const pageTitleEl = document.getElementById("page-title");
const pageSubtitleEl = document.getElementById("page-subtitle");
const topbarBudgetPillEl = document.getElementById("topbar-budget-pill");
const sidebarAvatarEl = document.getElementById("sidebar-avatar");
const sidebarStudentNameEl = document.getElementById("sidebar-student-name");
const sidebarStudentRoomEl = document.getElementById("sidebar-student-room");

// Dashboard elements
const totalSpentEl = document.getElementById("total-spent");
const kpiBudgetStatusEl = document.getElementById("kpi-budget-status");
const highestCategoryEl = document.getElementById("highest-category");
const totalCountEl = document.getElementById("total-count");

const budgetInput = document.getElementById("budget-input");
const setBudgetBtn = document.getElementById("set-budget-btn");
const budgetErrorEl = document.getElementById("budget-error");
const budgetStatusEl = document.getElementById("budget-status");
const budgetWarningEl = document.getElementById("budget-warning");
const progressBarEl = document.getElementById("progress-bar");
const progressLabelEl = document.getElementById("progress-label");

const formHeadingEl = document.getElementById("form-heading");
const presetButtonsEl = document.getElementById("preset-buttons");
const expenseForm = document.getElementById("expense-form");
const titleInput = document.getElementById("title-input");
const amountInput = document.getElementById("amount-input");
const categoryInput = document.getElementById("category-input");
const dateInput = document.getElementById("date-input");
const titleErrorEl = document.getElementById("title-error");
const amountErrorEl = document.getElementById("amount-error");
const dateErrorEl = document.getElementById("date-error");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

const filterCategorySelect = document.getElementById("filter-category");
const filterTotalEl = document.getElementById("filter-total");
const expenseListEl = document.getElementById("expense-list");
const emptyMessageEl = document.getElementById("empty-message");

// History section elements
const historySearchInput = document.getElementById("history-search");
const historyFilterSelect = document.getElementById("history-filter-category");
const historySortSelect = document.getElementById("history-sort");
const historySummaryEl = document.getElementById("history-summary");
const exportCsvBtn = document.getElementById("export-csv-btn");
const historyExportMsgEl = document.getElementById("history-export-msg");
const historyListEl = document.getElementById("history-list");
const historyEmptyEl = document.getElementById("history-empty");

// Analytics section elements
const analyticsSectionEl = document.getElementById("section-analytics");
const avgExpenseEl = document.getElementById("avg-expense");
const largestExpenseEl = document.getElementById("largest-expense");
const safeDailySpendEl = document.getElementById("safe-daily-spend");
const analyticsBarsEl = document.getElementById("analytics-bars");
const calcExpressionEl = document.getElementById("calc-expression");
const calcDisplayEl = document.getElementById("calc-display");
const calcKeypadEl = document.getElementById("calc-keypad");
const calcSplitButtonsEl = document.getElementById("calc-split-buttons");
const calcUseExpenseBtn = document.getElementById("calc-use-expense-btn");
const calcFeedbackEl = document.getElementById("calc-feedback");

// Calculator state
let calcCurrent = "0";
let calcPrevious = null;
let calcOperator = null;
let calcJustEvaluated = false;

// Profile section elements
const profileOnboardingBannerEl = document.getElementById("profile-onboarding-banner");
const profileAutofillBoxEl = document.getElementById("profile-autofill-box");
const profileAutofillSelectEl = document.getElementById("profile-autofill-select");
const profileAutofillBtn = document.getElementById("profile-autofill-btn");
const profileForm = document.getElementById("profile-form");
const profileNameInput = document.getElementById("profile-name");
const profileRollInput = document.getElementById("profile-roll");
const profileCollegeInput = document.getElementById("profile-college");
const profileRoomInput = document.getElementById("profile-room");
const profileCourseInput = document.getElementById("profile-course");
const profileAllowanceInput = document.getElementById("profile-allowance");
const profileEmergencyInput = document.getElementById("profile-emergency");
const profileGoalInput = document.getElementById("profile-goal");
const profileNameErrorEl = document.getElementById("profile-name-error");
const profileRollErrorEl = document.getElementById("profile-roll-error");
const profileCollegeErrorEl = document.getElementById("profile-college-error");
const profileRoomErrorEl = document.getElementById("profile-room-error");
const profileCourseErrorEl = document.getElementById("profile-course-error");
const profileAllowanceErrorEl = document.getElementById("profile-allowance-error");
const profileGoalErrorEl = document.getElementById("profile-goal-error");
const profileSaveBtn = document.getElementById("profile-save-btn");
const profileSavedMsgEl = document.getElementById("profile-saved-msg");
const profileAvatarEl = document.getElementById("profile-avatar");
const profileDisplayNameEl = document.getElementById("profile-display-name");
const profileDisplayCollegeEl = document.getElementById("profile-display-college");
const profileDisplayDetailsEl = document.getElementById("profile-display-details");
const profileDisplayRollEl = document.getElementById("profile-display-roll");
const profileDisplayEmergencyEl = document.getElementById("profile-display-emergency");
const profileDisplayAllowanceEl = document.getElementById("profile-display-allowance");
const profileDisplayGoalEl = document.getElementById("profile-display-goal");
const photoUploadLabelEl = document.getElementById("photo-upload-label");
const profilePhotoInput = document.getElementById("profile-photo-input");
const removePhotoBtn = document.getElementById("remove-photo-btn");
const profilePhotoErrorEl = document.getElementById("profile-photo-error");
const profileBudgetInput = document.getElementById("profile-budget-input");
const profileBudgetBtn = document.getElementById("profile-budget-btn");
const profileBudgetErrorEl = document.getElementById("profile-budget-error");
const profileBudgetMsgEl = document.getElementById("profile-budget-msg");

// Settings section elements
const darkModeToggleBtn = document.getElementById("dark-mode-toggle");
const settingsBudgetInput = document.getElementById("settings-budget-input");
const settingsBudgetBtn = document.getElementById("settings-budget-btn");
const settingsBudgetErrorEl = document.getElementById("settings-budget-error");
const settingsBudgetMsgEl = document.getElementById("settings-budget-msg");
const logoutBtn = document.getElementById("logout-btn");
const createNewAccountBtn = document.getElementById("create-new-account-btn");
const resetSampleBtn = document.getElementById("reset-sample-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const confirmBoxEl = document.getElementById("confirm-box");
const confirmTextEl = document.getElementById("confirm-text");
const confirmYesBtn = document.getElementById("confirm-yes-btn");
const confirmNoBtn = document.getElementById("confirm-no-btn");
const settingsDataMsgEl = document.getElementById("settings-data-msg");

// Safely escapes user text so HTML tags display as plain text
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Formats numbers neatly (e.g. 80 -> Rs. 80, 12.5 -> Rs. 12.50) without float glitches
function formatMoney(amount) {
  const cleanAmount = Math.round(Number(amount) * 100) / 100;
  if (Number.isInteger(cleanAmount)) {
    return `Rs. ${cleanAmount}`;
  }
  return `Rs. ${cleanAmount.toFixed(2)}`;
}

// Sums expense amounts in paise using reduce() to avoid floating point glitches
function sumAmounts(list) {
  const totalPaise = list.reduce(function (sum, item) {
    return sum + Math.round(Number(item.amount) * 100);
  }, 0);
  return totalPaise / 100;
}

// Returns today's date formatted as YYYY-MM-DD for quick presets
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Shows or clears a red validation error message under an input
function setFieldError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  inputEl.classList.toggle("input-error", message !== "");
}

// Creates two-letter avatar initials from a student's name
function getInitials(name) {
  const parts = name.trim().split(" ").filter(function (word) {
    return word !== "";
  });
  if (parts.length === 0) {
    return "HS";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Renders either the student's uploaded photo or fallback initials into an avatar box
function renderAvatar(containerEl, photoData, initials) {
  if (photoData && photoData.indexOf("data:image/") === 0) {
    containerEl.innerHTML = `<img src="${escapeHTML(photoData)}" alt="Student profile photo" class="avatar-img" />`;
  } else {
    containerEl.textContent = initials;
  }
}

// Syncs all budget inputs across Welcome (when logged in), Dashboard, Profile, and Settings
function syncBudgetInputs() {
  const budgetText = monthlyBudget > 0 ? String(monthlyBudget) : "";
  budgetInput.value = budgetText;
  profileBudgetInput.value = budgetText;
  settingsBudgetInput.value = budgetText;
  welcomeBudgetInput.value = isLoggedIn ? budgetText : "";
}

// Checks whether a profile object has every required field and a photo completed
function hasCompleteProfileFields(profileObj) {
  return Boolean(
    profileObj &&
    profileObj.name.trim() !== "" &&
    profileObj.roll.trim() !== "" &&
    profileObj.college.trim() !== "" &&
    profileObj.room.trim() !== "" &&
    profileObj.course.trim() !== "" &&
    Number(profileObj.allowance) > 0 &&
    profileObj.goal.trim() !== "" &&
    profileObj.photo &&
    profileObj.photo.indexOf("data:image/") === 0
  );
}

// Creates a unique key for saving a student's profile snapshot for autofill
function getProfileSnapshotKey(profileObj) {
  return `${profileObj.name.trim().toLowerCase()}_${profileObj.roll.trim().toLowerCase()}`;
}

// Saves or updates the current completed student profile in the savedProfiles list
function saveCurrentProfileSnapshot() {
  if (!isProfileComplete || !hasCompleteProfileFields(profile)) {
    return;
  }

  const key = getProfileSnapshotKey(profile);
  const snapshot = {
    key: key,
    profile: { ...profile },
    monthlyBudget: monthlyBudget,
    expenses: expenses.map(function (item) {
      return {
        id: item.id,
        title: item.title,
        amount: item.amount,
        category: item.category,
        date: item.date
      };
    })
  };

  const existing = savedProfiles.filter(function (entry) {
    return entry.key !== key;
  });
  savedProfiles = [snapshot].concat(existing);
}

// Loads expenses, budget, profile, saved autofill profiles, session state, and theme safely
function loadData() {
  try {
    const savedExpenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (savedExpenses === null) {
      expenses = sampleExpenses.map(function (item) {
        return {
          id: item.id,
          title: item.title,
          amount: item.amount,
          category: item.category,
          date: item.date
        };
      });
    } else {
      const parsedExpenses = JSON.parse(savedExpenses);
      expenses = Array.isArray(parsedExpenses) ? parsedExpenses : [];
    }
  } catch (error) {
    expenses = [];
  }

  try {
    const savedBudget = localStorage.getItem(BUDGET_STORAGE_KEY);
    if (savedBudget !== null) {
      const parsedBudget = Number(savedBudget);
      if (!Number.isNaN(parsedBudget) && parsedBudget > 0) {
        monthlyBudget = Math.round(parsedBudget * 100) / 100;
      }
    }
  } catch (error) {
    monthlyBudget = 0;
  }

  try {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile !== null) {
      const parsedProfile = JSON.parse(savedProfile);
      if (parsedProfile && typeof parsedProfile === "object") {
        profile = {
          name: parsedProfile.name || "",
          roll: parsedProfile.roll || "",
          college: parsedProfile.college || "",
          room: parsedProfile.room || "",
          course: parsedProfile.course || "",
          allowance: parsedProfile.allowance ? Number(parsedProfile.allowance) : 0,
          emergency: parsedProfile.emergency || "",
          goal: parsedProfile.goal || "",
          photo: parsedProfile.photo || ""
        };
      }
    }
  } catch (error) {
    profile = { ...emptyProfile };
  }

  try {
    const rawSavedList = localStorage.getItem(SAVED_PROFILES_KEY);
    const parsedSavedList = rawSavedList ? JSON.parse(rawSavedList) : [];
    savedProfiles = Array.isArray(parsedSavedList) ? parsedSavedList : [];
  } catch (error) {
    savedProfiles = [];
  }

  try {
    const savedComplete = localStorage.getItem(PROFILE_COMPLETE_KEY) === "true";
    isProfileComplete = savedComplete && hasCompleteProfileFields(profile);
    isLoggedIn = localStorage.getItem(SESSION_ACTIVE_KEY) === "true" && isProfileComplete;
    isDarkMode = localStorage.getItem(THEME_STORAGE_KEY) === "true";
  } catch (error) {
    isProfileComplete = false;
    isLoggedIn = false;
    isDarkMode = false;
  }

  if (isProfileComplete && savedProfiles.length === 0) {
    saveCurrentProfileSnapshot();
  }

  syncBudgetInputs();
}

// Saves expenses, budget, profile, autofill snapshots, session state, and theme
function saveData() {
  saveCurrentProfileSnapshot();
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    localStorage.setItem(BUDGET_STORAGE_KEY, String(monthlyBudget));
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem(PROFILE_COMPLETE_KEY, String(isProfileComplete));
    localStorage.setItem(SAVED_PROFILES_KEY, JSON.stringify(savedProfiles));
    localStorage.setItem(SESSION_ACTIVE_KEY, String(isLoggedIn));
    localStorage.setItem(THEME_STORAGE_KEY, String(isDarkMode));
  } catch (error) {
    // Ignore storage errors if localStorage is full or disabled
  }
}

// Populates the previous-profile autofill dropdowns on Welcome and Profile
function renderAutofillOptions() {
  const hasSaved = savedProfiles.length > 0;
  welcomeAutofillBoxEl.classList.toggle("hidden", !hasSaved);
  profileAutofillBoxEl.classList.toggle("hidden", !hasSaved || isProfileComplete);

  if (!hasSaved) {
    autofillProfileSelectEl.innerHTML = "";
    profileAutofillSelectEl.innerHTML = "";
    return;
  }

  const optionsHtml = savedProfiles.map(function (entry) {
    const label = `${escapeHTML(entry.profile.name)} (${escapeHTML(entry.profile.roll)})`;
    return `<option value="${escapeHTML(entry.key)}">${label}</option>`;
  }).join("");

  autofillProfileSelectEl.innerHTML = optionsHtml;
  profileAutofillSelectEl.innerHTML = optionsHtml;
}

// Autofills a previously saved student profile into Welcome or the Profile form
function autofillSelectedProfile(selectEl, sourceMode) {
  const selectedKey = selectEl.value;
  const chosen = savedProfiles.filter(function (entry) {
    return entry.key === selectedKey;
  })[0] || savedProfiles[0];

  if (!chosen) {
    return;
  }

  profile = { ...chosen.profile };
  monthlyBudget = Number(chosen.monthlyBudget) > 0 ? Number(chosen.monthlyBudget) : 0;
  expenses = Array.isArray(chosen.expenses)
    ? chosen.expenses.map(function (item) {
      return {
        id: item.id,
        title: item.title,
        amount: item.amount,
        category: item.category,
        date: item.date
      };
    })
    : [];

  renderProfile();
  clearProfileErrors();
  refreshAllViews();

  if (sourceMode === "welcome") {
    fillWelcomeProfileInputs(profile);
    welcomeBudgetInput.value = monthlyBudget > 0 ? String(monthlyBudget) : "";
    setFieldError(welcomeBudgetInput, welcomeBudgetErrorEl, "");
    setFieldError(welcomeAllowanceInput, welcomeAllowanceErrorEl, "");
    welcomeProfileMsgEl.classList.add("hidden");
    startAppBtn.textContent = "Create Profile";
    welcomeAutofillMsgEl.textContent = `Autofilled ${profile.name}'s details! Choose a photo and click Create Profile.`;
    welcomeAutofillMsgEl.classList.remove("hidden");
    saveData();
    updateNavLocks();
  } else {
    syncBudgetInputs();
    profileSavedMsgEl.textContent = `Autofilled ${profile.name}'s details. Choose a photo and click Save & Unlock Dashboard!`;
    profileSavedMsgEl.classList.remove("hidden");
  }
}

// Updates sidebar tab locks and removes the Welcome tab once the user logs in
function updateNavLocks() {
  const navButtons = navMenuEl.querySelectorAll(".nav-btn");
  navButtons.forEach(function (btn) {
    const target = btn.dataset.section;
    const isLocked = !isProfileComplete && target !== "welcome" && target !== "profile";
    btn.classList.toggle("locked", isLocked);
  });

  navWelcomeBtn.classList.toggle("hidden", isLoggedIn && isProfileComplete);
  profileOnboardingBannerEl.classList.toggle("hidden", isProfileComplete);
  profileSaveBtn.textContent = isProfileComplete ? "Save Profile" : "Save & Unlock Dashboard";
}

// Switches between the Welcome page and app sections, removing Welcome after login
function showSection(sectionName) {
  if (sectionName === "welcome") {
    if (isLoggedIn && isProfileComplete) {
      sectionName = "dashboard";
    } else {
      welcomePageEl.classList.remove("hidden");
      appShellEl.classList.add("hidden");
      updateWelcomeStats();
      return;
    }
  }

  let targetSection = sectionName;
  if (!isProfileComplete && targetSection !== "profile") {
    targetSection = "profile";
    profileOnboardingBannerEl.classList.remove("hidden");
    profileOnboardingBannerEl.classList.remove("shake");
    profileOnboardingBannerEl.classList.add("shake");
  }

  welcomePageEl.classList.add("hidden");
  appShellEl.classList.remove("hidden");

  const sectionKeys = Object.keys(SECTION_INFO);
  sectionKeys.forEach(function (key) {
    const sectionEl = document.getElementById(`section-${key}`);
    sectionEl.classList.toggle("hidden", key !== targetSection);
  });

  const navButtons = navMenuEl.querySelectorAll(".nav-btn");
  navButtons.forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.section === targetSection);
  });

  const info = SECTION_INFO[targetSection] || SECTION_INFO.dashboard;
  pageTitleEl.textContent = info.title;
  pageSubtitleEl.textContent = info.subtitle;
}

// Fills or clears the Quick Setup Profile inputs on the Welcome page
function fillWelcomeProfileInputs(sourceProfile) {
  welcomeNameInput.value = sourceProfile.name || "";
  welcomeRollInput.value = sourceProfile.roll || "";
  welcomeCollegeInput.value = sourceProfile.college || "";
  welcomeRoomInput.value = sourceProfile.room || "";
  welcomeCourseInput.value = sourceProfile.course || "";
  welcomeAllowanceInput.value = sourceProfile.allowance > 0 ? String(sourceProfile.allowance) : "";
  welcomeEmergencyInput.value = sourceProfile.emergency || "";
  welcomeGoalInput.value = sourceProfile.goal || "";
}

// Updates the Welcome page photo preview and remove button state
function renderWelcomePhoto() {
  const initials = getInitials(welcomeNameInput.value || profile.name || "Hostel Student");
  renderAvatar(welcomePhotoPreviewEl, profile.photo, initials);
  welcomeRemovePhotoBtn.classList.toggle("hidden", !profile.photo);
}

// Updates the Welcome page cleanly without leaking previous data before login
function updateWelcomeStats() {
  welcomeStatsStripEl.classList.add("hidden");
  welcomeHistoryBtn.classList.add("hidden");
  welcomeProfileBtn.classList.add("hidden");
  welcomeAutofillMsgEl.classList.add("hidden");
  welcomeProfileMsgEl.classList.add("hidden");
  welcomePhotoErrorEl.textContent = "";
  setFieldError(welcomeAllowanceInput, welcomeAllowanceErrorEl, "");
  setFieldError(welcomeBudgetInput, welcomeBudgetErrorEl, "");

  welcomeTotalCountEl.textContent = "0";
  welcomeTotalSpentEl.textContent = "Rs. 0";
  welcomeBudgetPillEl.textContent = "Not set";
  fillWelcomeProfileInputs(emptyProfile);
  welcomeBudgetInput.value = "";

  startAppBtn.textContent = "Create Profile";
  welcomeGreetingEl.textContent =
    "Track every chai, canteen meal, bus pass, and late-night snack — upload your photo and create your profile to begin.";

  renderWelcomePhoto();
  renderAutofillOptions();
}

// Reads Quick Setup Profile values and saves them into the active profile state
function applyQuickSetupFields() {
  const rawAllowance = welcomeAllowanceInput.value.trim();
  if (rawAllowance !== "") {
    const parsedAllowance = Number(rawAllowance);
    if (Number.isNaN(parsedAllowance) || !Number.isFinite(parsedAllowance) || parsedAllowance <= 0) {
      setFieldError(welcomeAllowanceInput, welcomeAllowanceErrorEl, "Enter a monthly allowance greater than 0.");
      return false;
    }
    profile.allowance = Math.round(parsedAllowance * 100) / 100;
  }
  setFieldError(welcomeAllowanceInput, welcomeAllowanceErrorEl, "");

  const quickBudgetRaw = welcomeBudgetInput.value.trim();
  if (quickBudgetRaw !== "") {
    const ok = applyBudgetValue(quickBudgetRaw, welcomeBudgetInput, welcomeBudgetErrorEl);
    if (!ok) {
      return false;
    }
  } else {
    setFieldError(welcomeBudgetInput, welcomeBudgetErrorEl, "");
  }

  if (welcomeNameInput.value.trim() !== "") profile.name = welcomeNameInput.value.trim();
  if (welcomeRollInput.value.trim() !== "") profile.roll = welcomeRollInput.value.trim();
  if (welcomeCollegeInput.value.trim() !== "") profile.college = welcomeCollegeInput.value.trim();
  if (welcomeRoomInput.value.trim() !== "") profile.room = welcomeRoomInput.value.trim();
  if (welcomeCourseInput.value.trim() !== "") profile.course = welcomeCourseInput.value.trim();
  if (welcomeEmergencyInput.value.trim() !== "") profile.emergency = welcomeEmergencyInput.value.trim();
  if (welcomeGoalInput.value.trim() !== "") profile.goal = welcomeGoalInput.value.trim();

  return true;
}

// Updates profile directly from the Quick Setup Profile section on Welcome
function updateQuickSetupProfile() {
  if (!applyQuickSetupFields()) {
    welcomeProfileMsgEl.classList.add("hidden");
    return;
  }

  saveData();
  renderProfile();
  renderWelcomePhoto();
  welcomeProfileMsgEl.textContent = hasCompleteProfileFields(profile)
    ? "Quick profile updated! Click Create Profile to enter your Dashboard."
    : "Quick profile updated! Upload your photo and click Create Profile to finish remaining details.";
  welcomeProfileMsgEl.classList.remove("hidden");
}

// Handles Welcome page Create Profile submission, requiring a profile photo first
function handleWelcomeStart(event) {
  event.preventDefault();

  if (!profile.photo || profile.photo.indexOf("data:image/") !== 0) {
    welcomePhotoErrorEl.textContent = "Please choose a profile photo to continue.";
    return;
  }
  welcomePhotoErrorEl.textContent = "";

  if (!applyQuickSetupFields()) {
    return;
  }

  if (hasCompleteProfileFields(profile)) {
    isProfileComplete = true;
    isLoggedIn = true;
    saveData();
    renderProfile();
    renderAutofillOptions();
    updateNavLocks();
    showSection("dashboard");
    return;
  }

  saveData();
  renderProfile();
  updateNavLocks();
  renderAutofillOptions();
  showSection("profile");
  profileNameInput.focus();
}

// Handles sidebar navigation button clicks via event delegation
function handleNavClick(event) {
  const navBtn = event.target.closest(".nav-btn");
  if (!navBtn) {
    return;
  }
  showSection(navBtn.dataset.section);
}

// Fills the expense form when a Quick Hostel Preset chip is clicked
function handlePresetClick(event) {
  const chip = event.target.closest(".preset-chip");
  if (!chip) {
    return;
  }

  titleInput.value = chip.dataset.title || "";
  amountInput.value = chip.dataset.amount || "";
  categoryInput.value = chip.dataset.category || "Food";
  dateInput.value = getTodayDate();

  setFieldError(titleInput, titleErrorEl, "");
  setFieldError(amountInput, amountErrorEl, "");
  setFieldError(dateInput, dateErrorEl, "");
  titleInput.focus();
}

// Validates title, amount, and date fields and shows inline red error messages
function validateForm() {
  let isValid = true;

  const trimmedTitle = titleInput.value.trim();
  if (trimmedTitle === "") {
    setFieldError(titleInput, titleErrorEl, "Please enter an expense title.");
    isValid = false;
  } else {
    setFieldError(titleInput, titleErrorEl, "");
  }

  const rawAmount = amountInput.value.trim();
  const parsedAmount = Number(rawAmount);
  if (rawAmount === "" || Number.isNaN(parsedAmount) || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    setFieldError(amountInput, amountErrorEl, "Enter an amount greater than 0.");
    isValid = false;
  } else {
    setFieldError(amountInput, amountErrorEl, "");
  }

  if (dateInput.value === "") {
    setFieldError(dateInput, dateErrorEl, "Please pick a date.");
    isValid = false;
  } else {
    setFieldError(dateInput, dateErrorEl, "");
  }

  return isValid;
}

// Clears the expense form, validation errors, and resets Edit mode back to Add mode
function resetForm() {
  expenseForm.reset();
  editingId = null;
  formHeadingEl.textContent = "Add Expense";
  submitBtn.textContent = "Add Expense";
  cancelEditBtn.classList.add("hidden");

  setFieldError(titleInput, titleErrorEl, "");
  setFieldError(amountInput, amountErrorEl, "");
  setFieldError(dateInput, dateErrorEl, "");
}

// Generates a unique numeric ID for a new expense
function getNextId() {
  const highestId = expenses.reduce(function (max, item) {
    return item.id > max ? item.id : max;
  }, 0);
  return highestId + 1;
}

// Adds a new expense or saves changes to the expense currently being edited
function addExpense(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const title = titleInput.value.trim();
  const amount = Math.round(Number(amountInput.value.trim()) * 100) / 100;
  const category = categoryInput.value;
  const date = dateInput.value;

  if (editingId !== null) {
    expenses = expenses.map(function (item) {
      if (item.id === editingId) {
        return { id: item.id, title: title, amount: amount, category: category, date: date };
      }
      return item;
    });
  } else {
    expenses.push({
      id: getNextId(),
      title: title,
      amount: amount,
      category: category,
      date: date
    });
  }

  saveData();
  resetForm();
  refreshAllViews();
}

// Fills the form with an existing expense and navigates to Dashboard to edit it
function startEditExpense(id) {
  const expenseToEdit = expenses.filter(function (item) {
    return item.id === id;
  })[0];

  if (!expenseToEdit) {
    return;
  }

  editingId = expenseToEdit.id;
  titleInput.value = expenseToEdit.title;
  amountInput.value = String(expenseToEdit.amount);
  categoryInput.value = expenseToEdit.category;
  dateInput.value = expenseToEdit.date;

  setFieldError(titleInput, titleErrorEl, "");
  setFieldError(amountInput, amountErrorEl, "");
  setFieldError(dateInput, dateErrorEl, "");

  formHeadingEl.textContent = "Edit Expense";
  submitBtn.textContent = "Save changes";
  cancelEditBtn.classList.remove("hidden");

  showSection("dashboard");
  titleInput.focus();
}

// Deletes an expense by ID and resets the form if that expense was being edited
function deleteExpense(id) {
  expenses = expenses.filter(function (item) {
    return item.id !== id;
  });

  if (editingId === id) {
    resetForm();
  }

  saveData();
  refreshAllViews();
}

// Handles Edit and Delete button clicks using event delegation on expense lists
function handleListClick(event) {
  const clickedButton = event.target.closest("button");
  if (!clickedButton) {
    return;
  }

  const expenseId = Number(clickedButton.dataset.id);
  if (clickedButton.classList.contains("delete-btn")) {
    deleteExpense(expenseId);
  } else if (clickedButton.classList.contains("edit-btn")) {
    startEditExpense(expenseId);
  }
}

// Validates and applies a new monthly budget across Dashboard, Profile, and Settings
function applyBudgetValue(rawBudget, inputEl, errorEl) {
  const trimmed = rawBudget.trim();
  const parsedBudget = Number(trimmed);

  if (trimmed === "" || Number.isNaN(parsedBudget) || !Number.isFinite(parsedBudget) || parsedBudget <= 0) {
    setFieldError(inputEl, errorEl, "Please enter a budget greater than 0.");
    return false;
  }

  setFieldError(budgetInput, budgetErrorEl, "");
  setFieldError(profileBudgetInput, profileBudgetErrorEl, "");
  setFieldError(settingsBudgetInput, settingsBudgetErrorEl, "");
  setFieldError(welcomeBudgetInput, welcomeBudgetErrorEl, "");

  monthlyBudget = Math.round(parsedBudget * 100) / 100;
  syncBudgetInputs();
  saveData();
  refreshAllViews();
  return true;
}

// Handles Set budget button click on the Dashboard
function setBudget() {
  applyBudgetValue(budgetInput.value, budgetInput, budgetErrorEl);
}

// Handles Update Budget button click on the Profile page
function setBudgetFromProfile() {
  const ok = applyBudgetValue(profileBudgetInput.value, profileBudgetInput, profileBudgetErrorEl);
  if (ok) {
    profileBudgetMsgEl.textContent = `Monthly budget updated to ${formatMoney(monthlyBudget)}.`;
    profileBudgetMsgEl.classList.remove("hidden");
  } else {
    profileBudgetMsgEl.classList.add("hidden");
  }
}

// Handles Update Budget button click on the Settings page
function setBudgetFromSettings() {
  const ok = applyBudgetValue(settingsBudgetInput.value, settingsBudgetInput, settingsBudgetErrorEl);
  if (ok) {
    settingsBudgetMsgEl.textContent = `Monthly budget updated to ${formatMoney(monthlyBudget)}.`;
    settingsBudgetMsgEl.classList.remove("hidden");
  } else {
    settingsBudgetMsgEl.classList.add("hidden");
  }
}

// Finds which category has the highest total spending
function getHighestCategory() {
  if (expenses.length === 0) {
    return "None yet";
  }

  let topCategory = "";
  let topTotal = -1;

  CATEGORIES.forEach(function (category) {
    const categoryItems = expenses.filter(function (item) {
      return item.category === category;
    });
    const categoryTotal = sumAmounts(categoryItems);
    if (categoryTotal > topTotal) {
      topTotal = categoryTotal;
      topCategory = category;
    }
  });

  if (topTotal <= 0) {
    return "None yet";
  }
  return `${topCategory} (${formatMoney(topTotal)})`;
}

// Updates KPIs, remaining/over-budget status, progress bar, and highest category
function updateSummary() {
  const totalSpent = sumAmounts(expenses);
  totalSpentEl.textContent = formatMoney(totalSpent);
  highestCategoryEl.textContent = getHighestCategory();
  totalCountEl.textContent = String(expenses.length);

  if (monthlyBudget <= 0) {
    kpiBudgetStatusEl.textContent = "Not set";
    topbarBudgetPillEl.textContent = "Budget: Not set";
    budgetStatusEl.textContent = "Set a monthly budget to track remaining balance.";
    budgetStatusEl.classList.remove("over-budget");
    budgetWarningEl.classList.add("hidden");
    progressBarEl.style.width = "0%";
    progressBarEl.classList.toggle("bar-green", true);
    progressBarEl.classList.toggle("bar-orange", false);
    progressBarEl.classList.toggle("bar-red", false);
    progressLabelEl.textContent = "No budget set yet";
    return;
  }

  const difference = Math.round((monthlyBudget - totalSpent) * 100) / 100;
  const isOverBudget = difference < 0;

  if (isOverBudget) {
    const overAmount = Math.abs(difference);
    budgetStatusEl.textContent = `Over budget by ${formatMoney(overAmount)}`;
    kpiBudgetStatusEl.textContent = `-${formatMoney(overAmount)}`;
    budgetWarningEl.textContent = `Warning: Spending crossed your ${formatMoney(monthlyBudget)} budget!`;
  } else {
    budgetStatusEl.textContent = `Remaining: ${formatMoney(difference)}`;
    kpiBudgetStatusEl.textContent = formatMoney(difference);
    budgetWarningEl.textContent = "";
  }

  topbarBudgetPillEl.textContent = `Budget: ${formatMoney(monthlyBudget)}`;
  budgetStatusEl.classList.toggle("over-budget", isOverBudget);
  budgetWarningEl.classList.toggle("hidden", !isOverBudget);

  const rawPercent = (totalSpent / monthlyBudget) * 100;
  const barWidth = Math.min(rawPercent, 100);
  progressBarEl.style.width = `${barWidth}%`;

  const isGreen = rawPercent < 70;
  const isOrange = rawPercent >= 70 && rawPercent <= 100;
  const isRed = rawPercent > 100;

  progressBarEl.classList.toggle("bar-green", isGreen);
  progressBarEl.classList.toggle("bar-orange", isOrange);
  progressBarEl.classList.toggle("bar-red", isRed);

  progressLabelEl.textContent = `${Math.round(rawPercent)}% of budget used`;
}

// Builds HTML string for an array of expense items
function buildExpenseRowsHtml(list) {
  return list.map(function (item) {
    return `
      <li class="expense-item">
        <div class="expense-info">
          <span class="expense-title">${escapeHTML(item.title)}</span>
          <div class="expense-meta">
            <span class="category-tag">${escapeHTML(item.category)}</span>
            <span>${escapeHTML(item.date)}</span>
          </div>
        </div>
        <div class="expense-right">
          <span class="expense-amount">${formatMoney(item.amount)}</span>
          <div class="row-actions">
            <button type="button" class="btn btn-small edit-btn" data-id="${item.id}">Edit</button>
            <button type="button" class="btn btn-small delete-btn" data-id="${item.id}">Delete</button>
          </div>
        </div>
      </li>
    `;
  }).join("");
}

// Filters and renders the Dashboard expense list and selected category total
function renderList() {
  const selectedCategory = filterCategorySelect.value;

  const visibleExpenses = expenses.filter(function (item) {
    return selectedCategory === "All" || item.category === selectedCategory;
  });

  const filteredTotal = sumAmounts(visibleExpenses);
  filterTotalEl.textContent = `Showing ${selectedCategory}: ${formatMoney(filteredTotal)}`;

  if (visibleExpenses.length === 0) {
    expenseListEl.innerHTML = "";
    emptyMessageEl.textContent = expenses.length === 0
      ? "No expenses yet"
      : `No expenses in ${selectedCategory}`;
    emptyMessageEl.classList.remove("hidden");
    return;
  }

  emptyMessageEl.classList.add("hidden");
  expenseListEl.innerHTML = buildExpenseRowsHtml(visibleExpenses);
}

// Searches, filters, sorts, and renders the History page expense list
function renderHistory() {
  const searchQuery = historySearchInput.value.trim().toLowerCase();
  const categoryFilter = historyFilterSelect.value;
  const sortMode = historySortSelect.value;

  const matched = expenses.filter(function (item) {
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const sorted = matched.slice().sort(function (a, b) {
    if (sortMode === "oldest") {
      return a.date.localeCompare(b.date);
    }
    if (sortMode === "highest") {
      return b.amount - a.amount;
    }
    if (sortMode === "lowest") {
      return a.amount - b.amount;
    }
    return b.date.localeCompare(a.date);
  });

  const matchedTotal = sumAmounts(sorted);
  historySummaryEl.textContent = `Showing ${sorted.length} expense${sorted.length === 1 ? "" : "s"} • Total: ${formatMoney(matchedTotal)}`;

  if (sorted.length === 0) {
    historyListEl.innerHTML = "";
    historyEmptyEl.textContent = expenses.length === 0
      ? "No expenses yet"
      : "No matching expenses found";
    historyEmptyEl.classList.remove("hidden");
    return;
  }

  historyEmptyEl.classList.add("hidden");
  historyListEl.innerHTML = buildExpenseRowsHtml(sorted);
}

// Escapes a single CSV field safely
function csvCell(value) {
  const safe = String(value).replace(/"/g, '""');
  return `"${safe}"`;
}

// Downloads all recorded expenses as a CSV file
function exportExpensesCSV() {
  if (expenses.length === 0) {
    historyExportMsgEl.textContent = "Add at least one expense before exporting CSV.";
    return;
  }

  historyExportMsgEl.textContent = "";
  const header = "ID,Title,Amount,Category,Date";
  const lines = expenses.map(function (item) {
    return [
      csvCell(item.id),
      csvCell(item.title),
      csvCell(item.amount),
      csvCell(item.category),
      csvCell(item.date)
    ].join(",");
  });

  const csvContent = `${header}\n${lines.join("\n")}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "spendsmart-expenses.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

// Renders category breakdown bars, averages, and safe daily spend on Analytics
function renderAnalytics() {
  const totalSpent = sumAmounts(expenses);

  if (expenses.length === 0) {
    avgExpenseEl.textContent = "Rs. 0";
    largestExpenseEl.textContent = "None yet";
  } else {
    const avg = totalSpent / expenses.length;
    avgExpenseEl.textContent = formatMoney(avg);

    const largest = expenses.reduce(function (best, item) {
      return item.amount > best.amount ? item : best;
    }, expenses[0]);
    largestExpenseEl.textContent = `${largest.title} (${formatMoney(largest.amount)})`;
  }

  if (monthlyBudget <= 0) {
    safeDailySpendEl.textContent = "Set budget";
  } else {
    const remaining = Math.round((monthlyBudget - totalSpent) * 100) / 100;
    if (remaining <= 0) {
      safeDailySpendEl.textContent = "Rs. 0 / day";
    } else {
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const daysLeft = Math.max(daysInMonth - today.getDate() + 1, 1);
      safeDailySpendEl.textContent = `${formatMoney(remaining / daysLeft)} / day`;
    }
  }

  const barsHtml = CATEGORIES.map(function (category) {
    const categoryItems = expenses.filter(function (item) {
      return item.category === category;
    });
    const categoryTotal = sumAmounts(categoryItems);
    const percent = totalSpent > 0 ? Math.round((categoryTotal / totalSpent) * 100) : 0;

    return `
      <div class="analytics-row">
        <div class="analytics-row-head">
          <span>${escapeHTML(category)}</span>
          <span>${formatMoney(categoryTotal)} (${percent}%)</span>
        </div>
        <div class="analytics-track">
          <div class="analytics-fill" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }).join("");

  analyticsBarsEl.innerHTML = barsHtml;
}

// Updates the Profile section display, photo, and sidebar user badge
function renderProfile() {
  const displayName = profile.name || "Your Name";
  const initials = getInitials(displayName);

  renderAvatar(sidebarAvatarEl, profile.photo, initials);
  renderAvatar(profileAvatarEl, profile.photo, initials);
  removePhotoBtn.classList.toggle("hidden", !profile.photo);

  sidebarStudentNameEl.textContent = profile.name || "Setup Profile";
  sidebarStudentRoomEl.textContent = profile.room ? `Room ${profile.room}` : "Room --";

  profileDisplayNameEl.textContent = displayName;
  profileDisplayCollegeEl.textContent = profile.college || "Hostel / College";
  profileDisplayDetailsEl.textContent = `Room ${profile.room || "--"} • ${profile.course || "Course"}`;
  profileDisplayRollEl.textContent = `Roll No: ${profile.roll || "--"}`;
  profileDisplayEmergencyEl.textContent = `Emergency: ${profile.emergency || "Not added"}`;
  profileDisplayAllowanceEl.textContent = profile.allowance > 0
    ? `Allowance: ${formatMoney(profile.allowance)}`
    : "Allowance: Not set";
  profileDisplayGoalEl.textContent = profile.goal || "Add your monthly saving goal";

  profileNameInput.value = profile.name;
  profileRollInput.value = profile.roll;
  profileCollegeInput.value = profile.college;
  profileRoomInput.value = profile.room;
  profileCourseInput.value = profile.course;
  profileAllowanceInput.value = profile.allowance > 0 ? String(profile.allowance) : "";
  profileEmergencyInput.value = profile.emergency;
  profileGoalInput.value = profile.goal;
}

// Validates and loads an image file as the student's profile photo
function processPhotoFile(file, errorEl) {
  if (!file) {
    return;
  }

  if (file.type.indexOf("image/") !== 0) {
    errorEl.textContent = "Please choose a valid image file (PNG, JPG, etc.).";
    return;
  }

  if (file.size > MAX_PHOTO_BYTES) {
    errorEl.textContent = "Image is too large. Please pick a photo under 1 MB.";
    return;
  }

  welcomePhotoErrorEl.textContent = "";
  profilePhotoErrorEl.textContent = "";
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    profile.photo = String(reader.result || "");
    saveData();
    renderProfile();
    renderWelcomePhoto();
  });
  reader.readAsDataURL(file);
}

// Handles selecting a profile photo file from Welcome or Profile inputs
function handlePhotoChange(event) {
  const inputEl = event.target;
  const errorEl = inputEl === welcomePhotoInput ? welcomePhotoErrorEl : profilePhotoErrorEl;
  const file = inputEl.files && inputEl.files[0];
  processPhotoFile(file, errorEl);
}

// Removes the uploaded profile photo and restores initials across Welcome and Profile
function removeProfilePhoto() {
  profile.photo = "";
  welcomePhotoInput.value = "";
  profilePhotoInput.value = "";
  welcomePhotoErrorEl.textContent = "";
  profilePhotoErrorEl.textContent = "";
  saveData();
  renderProfile();
  renderWelcomePhoto();
}

// Validates all required student profile fields before saving and unlocking the app
function validateProfileForm() {
  let isValid = true;

  const requiredFields = [
    { input: profileNameInput, error: profileNameErrorEl, msg: "Please enter your full name." },
    { input: profileRollInput, error: profileRollErrorEl, msg: "Please enter your student ID / roll no." },
    { input: profileCollegeInput, error: profileCollegeErrorEl, msg: "Please enter your hostel or college name." },
    { input: profileRoomInput, error: profileRoomErrorEl, msg: "Please enter your room number." },
    { input: profileCourseInput, error: profileCourseErrorEl, msg: "Please enter your course and semester." },
    { input: profileGoalInput, error: profileGoalErrorEl, msg: "Please enter a monthly saving goal." }
  ];

  requiredFields.forEach(function (field) {
    if (field.input.value.trim() === "") {
      setFieldError(field.input, field.error, field.msg);
      isValid = false;
    } else {
      setFieldError(field.input, field.error, "");
    }
  });

  const rawAllowance = profileAllowanceInput.value.trim();
  const parsedAllowance = Number(rawAllowance);
  if (rawAllowance === "" || Number.isNaN(parsedAllowance) || !Number.isFinite(parsedAllowance) || parsedAllowance <= 0) {
    setFieldError(profileAllowanceInput, profileAllowanceErrorEl, "Enter a monthly allowance greater than 0.");
    isValid = false;
  } else {
    setFieldError(profileAllowanceInput, profileAllowanceErrorEl, "");
  }

  if (!profile.photo || profile.photo.indexOf("data:image/") !== 0) {
    profilePhotoErrorEl.textContent = "Please choose a profile photo.";
    isValid = false;
  } else {
    profilePhotoErrorEl.textContent = "";
  }

  return isValid;
}

// Saves a complete student profile, unlocks tabs, hides Welcome, and opens Dashboard
function saveProfile(event) {
  event.preventDefault();

  if (!validateProfileForm()) {
    profileSavedMsgEl.classList.add("hidden");
    return;
  }

  const wasIncomplete = !isProfileComplete;

  profile = {
    name: profileNameInput.value.trim(),
    roll: profileRollInput.value.trim(),
    college: profileCollegeInput.value.trim(),
    room: profileRoomInput.value.trim(),
    course: profileCourseInput.value.trim(),
    allowance: Math.round(Number(profileAllowanceInput.value.trim()) * 100) / 100,
    emergency: profileEmergencyInput.value.trim(),
    goal: profileGoalInput.value.trim(),
    photo: profile.photo
  };

  isProfileComplete = true;
  isLoggedIn = true;

  saveData();
  renderProfile();
  renderAutofillOptions();
  updateNavLocks();

  if (wasIncomplete) {
    profileSavedMsgEl.classList.add("hidden");
    showSection("dashboard");
  } else {
    profileSavedMsgEl.textContent = "Profile saved successfully!";
    profileSavedMsgEl.classList.remove("hidden");
  }
}

// Applies the saved light or dark mode theme to the page
function applyTheme() {
  document.body.classList.toggle("dark-mode", isDarkMode);
  darkModeToggleBtn.textContent = isDarkMode ? "Switch to Light Mode" : "Enable Dark Mode";
}

// Toggles dark mode on or off and saves the choice
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  saveData();
  applyTheme();
}

// Logs out to a clean Welcome page, removes the profile photo, and asks for a photo on next start
function logoutAccount() {
  saveCurrentProfileSnapshot();
  const currentKey = getProfileSnapshotKey(profile);
  savedProfiles = savedProfiles.map(function (entry) {
    if (entry.key === currentKey) {
      return {
        key: entry.key,
        profile: { ...entry.profile, photo: "" },
        monthlyBudget: entry.monthlyBudget,
        expenses: entry.expenses
      };
    }
    return entry;
  });

  isLoggedIn = false;
  isProfileComplete = false;
  profile = { ...emptyProfile };
  welcomePhotoInput.value = "";
  profilePhotoInput.value = "";
  welcomePhotoErrorEl.textContent = "";
  confirmBoxEl.classList.add("hidden");
  pendingDataAction = null;
  fillWelcomeProfileInputs(emptyProfile);
  welcomeBudgetInput.value = "";
  welcomeProfileMsgEl.classList.add("hidden");
  setFieldError(welcomeAllowanceInput, welcomeAllowanceErrorEl, "");
  setFieldError(welcomeBudgetInput, welcomeBudgetErrorEl, "");
  clearProfileErrors();
  saveData();
  renderProfile();
  renderWelcomePhoto();
  renderAutofillOptions();
  updateNavLocks();
  showSection("welcome");
}

// Opens the inline confirmation box on Settings for account or data actions
function askDataConfirmation(actionType) {
  pendingDataAction = actionType;
  settingsDataMsgEl.classList.add("hidden");

  if (actionType === "reset") {
    confirmTextEl.textContent = "Restore the 5 sample hostel expenses? Current expenses will be replaced.";
  } else if (actionType === "clear") {
    confirmTextEl.textContent = "Delete all expenses? This will leave your expense list empty.";
  } else if (actionType === "create-new") {
    confirmTextEl.textContent = "Create a brand new student profile? Your previous profile remains available in Autofill.";
  }

  confirmBoxEl.classList.remove("hidden");
}

// Clears all profile validation errors when resetting or creating a new profile
function clearProfileErrors() {
  setFieldError(profileNameInput, profileNameErrorEl, "");
  setFieldError(profileRollInput, profileRollErrorEl, "");
  setFieldError(profileCollegeInput, profileCollegeErrorEl, "");
  setFieldError(profileRoomInput, profileRoomErrorEl, "");
  setFieldError(profileCourseInput, profileCourseErrorEl, "");
  setFieldError(profileAllowanceInput, profileAllowanceErrorEl, "");
  setFieldError(profileGoalInput, profileGoalErrorEl, "");
  profilePhotoErrorEl.textContent = "";
  profileSavedMsgEl.classList.add("hidden");
  profileBudgetMsgEl.classList.add("hidden");
}

// Executes the confirmed reset, clear, or create-new-profile action
function confirmDataAction() {
  if (pendingDataAction === "reset") {
    expenses = sampleExpenses.map(function (item) {
      return {
        id: item.id,
        title: item.title,
        amount: item.amount,
        category: item.category,
        date: item.date
      };
    });
    settingsDataMsgEl.textContent = "Sample expenses restored.";
  } else if (pendingDataAction === "clear") {
    expenses = [];
    settingsDataMsgEl.textContent = "All expenses cleared.";
  } else if (pendingDataAction === "create-new") {
    saveCurrentProfileSnapshot();
    profile = { ...emptyProfile };
    welcomePhotoInput.value = "";
    profilePhotoInput.value = "";
    isProfileComplete = false;
    isLoggedIn = false;
    monthlyBudget = 0;
    expenses = [];
    pendingDataAction = null;
    confirmBoxEl.classList.add("hidden");
    clearProfileErrors();
    resetForm();
    syncBudgetInputs();
    saveData();
    renderProfile();
    updateNavLocks();
    refreshAllViews();
    showSection("welcome");
    return;
  }

  pendingDataAction = null;
  confirmBoxEl.classList.add("hidden");
  resetForm();
  saveData();
  refreshAllViews();
  settingsDataMsgEl.classList.remove("hidden");
}

// Cancels the inline confirmation box
function cancelDataAction() {
  pendingDataAction = null;
  confirmBoxEl.classList.add("hidden");
}

// Formats a calculator number neatly without floating point glitches
function formatCalcNumber(value) {
  const rounded = Math.round(Number(value) * 10000) / 10000;
  return String(rounded);
}

// Updates the calculator screen expression and main numeric display
function renderCalculator() {
  const opSymbols = { "+": "+", "-": "−", "*": "×", "/": "÷", "%": "%" };
  if (calcOperator !== null && calcPrevious !== null) {
    calcExpressionEl.textContent = `${calcPrevious} ${opSymbols[calcOperator] || calcOperator}`;
  } else {
    calcExpressionEl.textContent = "0";
  }
  calcDisplayEl.textContent = calcCurrent;
}

// Resets the calculator state back to zero
function clearCalculator() {
  calcCurrent = "0";
  calcPrevious = null;
  calcOperator = null;
  calcJustEvaluated = false;
  calcFeedbackEl.textContent = "";
  renderCalculator();
}

// Appends a digit or decimal point to the active calculator value
function appendCalcDigit(digit) {
  calcFeedbackEl.textContent = "";
  if (calcJustEvaluated) {
    calcCurrent = digit === "." ? "0." : digit;
    calcJustEvaluated = false;
    renderCalculator();
    return;
  }

  if (digit === ".") {
    if (!calcCurrent.includes(".")) {
      calcCurrent = `${calcCurrent}.`;
    }
  } else if (calcCurrent === "0") {
    calcCurrent = digit;
  } else if (calcCurrent.length < 14) {
    calcCurrent = `${calcCurrent}${digit}`;
  }
  renderCalculator();
}

// Removes the last typed digit from the calculator display
function backspaceCalculator() {
  calcFeedbackEl.textContent = "";
  if (calcJustEvaluated || calcCurrent.length <= 1) {
    calcCurrent = "0";
    calcJustEvaluated = false;
  } else {
    calcCurrent = calcCurrent.slice(0, -1);
  }
  renderCalculator();
}

// Computes the pending binary operation safely without eval()
function computeCalcPair(first, second, op) {
  if (op === "+") return first + second;
  if (op === "-") return first - second;
  if (op === "*") return first * second;
  if (op === "/") {
    if (second === 0) return null;
    return first / second;
  }
  if (op === "%") {
    return (first * second) / 100;
  }
  return second;
}

// Handles selecting an arithmetic operator on the calculator
function chooseCalcOperator(op) {
  calcFeedbackEl.textContent = "";
  const currentNum = Number(calcCurrent);

  if (calcPrevious !== null && calcOperator !== null && !calcJustEvaluated) {
    const result = computeCalcPair(calcPrevious, currentNum, calcOperator);
    if (result === null) {
      calcFeedbackEl.textContent = "Cannot divide by 0.";
      clearCalculator();
      return;
    }
    calcPrevious = Number(formatCalcNumber(result));
    calcCurrent = String(calcPrevious);
  } else {
    calcPrevious = currentNum;
  }

  calcOperator = op;
  calcJustEvaluated = true;
  renderCalculator();
}

// Evaluates the pending calculator expression and displays the result
function evaluateCalculator() {
  if (calcOperator === null || calcPrevious === null) {
    return;
  }

  const currentNum = Number(calcCurrent);
  const result = computeCalcPair(calcPrevious, currentNum, calcOperator);
  if (result === null) {
    clearCalculator();
    calcFeedbackEl.textContent = "Cannot divide by 0.";
    return;
  }

  calcCurrent = formatCalcNumber(result);
  calcPrevious = null;
  calcOperator = null;
  calcJustEvaluated = true;
  renderCalculator();
}

// Handles calculator keypad clicks using event delegation
function handleCalcClick(event) {
  const btn = event.target.closest("button");
  if (!btn) {
    return;
  }

  if (btn.dataset.digit !== undefined) {
    appendCalcDigit(btn.dataset.digit);
  } else if (btn.dataset.op !== undefined) {
    chooseCalcOperator(btn.dataset.op);
  } else if (btn.dataset.action === "clear") {
    clearCalculator();
  } else if (btn.dataset.action === "back") {
    backspaceCalculator();
  } else if (btn.dataset.action === "equals") {
    evaluateCalculator();
  }
}

// Splits the current calculator amount evenly among roommates
function handleCalcSplit(event) {
  const splitBtn = event.target.closest("button");
  if (!splitBtn) {
    return;
  }

  const people = Number(splitBtn.dataset.split);
  const currentNum = Number(calcCurrent);
  if (people <= 0 || Number.isNaN(currentNum) || currentNum <= 0) {
    calcFeedbackEl.textContent = "Enter an amount above 0 before splitting.";
    return;
  }

  calcFeedbackEl.textContent = "";
  calcCurrent = String(Math.round((currentNum / people) * 100) / 100);
  calcPrevious = null;
  calcOperator = null;
  calcJustEvaluated = true;
  renderCalculator();
}

// Sends the calculated amount straight to the Add Expense form on Dashboard
function useCalcAmountInExpense() {
  const amountValue = Math.round(Number(calcCurrent) * 100) / 100;
  if (Number.isNaN(amountValue) || !Number.isFinite(amountValue) || amountValue <= 0) {
    calcFeedbackEl.textContent = "Calculate an amount greater than 0 first.";
    return;
  }

  calcFeedbackEl.textContent = "";
  amountInput.value = String(amountValue);
  setFieldError(amountInput, amountErrorEl, "");
  showSection("dashboard");
  titleInput.focus();
}

// Handles Escape key shortcuts and calculator keyboard input when Analytics is active
function handleKeyShortcuts(event) {
  if (event.key === "Escape") {
    if (editingId !== null) {
      resetForm();
    }
    if (!confirmBoxEl.classList.contains("hidden")) {
      cancelDataAction();
    }
    if (!analyticsSectionEl.classList.contains("hidden")) {
      clearCalculator();
    }
    return;
  }

  const isAnalyticsOpen = !appShellEl.classList.contains("hidden") &&
    !analyticsSectionEl.classList.contains("hidden");
  const activeTag = document.activeElement ? document.activeElement.tagName : "";
  const isTypingInField = activeTag === "INPUT" || activeTag === "SELECT" || activeTag === "TEXTAREA";

  if (!isAnalyticsOpen || isTypingInField) {
    return;
  }

  if (/^[0-9.]$/.test(event.key)) {
    event.preventDefault();
    appendCalcDigit(event.key);
  } else if (["+", "-", "*", "/", "%"].includes(event.key)) {
    event.preventDefault();
    chooseCalcOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    evaluateCalculator();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    backspaceCalculator();
  } else if (event.key.toLowerCase() === "c") {
    event.preventDefault();
    clearCalculator();
  }
}

// Binds Enter and Space keys on custom photo upload labels for keyboard accessibility
function bindPhotoLabelKeys(labelEl, inputEl) {
  labelEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputEl.click();
    }
  });
}

// Attaches Enter-key submit behavior to standalone budget input fields
function bindEnterToButton(inputEl, buttonEl) {
  inputEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      buttonEl.click();
    }
  });
}

// Refreshes every view so Dashboard, History, Analytics, and Summary stay synced
function refreshAllViews() {
  renderList();
  renderHistory();
  renderAnalytics();
  updateSummary();
}

// Event listeners
welcomeForm.addEventListener("submit", handleWelcomeStart);
welcomeUpdateProfileBtn.addEventListener("click", updateQuickSetupProfile);
welcomeAllowanceInput.addEventListener("input", function () {
  setFieldError(welcomeAllowanceInput, welcomeAllowanceErrorEl, "");
});
autofillProfileBtn.addEventListener("click", function () {
  autofillSelectedProfile(autofillProfileSelectEl, "welcome");
});
profileAutofillBtn.addEventListener("click", function () {
  autofillSelectedProfile(profileAutofillSelectEl, "profile");
});
welcomeHistoryBtn.addEventListener("click", function () {
  showSection("history");
});
welcomeProfileBtn.addEventListener("click", function () {
  showSection("profile");
});

navMenuEl.addEventListener("click", handleNavClick);
presetButtonsEl.addEventListener("click", handlePresetClick);
expenseForm.addEventListener("submit", addExpense);
cancelEditBtn.addEventListener("click", resetForm);
setBudgetBtn.addEventListener("click", setBudget);
filterCategorySelect.addEventListener("change", renderList);
expenseListEl.addEventListener("click", handleListClick);

// Clear validation errors automatically as the student types
titleInput.addEventListener("input", function () {
  setFieldError(titleInput, titleErrorEl, "");
});
amountInput.addEventListener("input", function () {
  setFieldError(amountInput, amountErrorEl, "");
});
dateInput.addEventListener("change", function () {
  setFieldError(dateInput, dateErrorEl, "");
});
budgetInput.addEventListener("input", function () {
  setFieldError(budgetInput, budgetErrorEl, "");
});
profileBudgetInput.addEventListener("input", function () {
  setFieldError(profileBudgetInput, profileBudgetErrorEl, "");
});
settingsBudgetInput.addEventListener("input", function () {
  setFieldError(settingsBudgetInput, settingsBudgetErrorEl, "");
});
welcomeBudgetInput.addEventListener("input", function () {
  setFieldError(welcomeBudgetInput, welcomeBudgetErrorEl, "");
});

// Clear profile validation errors on input
profileNameInput.addEventListener("input", function () {
  setFieldError(profileNameInput, profileNameErrorEl, "");
});
profileRollInput.addEventListener("input", function () {
  setFieldError(profileRollInput, profileRollErrorEl, "");
});
profileCollegeInput.addEventListener("input", function () {
  setFieldError(profileCollegeInput, profileCollegeErrorEl, "");
});
profileRoomInput.addEventListener("input", function () {
  setFieldError(profileRoomInput, profileRoomErrorEl, "");
});
profileCourseInput.addEventListener("input", function () {
  setFieldError(profileCourseInput, profileCourseErrorEl, "");
});
profileAllowanceInput.addEventListener("input", function () {
  setFieldError(profileAllowanceInput, profileAllowanceErrorEl, "");
});
profileGoalInput.addEventListener("input", function () {
  setFieldError(profileGoalInput, profileGoalErrorEl, "");
});

bindEnterToButton(budgetInput, setBudgetBtn);
bindEnterToButton(profileBudgetInput, profileBudgetBtn);
bindEnterToButton(settingsBudgetInput, settingsBudgetBtn);

historySearchInput.addEventListener("input", renderHistory);
historyFilterSelect.addEventListener("change", renderHistory);
historySortSelect.addEventListener("change", renderHistory);
exportCsvBtn.addEventListener("click", exportExpensesCSV);
historyListEl.addEventListener("click", handleListClick);

profileForm.addEventListener("submit", saveProfile);
profileBudgetBtn.addEventListener("click", setBudgetFromProfile);
welcomePhotoInput.addEventListener("change", handlePhotoChange);
welcomeRemovePhotoBtn.addEventListener("click", removeProfilePhoto);
profilePhotoInput.addEventListener("change", handlePhotoChange);
removePhotoBtn.addEventListener("click", removeProfilePhoto);
bindPhotoLabelKeys(welcomePhotoLabelEl, welcomePhotoInput);
bindPhotoLabelKeys(photoUploadLabelEl, profilePhotoInput);

darkModeToggleBtn.addEventListener("click", toggleDarkMode);
settingsBudgetBtn.addEventListener("click", setBudgetFromSettings);
logoutBtn.addEventListener("click", logoutAccount);
createNewAccountBtn.addEventListener("click", function () {
  askDataConfirmation("create-new");
});
resetSampleBtn.addEventListener("click", function () {
  askDataConfirmation("reset");
});
clearAllBtn.addEventListener("click", function () {
  askDataConfirmation("clear");
});
confirmYesBtn.addEventListener("click", confirmDataAction);
confirmNoBtn.addEventListener("click", cancelDataAction);

calcKeypadEl.addEventListener("click", handleCalcClick);
calcSplitButtonsEl.addEventListener("click", handleCalcSplit);
calcUseExpenseBtn.addEventListener("click", useCalcAmountInExpense);

document.addEventListener("keydown", handleKeyShortcuts);

// Initialize application on page load
loadData();
applyTheme();
renderProfile();
renderAutofillOptions();
updateNavLocks();
refreshAllViews();
renderCalculator();
showSection(isLoggedIn && isProfileComplete ? "dashboard" : "welcome");
