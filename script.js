
let isReadonlyMode = false;
window.pesertaList = [];
let questions = [];
let current = 0;
let score = 0;
let userAnswers = [];
let timerInterval;
let startTime;

isReadonlyMode = true;

window.loggedInEmail = null; // 🆕 Menyimpan email login
declareVariables();

// Ambil data peserta dari spreadsheet
fetch("https://opensheet.elk.sh/18mQe0-u4ma9mEemc5L6zN6AWe6IbfopdDIlhUKM1WEE/PESERTA")
  .then(res => res.json())
  .then(data => {
    window.pesertaList = data.map(row => ({
      email: (row.Email || "").trim().toLowerCase(),
      nama: row.Nama || "",
      asalSekolah: row["Asal Sekolah"] || "",
      kurikulum: row["Kurikulum"] || "",
      kelas: row.Kelas || "",
      password: row.Password || "",
      pesan: row["Pesan Pribadi"] || ""
    }));

    if (window.loggedInEmail) {
      emailInput.value = window.loggedInEmail;
      emailInput.dispatchEvent(new Event("blur"));
    }
  })
  .catch(err => console.error("❌ Gagal memuat data peserta:", err));

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value.trim();

    const user = window.pesertaList?.find(p => p.email === email && p.password === password);

    if (user) {
      alert("Login berhasil!");
      window.loggedInEmail = user.email;

      document.querySelectorAll(".halaman, .halaman-konten").forEach(el => el.style.display = "none");
      document.getElementById("login-page").style.display = "none";
      document.getElementById("beranda").style.display = "block";
    } else {
      alert("Email atau password salah.");
    }
  });
}

// TOMBOL BELAJAR/TRYOUT AKTIFKAN FORM IDENTITAS DENGAN VALIDASI LOGIN

document.addEventListener("DOMContentLoaded", function () {
  const semuaTombolKelas = document.querySelectorAll(".tombol-3d");

  semuaTombolKelas.forEach(btn => {
  btn.addEventListener("click", function () {
    if (!window.loggedInEmail) {
      alert("⚠️ Kamu belum login");
      document.querySelectorAll(".halaman, .halaman-konten, #identity-form").forEach(el => el.style.display = "none");
      document.getElementById("beranda").style.display = "block";
      return;
      
    }

    document.querySelectorAll(".halaman, .halaman-konten").forEach(hal => hal.style.display = "none");
    document.getElementById("identity-form").style.display = "block";

    const emailInput = document.getElementById("email");
    emailInput.value = window.loggedInEmail;
    emailInput.dispatchEvent(new Event("blur"));
  });
});
});

function declareVariables() {
  nameInput = document.getElementById("name");
  emailInput = document.getElementById("email");
  sekolahInput = document.getElementById("sekolah");
  kurikulumInput = document.getElementById("kurikulum");
  kelasInput = document.getElementById("kelas");
  mapelInput = document.getElementById("mapel");
  babInput = document.getElementById("bab");
  paketInput = document.getElementById("paket");
  jumlahSoalInput = document.getElementById("jumlahSoal");
  durasiInput = document.getElementById("durasi");
  passwordInput = document.getElementById("password");
  startBtn = document.getElementById("start-btn");
  passwordMessage = document.getElementById("password-message");
  identityForm = document.getElementById("identity-form");
  quizBox = document.getElementById("quiz-box");
  questionEl = document.getElementById("question");
  optionsEl = document.getElementById("options");
  feedbackEl = document.getElementById("feedback");
  scoreEl = document.getElementById("score");
  timerEl = document.getElementById("timer");
  navigation = document.getElementById("navigation");
}

// Ambil data peserta dari spreadsheet
document.addEventListener("DOMContentLoaded", () => {
  const semuaHalaman = document.querySelectorAll(".halaman");
  semuaHalaman.forEach(hal => hal.style.display = "none");

  const halamanBeranda = document.getElementById("beranda");
  if (halamanBeranda) {
    halamanBeranda.style.display = "block";
  }

  fetch("https://opensheet.elk.sh/18mQe0-u4ma9mEemc5L6zN6AWe6IbfopdDIlhUKM1WEE/PESERTA")
    .then(res => res.json())
    .then(data => {
      window.pesertaList = data.map(row => ({
        email: (row.Email || "").trim().toLowerCase(),
        nama: row.Nama || "",
        asalSekolah: row["Asal Sekolah"] || "",
        kurikulum: row["Kurikulum"] || "",
        kelas: row.Kelas || "",
        password: row.Password || "",
        pesan: row["Pesan Pribadi"] || ""
      }));
    })
    .catch(err => console.error("❌ Gagal memuat data peserta:", err));
});

// Autofill data berdasarkan email
emailInput.addEventListener("blur", () => {
  const email = emailInput.value.trim().toLowerCase();
  const peserta = window.pesertaList.find(p => p.email === email);

  if (peserta) {
    nameInput.value = peserta.nama;
    sekolahInput.value = peserta.asalSekolah;
    kurikulumInput.value = peserta.kurikulum;
    kelasInput.value = peserta.kelas;
    passwordInput.value = peserta.password;

    document.getElementById('pesan-motivasi').innerText = peserta.pesan || "Semangat ya!";

    nameInput.readOnly = true;
    sekolahInput.readOnly = true;
    kurikulumInput.readOnly = true;
    kelasInput.readOnly = true;
    passwordInput.readOnly = true;

    validatePassword();
    if (peserta.kelas && peserta.kurikulum) {
      loadMapelList(peserta.kelas);
    }
  } else {
    alert("Email tidak ditemukan.");
    nameInput.value = "";
    sekolahInput.value = "";
    kurikulumInput.value = "";
    kelasInput.value = "";
    passwordInput.value = "";
    document.getElementById('pesan-motivasi').innerText = "Semangat ya!";
    nameInput.readOnly = false;
    sekolahInput.readOnly = false;
    kurikulumInput.readOnly = false;
    kelasInput.readOnly = false;
    passwordInput.readOnly = false;
  }
});

// Validasi password
function validatePassword() {
  const email = emailInput.value.trim();
  const enteredPassword = passwordInput.value.trim();
  const peserta = window.pesertaList.find(p => p.email === email.toLowerCase());

  if (!peserta) {
    passwordMessage.textContent = "Email tidak ditemukan.";
    startBtn.disabled = true;
  } else if (peserta.password === enteredPassword) {
    passwordMessage.textContent = "";
    startBtn.disabled = false;
  } else {
    passwordMessage.textContent = "SALAH PASSWORD";
    startBtn.disabled = true;
  }
}

passwordInput.addEventListener("input", validatePassword);
emailInput.addEventListener("input", validatePassword);

// Fungsi untuk memuat mapel
function loadMapelList(kelas) {
  const kurikulum = kurikulumInput.value.trim();
  if (!kurikulum) {
    mapelInput.innerHTML = '<option value="">Isi kurikulum terlebih dahulu</option>';
    return;
  }

  const url = `https://script.google.com/macros/s/AKfycbzcFz3Tm6C9-TPHK7M5NqNykCEiXxROkOtYxZxTpaPsmnS1cxsfprG89cfz9C9DukGc/exec?kelas=${encodeURIComponent(kelas)}&kurikulum=${encodeURIComponent(kurikulum)}`;

  mapelInput.innerHTML = '<option>Memuat...</option>';

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        mapelInput.innerHTML = '<option value="">Tidak ada mapel ditemukan</option>';
        return;
      }

      mapelInput.innerHTML = '<option value="">Pilih Mata Pelajaran</option>';
      data.forEach(nama => {
        const option = document.createElement("option");
        option.value = nama;
        option.textContent = nama;
        mapelInput.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Fetch error:", err);
      mapelInput.innerHTML = '<option value="">Gagal memuat mapel</option>';
    });
}

// Trigger saat kelas diubah (input atau blur)
["input", "blur"].forEach(evt => {
  kelasInput.addEventListener(evt, () => {
    const selectedKelas = kelasInput.value.trim();
    const kurikulum = kurikulumInput.value.trim();
    if (selectedKelas && kurikulum) {
      loadMapelList(selectedKelas);
    }
  });
});



//INPUT NAMA BAB MATERI
const selectedSpreadsheetName = mapelInput.value; // ambil nama dari input
const sheetApiBaseUrl = "https://script.google.com/macros/s/AKfycbxMuFkeVk7gN6anQ79i37Whstx2k95FMWoaqOAwX8-6OaGjlj6_E66eDGczG8M9CTZO5Q/exec";


function loadSheetList(selectedSpreadsheetName) {
  if (!selectedSpreadsheetName) {
    babInput.innerHTML = '<option value="">Pilih Materi</option>';
    return;
  }

  // Buat URL dinamis berdasarkan pilihan mata pelajaran
  const sheetApiUrl = `${sheetApiBaseUrl}?action=getSheets&spreadsheetName=${encodeURIComponent(selectedSpreadsheetName)}`;

  babInput.innerHTML = '<option value="">Memuat Bab Materi...</option>';

  fetch(sheetApiUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(sheetNames => {
      babInput.innerHTML = '<option value="">Pilih Bab Materi</option>';

      if (Array.isArray(sheetNames) && sheetNames.length > 0) {
        sheetNames
      .filter(name => !/^Sheet\d*/i.test(name)) // menyaring nama sheet yang diawali "Sheet"
      .forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        babInput.appendChild(option);
      });
      } else {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Bab Materi tidak ditemukan";
        babInput.appendChild(option);
      }
    })
    .catch(err => {
      console.error("Gagal memuat daftar BAB:", err);
      babInput.innerHTML = '<option value="">Gagal memuat bab</option>';
    });
}

// Listener untuk perubahan pada input MATA PELAJARAN
if (mapelInput) {
  mapelInput.addEventListener("change", function() {
    const selectedSpreadsheet = mapelInput.value;
    loadSheetList(selectedSpreadsheet);
  });
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const sheetURL = "https://opensheet.elk.sh/1-XMEFrfkLfxd9AWi-EfLuGo8dnjO_kzYUCJ2gy9C-zs/Sheet2";

babInput.addEventListener("change", () => {
  const selectedBab = babInput.value.trim();

  if (!selectedBab) {
    jumlahSoalInput.value = "";
    durasiInput.value = "";
    return;
  }

  fetch(sheetURL)
    .then(response => response.json())
    .then(data => {
      const matchedRow = data.find(row => row["Nama Sheet"]?.trim() === selectedBab);

      if (matchedRow) {
        jumlahSoalInput.value = matchedRow["Jumlah Soal Per Paket"] || "";
        durasiInput.value = matchedRow["Durasi"] || "";
      } else {
        jumlahSoalInput.value = "";
        durasiInput.value = "";
        console.warn("BAB MATERI tidak ditemukan di Sheet2.");
      }
    })
    .catch(error => {
      console.error("Gagal mengambil data dari spreadsheet:", error);
      jumlahSoalInput.value = "";
      durasiInput.value = "";
    });
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
async function updatePaketDropdown(babMateriDipilih) {
  const paketInput = document.getElementById("paket");
  if (!paketInput) return;

  paketInput.innerHTML = '<option value="">Memuat Paket...</option>';

  try {
    const response = await fetch('https://opensheet.elk.sh/1-XMEFrfkLfxd9AWi-EfLuGo8dnjO_kzYUCJ2gy9C-zs/Sheet2');
    const data = await response.json();

    const baris = data.find(row =>
      row["Nama Sheet"]?.trim().toLowerCase() === babMateriDipilih.trim().toLowerCase()
    );

    paketInput.innerHTML = '<option value="">Pilih Paket</option>';

    if (baris) {
      const jumlahPaket = parseInt(baris["Paket Ke"]);
      if (!isNaN(jumlahPaket)) {
        for (let i = 1; i <= jumlahPaket; i++) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = i;
          paketInput.appendChild(option);
        }
      } else {
        console.warn("Paket Ke bukan angka:", baris["Paket Ke"]);
      }
    } else {
      console.warn("Tidak ada baris cocok untuk BAB:", babMateriDipilih);
    }
  } catch (error) {
    console.error("Gagal ambil data:", error);
  }
}

// URL sheet menggunakan OpenSheet
const pesertaSheetURL = "https://opensheet.elk.sh/18mQe0-u4ma9mEemc5L6zN6AWe6IbfopdDIlhUKM1WEE/PESERTA";

// Fungsi validasi password berdasarkan email
function validatePassword() {
  const email = emailInput.value.trim();
  const enteredPassword = passwordInput.value.trim();

  if (!email || !enteredPassword) {
    passwordMessage.textContent = "";
    startBtn.disabled = true;
    return;
  }

  fetch(pesertaSheetURL)
    .then(response => response.json())
    .then(data => {
      const user = data.find(row => row["Email"]?.trim().toLowerCase() === email.toLowerCase());

      if (!user) {
        passwordMessage.textContent = "Email tidak ditemukan.";
        startBtn.disabled = true;
      } else if (user["Password"]?.trim() === enteredPassword) {
        passwordMessage.textContent = "";
        startBtn.disabled = false;
      } else {
        passwordMessage.textContent = "SALAH PASSWORD";
        startBtn.disabled = true;
      }
    })
    .catch(error => {
      console.error("Gagal mengambil data password:", error);
      passwordMessage.textContent = "Terjadi kesalahan saat memeriksa password.";
      startBtn.disabled = true;
    });
}

// Event listener saat password atau email berubah
passwordInput.addEventListener("input", validatePassword);
emailInput.addEventListener("input", validatePassword);


function toProperCase(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
startBtn.addEventListener("click",async () => {
  if (
    !nameInput.value ||
    !emailInput.value ||
    !sekolahInput.value ||
    !kurikulumInput.value || // tambahkan ini
    !kelasInput.value ||
    !mapelInput.value ||
    !babInput.value ||
    !paketInput.value ||
    !durasiInput.value
  ) {
    alert("Harap lengkapi semua data terlebih dahulu!");
    return;
  }
//TOMBOL MULAI KUIZ
  try {
    await cekRiwayatKuis();
    startQuiz();
  } catch (err) {
    console.warn("Lewati startQuiz karena peserta sudah pernah ikut.");
  }

  
});

//MASUK KE HALAMAN KUIZ
function startQuiz() {
  fetchQuestions().then(() => {
  startTime = new Date(); // waktu mulai dicatat di sini  
  // Tampilkan label info peserta

document.getElementById("label-nama-siswa").textContent = (toProperCase(nameInput.value) || '').substring(0, 15);
document.getElementById("label-asal-sekolah").textContent = (sekolahInput.value || '').substring(0, 15);
document.getElementById("label-kelas").textContent = (kelasInput.value || '').substring(0, 15);
document.getElementById("label-nama-paket").textContent = (paketInput.value || '').substring(0, 15);
document.getElementById("label-bab-materi").textContent = (babInput.value || '').substring(0, 15);

  identityForm.style.display = "none";
    quizBox.style.display = "flex";
    userAnswers = Array(questions.length).fill(null);
    createNavigation();
    loadQuestion(0);
    startTimer(parseInt(durasiInput.value));
  });
}

function fetchQuestions() {
  const bab = babInput.value.trim();
  const mapel = mapelInput.value.trim();

  const mappingUrl = `https://opensheet.elk.sh/15R8bAIdfe9kGQu__Uois7Myc0fFY9rPzP5KBKZjxkY0/Sheet2`;

  console.log("Memfetch mapping dari:", mappingUrl);

  return fetch(mappingUrl)
    .then(mappingResponse => mappingResponse.json())
    .then(mappingData => {
      console.log("Data mapping:", mappingData);

      // Sesuaikan dengan nama kolom baru
      const mapping = mappingData.find(row => row["Nama File"] === mapel);

      if (!mapping) {
        alert(`❌ Nama file "${mapel}" tidak ditemukan di data mapping.`);
        throw new Error('Nama file tidak ditemukan');
      }

      console.log("Spreadsheet ID ditemukan:", mapping["ID File"]);

      const spreadsheetId = mapping["ID File"];
      const soalUrl = `https://opensheet.elk.sh/${spreadsheetId}/${bab}`;

      console.log("URL soal:", soalUrl);

      return fetch(soalUrl);
    })
    .then(soalResponse => soalResponse.json())
    .then(soalData => {
      console.log("Data soal:", soalData);

      const paketKe = parseInt(paketInput.value);
      const soalPerPaket = parseInt(document.getElementById("jumlahSoal").value) || 0;
      const startIndex = 1 + (paketKe - 1) * soalPerPaket;
      const endIndex = startIndex + soalPerPaket;
      const slicedData = soalData.slice(startIndex, endIndex);

      questions = slicedData.map(row => {
        const keyMap = { A: "1", B: "2", C: "3", D: "4", E: "5" };
        const answerKey = keyMap[row.Kunci?.toUpperCase()] || "1";

        const rawOptions = [
          {
            key: "1",
            value: row.Option1,
            explanation: row.PenjelasanOpsiA,
            image: row["GambarOpsiA"] || null
          },
          {
            key: "2",
            value: row.Option2,
            explanation: row.PenjelasanOpsiB,
            image: row["GambarOpsiB"] || null
          },
          {
            key: "3",
            value: row.Option3,
            explanation: row.PenjelasanOpsiC,
            image: row["GambarOpsiC"] || null
          },
          {
            key: "4",
            value: row.Option4,
            explanation: row.PenjelasanOpsiD,
            image: row["GambarOpsiD"] || null
          },
          {
            key: "5",
            value: row.Option5,
            explanation: row.PenjelasanOpsiE,
            image: row["GambarOpsiE"] || null
          }
        ].filter(opt => opt.value);

        const shuffled = rawOptions.sort(() => Math.random() - 0.5);

        const labeledOptions = shuffled.map((opt, index) => ({
          ...opt,
          label: String.fromCharCode(65 + index) // A-E
        }));

        const formattedExplanation = labeledOptions.map(opt => {
          const icon = opt.key === answerKey ? "✅" : "❌";
          return `${icon} <strong>Pilihan ${opt.label}</strong><br> ${opt.explanation}`;
        }).join("<br><br>");

        return {
          question: row.Soal,
          image: row["gambar soal"] || null,
          options: labeledOptions,
          answer: answerKey,
          explanation: formattedExplanation,
          pembahasanImageUrl: row["gambar penyelesaian"] || null
        };
      });
    })
    .catch(err => {
      console.error('Error detail:', err);
      alert(`❌ Gagal mengambil soal. Pastikan data tersedia dan formatnya benar.`);
    });
}

//MEMBUAT TOMBOL NAVIGASI SOAL
function createNavigation() {
  navigation.innerHTML = "";

  // Tambahkan tombol nomor soal
  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.id = `nav-btn-${i}`;
    btn.textContent = i + 1;
    btn.addEventListener("click", () => loadQuestion(i));
    navigation.appendChild(btn);
  });

  // Kontainer untuk tombol navigasi bawah
 // Baris 1: KEMBALI dan LANJUT
const navTopRow = document.createElement("div");
navTopRow.className = "nav-controls";

const backBtn = document.createElement("button");
backBtn.textContent = "⬅️ KEMBALI";
backBtn.addEventListener("click", () => {
  if (current > 0) loadQuestion(current - 1);
});

const nextBtn = document.createElement("button");
nextBtn.textContent = "LANJUT ➡️";
nextBtn.addEventListener("click", () => {
  if (current < questions.length - 1) loadQuestion(current + 1);
});

navTopRow.appendChild(backBtn);
navTopRow.appendChild(nextBtn);

// Baris 2: REFRESH dan SELESAI
const navBottomRow = document.createElement("div");
navBottomRow.className = "nav-controls";

const refreshBtn = document.createElement("button");
refreshBtn.textContent = "🔄 REFRESH";
refreshBtn.addEventListener("click", () => {
  const konfirmasi = confirm("Kembali ke halaman identitas? Semua jawaban akan hilang.");
  if (konfirmasi) {
    clearInterval(timerInterval); // hentikan timer
    quizBox.style.display = "none";
    identityForm.style.display = "block";
    navigation.innerHTML = ""; // bersihkan navigasi soal
    userAnswers = [];
    score = 0;
    current = 0;
    scoreEl.textContent = "Skor: 0";
    timerEl.textContent = "00:00";
  }

});

const finishBtn = document.createElement("button");
finishBtn.textContent = "✅ SELESAI";
finishBtn.addEventListener("click", () => {
  const yakin = confirm("Yakin ingin keluar dari aplikasi?");
  if (yakin) {
     window.open('', '_self');
      window.location.href = "https://google.com";
  }
});

navBottomRow.appendChild(refreshBtn);
navBottomRow.appendChild(finishBtn);

// Tambahkan keduanya ke navigasi
navigation.appendChild(navTopRow);
navigation.appendChild(navBottomRow);
}

//ACAK OPTION SOAL
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

//MULAI TAMPILKAN SOAL
function loadQuestion(index) {
  current = index;
  const q = questions[current];
  const currentAnswer = userAnswers[current];

  questionEl.innerHTML = `
    <h3>Soal ${index + 1}</h3>
    ${q.image ? `<img src="${q.image}" alt="Gambar Soal" style="max-width: 50%; margin: 10px 0;" />` : ""}
    <p>${q.question}</p>
  `;
  optionsEl.innerHTML = "";
  feedbackEl.innerHTML = "";

  q.options.forEach((opt) => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="radio" name="option" value="${opt.key}" data-label="${opt.label}" ${isReadonlyMode ? "disabled" : ""}>
      ${opt.label}. ${opt.value || ""}
      ${opt.image ? `<br><img src="${opt.image}" alt="Gambar Opsi" style="max-width: 100px; margin-top: 5px;">` : ""}
    `;
    optionsEl.appendChild(label);
  });

  const inputs = optionsEl.querySelectorAll("input");

  if (currentAnswer !== null) {
    showAnswerResult(q, currentAnswer, inputs, current);
  } else if (!isReadonlyMode) {
    inputs.forEach(input => {
      input.addEventListener("click", () => {
        const userConfirmed = confirm("Apakah kamu yakin dengan jawabanmu?");
        if (!userConfirmed) {
          input.checked = false;
          return;
        }

        const selectedKey = input.value;
        const isCorrect = selectedKey === q.answer;

        userAnswers[current] = {
          isCorrect,
          selectedKey
        };

        if (isCorrect) {
          score++;
          scoreEl.textContent = `Skor: ${score}`;
        }

        inputs.forEach(inp => inp.disabled = true);
        document.getElementById(`nav-btn-${current}`).classList.add("answered");

        showAnswerResult(q, userAnswers[current], inputs, current);

        if (userAnswers.every(ans => ans !== null)) {
          clearInterval(timerInterval);
          showSummary();
        }
      });
    });
  }
}


function showAnswerResult(q, answerObj, inputs, index) {
  const { isCorrect, selectedKey } = answerObj;

  inputs.forEach(input => {
    const isSelected = input.value === selectedKey;
    const isCorrectAnswer = input.value === q.answer;

    input.disabled = true;

    if (isCorrectAnswer) {
      input.closest("label").classList.add("correct"); // Hijau
    }

    if (isSelected && !isCorrectAnswer) {
      input.closest("label").classList.add("selected"); // Merah
    }

    if (isSelected) {
      input.checked = true;
    }
  });

  // Warna tombol navigasi
  const navBtn = document.getElementById(`nav-btn-${index}`);
  if (navBtn) {
    navBtn.classList.remove("answered");
    navBtn.classList.add(isCorrect ? "correct-answer" : "wrong-answer");
  }

  // Tampilkan feedback dan pembahasan
  feedbackEl.innerHTML = `
    <span style="font-size: 24px;">${isCorrect ? "✅ Benar!" : "❌ Salah!"}</span><br>
    ${q.pembahasanImageUrl ? `<img src="${q.pembahasanImageUrl}" alt="Gambar Pembahasan" style="max-width: 50%; height: auto; margin-top: 10px;"><br>` : ""}
    <strong style="display: block; margin-top: 20px;">Pembahasan:</strong><br>
    <p style="margin-top: 0px;">${q.explanation}</p>
  `;
  feedbackEl.style.color = isCorrect ? "green" : "green";
}





function startTimer(duration) {
  let timeLeft = duration * 60;
  updateTimer(timeLeft);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showSummary();
    }
  }, 1000);
}

function updateTimer(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;
}

// Fungsi showSummary diperbaiki untuk mengirim hasil ke spreadsheet
function showSummary() {
  const selesai = new Date();
  const durasiMenit = Math.round((selesai - startTime) / 60000);
  const waktuSelesai = selesai.toLocaleString("id-ID");

  const jumlahSoal = questions.length;
  const jumlahBenar = userAnswers.filter(a => a && a.isCorrect).length;
  const jumlahSalah = jumlahSoal - jumlahBenar;
  const nilai = Math.round((jumlahBenar / jumlahSoal) * 100);

  const dataHasil = {
    nama: nameInput.value,
    email: emailInput.value,
    sekolah: sekolahInput.value,
    kurikulum: kurikulumInput.value,
    kelas: kelasInput.value,
    mapel: mapelInput.value,
    bab: babInput.value,
    paket: paketInput.value,
    jumlah_soal: jumlahBenar + jumlahSalah,
    benar: jumlahBenar,
    salah: jumlahSalah,
    nilai: nilai,
    waktu_selesai: waktuSelesai,
    durasi: durasiMenit
  };

  console.log("Mengirim data:", dataHasil);

  fetch("https://script.google.com/macros/s/AKfycbwiqaI9IKl2jOgm_iEiwT1SZOW5niPEg0fepR26rLGqeBXvrc2KKdWSuipDmhnC0SZ5/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(dataHasil)
  }).then(() => {
    fetch("https://script.google.com/macros/s/AKfycbwfL1qOAcg2qwY_irdKi938Sm0GwAQgTWYbl0yvJ2wsbocEtEFo-oCr7XLMAd8SYm5UEg/exec", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(dataHasil)
    }).then(() => {
      fetch(`https://opensheet.elk.sh/18mQe0-u4ma9mEemc5L6zN6AWe6IbfopdDIlhUKM1WEE/PESERTA`)
        .then(res => res.json())
        .then(pesertaData => {
          const peserta = pesertaData.find(p => p.Email === dataHasil.email);
          const nomorAyah = peserta["WA Ayah"];
          const nomorIbu = peserta["WA Ibu"];
          const nomorAnak = peserta["WA Anak"];

const pesan = 
`📋 *Laporan Hasil Kuis*
Halo ${dataHasil.nama}...

Berikut hasil kuis yang Ananda kerjakan:

*🧾 Paket Soal*
Kurikulum       : ${dataHasil.kurikulum}
Kelas           : ${dataHasil.kelas}
Mapel           : ${dataHasil.mapel}
Bab             : ${dataHasil.bab}
Paket           : ${dataHasil.paket}

*📈 Hasil Kuis*
Jumlah Soal     : ${dataHasil.jumlah_soal}
Benar           : ${dataHasil.benar}
Salah           : ${dataHasil.salah}
Nilai           : ${dataHasil.nilai}/100
Selesai         : ${dataHasil.waktu_selesai}
Durasi          : ${dataHasil.durasi} menit

🎉 Terima kasih telah mengikuti kuis ini.

- TEAM BIMBEL ANTIREMED`;

          const kirimWA = (nomor) => {
          if (!nomor) return Promise.resolve();
          const form = new FormData();
          form.append("appkey", "a16356e4-75ea-49ed-acf5-ce26ff3bd27e");
          form.append("authkey", "sHSu8mF0UwmKtbm5Zuvb4JgUF9Bvj9BvcaT1MtHsexywLXhlx8");
          form.append("to", nomor);
          form.append("message", pesan);
          return fetch("https://app.wapanels.com/api/create-message", {
            method: "POST",
            body: form
          });
        };

          Promise.all([kirimWA(nomorAyah), kirimWA(nomorIbu), kirimWA(nomorAnak)])
            .then(() => {
              alert(`Kuis selesai!\nNilai: ${nilai}\nBenar: ${jumlahBenar}, Salah: ${jumlahSalah}`);
              tampilkanLeaderboard();
            }).catch(() => tampilkanLeaderboard());
        }).catch(() => tampilkanLeaderboard());
    });
  });
}


function tampilkanLeaderboard() {
  const leaderboardDiv = document.getElementById("leaderboard");
  const tbody = document.querySelector("#leaderboard-table tbody");

  // Ambil filter
  const kurikulum = document.getElementById("kurikulum").value;
  const kelas = document.getElementById("kelas").value;
  const mapel = document.getElementById("mapel").value;
  const bab = document.getElementById("bab").value;
  const paket = document.getElementById("paket").value;

  fetch("https://opensheet.elk.sh/1sW3Yw1Ge_6yibNqXXvpyIzGgzrOnMzIePfIjqCHbqM0/DATANILAI")
    .then(res => res.json())
    .then(data => {
      const ranking = data
        .filter(row =>
          row.nilai &&
          row.kurikulum === kurikulum &&
          row.kelas === kelas &&
          row.mapel === mapel &&
          row.bab === bab &&
          row.paket === paket
        )
        .map(row => ({
          nama: row.nama,
          sekolah: row.sekolah,
          nilai: parseInt(row.nilai),
          waktu: row.waktu_selesai
        }))
        .sort((a, b) => b.nilai - a.nilai)
        .slice(0, 15);

      tbody.innerHTML = "";
      function sentenceCase(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      }
      // Tampilkan filter info
      document.getElementById("filter-info").innerHTML = `
      <strong>Paket Soal:</strong> 
      ${sentenceCase(kurikulum)}, 
      ${sentenceCase(kelas)}, 
      ${sentenceCase(mapel)}, 
      Bab ${sentenceCase(bab)}, 
      Paket ${sentenceCase(paket)}
    `;

      ranking.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td style="text-align: left;">${item.nama}</td>
          <td>${item.sekolah}</td>
          <td>${item.nilai}</td>
          <td>${item.waktu}</td>
        `;
        tbody.appendChild(tr);
      });

      document.getElementById("quiz-box").style.display = "none";
      leaderboardDiv.style.display = "block";
    })
    .catch(err => {
      alert("Gagal memuat leaderboard.");
      console.error(err);
    });
}





document.addEventListener("DOMContentLoaded", () => {
  const exitBtn = document.getElementById("exit-btn");
  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      if (confirm("Yakin ingin keluar dari aplikasi?")) {
        window.open('', '_self');
        window.location.href = "https://google.com";
        
      }
    });
  }
});

async function cekRiwayatKuis() {
  const url = "https://opensheet.elk.sh/1sW3Yw1Ge_6yibNqXXvpyIzGgzrOnMzIePfIjqCHbqM0/DATANILAI";
  const email = emailInput.value.trim();
  const kurikulum = kurikulumInput.value;
  const sekolah = sekolahInput.value;
  const kelas = kelasInput.value;
  const mapel = mapelInput.value;
  const bab = babInput.value;
  const paket = paketInput.value;

  const data = await fetch(url).then(res => res.json());

  const history = data.filter(row =>
    row.email?.toLowerCase() === email.toLowerCase() &&
    row.kurikulum === kurikulum &&
    row.sekolah === sekolah &&
    row.kelas === kelas &&
    row.mapel === mapel &&
    row.bab === bab &&
    row.paket === paket
  );

  if (history.length >= 3) {
    // Sudah pernah ikut, ambil yang terakhir (asumsi paling bawah paling baru)
    const last = history[history.length - 1];

    isReadonlyMode = true;
     const konfirmasi = confirm("⚠️ Kamu sudah mengikuti kuis ini sebanyak 3 kali.\\nIngin melihat kembali jawaban terakhir dalam mode baca (readonly)?");
  if (!konfirmasi) {
    alert("Silakan kembali ke halaman identitas atau pilih paket lain.");
    throw "BATAL_READONLY";
  }

    await fetchQuestions();
    identityForm.style.display = "none";
    quizBox.style.display = "flex";
    userAnswers = questions.map((q, i) => ({
      isCorrect: true,
      selectedKey: q.answer
    }));
    createNavigation();
    loadQuestion(0);
    throw "SUDAH_DIISI";
  } else {
    isReadonlyMode = false;
  }

}

