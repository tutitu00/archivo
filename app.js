// Archivo - Centralized Application Logic & LocalStorage Management

const STORAGE_KEYS = {
  DOCUMENTS: 'archivo_documents_v1',
  LOGS: 'archivo_logs_v1'
};

// Initial default data if localStorage is empty
const INITIAL_DOCUMENTS = [
  {
    id: "DOC-88219",
    cif: "88219",
    account: "1098-7654-32",
    customerName: "BUDI SANTOSO",
    docType: "Tabungan",
    cabinet: "CAB-A1",
    rack: "R3",
    folderCode: "FLD-882",
    status: "archived", // archived, verification, available, transition
    location: "Kabinet A, Rak 3 (Master Vault)",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    displayTime: "Baru saja",
    staff: "J. Doe"
  },
  {
    id: "DOC-77412",
    cif: "77412",
    account: "2345-6789-01",
    customerName: "SITI RAHMAWATI",
    docType: "Reset PIN",
    cabinet: "CAB-A2",
    rack: "R2",
    folderCode: "FLD-442",
    status: "archived",
    location: "Kotak 442, Kabinet A2",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    displayTime: "15 menit lalu",
    staff: "A. Smith"
  },
  {
    id: "DOC-99021",
    cif: "99021",
    account: "3456-7890-12",
    customerName: "AHMAD HIDAYAT",
    docType: "Pengaduan Nasabah",
    cabinet: "CAB-B1",
    rack: "R1",
    folderCode: "FLD-109",
    status: "verification",
    location: "Area Verifikasi Brankas Utama",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    displayTime: "1 jam lalu",
    staff: "Audit Sistem"
  },
  {
    id: "DOC-44100",
    cif: "44100",
    account: "4567-8901-23",
    customerName: "DEWI LESTARI",
    docType: "ATM",
    cabinet: "CAB-A1",
    rack: "R4",
    folderCode: "FLD-301",
    status: "archived",
    location: "Kabinet A1, Rak 4",
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    displayTime: "3 jam lalu",
    staff: "M. Lee"
  }
];

const INITIAL_LOGS = [
  {
    id: "LOG-001",
    title: "CIF 88219 - Master Agreement",
    action: "Dipindahkan ke Kabinet A, Rak 3",
    type: "move",
    status: "success",
    timestamp: "Baru saja",
    user: "J. Doe"
  },
  {
    id: "LOG-002",
    title: "CIF 77412 - KYC Update",
    action: "Diverifikasi dan disegel di Kotak 442",
    type: "verify",
    status: "success",
    timestamp: "15 menit lalu",
    user: "A. Smith"
  },
  {
    id: "LOG-003",
    title: "CIF 99021 - Loan Origination",
    action: "Ditandai: Tanda tangan kurang di halaman 4",
    type: "warning",
    status: "warning",
    timestamp: "1 jam lalu",
    user: "Audit Sistem"
  },
  {
    id: "LOG-004",
    title: "CIF 44100 - Mortgage Deed",
    action: "Diambil untuk tinjauan audit eksternal",
    type: "checkout",
    status: "info",
    timestamp: "3 jam lalu",
    user: "M. Lee"
  }
];

// Initialize Storage if empty & ensure all customer names are uppercase
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  } else {
    // Migration: automatically convert all previously saved document customer names to CAPSLOCK
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) || [];
      let isModified = false;
      const updated = existing.map(doc => {
        if (doc.customerName && doc.customerName !== doc.customerName.toUpperCase()) {
          isModified = true;
          return { ...doc, customerName: doc.customerName.toUpperCase() };
        }
        return doc;
      });
      if (isModified) {
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Migration error", e);
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
  }
}

// Get all documents (always with UPPERCASE customer names)
function getDocuments() {
  initStorage();
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) || [];
    return raw.map(doc => ({
      ...doc,
      customerName: doc.customerName ? doc.customerName.toUpperCase() : ''
    }));
  } catch (e) {
    console.error("Failed to parse documents from localStorage", e);
    return INITIAL_DOCUMENTS;
  }
}

// Save new document
function saveDocument(docData) {
  const docs = getDocuments();
  const newDoc = {
    id: docData.id || `DOC-${Math.floor(10000 + Math.random() * 90000)}`,
    cif: docData.cif,
    account: docData.account || '-',
    customerName: (docData.customerName || '').toUpperCase().trim(),
    docType: docData.docType || 'Tabungan',
    cabinet: docData.cabinet || 'CAB-A1',
    rack: docData.rack || 'R1',
    folderCode: docData.folderCode || 'FLD-000',
    status: docData.status || 'verification',
    location: `${docData.cabinet || 'CAB-A1'}, ${docData.rack || 'R1'} (${docData.folderCode || 'Map'})`,
    createdAt: new Date().toISOString(),
    displayTime: 'Baru saja',
    staff: 'Elshanora Putri'
  };

  docs.unshift(newDoc);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));

  // Add corresponding Audit Log
  const logAction = docData.status === 'archived'
    ? `Berhasil didaftarkan & diarsipkan ke ${newDoc.location}`
    : `Didaftarkan (Menunggu Verifikasi) di ${newDoc.location}`;

  saveLog({
    title: `CIF ${newDoc.cif} - ${newDoc.customerName} (${newDoc.docType})`,
    action: logAction,
    type: docData.status === 'archived' ? 'verify' : 'move',
    status: docData.status === 'archived' ? 'success' : 'warning',
    timestamp: 'Baru saja',
    user: 'Elshanora Putri'
  });

  return newDoc;
}

// Get Audit Logs
function getLogs() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS)) || [];
  } catch (e) {
    return INITIAL_LOGS;
  }
}

// Save Audit Log
function saveLog(logData) {
  const logs = getLogs();
  const newLog = {
    id: `LOG-${Date.now()}`,
    title: logData.title,
    action: logData.action,
    type: logData.type || 'info',
    status: logData.status || 'info',
    timestamp: logData.timestamp || 'Baru saja',
    user: logData.user || 'Staf Operasional'
  };
  logs.unshift(newLog);
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

// Get document by ID
function getDocumentById(id) {
  const docs = getDocuments();
  return docs.find(d => d.id === id) || null;
}

// Update existing document data
function updateDocument(id, updatedData) {
  const docs = getDocuments();
  const index = docs.findIndex(d => d.id === id);
  if (index === -1) return null;

  const currentDoc = docs[index];

  let location = updatedData.location;
  if (!location || location.trim() === '') {
    const cab = updatedData.cabinet || currentDoc.cabinet || 'CAB-A1';
    const rack = updatedData.rack || currentDoc.rack || 'R1';
    const folder = updatedData.folderCode || currentDoc.folderCode || 'FLD-000';
    location = `${cab}, ${rack} (${folder})`;
  }

  const updatedDoc = {
    ...currentDoc,
    cif: updatedData.cif !== undefined ? updatedData.cif : currentDoc.cif,
    customerName: updatedData.customerName !== undefined ? updatedData.customerName.toUpperCase().trim() : currentDoc.customerName,
    account: updatedData.account !== undefined ? updatedData.account : currentDoc.account,
    docType: updatedData.docType !== undefined ? updatedData.docType : currentDoc.docType,
    cabinet: updatedData.cabinet !== undefined ? updatedData.cabinet : currentDoc.cabinet,
    rack: updatedData.rack !== undefined ? updatedData.rack : currentDoc.rack,
    folderCode: updatedData.folderCode !== undefined ? updatedData.folderCode : currentDoc.folderCode,
    status: updatedData.status !== undefined ? updatedData.status : currentDoc.status,
    location: location,
    updatedAt: new Date().toISOString()
  };

  docs[index] = updatedDoc;
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));

  // Log Audit Entry
  saveLog({
    title: `CIF ${updatedDoc.cif} - ${updatedDoc.customerName} (${updatedDoc.docType})`,
    action: `Keterangan/data dokumen ${updatedDoc.id} berhasil diperbarui`,
    type: 'verify',
    status: 'success',
    timestamp: 'Baru saja',
    user: updatedDoc.staff || 'Staf Operasional'
  });

  return updatedDoc;
}

// Delete document by ID
function deleteDocument(id) {
  let docs = getDocuments();
  const target = docs.find(d => d.id === id);
  if (!target) return false;

  docs = docs.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));

  saveLog({
    title: `Hapus Dokumen ${id}`,
    action: `Dokumen CIF ${target.cif} (${target.customerName}) telah dihapus`,
    type: 'warning',
    status: 'warning',
    timestamp: 'Baru saja',
    user: 'Staf Operasional'
  });

  return true;
}

// Toast notification UI helper
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('archivo-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'archivo-toast-container';
    toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-secondary text-on-secondary' : (type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary');
  const icon = type === 'success' ? 'check_circle' : (type === 'error' ? 'error' : 'info');

  toast.className = `flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg ${bgColor} transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[24px]">${icon}</span>
    <span class="font-bold text-body-md">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// Interactive Edit Document Modal UI Helper
function openEditModal(docId, onSaveSuccess) {
  const doc = getDocumentById(docId);
  if (!doc) {
    showToast('Dokumen tidak ditemukan dalam sistem.', 'error');
    return;
  }

  closeEditModal();

  const modalHtml = `
    <div id="archivo-edit-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all my-8 animate-fadeIn">
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-primary text-on-primary flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[24px]">edit_document</span>
            <h3 class="text-headline-md font-bold">Edit Keterangan Data Dokumen</h3>
          </div>
          <button type="button" onclick="closeEditModal()" class="text-on-primary/80 hover:text-on-primary hover:bg-white/10 rounded-full p-1 transition-colors">
            <span class="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <!-- Form Edit -->
        <form id="archivo-edit-form" class="p-6 flex flex-col gap-4 text-on-surface">
          <div class="bg-surface-container-low p-3 rounded-xl border border-outline-variant/60 flex items-center justify-between text-body-md">
            <span>ID Dokumen: <strong class="text-primary font-mono">${doc.id}</strong></span>
            <span class="text-label-md text-outline">Dibuat: ${doc.displayTime || 'Sistem'}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nomor CIF -->
            <div>
              <label class="block text-label-lg font-bold mb-1 text-primary">Nomor CIF <span class="text-error">*</span></label>
              <input type="text" id="edit-cif" value="${doc.cif || ''}" required
                class="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary text-body-md" />
            </div>

            <!-- Nama Nasabah -->
            <div>
              <label class="block text-label-lg font-bold mb-1 text-primary">Nama Nasabah <span class="text-error">*</span></label>
              <input type="text" id="edit-customerName" value="${(doc.customerName || '').toUpperCase()}" required oninput="this.value = this.value.toUpperCase()"
                class="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary text-body-md uppercase font-semibold tracking-wide" />
            </div>

            <!-- Nomor Rekening -->
            <div>
              <label class="block text-label-lg font-bold mb-1 text-primary">Nomor Rekening</label>
              <input type="text" id="edit-account" value="${doc.account || ''}"
                class="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary text-body-md" />
            </div>

            <!-- Jenis Dokumen -->
            <div>
              <label class="block text-label-lg font-bold mb-1 text-primary">Jenis Dokumen</label>
              <select id="edit-docType" class="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary text-body-md">
                <option value="Tabungan" ${doc.docType === 'Tabungan' ? 'selected' : ''}>Tabungan</option>
                <option value="Giro" ${doc.docType === 'Giro' ? 'selected' : ''}>Giro</option>
                <option value="Deposito" ${doc.docType === 'Deposito' ? 'selected' : ''}>Deposito</option>
                <option value="Kredit" ${doc.docType === 'Kredit' ? 'selected' : ''}>Kredit / Pinjaman</option>
                <option value="Reset PIN" ${doc.docType === 'Reset PIN' ? 'selected' : ''}>Reset PIN</option>
                <option value="ATM" ${doc.docType === 'ATM' ? 'selected' : ''}>ATM</option>
                <option value="Pengaduan Nasabah" ${doc.docType === 'Pengaduan Nasabah' ? 'selected' : ''}>Pengaduan Nasabah</option>
                <option value="Lainnya" ${!['Tabungan', 'Giro', 'Deposito', 'Kredit', 'Reset PIN', 'ATM', 'Pengaduan Nasabah'].includes(doc.docType) ? 'selected' : ''}>Lainnya</option>
              </select>
            </div>

            <!-- Kode Kabinet -->
            <div>
              <label class="block text-label-lg font-bold mb-1 text-primary">Kabinet</label>
              <input type="text" id="edit-cabinet" value="${doc.cabinet || ''}"
                class="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary text-body-md" />
            </div>

            <!-- Nomor Rak -->
            <div>
              <label class="block text-label-lg font-bold mb-1 text-primary">Nomor Rak</label>
              <input type="text" id="edit-rack" value="${doc.rack || ''}"
                class="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary text-body-md" />
            </div>

            <!-- Kode Map/Folder -->
            <div>
              <label class="block text-label-lg font-bold mb-1 text-primary">Kode Map / Folder</label>
              <input type="text" id="edit-folderCode" value="${doc.folderCode || ''}"
                class="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary text-body-md" />
            </div>

            <!-- Status Dokumen -->
            <div>
              <label class="block text-label-lg font-bold mb-1 text-primary">Status Dokumen</label>
              <select id="edit-status" class="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary text-body-md">
                <option value="archived" ${doc.status === 'archived' ? 'selected' : ''}>Diarsipkan / Tersedia</option>
                <option value="verification" ${doc.status === 'verification' ? 'selected' : ''}>Dalam Verifikasi</option>
                <option value="transition" ${doc.status === 'transition' ? 'selected' : ''}>Dalam Transisi</option>
              </select>
            </div>
          </div>

          <!-- Keterangan / Deskripsi Lokasi -->
          <div class="mt-2">
            <label class="block text-label-lg font-bold mb-1 text-primary">Deskripsi Lokasi / Keterangan Tambahan</label>
            <textarea id="edit-location" rows="2"
              class="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary text-body-md">${doc.location || ''}</textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-4 mt-2 border-t border-outline-variant">
            <button type="button" onclick="handleDeleteFromModal('${doc.id}', ${typeof onSaveSuccess === 'function' ? 'true' : 'false'})" class="px-4 py-2 text-error border border-error/30 hover:bg-error-container/40 rounded-xl text-label-md font-bold transition-colors flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">delete</span>
              Hapus Dokumen
            </button>

            <div class="flex items-center gap-3">
              <button type="button" onclick="closeEditModal()" class="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl text-label-md font-bold transition-colors">
                Batal
              </button>
              <button type="submit" class="px-5 py-2.5 bg-primary text-on-primary hover:bg-tertiary rounded-xl text-label-md font-bold shadow-md transition-all flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">save</span>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  document.getElementById('archivo-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedData = {
      cif: document.getElementById('edit-cif').value.trim(),
      customerName: document.getElementById('edit-customerName').value.trim(),
      account: document.getElementById('edit-account').value.trim(),
      docType: document.getElementById('edit-docType').value,
      cabinet: document.getElementById('edit-cabinet').value.trim(),
      rack: document.getElementById('edit-rack').value.trim(),
      folderCode: document.getElementById('edit-folderCode').value.trim(),
      status: document.getElementById('edit-status').value,
      location: document.getElementById('edit-location').value.trim()
    };

    updateDocument(docId, updatedData);
    closeEditModal();
    showToast(`Keterangan dokumen CIF ${updatedData.cif} berhasil diperbarui!`, 'success');

    if (typeof onSaveSuccess === 'function') {
      onSaveSuccess();
    }
  });
}

function closeEditModal() {
  const modal = document.getElementById('archivo-edit-modal');
  if (modal) modal.remove();
}

function handleDeleteFromModal(docId, hasCallback) {
  if (confirm(`Apakah Anda yakin ingin menghapus dokumen ${docId}?`)) {
    deleteDocument(docId);
    closeEditModal();
    showToast(`Dokumen ${docId} telah dihapus.`, 'success');
    if (hasCallback) {
      window.location.reload();
    }
  }
}

// Global initialization call on script load
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
});
