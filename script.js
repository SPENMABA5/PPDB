// script.js

// Mendapatkan referensi ke elemen formulir dan pesan sukses
const ppdbForm = document.getElementById('ppdbForm');
const successMessage = document.getElementById('successMessage');

// Menambahkan event listener untuk submit formulir
ppdbForm.addEventListener('submit', async function(event) { // Tambahkan 'async' di sini
    // Mencegah perilaku submit default formulir (reload halaman)
    event.preventDefault();

    // Mengumpulkan data dari formulir
    const namaLengkap = document.getElementById('namaLengkap').value;
    const tanggalLahir = document.getElementById('tanggalLahir').value;
    const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked');
    const email = document.getElementById('email').value;
    const nomorTelepon = document.getElementById('nomorTelepon').value;
    const alamat = document.getElementById('alamat').value;

    // --- Validasi Sederhana ---
    let isValid = true;
    let errorMessage = '';

    if (namaLengkap.trim() === '') {
        isValid = false;
        errorMessage += 'Nama Lengkap tidak boleh kosong.\n';
    }
    if (tanggalLahir.trim() === '') {
        isValid = false;
        errorMessage += 'Tanggal Lahir tidak boleh kosong.\n';
    }
    if (!jenisKelamin) {
        isValid = false;
        errorMessage += 'Jenis Kelamin harus dipilih.\n';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        isValid = false;
        errorMessage += 'Format Email tidak valid.\n';
    }
    const phoneRegex = /^\d{8,}$/;
    if (!phoneRegex.test(nomorTelepon)) {
        isValid = false;
        errorMessage += 'Nomor Telepon harus berisi angka dan minimal 8 digit.\n';
    }
    if (alamat.trim() === '') {
        isValid = false;
        errorMessage += 'Alamat tidak boleh kosong.\n';
    }

    if (!isValid) {
        displayMessage(errorMessage, 'error');
        return;
    }

    // --- Proses Data Formulir (Kirim ke Server) ---
    const formData = {
        namaLengkap: namaLengkap,
        tanggalLahir: tanggalLahir,
        jenisKelamin: jenisKelamin ? jenisKelamin.value : '',
        email: email, // Email siswa
        nomorTelepon: nomorTelepon,
        alamat: alamat
    };

    console.log('Data Formulir akan dikirim:', formData);

    try {
        // Ganti '/api/submit-ppdb' dengan endpoint API backend Anda.
        // Karena Anda menjalankan backend di localhost:3000,
        // pastikan URL ini cocok dengan lokasi backend Anda.
        const response = await fetch('http://localhost:3000/api/submit-ppdb', { // PENTING: Tambahkan 'http://localhost:3000' di sini!
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json(); // Menguraikan respons JSON dari server

        if (response.ok) { // Jika respons OK (status 200-299)
            console.log('Sukses:', result);
            displayMessage('Pendaftaran Anda telah berhasil disubmit!', 'success');
            ppdbForm.reset(); // Mengosongkan formulir setelah sukses
        } else {
            // Tangani error dari server (misal, validasi gagal di sisi server)
            console.error('Error dari server:', result.message || 'Terjadi kesalahan saat pendaftaran.');
            displayMessage(result.message || 'Terjadi kesalahan saat pendaftaran.', 'error');
        }
    } catch (error) {
        console.error('Error saat mengirim data:', error);
        displayMessage('Terjadi kesalahan jaringan atau server tidak merespons.', 'error');
    }
});

// Fungsi untuk menampilkan pesan (sukses atau error)
function displayMessage(message, type) {
    if (type === 'success') {
        successMessage.classList.remove('hidden');
        successMessage.classList.remove('bg-red-100', 'border-red-400', 'text-red-700');
        successMessage.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        successMessage.innerHTML = `<strong class="font-bold">${message.split('!')[0]}!</strong> <span class="block sm:inline">${message.split('!').slice(1).join('!') || 'Pendaftaran Anda telah berhasil disubmit.'}</span>`;
    } else if (type === 'error') {
        successMessage.classList.remove('hidden');
        successMessage.classList.remove('bg-green-100', 'border-green-400', 'text-green-700');
        successMessage.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        successMessage.innerHTML = `<strong class="font-bold">Error!</strong> <span class="block sm:inline">${message}</span>`;
    }

    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000); // Pesan akan hilang setelah 5 detik
}
