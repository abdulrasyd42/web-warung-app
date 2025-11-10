'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, Trash2, Edit, Download, Moon, Sun, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Barang {
  id: number;
  nama_barang: string;
  harga: number;
  stok: number;
  kategori: string;
  tanggal_update: string;
}

interface FormData {
  nama_barang: string;
  harga: string;
  stok: string;
  kategori: string;
}

export default function DataWarung() {
  const [items, setItems] = useState<Barang[]>([]);
  const [filteredItems, setFilteredItems] = useState<Barang[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Barang | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState<FormData>({
    nama_barang: '',
    harga: '',
    stok: '',
    kategori: 'Makanan'
  });

  const categories = ['Semua', 'Makanan', 'Minuman', 'Snack', 'Bumbu', 'Lainnya'];

  // Load data dari localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('warung-items');
    if (savedItems) {
      const data = JSON.parse(savedItems);
      setItems(data);
      setFilteredItems(data);
    }
  }, []);

  // Save data ke localStorage
  const saveData = (data: Barang[]) => {
    localStorage.setItem('warung-items', JSON.stringify(data));
  };

  // Filter items
  useEffect(() => {
    let filtered = items;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'Semua') {
      filtered = filtered.filter(item => item.kategori === selectedCategory);
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, items]);

  const showToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = () => {
    if (!formData.nama_barang || !formData.harga || !formData.stok) {
      showToast('Mohon lengkapi semua field', 'error');
      return;
    }
    
    if (editingItem) {
      const updatedItems = items.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              ...formData, 
              harga: parseInt(formData.harga),
              stok: parseInt(formData.stok),
              tanggal_update: new Date().toISOString()
            }
          : item
      );
      setItems(updatedItems);
      saveData(updatedItems);
      showToast('Barang berhasil diupdate!');
    } else {
      const newItem: Barang = {
        id: Date.now(),
        nama_barang: formData.nama_barang,
        harga: parseInt(formData.harga),
        stok: parseInt(formData.stok),
        kategori: formData.kategori,
        tanggal_update: new Date().toISOString()
      };
      const newItems = [...items, newItem];
      setItems(newItems);
      saveData(newItems);
      showToast('Barang berhasil ditambahkan!');
    }
    
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Yakin ingin menghapus barang ini?')) {
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
      saveData(newItems);
      showToast('Barang berhasil dihapus!', 'success');
    }
  };

  const openModal = (item: Barang | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nama_barang: item.nama_barang,
        harga: item.harga.toString(),
        stok: item.stok.toString(),
        kategori: item.kategori
      });
    } else {
      setEditingItem(null);
      setFormData({
        nama_barang: '',
        harga: '',
        stok: '',
        kategori: 'Makanan'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      nama_barang: '',
      harga: '',
      stok: '',
      kategori: 'Makanan'
    });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nama Barang', 'Harga', 'Stok', 'Kategori', 'Tanggal Update'];
    const csvData = items.map(item => [
      item.id,
      item.nama_barang,
      item.harga,
      item.stok,
      item.kategori,
      new Date(item.tanggal_update).toLocaleDateString('id-ID')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-warung.csv';
    a.click();
    showToast('Data berhasil diexport ke CSV!');
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-gray-100'}`}>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <Alert className={`${toast.type === 'error' ? 'bg-red-100 border-red-300' : 'bg-green-100 border-green-300'} shadow-lg`}>
            <AlertDescription className={toast.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {toast.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Navbar */}
      <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-md border-b`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} w-8 h-8`} />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Data Warung</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
          <div>
            <button onClick={() => { localStorage.removeItem("isLoggedIn");
            window.location.href = "/login";}} 
        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
        > Logout
</button></div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header Actions */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
              <input
                type="text"
                placeholder="Cari barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={exportToCSV}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              } transition-colors flex-1 md:flex-initial justify-center`}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md flex-1 md:flex-initial justify-center"
            >
              <Plus className="w-4 h-4" />
              Tambah Barang
            </button>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Belum ada barang</p>
            <p className="text-sm">Klik &quot;Tambah Barang&quot; untuk menambahkan data</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
                } rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border p-5`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {item.nama_barang}
                    </h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.kategori}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openModal(item)}
                      className={`p-2 rounded-lg ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-blue-400' 
                          : 'hover:bg-blue-50 text-blue-600'
                      } transition-colors`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`p-2 rounded-lg ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-red-400' 
                          : 'hover:bg-red-50 text-red-600'
                      } transition-colors`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex justify-between">
                    <span>Harga:</span>
                    <span className="font-semibold">{formatRupiah(item.harga)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stok:</span>
                    <span className={`font-semibold ${item.stok < 10 ? 'text-red-500' : ''}`}>
                      {item.stok} unit
                    </span>
                  </div>
                  <div className={`text-xs pt-2 border-t ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200'}`}>
                    Update: {new Date(item.tanggal_update).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40 animate-in fade-in duration-200">
          <div className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-2xl w-full max-w-md animate-in zoom-in duration-200`}>
            <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {editingItem ? 'Edit Barang' : 'Tambah Barang'}
              </h2>
              <button
                onClick={closeModal}
                className={`p-1 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nama Barang
                </label>
                <input
                  type="text"
                  value={formData.nama_barang}
                  onChange={(e) => setFormData({...formData, nama_barang: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Contoh: Beras Premium"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.harga}
                    onChange={(e) => setFormData({...formData, harga: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="10000"
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Stok
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stok}
                    onChange={(e) => setFormData({...formData, stok: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="50"
                  />
                </div>
              </div>
              
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kategori
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  {categories.filter(cat => cat !== 'Semua').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                      : 'border-gray-300 hover:bg-gray-50'
                  } transition-colors`}
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                >
                  {editingItem ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}