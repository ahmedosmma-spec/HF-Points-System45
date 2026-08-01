// --- إدارة البيانات الأساسية ---

// جلب المستخدم الحالي
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('hf_current_user')) || null;
}

// جلب جميع الأعضاء
function getUsers() {
  return JSON.parse(localStorage.getItem('hf_users')) || [];
}

// حفظ الأعضاء
function saveUsers(users) {
  localStorage.setItem('hf_users', JSON.stringify(users));
}

// فحص تسجيل الدخول (مع حماية من التوجيه اللانهائي)
function checkAuthRequirement() {
  const currentUser = getCurrentUser();
  const currentPage = window.location.pathname.split('/').pop();

  if (!currentUser && currentPage !== 'login.html') {
    window.location.href = 'login.html';
  }
}

// تسجيل الخروج
function logoutUser() {
  localStorage.removeItem('hf_current_user');
  window.location.href = 'login.html';
}

// --- إدارة الشكاوى وصندوق الوارد 👁️‍🗨️ ---

function getComplaints() {
  return JSON.parse(localStorage.getItem('hf_complaints')) || [];
}

function saveComplaints(complaints) {
  localStorage.setItem('hf_complaints', JSON.stringify(complaints));
}

function sendComplaint(text) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('يرجى تسجيل الدخول أولاً!');
    return;
  }
  
  const complaints = getComplaints();
  complaints.push({
    id: Date.now(),
    username: currentUser.username,
    text: text,
    reply: null,
    read: false,
    date: new Date().toLocaleDateString('ar-EG')
  });
  saveComplaints(complaints);
  alert('تم إرسال الشكوى للأدمن بنجاح! 🎉');
}

function replyToComplaint(id, replyText) {
  let complaints = getComplaints();
  complaints = complaints.map(c => {
    if (c.id === id) {
      c.reply = replyText;
      c.read = false;
    }
    return c;
  });
  saveComplaints(complaints);
}

function getUnreadInboxCount() {
  const currentUser = getCurrentUser();
  if (!currentUser) return 0;
  const complaints = getComplaints();
  return complaints.filter(c => c.username === currentUser.username && c.reply && !c.read).length;
}

function markInboxAsRead() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  let complaints = getComplaints();
  complaints = complaints.map(c => {
    if (c.username === currentUser.username && c.reply) {
      c.read = true;
    }
    return c;
  });
  saveComplaints(complaints);
}

// --- إدارة ذاكرة البوت 🧠 ---

function getBotBrain() {
  return JSON.parse(localStorage.getItem('hf_bot_brain')) || {};
}

function learnBotQuestion(question, answer) {
  const brain = getBotBrain();
  brain[question.toLowerCase().trim()] = answer;
  localStorage.setItem('hf_bot_brain', JSON.stringify(brain));
  removeUnknownQuestion(question);
}

function getUnknownQuestions() {
  return JSON.parse(localStorage.getItem('hf_unknown_questions')) || [];
}

function saveUnknownQuestion(question) {
  let unknown = getUnknownQuestions();
  const qClean = question.trim();
  if (!unknown.includes(qClean) && qClean.length > 2) {
    unknown.push(qClean);
    localStorage.setItem('hf_unknown_questions', JSON.stringify(unknown));
  }
}

function removeUnknownQuestion(question) {
  let unknown = getUnknownQuestions();
  unknown = unknown.filter(q => q.toLowerCase().trim() !== question.toLowerCase().trim());
  localStorage.setItem('hf_unknown_questions', JSON.stringify(unknown));
}
// ❌ السطر القديم اللي كان بيجيب error:
function goToInbox() {
    window.location.href = 'complaints.html';
}

// ✅ غيّره خليه يفتح صفحة تقديم الشكوى والردود بتاعتك مباشرة:
function goToInbox() {
    window.location.href = 'complaint.html';
}

