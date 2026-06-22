import { useRef, useState, useEffect } from 'react'
import { FiUploadCloud, FiX, FiFile, FiCamera, FiRefreshCw } from 'react-icons/fi'

export default function FileUpload({ onChange }) {
  const [files, setFiles] = useState([]) // Array of Base64 DataURLs
  const [drag, setDrag] = useState(false)
  const [mode, setMode] = useState('system') // 'system' or 'camera'
  
  // Camera state
  const [stream, setStream] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState('environment') // Rear camera by default for scanner feel
  const [cameraError, setCameraError] = useState('')
  
  const inputRef = useRef(null)
  const videoRef = useRef(null)

  // Cleanup camera stream on unmount or mode change
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setCameraActive(false)
  }

  const startCamera = async (face = facingMode) => {
    setCameraError('')
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: face, width: { ideal: 800 }, height: { ideal: 600 } },
        audio: false
      })
      setStream(mediaStream)
      setCameraActive(true)
      // Wait for ref to be populated
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }, 50)
    } catch (err) {
      console.error('Error starting camera:', err)
      setCameraError('Could not access camera. Please check permissions or try system upload.')
    }
  }

  const toggleCameraFacing = () => {
    const nextFace = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(nextFace)
    if (cameraActive) {
      startCamera(nextFace)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Draw frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      const next = [...files, dataUrl]
      setFiles(next)
      onChange?.(next)
      stopCamera()
    }
  }

  const add = (list) => {
    const promises = Array.from(list).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(promises).then((dataUrls) => {
      const next = [...files, ...dataUrls]
      setFiles(next)
      onChange?.(next)
    })
  }

  const remove = (i) => {
    const next = files.filter((_, idx) => idx !== i)
    setFiles(next)
    onChange?.(next)
  }

  return (
    <div className="custom-file-uploader" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Selector Tabs */}
      <div className="upload-tabs" style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <button
          type="button"
          className={`btn btn-sm ${mode === 'system' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => { setMode('system'); stopCamera() }}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <FiUploadCloud /> System Upload
        </button>
        <button
          type="button"
          className={`btn btn-sm ${mode === 'camera' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => { setMode('camera'); setCameraError('') }}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <FiCamera /> Use Camera
        </button>
      </div>

      {/* System Upload View */}
      {mode === 'system' && (
        <div
          className={`file-upload ${drag ? 'drag' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files) }}
        >
          <FiUploadCloud />
          <div style={{ fontWeight: 600 }}>Drag &amp; drop photos here</div>
          <div style={{ fontSize: '0.82rem' }}>or click to browse</div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={(e) => e.target.files && add(e.target.files)}
          />
        </div>
      )}

      {/* Camera View */}
      {mode === 'camera' && (
        <div className="camera-box" style={{
          border: '2px dashed var(--border-strong)',
          borderRadius: 'var(--radius)',
          background: 'var(--surface-2)',
          padding: '16px',
          textAlign: 'center',
          minHeight: '220px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12
        }}>
          {cameraActive ? (
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px', margin: '0 auto' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  display: 'block',
                  background: '#000',
                  transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                }}
              />
              <div style={{
                marginTop: 12,
                display: 'flex',
                justifyContent: 'center',
                gap: 8
              }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={capturePhoto}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <FiCamera /> Capture
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={toggleCameraFacing}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.05)' }}
                >
                  <FiRefreshCw /> Switch
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={stopCamera}
                  style={{ color: 'var(--danger)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px' }}>
              <FiCamera size={36} style={{ color: 'var(--brand-500)', marginBottom: 8 }} />
              {cameraError ? (
                <div style={{ color: 'var(--danger)', fontSize: '0.84rem', marginBottom: 12 }}>{cameraError}</div>
              ) : (
                <p style={{ fontSize: '0.84rem', color: 'var(--text-3)', marginBottom: 12 }}>
                  Use your device camera to snap a reference photo.
                </p>
              )}
              <button
                type="button"
                className="btn btn-soft btn-sm"
                onClick={() => startCamera()}
              >
                Start Camera
              </button>
            </div>
          )}
        </div>
      )}

      {/* Render base64 image thumbnails */}
      {files.length > 0 && (
        <div className="file-thumbs" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
          {files.map((dataUrl, i) => (
            <div 
              className="file-thumb" 
              key={i} 
              style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 12, 
                overflow: 'hidden', 
                position: 'relative', 
                border: '1px solid var(--border)' 
              }}
            >
              <img 
                src={dataUrl} 
                alt={`Uploaded ${i + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <span 
                className="rm" 
                onClick={(e) => { e.stopPropagation(); remove(i) }}
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'var(--danger)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                <FiX />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
