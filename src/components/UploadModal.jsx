import { useState, useRef, useEffect } from 'react'
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";

const fileTypes = ["JPG", "PNG", "GIF"];

const EXT_COLORS = {
  jpg: '#f5a623', jpeg: '#f5a623', png: '#4f7ef8', gif: '#9f7aea',
  svg: '#34c98e', mp4: '#ed64a6', pdf: '#f05252', ai: '#ed8936',
  psd: '#4f7ef8', zip: '#8b97ad', xlsx: '#34c98e', ase: '#9f7aea',
}

function getColor(ext = '') { return EXT_COLORS[ext.toLowerCase()] || '#8b97ad' }

export default function FolderBrowser({ onClose, onSelect }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['desktop']))
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [activeRoot, setActiveRoot] = useState('desktop')
  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('name')
  const [file, setFile] = useState(null);
  const handleChange = (files) => {
    setFile(files);
  };
  const selectedCount = file?.length

  const handleConfirm = async (e) => {
    e.preventDefault();
    // In a real app these would be actual File objects from the file system.
    // Here we simulate them since we can't truly access the filesystem.
    for (let i = 0; i < file.length; i++) {
      const formData = new FormData();
      formData.append('file', file[i]);
      try {
        const response = await axios.post(`/api/classify`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': 'application/json'
          }
        });
        console.log("Filename: ", file[i].name, "\nClassification: ", response.data.classification);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div className="relative flex flex-col w-full max-w-3xl mx-4 rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: '#131720', border: '1px solid #252d3d', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', height: '78vh', maxHeight: '680px' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 shrink-0" style={{ borderBottom: '1px solid #1e2535' }}>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4a1 1 0 011-1h4l1 1.5H13a1 1 0 011 1V12a1 1 0 01-1 1H3a1 1 0 01-1-1V4z"
                fill="rgba(79,126,248,0.2)" stroke="#4f7ef8" strokeWidth="1" />
            </svg>
            <h2 className="text-sm font-semibold" style={{ color: '#e8edf5' }}>Browse Files</h2>
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-64">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2" width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="4.5" cy="4.5" r="3.5" stroke="#546278" strokeWidth="1.3" />
              <path d="M7.5 7.5L10 10" stroke="#546278" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search files…"
              className="w-full text-xs pl-7 pr-3 py-1.5 rounded-lg outline-none"
              style={{ background: '#0f131a', border: '1px solid #252d3d', color: '#e8edf5' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#4f7ef8')}
              onBlur={e => (e.currentTarget.style.borderColor = '#252d3d')}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ color: '#546278' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* View toggle */}
            <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid #252d3d' }}>
              <button onClick={() => setViewMode('list')} className="px-2 py-1.5 transition-colors"
                style={{ background: viewMode === 'list' ? '#1a2030' : '#0f131a', color: viewMode === 'list' ? '#e8edf5' : '#546278' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 3h10M1 6h10M1 9h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button onClick={() => setViewMode('grid')} className="px-2 py-1.5 transition-colors"
                style={{ background: viewMode === 'grid' ? '#1a2030' : '#0f131a', color: viewMode === 'grid' ? '#e8edf5' : '#546278' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1" y="1" width="4" height="4" rx="0.5" fill="currentColor" />
                  <rect x="7" y="1" width="4" height="4" rx="0.5" fill="currentColor" />
                  <rect x="1" y="7" width="4" height="4" rx="0.5" fill="currentColor" />
                  <rect x="7" y="7" width="4" height="4" rx="0.5" fill="currentColor" />
                </svg>
              </button>
            </div>

            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: '#546278', background: '#1a2030' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e8edf5'; e.currentTarget.style.background = '#252d3d' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#546278'; e.currentTarget.style.background = '#1a2030' }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-center file-drop" style={{height:'stretch' }}>
          <div className="flex items-center gap-2 justify-center" style={{ border: '2px dashed #252d3d', height: '50vh', maxHeight: '300px', borderRadius: '8px', width: '50%' }}>
            <FileUploader className="w-full h-full drop_area drop_zone" handleChange={handleChange} name="file" types={fileTypes} multiple={true} maxSize={50} label="Drop files or browse" style={{ width: 'stretch', height: 'stretch' }} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0"
          style={{ borderTop: '1px solid #1e2535', background: '#0f131a' }}>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: '#546278' }}>{file?.length ? `${file.length} files` : 'No files'} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ background: '#1a2030', border: '1px solid #252d3d', color: '#8b97ad' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e3a50'; e.currentTarget.style.color = '#e8edf5' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#252d3d'; e.currentTarget.style.color = '#8b97ad' }}>
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedCount === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: selectedCount > 0 ? '#4f7ef8' : '#1a2030',
                color: selectedCount > 0 ? 'white' : '#546278',
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                border: `1px solid ${selectedCount > 0 ? 'transparent' : '#252d3d'}`,
              }}
              onMouseEnter={e => { if (selectedCount > 0) e.currentTarget.style.background = '#6b93ff' }}
              onMouseLeave={e => { if (selectedCount > 0) e.currentTarget.style.background = '#4f7ef8' }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1v7M2 5l3.5-3.5L9 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 9.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {selectedCount > 0 ? `Add ${selectedCount} file${selectedCount !== 1 ? 's' : ''}` : 'Select files'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
